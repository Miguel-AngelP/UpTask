<?php 


namespace Controllers;


use MVC\Router;
use Classes\Email;
use Model\Usuario;

class LoginController{
    
    public static function login(Router $router){

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
            $usuario = new Usuario($_POST);
            
            $alertas = $usuario->validarLogin();
            
            if(empty($alertas)){
                // Verificar que el usuario exista

                $usuario = Usuario::where('email',$usuario->email);
                 
                if(!$usuario || !$usuario->confirmado){
                    Usuario::setAlerta('error', 'El Usuario No Existe o no está confirmado');
                } else {
                    // El usuario existe

                    if( password_verify($_POST['password'], $usuario->password)){
                        //Iniciar la sesión del usuario autenticado

                        session_start();
                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        // Redireccionar
                            header('Location: /dashboard'); 

                        debuguear($_SESSION);

                    } else{
                        Usuario::setAlerta('error', 'Password Incorrecto');
                    }
                }

            }

        }

        $alertas = Usuario::getAlertas();
        // Renderizado
        $router->render('auth/login',[
            "titulo" => 'Iniciar Sesión',
            'alertas' => $alertas
        ]);
    }

    public static function logout(Router $router){
        session_start();

        $_SESSION = [];

        header('Location: /');

       
    }

    public static function crear(Router $router){
        $alertas = [];
        $usuario = new Usuario;

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();
            
            if(empty($alertas)){
                $existeUsuario = Usuario::where('email', $usuario->email);


                if($existeUsuario){
                Usuario::setAlerta('error','El Usuario ya está registrado');
                $alertas = Usuario::getAlertas();
                } else{
                    // Hashear el password
                    $usuario->hashPassword();

                    //Eliminar password2
                    unset($usuario->password2);

                    //Generar token
                    $usuario->crearToken();

                    // Crear Nuevo Usuario
                    $resultado = $usuario->guardar();

                    //Enviar el Email al usuario con su token

                    $email = new Email($usuario->email,$usuario->nombre, $usuario->token );
                    $email->enviarConfirmacion();

                    if($resultado){
                        header('location: /mensaje');
                        
                    }

                    
                }
            }
            
        
        }

        // Renderizado
        $router->render('auth/crear',[
            "titulo" => 'Crear tu Cuenta en Uptask',
            'usuario' => $usuario,
            'alertas' => $alertas

        ]);
    }

    public static function olvide(Router $router){
        $alertas = [];
        

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = new Usuario($_POST);
            $alertas = $usuario->validarEmail();

            if(empty($alertas)){
                // buscar el usuario
                $usuario = Usuario::where('email', $usuario->email);

                if($usuario && $usuario->confirmado){

                    // Generar un nuevo token
                    $usuario->crearToken();
                    unset($usuario->password2);

                    // Actualizar el usuario
                    $usuario->guardar();


                    // Enviar el Email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();

                    // Imprimir la alerta
                    Usuario::setAlerta('exito','Hemos enviado las instrucciones de como reescribir tu password al email');
                    
                } else {
                    Usuario::setAlerta('error','El usuario no existe o no está confirmado');
                    
                }
                
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/olvide',[
            "titulo" => 'Olvidé mi Password',
            "alertas" => $alertas
        ]);
    }

    public static function reestablecer(Router $router){
        $token = s($_GET['token']);
        $mostrar = true;
        

        if(!$token) header('location: /');

        // Identificar el usuario con este token

        $usuario= Usuario::where('token', $token);

        if(empty($usuario)){
            Usuario::setAlerta('error', 'Token No Valido');
            $mostrar = false;
        }
        

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Añadir nuevo password
            $usuario->sincronizar($_POST); 

            // Validar password
            $alertas = $usuario->validarPassword();

            if(empty($alertas)){
                // Hashear nuevo password
                $usuario->hashPassword();
                unset($usuario->password2);
                
                // Eliminar el Token
                $usuario->token = null;

                // Guardar el usuario en la BD

                $resultado = $usuario->guardar();

                // Redireccionar
                if($resultado){
                    header('location: /');
                }

                
            }

        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/reestablecer',[
            'titulo' => 'Reestablece tu Password',
            'alertas' => $alertas,
            'mostrar' => $mostrar
        ]);
    }

    public static function mensaje(Router $router){
        
        $router->render('auth/mensaje',[
            'titulo' => 'Cuenta Crada Exitosamente'
        ]);
        
    }

    public static function confirmar(Router $router){

        $token = s( $_GET['token']);

        
        if(!$token) header('location: /');

        // Encontrar al usuario

        $usuario = Usuario::where('token', $token);

        if(empty($usuario)){
            // No se encontró usuario con este token
            Usuario::setAlerta('error', 'Tokén invalido');
        } else {
            // Confirmar la cuenta - eliminando token y password2
            $usuario->confirmado = 1;
            $usuario->token = null;
            unset($usuario->password2);
            
            // almacenando en la base de datos
            $usuario->guardar();

            Usuario::setAlerta('exito', 'Cuenta Verificada');
        }

        $alertas = Usuario::getAlertas();       

        $router->render('auth/confirmar',[
            'titulo' => 'Confirma tu Cuenta en Uptask',
            'alertas' => $alertas
        ]);

      
    }
}