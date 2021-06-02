let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

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

    // Muestra el resumen de la cita ( o mensaje de error en caso de no pasar la validacion)
    mostrarResumen();

    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();
    
    // deshabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto
    horaCita();
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
            servicioDiv.dataset.idServicio = id;

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

        eliminarServicio( elemento.dataset.idServicio );
    } else {
        elemento.classList.add('activo');

        const servicioObj = {
            id: parseInt( elemento.dataset.idServicio ),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.lastElementChild.textContent
        }
        agregarServicio(servicioObj);

    }
}

function eliminarServicio( id ) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
}

function agregarServicio( servicio ) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicio]
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
            mostrarResumen(); // Estamos en la pagina 3, carga el resumen de la cita
            break;
        default:
            break;
    }
    mostrarSeccion();
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo
    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validacion de objeto
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos por agregar';

        noServicios.classList.add('invalidar-cita');

        // Agregar a resumen Div
        resumenDiv.appendChild(noServicios);
        return;
    }

    // Mostrar el resumen 
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;
    
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    
    // Iterar sobre el arreglo de servicios
    servicios.forEach(servicio => {
        const { nombre, precio } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumenDiv.appendChild(contenedorServicio);
    });

}
function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('change', elemento => {
        const nombreTexto = elemento.target.value.trim();
        if ( nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta( mensaje, tipo ) {
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }
    const alerta = document.createElement('P');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000)
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');

    fechaInput.addEventListener('input', elemento => {
        const dia = new Date(elemento.target.value).getUTCDay();
        if([0,6].includes(dia)) {
            elemento.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('No hay servicio los fines de semana', 'error')
        } else {
            cita.fecha = fechaInput.value;
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    // Formato deseado: AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes<10 ? `0${mes}`: mes}-${dia<10 ? `0${dia}`: dia}`;
    inputFecha.min = fechaDeshabilitar;
}
function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value; 
        const hora = horaCita.split(':')[0];

        if(hora < 10 || hora > 18) {
            mostrarAlerta('Hora no valida', 'error');
            inputHora.value = '';
        } else {
            cita.hora = horaCita;
        }
    })
}