<div class="contenedor reestablecer">
   
<?php
    include_once __DIR__ . "/../templates/nombre-sitio.php";
?>




<div class="contenedor-sm">
    
    <?php include_once __DIR__ . "/../templates/alertas.php"; ?>
    <?php  if($mostrar){  ?>

        <p class="descripcion-pagina">Coloca tu Nuevo Password</p>

        <form class="formulario" method="POST">

            <div class="campo">
                <label for="password">Password:</label>
                <input 
                    type="text"
                    id="password"
                    name="password"
                    placeholder="Tu Password"
                />
            </div>
            <input type="submit" class="boton" value="Guardar Password">

        </form>
<?php } ?>
        <div class="acciones">
            <a href="/crear">¿Aún no tienes una cuenta? crea una aquí</a>
            <a href="/olvide">¿Olvidaste tu contraseña?</a>
        </div>
    </div> <!---------------------------- Contenedor SM ---------------------------->
</div>