

const mobileMenuBtn = document.querySelector('#mobile-menu');
const cerrarMenuBtn =document.querySelector('#cerrar-menu');
const siderbar = document.querySelector('.sidebar');

if(mobileMenuBtn){
    mobileMenuBtn.addEventListener('click', function(){
        siderbar.classList.add('mostrar');

    })
}

if(cerrarMenuBtn){
    cerrarMenuBtn.addEventListener('click',function(){
        siderbar.classList.add('ocultar');

        setTimeout(() => {
            siderbar.classList.remove('mostrar');    
            siderbar.classList.remove('ocultar');    
        }, 500);
    })
}

// Elimina la clase de mostrar,  en un tamaño de tablet o mayores

const anchoPantalla = document.body.clientWidth;

window.addEventListener('resize',function(){
    const anchoPantalla = document.body.clientWidth;
    if(anchoPantalla >= 768){
        siderbar.classList.remove('mostrar');
    }
});