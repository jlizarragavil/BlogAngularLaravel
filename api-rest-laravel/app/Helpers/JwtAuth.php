<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;

class JwtAuth{
    
    public $key;
    public function __construct(){
        $this->key = 'clave_secreta-123';
    }
    
    public function signup($email, $password, $getToken = null){
        //Buscar si existe el usuario con las credenciales
        $user = User::where([
            'email' => $email,
            'password' => $password
                
        ])->first();
        
        
        //Comprobar si son correctas(objeto)
        $signup = false;
        if(is_object($user)){
            $signup = true;
        }
        //Generar el token con los datos del usuario conectado
        
        if($signup){
            $token = array(
                'sub' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'surname' => $user->surname,
                'iat' => time(),
                'exp' => time() + (7*64*60*60),
                'image' => $user->image,
                'description' => $user-> description
            );
            
            $jwt = JWT::encode($token, $this->key, 'HS256');
            
        //Devolver los datos decodificados o el token en funcion de un parametro
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            if($getToken == null){
                $data =  $jwt;
            }else{
                $data =  $decoded;
            }
            
        }else{
            $data = array(
                'status' => 'error',
                'message' => 'Login incorrecto'
            );
        }
        
        return $data;
    }

    public function checkToken($jwt, $getIdentity = false){
        $auth = false;
        try{
            $jwt = str_replace('"', '', $jwt);
            $decoded = JWT::decode($jwt, $this -> key, ['HS256']);
        } catch (\UnexpectedValueException $e) {
            $auth = false;
        } catch(\DomainException $e){
            $auth = false;
        }
        
        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth = true;
        }else{
            $auth = false;
        }
        
        if($getIdentity){
            return $decoded;
        }
        
        return $auth;
    }
    
}


