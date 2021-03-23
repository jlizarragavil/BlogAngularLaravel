<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Http\Response;
use Log;

class UserController extends Controller {

    public function pruebas(Request $request) {
        return "Accion de pruebas de UserController";
    }

    public function register(Request $request) {

        //Recoger los datos del usuario por POST


        Log::info("Datos: " . $request);
        Log::info("content: " . $request->getContent());
        //$json = $request->input('json', null);
        //$json = $request->json()->all();
        $json=$request->getContent();
        $params = json_decode($json);
        $params_array = json_decode($json, true); //Array
        Log::info("Json: " . $json);

        if (!empty($params) && !empty($params_array)) {
            //Limpiar datos
            Log::info("ENTRA IF");
            $params_array = array_map('trim', $params_array);

            //Validar datos

            $validate = \Validator::make($params_array, [
                        'name' => 'required|alpha',
                        'surname' => 'required|alpha',
                        'email' => 'required|email|unique:users', //Comprobar usuario duplicado
                        'password' => 'required'
            ]);

            if ($validate->fails()) {

                $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'El usuario no se ha creado ',
                    'errors' => $validate->errors()
                );
            } else {
                //Validacion ok
                //Cifrar la contraseña

                $pwd = hash('sha256', $params->password);

                //Crear el usuario

                $user = new User();
                $user->name = $params_array['name'];
                $user->surname = $params_array['surname'];
                $user->email = $params_array['email'];
                $user->password = $pwd;
                $user->role = 'ROLE_USER';

                $user->save();

                //Devolver datos
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El usuario se ha creado '
                );
            }
        } else {
            Log::info("NO ENTRA IF");
            $data = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'Los datos enviados no son correctos ',
            );
        }

        return response()->json($data, $data['code']);
    }

    public function login(Request $request) {
        $jwtAuth = new \JwtAuth();
        Log::info("Datos: " . $request);
        Log::info("content: " . $request->getContent());
        //Recibir datos por post
        /*$json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = \GuzzleHttp\json_decode($json, true);*/
        $json=$request->getContent();
        //$json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true); //Array

        //Validar Datos
        $validate = \Validator::make($params_array, [
                    'email' => 'required|email',
                    'password' => 'required'
        ]);

        if ($validate->fails()) {

            $signup = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'El usuario no se ha podido logear ',
                'errors' => $validate->errors()
            );
        } else {
            //Cifrar password
            $pwd = hash('sha256', $params->password);

            //Devolver token
            $signup = $jwtAuth->signup($params->email, $pwd);

            if (!empty($params->gettoken)) {
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
        }
        return response()->json($signup, 200);
    }

    public function update(Request $request) {
        //Comprobar si el usuario está identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkTocken = $jwtAuth->checkToken($token);
        //Recoger usuario por POST
        $json=$request->getContent();
        $params_array = json_decode($json, true);

        if ($checkTocken && !empty($params_array)) {
            //Sacar usuario identificado

            $user = $jwtAuth->checkToken($token, true);

            //Validar datos para cambiar
            $validate = \Validator::make($params_array, [
                        'name' => 'required|alpha',
                        'surname' => 'required|alpha',
                        'email' => 'required|email|unique:users,' . $user->sub
            ]);
            //Quitar campos que no quiero actualziar

            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_token']);
            //Actualizar usuario en bbdd
            Log::info("Datos: " . $json);
            $user_update = User::where('id', $user->sub)->update($params_array);
            
            //Devolver array con resultado
            $data = array(
                'status' => 'success',
                'code' => 200,
                'user' => $user,
                'changes' => $params_array
            );
        } else {
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'El usuario no está identificado '
            );
        }
        return response()->json($data, $data['code']);
    }

    public function upload(Request $request) {
        //Recoger datos de la peticion
        $image = $request->file('file0');

        //validar imagen
        $validate = \Validator::make($request->all(), [
                    'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        //subir imagen
        if (!$image || $validate->fails()) {
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'Error al subir imagen'
            );
        } else {
            $image_name = time() . $image->getClientOriginalName();
            \Storage::disk('users')->put($image_name, \File::get($image));
            $data = array(
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            );
        }
        return response()->json($data, $data['code']);
    }

    public function getImage($filename) {

        $isset = \Storage::disk('users')->exists($filename);
        if ($isset) {
            $file = \Storage::disk('users')->get($filename);
            return new Response($file, 200);
        } else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'messagge' => 'La imagen no existe'
            );
            return response()->json($data, $data['code']);
        }
    }

    public function detail($id) {
         Log::info("Datos: " . $id);
        $user = User::find($id);
        if (is_object($user)) {
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $user
            );
        } else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'messagge' => 'El usuario no existe'
            );
        }
        return response()->json($data, $data['code']);
    }
    
    

}
