<div class="contenedor olvide">
   
<?php
    include_once __DIR__ . "/../templates/nombre-sitio.php";
?>


    <div class="contenedor-sm">
    <?php
    include_once __DIR__ . "/../templates/alertas.php";
    ?>
        <p class="descripcion-pagina">Recuperar tu Password</p>

        <form action="/olvide" class="formulario" method="POST">
            <div class="campo">
                <label for="email">Email:</label>
                <input 
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Tu email"
                />
            </div>

          
            <input type="submit" class="boton" value="Enviar Instrucciones">
        </form>
        <div class="acciones">
            <a href="/">¿Ya tienes cuenta? inicia sesión aquí</a>
            <a href="/crear">¿Aún no tienes una cuenta? crea una aquí</a>
        </div>
    </div> <!---------------------------- Contenedor SM ---------------------------->
</div>