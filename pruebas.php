Función inicial para cambiar el estado de la tarea

async function obtenerTareas(){
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            
            tareas = resultado.tareas;
            mostrarTareas()


            
        } catch (error) {
           console.log(error);
        }
}

