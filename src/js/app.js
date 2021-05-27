document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
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