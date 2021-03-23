<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;
use Log;
class CategoryController extends Controller {

    public function __construct() {
        $this->middleware('api.auth', ['except' => ['index', 'show']]);
    }

    public function index() {
        $categories = Category::all();
        return response()->json([
                    'code' => 200,
                    'status' => 'success',
                    'categories' => $categories
        ]);
    }

    public function show($id) {
        $category = Category::find($id);
        if (is_object($category)) {
            $data = array(
                'code' => 200,
                'status' => 'success',
                'category' => $category
            );
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'No es una categoria'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function store(Request $request) {
        //Recoger datos POST
        //$json = $request->input('json', null);
        $json=$request->getContent();
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {
            $validate = \Validator::make($params_array, [
                        'name' => 'required'
            ]);

            //Validar datos

            if ($validate->fails()) {
                $data = array(
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'No se ha guardado alcategoría'
                );
            } else {
                //Guardar categoria
                $category = new Category();
                $category->name = $params_array['name'];
                $category->save();
                   
                $data = array(
                    
                    'code' => 200,
                    'status' => 'success',
                    'message' => 'Se ha guardado alcategoría',
                    'category' => $category
                );
                Log::info("Datos: ". $data['code']);
            }
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'no has enviado categoria'
            );
        }
        //devolver resultado
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request) {
        //recoger datos de POST
        //$json = $request->input('json', null);
        $json=$request->getContent();
        $params_array = json_decode($json, true);

        if (!empty($params_array)) {
            //validar datos
            $validate = \Validator::make($params_array, [
                        'name' => 'required'
            ]);

            //quitar lo que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['created_at']);
            //Actualizar categoria
            $category = Category::where('id', $id)->update($params_array);
            $data = array(
                'code' => 200,
                'status' => 'success',
                'message' => 'Se ha actualizado alcategoría',
                'category' => $params_array
            );
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'no has enviado categoria para actualizar'
            );
        }
        return response()->json($data, $data['code']);
    }

}
