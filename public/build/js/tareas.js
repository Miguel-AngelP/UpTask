!function(){!async function(){try{const t=`/api/tareas?id=${d()}`,a=await fetch(t),o=await a.json();e=o.tareas,n()}catch(e){console.log(e)}}();let e=[],t=[];document.querySelector("#agregar-tarea").addEventListener("click",(function(){o(!1)}));function a(a){const o=a.target.value;t=""!==o?e.filter((e=>e.Estado===o)):[],n()}function n(){!function(){const e=document.querySelector("#listado-tareas");for(;e.firstChild;)e.removeChild(e.firstChild)}(),function(){const t=e.filter((e=>"0"===e.Estado)),a=document.querySelector("#pendientes");0===t.length?a.disabled=!0:a.disabled=!1;console.log(t)}(),function(){const t=e.filter((e=>"1"===e.Estado)),a=document.querySelector("#completadas");0===t.length?a.disabled=!0:a.disabled=!1;console.log(t)}();const a=t.length?t:e;if(0===a.length){const e=document.querySelector("#listado-tareas"),t=document.createElement("LI");return t.textContent="No hay Tareas ",t.classList.add("no-tareas"),void e.appendChild(t)}const r={0:"Pendiente",1:"Completa"};a.forEach((t=>{const a=document.createElement("LI");a.dataset.tareaId=t.id,a.classList.add("tarea");const i=document.createElement("P");i.textContent=t.nombre,i.ondblclick=function(){o(editar=!0,{...t})};const s=document.createElement("DIV");s.classList.add("opciones");const l=document.createElement("BUTTON");l.classList.add("estado-tarea"),l.classList.add(`${r[t.Estado].toLowerCase()}`),l.textContent=r[t.Estado],l.dataset.btnEstadoTarea=t.Estado,l.ondblclick=function(){!function(e){const t="1"===e.Estado?"0":"1";e.Estado=t,c(e)}({...t})};const u=document.createElement("BUTTON");u.classList.add("eliminar-tarea"),u.dataset.idTarea=t.id,u.textContent="Eliminar",u.onclick=function(){!function(t){Swal.fire({title:"¿Eliminar Tarea?",showCancelButton:!0,confirmButtonText:"Si",cancelButtonText:"No"}).then((a=>{a.isConfirmed&&async function(t){const{Estado:a,id:o,nombre:r}=t,c=new FormData;c.append("id",o),c.append("Estado",a),c.append("nombre",r),c.append("proyectoId",d());try{const a="http://localhost:3000/api/tarea/eliminar",o=await fetch(a,{method:"POST",body:c}),r=await o.json();r.resultado&&(Swal.fire("Eliminado!",r.mensaje,"success"),e=e.filter((e=>e.id!==t.id)),n())}catch(e){console.log(e)}}(t)}))}({...t})},s.appendChild(l),s.appendChild(u),a.appendChild(i),a.appendChild(s);document.querySelector("#listado-tareas").appendChild(a)}))}function o(t=!1,a={}){console.log(a);const o=document.createElement("DIV");o.classList.add("modal"),o.innerHTML=`\n            <form class="formulario nueva-tarea">\n                <legend>${t?"Editar Tarea":"Añade una nueva tarea"}</legend>\n\n                <div class="campo">\n                    <label for="">Tarea </label>\n                        <input \n                            type="text"\n                            name="tarea"\n                            placeholder="${a.nombre?"Edita titulo de tarea":"Añadir Tarea al Proyecto Actual"}"\n                            id="tarea"\n                            value="${a.nombre?a.nombre:""}"\n                        />\n                </div>\n                <div class="opciones">\n                    <input \n                        type="submit" \n                        class="submit-nueva-tarea" \n                        value="${a.nombre?" Guardar Cambios":"Añadir Tarea al Proyecto Actual"}"\n                        />\n                    <button type="button" class="cerrar-modal">Cancelar</button>\n                </div>\n            </form>\n        \n        \n        `,setTimeout((()=>{document.querySelector(".formulario").classList.add("animar")}),0),o.addEventListener("click",(function(i){if(i.preventDefault(),i.target.classList.contains("cerrar-modal")){document.querySelector(".formulario").classList.add("cerrar"),setTimeout((()=>{o.remove()}),500)}if(i.target.classList.contains("submit-nueva-tarea")){const o=document.querySelector("#tarea").value.trim();if(""===o)return void r("El nombre de la tarea es obligatorio","error",document.querySelector(".formulario legend"));t?(a.nombre=o,c(a)):async function(t){const a=new FormData;a.append("nombre",t),a.append("proyectoId",d());try{const o="http://localhost:3000/api/tarea",c=await fetch(o,{method:"POST",body:a}),d=await c.json();if(r(d.mensaje,d.tipo,document.querySelector(".formulario legend")),"exito"===d.tipo){const a=document.querySelector(".modal");setTimeout((()=>{a.remove(),window.location.reload()}),3e3);const o={id:String(d.id),Estado:"0",nombre:t,proyectoId:d.proyectoId};e=[...e,o],n()}}catch(e){console.log(e)}}(o)}})),document.querySelector(".dashboard").appendChild(o)}function r(e,t,a){const n=document.querySelector(".alerta");n&&n.remove();const o=document.createElement("DIV");o.classList.add("alerta",t),o.textContent=e,a.parentElement.insertBefore(o,a.nextElementSibling),setTimeout((()=>{o.remove()}),5e3)}async function c(t){const{Estado:a,id:o,nombre:r}=t,c=new FormData;c.append("id",o),c.append("Estado",a),c.append("nombre",r),c.append("proyectoId",d());try{const t="http://localhost:3000/api/tarea/actualizar",d=await fetch(t,{method:"POST",body:c}),i=await d.json();if("exito"===i.respuesta.tipo){Swal.fire(i.respuesta.mensaje,i.respuesta.mensaje,"success");const t=document.querySelector(".modal");t&&t.remove(),e=e.map((e=>(e.id===o&&(e.estado=a,e.nombre=r),e))),n()}}catch(e){console.log(e)}}function d(){const e=new URLSearchParams(window.location.search);return Object.fromEntries(e.entries()).id}document.querySelectorAll('#filtros input[type="radio"]').forEach((e=>{e.addEventListener("input",a)}))}();