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


// Función para actualizar la pantalla con la lista de mascotas. Esta función recibe un arreglo de mascotas a mostrar; si no se proporciona ninguno, utiliza el inventario completo. Primero, limpia el contenedor de la lista y luego recorre cada mascota, creando dinámicamente una tarjeta que incluye su nombre, estado (atendido o pendiente), detalles como especie/raza, dueño, edad y teléfono, así como botones para cambiar el estado, editar o eliminar la mascota. Cada tarjeta se agrega al contenedor principal, permitiendo que la interfaz refleje siempre el estado actual del inventario.
// Le pasamos un arreglo; si no le pasamos nada, usa el inventario completo
function actualizarPantalla(listaAMostrar = inventarioMascotas) {
    contenedorLista.innerHTML = '';

    listaAMostrar.forEach(function(mascota) {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-paciente'); 

        const titulo = document.createElement('h3');
        titulo.textContent = `🐼 ${mascota.nombre}`;

        const estado = document.createElement('span');
        estado.classList.add('estado-badge');
        
        // Verificamos el estado para cambiar el texto y color visual
        if (mascota.atendido) {
            estado.classList.add('atendido');
            estado.textContent = 'Estado: Atendido ✅';
        } else {
            estado.classList.add('pendiente');
            estado.textContent = 'Estado: Pendiente ⏳';
        }

        // Creamos párrafos para mostrar detalles adicionales de la mascota, incluyendo especie/raza, nombre del dueño y edad, así como el número de teléfono. Esto proporciona al usuario información completa sobre cada paciente en un formato claro y organizado.
        const pDetalles = document.createElement('p');
        pDetalles.textContent = `Especie/Raza: ${mascota.tipo} - ${mascota.raza}`;

        const pDueno = document.createElement('p');
        pDueno.textContent = `Dueño: ${mascota.dueno} | Edad: ${mascota.edad} años`;

        const pTelefono = document.createElement('p');
        pTelefono.textContent = `Teléfono: ${mascota.telefono}`;

        // Contenedor para agrupar los botones
        const cajaBotones = document.createElement('div');
        cajaBotones.classList.add('caja-botones');

        // Botón: Cambiar Estado
        const btnEstado = document.createElement('button');
        btnEstado.textContent = mascota.atendido ? ' ⏳Marcar como Pendiente' : '✅ Marcar como Atendido';
        btnEstado.addEventListener('click', () => cambiarEstadoMascota(mascota.id));

        // Botón: Editar
        const btnEditar = document.createElement('button');
        btnEditar.textContent = '✏️ Editar';
        btnEditar.addEventListener('click', () => cargarDatosParaEdicion(mascota.id));

        // Botón: Eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '🗑️ Eliminar';
        btnEliminar.addEventListener('click', () => eliminarMascota(mascota.id));

        // Ensamblamos
        cajaBotones.appendChild(btnEstado);
        cajaBotones.appendChild(btnEditar);
        cajaBotones.appendChild(btnEliminar);

        // Agregamos todos los elementos a la tarjeta
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(estado);
        tarjeta.appendChild(pDetalles);
        tarjeta.appendChild(pDueno);
        tarjeta.appendChild(pTelefono);
        tarjeta.appendChild(cajaBotones);

        // Agregamos la tarjeta al contenedor principal de la lista
        contenedorLista.appendChild(tarjeta);
    });
}


// OPERACIONES DE GUARDADO, ELIMINACIÓN Y EDICIÓN DE DATOS.

//  La función guardarDatos convierte el arreglo inventarioMascotas a una cadena JSON y lo almacena en localStorage bajo la clave pacientesVeterinaria, asegurando que los cambios se persistan entre sesiones. Después de guardar, llama a actualizarPantalla para reflejar inmediatamente cualquier cambio en la interfaz de usuario, manteniendo la lista de pacientes sincronizada con el almacenamiento local.
function guardarDatos() {
    localStorage.setItem('pacientesVeterinaria', JSON.stringify(inventarioMascotas));
    actualizarPantalla();
}

// La función eliminarMascota recibe un ID de mascota y solicita confirmación al usuario antes de proceder. Si el usuario confirma, filtra el arreglo inventarioMascotas para excluir la mascota con el ID proporcionado, actualiza el almacenamiento local y refresca la pantalla para reflejar la eliminación.
function eliminarMascota(id) {
    if(confirm("¿Estás seguro de eliminar este registro?")) {
        // Filtramos para quedarnos con todos menos el que coincide con el ID
        inventarioMascotas = inventarioMascotas.filter(mascota => mascota.id !== id);
        guardarDatos();
    }
}

// La función cambiarEstadoMascota busca una mascota por su ID y alterna su estado de 'atendido' entre true y false. Después de cambiar el estado, llama a guardarDatos para actualizar el almacenamiento local y refrescar la pantalla, asegurando que la interfaz refleje el nuevo estado del paciente.
function cambiarEstadoMascota(id) {
    // Buscamos la mascota y le invertimos su valor de 'atendido' (de true a false o viceversa)
    const mascota = inventarioMascotas.find(m => m.id === id);
    if(mascota) {
        mascota.atendido = !mascota.atendido;
        guardarDatos();
    }
}

// La función cargarDatosParaEdicion busca una mascota por su ID y, si la encuentra, llena el formulario con sus datos existentes. Esto permite al usuario editar la información de la mascota. También ajusta el selector de tipo y sub-tipo de mascota, mostrando el campo de raza personalizada si es necesario. Finalmente, cambia el estado de edición y actualiza el texto del botón de envío para reflejar que se está editando un registro existente.
function cargarDatosParaEdicion(id) {
    const mascota = inventarioMascotas.find(m => m.id === id);
    if(mascota) {
        // Llenamos el formulario con los datos existentes
        document.getElementById('nombre-mascota').value = mascota.nombre;
        document.getElementById('nombre-dueño').value = mascota.dueno;
        document.getElementById('edad').value = mascota.edad;
        document.getElementById('telefono').value = mascota.telefono;
        
        // Forzamos el cambio del selector de tipo
        selectTipoMascota.value = mascota.tipo;
        const eventoChange = new Event('change');
        selectTipoMascota.dispatchEvent(eventoChange);
        
        // Asignamos la raza
        // (Simplificado para evitar complicaciones extra con el campo "otro" al editar)
        selectSubTipo.value = mascota.raza;
        if (!selectSubTipo.value) {
            selectSubTipo.value = 'otro';
            selectSubTipo.dispatchEvent(new Event('change'));
            inputRazaPersonalizada.value = mascota.raza;
        }

        // Cambiamos la variable de estado y el texto del botón
        mascotaEnEdicionId = id;
        btnSubmit.textContent = 'Actualizar Datos';
        window.scrollTo(0, 0); // Llevamos la pantalla arriba
    }
}

// EVENTOS DE FORMULARIO Y VALIDACIÓN DE DATOS.

// Creamos un evento 'submit' para el formulario. Este evento previene el comportamiento por defecto de recargar la página y captura los valores ingresados por el usuario. Se realizan validaciones básicas, como verificar que los nombres tengan más de dos caracteres y que la edad sea un número válido entre 0 y 30. Dependiendo de si se está creando un nuevo paciente o editando uno existente, se actualiza el arreglo inventarioMascotas en consecuencia. Finalmente, se guarda la información en localStorage, se limpia el formulario y se restablecen los selectores a su estado inicial.
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    // Capturamos y limpiamos los valores del formulario, con trim() para eliminar espacios innecesarios
    const nombre = document.getElementById('nombre-mascota').value.trim();
    const dueno = document.getElementById('nombre-dueño').value.trim();
    // Convertimos la edad a número entero para validación
    const edad = parseInt(document.getElementById('edad').value);
    const telefono = document.getElementById('telefono').value.trim();
    // Capturamos el tipo de mascota seleccionado
    const tipo = document.getElementById('tipoMascota').value;

    // Capturamos la raza o especie seleccionada; si es "otro", usamos el valor del campo de entrada personalizado
    let raza = selectSubTipo.value;
    if (raza === 'otro') {
        raza = inputRazaPersonalizada.value.trim(); 
    }

    // Agregamos validaciones básicas para asegurar que los datos ingresados sean razonables antes de proceder a guardar o actualizar la información. Si alguna validación falla, se muestra un mensaje de error y se detiene el proceso.
    if (nombre.length <= 2 || dueno.length <= 2) return mostrarError("Los nombres deben ser más largos, al menos 3 caracteres.");
    // isNaN verifica si la edad no es un número; además, validamos que esté en el rango de 0 a 30 años
    if (isNaN(edad) || edad < 0 || edad > 30) return mostrarError("Edad inválida.");

    // Dependiendo de si estamos en modo edición o creación, actualizamos el arreglo inventarioMascotas de manera diferente. Si estamos editando, buscamos la mascota por su ID y actualizamos sus propiedades; si estamos creando, generamos un nuevo objeto con un ID único basado en la fecha y hora actual, y lo agregamos al arreglo. Esto permite que la aplicación maneje ambos casos de manera eficiente y coherente.
    if (mascotaEnEdicionId) {
        // MODO EDICIÓN: Buscamos la mascota y actualizamos sus datos
        const mascota = inventarioMascotas.find(m => m.id === mascotaEnEdicionId);
        mascota.nombre = nombre;
        mascota.dueno = dueno;
        mascota.edad = edad;
        mascota.telefono = telefono;
        mascota.tipo = tipo;
        mascota.raza = raza;
        
        // Reseteamos el estado de edición
        mascotaEnEdicionId = null;
        btnSubmit.textContent = 'Añadir Paciente';
    } else {
        // MODO CREACIÓN: Creamos un objeto nuevo
        const nuevoPaciente = {
            id: Date.now(), // ID único
            nombre: nombre,
            dueno: dueno,
            edad: edad,
            telefono: telefono,
            tipo: tipo,
            raza: raza,
            atendido: false
        };
        inventarioMascotas.push(nuevoPaciente);
    }

    guardarDatos();
    
    // Limpieza
    formulario.reset();
    selectSubTipo.innerHTML = '<option value="" disabled selected>Primero selecciona tipo...</option>';
    selectSubTipo.disabled = true;
    inputRazaPersonalizada.style.display = 'none';
});

// BUSCADOR Y FILTROS DE LISTA.

// Buscador de mascotas por nombre. Este evento escucha cambios en el campo de entrada del buscador y filtra el arreglo inventarioMascotas para encontrar coincidencias que incluyan el texto ingresado, ignorando mayúsculas y minúsculas. Los resultados filtrados se pasan a la función actualizarPantalla para mostrar solo las mascotas que coinciden con la búsqueda, proporcionando una forma rápida y eficiente de localizar pacientes específicos dentro del inventario.
buscadorNombre.addEventListener('input', (evento) => {
    const textoBusqueda = evento.target.value.toLowerCase();
    const resultados = inventarioMascotas.filter(mascota => 
        mascota.nombre.toLowerCase().includes(textoBusqueda)
    );
    actualizarPantalla(resultados);
});

// Variable para recordar el estado del orden (comienza en true para A-Z)
let ordenAscendente = true;

// Ordenar A-Z y Z-A alternadamente
btnOrdenar.addEventListener('click', () => {
    // Usamos el operador spread [...] para no alterar el orden original del arreglo base
    const listaOrdenada = [...inventarioMascotas].sort((a, b) => {
        if (ordenAscendente) {
            // Ordena de la A a la Z
            return a.nombre.localeCompare(b.nombre);
        } else {
            // Ordena de la Z a la A (invertimos a y b)
            return b.nombre.localeCompare(a.nombre);
        }
    });

    // Cambiamos el texto del botón para indicar qué hará el próximo clic
    if (ordenAscendente) {
        btnOrdenar.textContent = 'Ordenar Z-A';
    } else {
        btnOrdenar.textContent = 'Ordenar A-Z';
    }

    // Invertimos el interruptor para la próxima vez que se haga clic
    ordenAscendente = !ordenAscendente;

    // Actualizamos la pantalla con la nueva lista ordenada
    actualizarPantalla(listaOrdenada);
});

// Boton de filtro para mostrar todas las mascotas independientemente de su estado.
btnTodos.addEventListener('click', () => actualizarPantalla(inventarioMascotas));

// Botón de filtro para mostrar solo las mascotas pendientes de atención. Filtra el arreglo inventarioMascotas para incluir únicamente aquellas mascotas cuyo estado 'atendido' sea false, y luego actualiza la pantalla con este subconjunto, permitiendo al usuario enfocarse en los pacientes que aún requieren atención.
btnPendientes.addEventListener('click', () => {
    const pendientes = inventarioMascotas.filter(m => m.atendido === false);
    actualizarPantalla(pendientes);
});

// Botón de filtro para mostrar solo las mascotas que ya han sido atendidas. Filtra el arreglo inventarioMascotas para incluir únicamente aquellas mascotas cuyo estado 'atendido' sea true, y luego actualiza la pantalla con este subconjunto, permitiendo al usuario revisar fácilmente los pacientes que ya han recibido atención.
btnAtendidos.addEventListener('click', () => {
    const atendidos = inventarioMascotas.filter(m => m.atendido === true);
    actualizarPantalla(atendidos);
});


// INICIALIZACIÓN DE LA PANTALLA AL CARGAR LA PÁGINA. Al cargar la página, se llama a la función actualizarPantalla para mostrar inmediatamente la lista de mascotas almacenadas en el inventario, asegurando que el usuario vea la información más reciente y completa desde el inicio.
actualizarPantalla();