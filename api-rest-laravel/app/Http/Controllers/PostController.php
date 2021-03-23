<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller {

    public function __construct() {
        $this->middleware('api.auth', ['except' => ['index', 'show', 'getImage', 'getPostsByCategory', 'getPostsByUser']]);
    }

    public function index() {
        $posts = Post::all()->load('category');
        return response()->json([
                    'code' => 200,
                    'status' => 'success',
                    'posts' => $posts
        ]);
    }

    public function show($id) {
        $post = Post::find($id)->load('category')->load('user');
        if (is_object($post)) {
            $data = array(
                'code' => 200,
                'status' => 'success',
                'post' => $post
            );
        } else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'no existe la entrada'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function store(Request $request) {
        //$json = $request->input('json', null);
        $json=$request->getContent();
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {
            //Conseguir usuario identificado
            $user = $this->getIdentity($request);

            //validar Datos
            $validate = \Validator::make($params_array, [
                        'title' => 'required',
                        'content' => 'required',
                        'category_id' => 'required',
                        'image' => 'required'
            ]);
            if ($validate->fails()) {
                $data = array(
                    'code' => 404,
                    'status' => 'error',
                    'message' => 'faltan datos'
                );
            } else {
                $post = new Post();
                $post->user_id = $user->sub;
                $post->category_id = $params->category_id;
                $post->title = $params->title;
                $post->content = $params->content;
                $post->image = $params->image;

                $post->save();

                $data = array(
                    'code' => 200,
                    'status' => 'success',
                    'post' => $post
                );
            }
            //guardar post
        } else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'Envia los datos correctamente'
            );
        }
        //devolver salida
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request) {
        //$json = $request->input('json', null);
        $json=$request->getContent();
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {

            //validar datos

            $validate = \Validator::make($params_array, [
                        'title' => 'required',
                        'content' => 'required',
                        'category_id' => 'required',
            ]);

            if ($validate->fails()) {
                $data = array(
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'Datos enviados incorrectos'
                );
            } else {
                //eliminar lo que no queremos actualizar
                unset($params_array['id']);
                unset($params_array['user_id']);
                unset($params_array['created_at']);
                unset($params_array['user']);

                //Conseguir usuario identificado
                $user = $this->getIdentity($request);

                //actualizar el registro
                /* $where =[
                  'id' => $id,
                  'user_id' => $user->sub
                  ];
                  $post = Post::updateOrCreate($where, $params_array); */
                $post = Post::where('id', $id)->where('user_id', $user->sub)->first();

                if (!empty($post) && is_object($post)) {

                    $post->update($params_array);

                    $data = array(
                        'code' => 200,
                        'status' => 'success',
                        'message' => 'Post actualizado',
                        'post' => $post,
                        'changes' => $params_array
                    );
                } else {
                    $data = array(
                        'code' => 400,
                        'status' => 'error',
                        'message' => 'Datos enviados incorrectosss'
                    );
                }
                //devolver salida
            }
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'Datos enviados incorrectos'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function destroy($id, Request $request) {
        //Conseguir usuario identificado

        $user = $this->getIdentity($request);

        //comprobar si existe el registro
        $post = Post::where('id', $id)->where('user_id', $user->sub)->first();

        if (!empty($post)) {
            //borrarlo

            $post->delete();
            //Devolver salida
            $data = array(
                'code' => 200,
                'status' => 'success',
                'message' => 'Post borrado',
                'post' => $post
            );
        } else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'Post no existe'
            );
        }


        return response()->json($data, $data['code']);
    }

    private function getIdentity(Request $request) {
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);

        return $user;
    }

    public function upload(Request $request) {
        //Recoger imagen 
        $image = $request->file('file0');
        //validar imagen

        $validate = \Validator::make($request->all(), [
                    'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        //guardar imagen en disco
        if (!$image || $validate->fails()) {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'error al cargar la imagen'
            );
        } else {
            $image_name = $image_name = time() . $image->getClientOriginalName();

            \Storage::disk('images')->put($image_name, \File::get($image));

            $data = array(
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            );
        }
        //devolver salida
        return response()->json($data, $data['code']);
    }

    public function getImage($filename) {
        //comprobar si existe el fichero
        $isset = \Storage::disk('images')->exists($filename);
        if ($isset) {
            //conseguir la imagen
            $file = \Storage::disk('images')->get($filename);
            //devolver la imagen 
            return new Response($file, 200);
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'no existe la imagen'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function getPostsByCategory($id) {
        $posts = Post::where('category_id', $id)->get();

        return response()->json([
                    'status' => 'success',
                    'posts' => $posts
                        ], 200);
    }

    public function getPostsByUser($id) {
        $posts = Post::where('user_id', $id)->get();

        return response()->json([
                    'status' => 'success',
                    'posts' => $posts
                        ], 200);
    }

}
