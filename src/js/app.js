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
        });
    } catch (error) {
        console.error(error);
    }
}