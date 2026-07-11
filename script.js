// =========================================================
// 1. ESTADO DE LA APLICACIÓN Y BASE DE DATOS
// =========================================================

// El arreglo inventarioMascotas se utiliza como el contenedor principal donde se almacenan todos los pacientes registrados en la aplicación. Al iniciar, el código intenta recuperar desde localStorage la información previamente guardada bajo la clave pacientesVeterinaria. Si esos datos existen, se convierten desde texto JSON a un arreglo real mediante JSON.parse, permitiendo que la aplicación mantenga la lista de pacientes incluso después de cerrar o recargar la página. En caso de que no haya información almacenada, el arreglo se inicializa vacío, asegurando que el sistema siempre tenga un punto de partida válido para registrar nuevos ingresos.
let inventarioMascotas = JSON.parse(localStorage.getItem('pacientesVeterinaria')) || [];

// La variable mascotaEnEdicionId cumple la función de indicar si el formulario está siendo utilizado para crear un nuevo paciente o para editar uno existente. Cuando su valor es null, la aplicación entiende que se está registrando una mascota nueva; si contiene un identificador, significa que el usuario está modificando un registro previamente creado. Esta variable permite que el sistema cambie su comportamiento según el contexto, diferenciando entre agregar y actualizar información dentro del inventario de pacientes.
let mascotaEnEdicionId = null; 


// CAPTURA DE ELEMENTOS DEL DOM.

// Capturamos los elementos del DOM que serán utilizados para interactuar con el usuario y manipular la información de los pacientes. Esto incluye selectores para tipo y sub-tipo de mascota, un campo de entrada para razas personalizadas, el formulario principal, el contenedor donde se mostrarán las tarjetas de los pacientes, y el botón de envío del formulario. Además, se capturan elementos adicionales para funcionalidades de búsqueda y filtrado, como el buscador por nombre y botones para ordenar y filtrar la lista de pacientes según su estado (todos, pendientes o atendidos). Esta captura permite que el código pueda manipular estos elementos dinámicamente en respuesta a las acciones del usuario.

const selectTipoMascota = document.getElementById('tipoMascota');
const selectSubTipo = document.getElementById('subTipo');
const inputRazaPersonalizada = document.getElementById('razaPersonalizada');
const formulario = document.getElementById('formulario-registro');
const contenedorLista = document.querySelector('#contenedor-lista');
const btnSubmit = formulario.querySelector('button[type="submit"]');

const buscadorNombre = document.getElementById('buscador-nombre');
const btnOrdenar = document.getElementById('btn-ordenar');
const btnTodos = document.getElementById('btn-todos');
const btnPendientes = document.getElementById('btn-pendientes');
const btnAtendidos = document.getElementById('btn-atendidos');

// LOGICA PARA EL SELECTOR DE TIPO Y SUBTIPO DE MASCOTA.

// Definimos un objeto que mapea cada tipo de mascota a un arreglo de razas o especies correspondientes. Esto permite que, al seleccionar un tipo de mascota, se puedan mostrar dinámicamente las opciones de raza o especie asociadas a ese tipo. La opción "Otro" se incluye en cada categoría para permitir al usuario ingresar una raza o especie personalizada si ninguna de las opciones predefinidas es adecuada.
const opcionesRazaEspecie = {
    perro: ['Mestizo', 'Labrador', 'Pug', 'Pastor Alemán', 'Otro'],
    gato: ['Mestizo', 'Persa', 'Siamés', 'Esfinge', 'Otro'],
    exotico: ['Conejo', 'Hurón', 'Hámster', 'Erizo', 'Otro'],
    ave: ['Canario', 'Loro', 'Cacatúa', 'Ninfa', 'Otro'],
};

// Creamos el evento 'change' para el selector de tipo de mascota. Cuando el usuario selecciona un tipo, se limpia el selector de sub-tipo y se oculta el campo de raza personalizada. Si existen razas o especies asociadas al tipo seleccionado, se habilita el selector de sub-tipo y se llenan sus opciones; si no, se deshabilita. Esto asegura que el usuario solo vea opciones relevantes según su selección inicial.
selectTipoMascota.addEventListener('change', function(evento) {
    const tipoSeleccionado = evento.target.value;
    selectSubTipo.innerHTML = '<option value="" disabled selected>Selecciona raza/especie...</option>';
    inputRazaPersonalizada.style.display = 'none';
    inputRazaPersonalizada.removeAttribute('required'); 
    inputRazaPersonalizada.value = ''; 
    
    if (opcionesRazaEspecie[tipoSeleccionado]) {
        selectSubTipo.disabled = false;
        opcionesRazaEspecie[tipoSeleccionado].forEach(function(raza) {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = raza.toLowerCase();
            nuevaOpcion.textContent = raza;
            selectSubTipo.appendChild(nuevaOpcion);
        });
    } else {
        selectSubTipo.disabled = true;
    }
});

// Creamos el evento 'change' para el selector de sub-tipo de mascota. Si el usuario selecciona "Otro", se muestra el campo de entrada para raza personalizada y se marca como obligatorio; si selecciona cualquier otra opción, se oculta y se limpia su valor, asegurando que solo se requiera información adicional cuando sea necesario.
selectSubTipo.addEventListener('change', function(evento) {
    if (evento.target.value === 'otro') {
        inputRazaPersonalizada.style.display = 'block';
        inputRazaPersonalizada.setAttribute('required', 'true');
    } else {
        inputRazaPersonalizada.style.display = 'none';
        inputRazaPersonalizada.removeAttribute('required');
        inputRazaPersonalizada.value = '';
    }
});

// Creamos una función para mostrar mensajes de error de manera temporal en la interfaz. Esta función primero verifica si ya existe un mensaje de error previo y lo elimina para evitar duplicados. Luego, crea un nuevo elemento div con la clase 'mensaje-error', establece su contenido con el mensaje proporcionado y lo inserta al inicio del formulario. Finalmente, utiliza setTimeout para eliminar automáticamente el mensaje después de 3.5 segundos, manteniendo la interfaz limpia y evitando que los errores se acumulen visualmente.
function mostrarError(mensaje) {
    const errorPrevio = document.querySelector('.mensaje-error');
    if (errorPrevio) errorPrevio.remove();

    const cajaError = document.createElement('div');
    cajaError.classList.add('mensaje-error'); 
    cajaError.textContent = `⚠️ Error: ${mensaje}`; 
    formulario.prepend(cajaError);
    setTimeout(() => cajaError.remove(), 3500);
}
