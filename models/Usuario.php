<?php

namespace Model;


class  Usuario extends ActiveRecord{

    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id','nombre','email','password','token','confirmado',];

    public function __construct($args = []){
        
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->password2 = $args['password2'] ?? '';
        $this->password_actual = $args['password_actual'] ?? '';
        $this->password_nuevo = $args['password_nuevo'] ?? '';
        $this->token = $args['token'] ?? '';
        $this->confirmado = $args['confirmado'] ?? 0;

    }
    // Validar al usuario
    public function validarLogin() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El Email del Usuario es Obligatorio';
        }
        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            self::$alertas['error'][] = 'Email no válido';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password no puede ir vacio';
        }
        return self::$alertas;

    }



    // Validación para cuentas nuevas
    public function validarNuevaCuenta() {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre del Usuario es Obligatorio';
        }
        if(!$this->email) {
            self::$alertas['error'][] = 'El Email del Usuario es Obligatorio';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password no puede estar Vácio';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El Password debe conteneder al menos 6 caracteres';
        }
        if($this->password !== $this->password2){
            self::$alertas['error'][] = 'Los passwords deben ser iguales';
        }
        
        
        return self::$alertas;
    }

    public function nuevo_password() : array{
        if(!$this->password_actual){
            self::$alertas['error'][] = 'El Password Actual no puede estar vacío';
        }
        if(!$this->password_actual){
            self::$alertas['error'][] = 'El Password Nuevo no puede estar vacío';
        }
        if(strlen($this->password_actual) < 6){
            self::$alertas['error'][] = 'El Password Nuevo debe contener almenos 6 caracteres';
        }

        return self::$alertas;
    }
    
    public function validarEmail(){
        if(!$this->email){
            self::$alertas['error'][] = 'El email es obligatorio';
        }

        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)){
            self::$alertas['error'][] = 'Email no valido';
        }

        return self::$alertas;
    }
    

    // Validar password
    public function validarPassword(){
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password no puede estar Vácio';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El Password debe conteneder al menos 6 caracteres';
        }

        return self::$alertas;

    }

    public function validar_perfil(){

        if(!$this->nombre){
            self::$alertas['error'][] = 'El nombre no puede estar vácio';
        }
        if(!$this->email){
            self::$alertas['error'][] = 'El email no puede estar vácio';
        }

        return self::$alertas;
        
    }

    // Comprobar password
    public function comprobar_password() : bool{
         return password_verify($this->password_actual, $this->password);
    }


    // hashea el password
    public function hashPassword() : void {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    // Generando el token
    public function crearToken() : void{
        $this->token = uniqid();
    }

    
    
}