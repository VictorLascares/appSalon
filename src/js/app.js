let pagina = 1;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta el Div Actual segun el tab al que se presiona
    mostrarSeccion();
    // Oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();
}

function mostrarSeccion() {
    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if ( seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if ( tabAnterior ) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            

            // Llamar la funcion de mostrar seccion
            mostrarSeccion();
            // Actualizar botones de paginador
            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;

        // Generar el HTMl
        servicios.forEach(servicio => {
            const  { id, nombre, precio } = servicio;
            
            // DOM Scripting
            // Generar nombre de Servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio')

            // Generar precio de Servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio')

            // Generar contenedor del servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');

            // Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;
            // Agregar nombreServicio y precioServicio al contenedor
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectar en el HTMl
            document.querySelector('.list-services').appendChild(servicioDiv);
        });
    } catch (error) {
        console.error(error);
    }
}

function seleccionarServicio(e)  {
    let elemento;
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('activo')) {
        elemento.classList.remove('activo');
    } else {
        elemento.classList.add('activo');
    }
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click',() => {
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    switch(pagina) {
        case 1:
            paginaAnterior.classList.add('ocultar');
            paginaSiguiente.classList.remove('ocultar');
            break;
        case 2:
            paginaAnterior.classList.remove('ocultar');
            paginaSiguiente.classList.remove('ocultar');
            break;
        case 3:
            paginaSiguiente.classList.add('ocultar');
            paginaAnterior.classList.remove('ocultar');
            break;
        default:
            break;
    }
    mostrarSeccion();
}