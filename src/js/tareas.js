(function(){

    obtenerTareas();
    let tareas = [];
    let filtradas = [];

    // Botón del modal de Agregar Tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', function(){
        mostrarFormulario(false)
    });

    // Filtros de búsqueda
    const filtros = document.querySelectorAll('#filtros input[type="radio"]');
    filtros.forEach( radio =>{
        radio.addEventListener('input', filtrarTareas);
    })

    function filtrarTareas(e){
        const filtro = e.target.value;

        if(filtro !== ''){
            filtradas = tareas.filter(tarea => tarea.Estado === filtro);
        } else {
            filtradas = [];
        }

        mostrarTareas();
    }
    

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

    function mostrarTareas(){
        limpiarTareas();
        totalPendientes();
        totalCompletas();

        const arrayTareas = filtradas.length ? filtradas : tareas;

        if(arrayTareas.length === 0){
            const contenedorTareas = document.querySelector('#listado-tareas');
            
            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No hay Tareas ';
            textoNoTareas.classList.add('no-tareas');
            contenedorTareas.appendChild(textoNoTareas);
            return;
            
        }

        const estados = {
            0: 'Pendiente',
            1: 'Completa'
            
        }

        arrayTareas.forEach(tarea => {
            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id;
            contenedorTarea.classList.add('tarea');

            const nombreTarea = document.createElement('P');
                                    //  `Nombre: ${tarea.nombre}` Codigo alternativo para colocar directamente el nombre de la tarea sin escribirlo en el HTML 
            nombreTarea.textContent = tarea.nombre; 
            nombreTarea.ondblclick = function(){
                mostrarFormulario(editar = true, {...tarea});
            }

            const opcionesDiv = document.createElement('DIV');
            opcionesDiv.classList.add('opciones');

            // Botones
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.Estado].toLowerCase()}`)
            btnEstadoTarea.textContent = estados[tarea.Estado];
            btnEstadoTarea.dataset.btnEstadoTarea = tarea.Estado;
            btnEstadoTarea.ondblclick = function(){
                cambiarEstadoTarea({...tarea});
            }


            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;
            btnEliminarTarea.textContent = 'Eliminar';
            btnEliminarTarea.onclick = function(){
                confirmarEliminarTarea({...tarea});
            }

            opcionesDiv.appendChild(btnEstadoTarea);
            opcionesDiv.appendChild(btnEliminarTarea);
            
            contenedorTarea.appendChild(nombreTarea);
            contenedorTarea.appendChild(opcionesDiv);
            
            const listadoTarea = document.querySelector('#listado-tareas');
            listadoTarea.appendChild(contenedorTarea);

            
        });
    }

    function totalPendientes(){
        const totalPendientes =  tareas.filter(tarea => tarea.Estado === "0");
        const pendientesRadio = document.querySelector('#pendientes');

        if(totalPendientes.length === 0){
            pendientesRadio.disabled = true;
        } else {
            pendientesRadio.disabled = false;
        }

        console.log(totalPendientes);
    }

    function totalCompletas(){
        const totalCompletas =  tareas.filter(tarea => tarea.Estado === "1");
        const completasRadio = document.querySelector('#completadas');

        if(totalCompletas.length === 0){
            completasRadio.disabled = true;
        } else {
            completasRadio.disabled = false;
        }

        console.log(totalCompletas);
    }

    function mostrarFormulario(editar = false, tarea = {}){

        console.log(tarea);
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar Tarea' : 'Añade una nueva tarea'}</legend>

                <div class="campo">
                    <label for="">Tarea </label>
                        <input 
                            type="text"
                            name="tarea"
                            placeholder="${tarea.nombre ? 'Edita titulo de tarea' : 'Añadir Tarea al Proyecto Actual'}"
                            id="tarea"
                            value="${tarea.nombre ? tarea.nombre : ''}"
                        />
                </div>
                <div class="opciones">
                    <input 
                        type="submit" 
                        class="submit-nueva-tarea" 
                        value="${tarea.nombre ? ' Guardar Cambios' : 'Añadir Tarea al Proyecto Actual'}"
                        />
                    <button type="button" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        
        
        `;

        setTimeout(() => {
            const formulario = document.querySelector('.formulario');
            formulario.classList.add('animar')
        }, 0);

       
        modal.addEventListener('click', function(e){
            e.preventDefault();

            if(e.target.classList.contains('cerrar-modal')){
                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar')
                setTimeout(() => {
                    modal.remove();    
                }, 500);
                
            }  
            if(e.target.classList.contains('submit-nueva-tarea')){
                const nombreTarea = document.querySelector('#tarea').value.trim();
        

                if(nombreTarea === ''){
                    // Mostrar una alerta de error
                    MostrarAlerta('El nombre de la tarea es obligatorio', 'error', document.querySelector('.formulario legend'));
                    return;


                }

                if(editar){
                    tarea.nombre = nombreTarea;
                    actualizarTarea(tarea);
                } else {
                    agregarTarea(nombreTarea);
                }
                
            }
            
        });


        document.querySelector('.dashboard').appendChild(modal);
    }

    
    
    // Muestra un mensaje en la intefaz
    function MostrarAlerta(mensaje, tipo, referencia){
        // Previene multiples alertas
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia){
            alertaPrevia.remove();
        }

        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta', tipo)
        alerta.textContent = mensaje;

        // inserta el codigo antes del leyend
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);

        // Elimina la alerta después de un tiempo
        setTimeout(() => {
            alerta.remove();
        }, 5000);
        
    }


    // Añade una tarea al proyecto actualmente seleccionado
    async function agregarTarea(tarea){
        // Construir la petición
        const datos = new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());

        

        try {
          const url = 'http://localhost:3000/api/tarea';
          const respuesta = await fetch(url,{
            method: 'POST',
            body: datos
          });

          const resultado = await respuesta.json()
          

          MostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.formulario legend'));

          if(resultado.tipo === 'exito'){
            const modal = document.querySelector('.modal');
            setTimeout(() => {
                modal.remove();

                window.location.reload();
            }, 3000);

            // Agregando el objeto de tarea al global de tareas
            const tareaObj =  {
                id: String(resultado.id),
                Estado: "0",
                nombre: tarea,
                proyectoId: resultado.proyectoId
            }
            
            tareas = [...tareas,tareaObj];
            mostrarTareas();

            
          }
          
        } catch (error) {
            console.log(error);
        }

        

    }

    function cambiarEstadoTarea(tarea){

        const nuevoEstado = tarea.Estado === "1" ? "0" : "1";
        tarea.Estado = nuevoEstado;
        actualizarTarea(tarea);

    }

   async function actualizarTarea(tarea){
        const {Estado, id, nombre,} = tarea;

        const datos = new FormData();
        
        datos.append("id", id);
        datos.append("Estado", Estado );
        datos.append("nombre", nombre);
        datos.append("proyectoId", obtenerProyecto());


        try {
            const url = 'http://localhost:3000/api/tarea/actualizar';

            const respuesta = await fetch(url,{
                method: 'POST',
                body: datos
            }); 
            const resultado = await respuesta.json();

            // console.log(resultado);

            if(resultado.respuesta.tipo === 'exito'){
                Swal.fire(
                    resultado.respuesta.mensaje,
                    resultado.respuesta.mensaje,
                    'success'
                );

            const modal = document.querySelector('.modal');
            if(modal){
                modal.remove();
            }
            
            

            tareas = tareas.map(tareaMemoria => {
                if(tareaMemoria.id === id){
                    tareaMemoria.estado = Estado;
                    tareaMemoria.nombre = nombre;
                } 

                return tareaMemoria;
            });
            mostrarTareas();
        };
        } 
        catch (error) {
            console.log(error);
        }
        
    }

    function confirmarEliminarTarea(tarea){
        Swal.fire({
            title: "¿Eliminar Tarea?",
            
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: 'No'
          }).then((result) => {
            
            if (result.isConfirmed) {
                eliminarTarea(tarea);
            } 
          });
    }
     
    async function eliminarTarea(tarea){
        const {Estado, id, nombre} = tarea;

        
        const datos = new FormData();
        datos.append("id", id);
        datos.append("Estado", Estado );
        datos.append("nombre", nombre);
        datos.append("proyectoId", obtenerProyecto());

        
        
        try {
            const url = 'http://localhost:3000/api/tarea/eliminar';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            
            
        

            const resultado = await respuesta.json();
            if(resultado.resultado){
                // MostrarAlerta(
                //     resultado.mensaje,
                //     resultado.tipo,
                //     document.querySelector('.contenedor-nueva-tarea')
                // );

                Swal.fire('Eliminado!', resultado.mensaje, 'success');

                tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id);
                mostrarTareas();
            }



        } catch (error) {
            console.log(error);
        }
    }


    function obtenerProyecto(){
        const proyectoParams = new URLSearchParams(window.location.search);
        const proyecto = Object.fromEntries(proyectoParams.entries());
            return proyecto.id;
    }


    function limpiarTareas(){
        const listadoTarea = document.querySelector('#listado-tareas')
        

        while(listadoTarea.firstChild){
            listadoTarea.removeChild(listadoTarea.firstChild);
        }
    }

})();