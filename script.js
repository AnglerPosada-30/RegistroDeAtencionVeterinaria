// Script principal para la gestión de pacientes en la aplicación de veterinaria. Este archivo contiene la lógica para registrar, editar, eliminar y mostrar mascotas, así como para manejar la persistencia de datos mediante localStorage. Además, incluye funcionalidades adicionales como búsqueda, filtrado y ordenamiento de la lista de pacientes.


// El arreglo inventarioMascotas se utiliza como el contenedor principal donde se almacenan todos los pacientes registrados en la aplicación. Al iniciar, el código intenta recuperar desde localStorage la información previamente guardada bajo la clave pacientesVeterinaria. Si esos datos existen, se convierten desde texto JSON a un arreglo real mediante JSON.parse, permitiendo que la aplicación mantenga la lista de pacientes incluso después de cerrar o recargar la página. En caso de que no haya información almacenada, el arreglo se inicializa vacío, asegurando que el sistema siempre tenga un punto de partida válido para registrar nuevos ingresos.
let inventarioMascotas = JSON.parse(localStorage.getItem('pacientesVeterinaria')) || [];

// La variable mascotaEnEdicionId cumple la función de indicar si el formulario está siendo utilizado para crear un nuevo paciente o para editar uno existente. Cuando su valor es null, la aplicación entiende que se está registrando una mascota nueva; si contiene un identificador, significa que el usuario está modificando un registro previamente creado. Esta variable permite que el sistema cambie su comportamiento según el contexto, diferenciando entre agregar y actualizar información dentro del inventario de pacientes.
let mascotaEnEdicionId = null; 

// CAPTURA DE ELEMENTOS DEL DOM

// Capturamos los elementos del DOM que serán utilizados para interactuar con el usuario y manipular la información de los pacientes. Esto incluye selectores para tipo y sub-tipo de mascota, un campo de entrada para razas personalizadas, el formulario principal, el contenedor donde se mostrarán las tarjetas de los pacientes, y el botón de envío del formulario. Además, se capturan elementos adicionales para funcionalidades de búsqueda y filtrado. Esta captura permite que el código pueda manipular estos elementos dinámicamente en respuesta a las acciones del usuario.
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


// LOGICA PARA EL SELECTOR DE SUB-TIPO Y RAZA PERSONALIZADA

// Definimos un objeto que mapea cada tipo de mascota a un arreglo de razas o especies correspondientes. Esto permite que, al seleccionar un tipo de mascota, se puedan mostrar dinámicamente las opciones de raza o especie asociadas a ese tipo. La opción "Otro" se incluye en cada categoría para permitir al usuario ingresar una raza o especie personalizada.
const opcionesRazaEspecie = {
    perro: ['Mestizo', 'Labrador', 'Pug', 'Pastor Alemán', 'Otro'],
    gato: ['Mestizo', 'Persa', 'Siamés', 'Esfinge', 'Otro'],
    exotico: ['Conejo', 'Hurón', 'Hámster', 'Erizo', 'Otro'],
    ave: ['Canario', 'Loro', 'Cacatúa', 'Ninfa', 'Otro'],
};

// Creamos el evento 'change' para el selector de tipo de mascota. Cuando el usuario selecciona un tipo, se limpia el selector de sub-tipo y se oculta el campo de raza personalizada. Si existen razas o especies asociadas al tipo seleccionado, se habilita el selector de sub-tipo y se llenan sus opciones; si no, se deshabilita.
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

// Creamos el evento 'change' para el selector de sub-tipo de mascota. Si el usuario selecciona "Otro", se muestra el campo de entrada para raza personalizada y se marca como obligatorio.
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

// Creamos una función para mostrar mensajes de error de manera temporal en la interfaz. Esta función primero verifica si ya existe un mensaje de error previo y lo elimina para evitar duplicados. Luego, inyecta un div de error al inicio del formulario y utiliza setTimeout para eliminarlo automáticamente después de 3.5 segundos.
function mostrarError(mensaje) {
    const errorPrevio = document.querySelector('.mensaje-error');
    if (errorPrevio) errorPrevio.remove();

    const cajaError = document.createElement('div');
    cajaError.classList.add('mensaje-error'); 
    cajaError.textContent = `⚠️ Error: ${mensaje}`; 
    formulario.prepend(cajaError);
    setTimeout(() => cajaError.remove(), 3500);
}

// FUNCIONES PRINCIPALES DE GESTIÓN DE MASCOTAS

// Función actualizarEstadisticas(). Esta función cumple con el requerimiento de mostrar permanentemente el total de mascotas registradas, las pendientes y las atendidas. Primero calcula el total basándose en la longitud del arreglo, y luego utiliza el método filter() para contar cuántas mascotas tienen su estado 'atendido' en false o true. Finalmente, inyecta estos valores en los elementos del panel HTML.
function actualizarEstadisticas() {
    const total = inventarioMascotas.length;
    const pendientes = inventarioMascotas.filter(m => m.atendido === false).length;
    const atendidos = inventarioMascotas.filter(m => m.atendido === true).length;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pendientes').textContent = pendientes;
    document.getElementById('stat-atendidos').textContent = atendidos;
}

// Función mostrarMascotas(). Esta función recibe un arreglo de mascotas a mostrar; si no se proporciona ninguno, utiliza el inventario completo. Limpia el contenedor de la lista y luego recorre cada mascota, creando dinámicamente una tarjeta que incluye su nombre, estado, detalles, dueño, edad y botones de acción. Al final, ejecuta la función de estadísticas para que la pantalla siempre esté sincronizada.
function mostrarMascotas(listaAMostrar = inventarioMascotas) {
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

        // Creamos párrafos para mostrar detalles adicionales de la mascota, incluyendo especie/raza, nombre del dueño, edad y teléfono.
        const pDetalles = document.createElement('p');
        pDetalles.textContent = `Especie/Raza: ${mascota.tipo} - ${mascota.raza}`;

        const pDueno = document.createElement('p');
        pDueno.textContent = `Dueño: ${mascota.dueno} | Edad: ${mascota.edad} años`;

        const pTelefono = document.createElement('p');
        pTelefono.textContent = `Teléfono: ${mascota.telefono}`;

        // Contenedor para agrupar los botones
        const cajaBotones = document.createElement('div');
        cajaBotones.classList.add('caja-botones');

        // Botón: Cambiar Estado (Llama a la función obligatoria cambiarEstado)
        const btnEstado = document.createElement('button');
        btnEstado.textContent = mascota.atendido ? ' ⏳Marcar como Pendiente' : '✅ Marcar como Atendido';
        btnEstado.addEventListener('click', () => cambiarEstado(mascota.id));

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

    // Aseguramos que los números del panel se actualicen visualmente
    actualizarEstadisticas();
}

// Función cambiarEstado(). Busca una mascota por su ID y alterna su estado de 'atendido' entre true y false. Después de cambiar el estado, llama a guardarDatos para actualizar el almacenamiento local y refrescar la pantalla.
function cambiarEstado(id) {
    const mascota = inventarioMascotas.find(m => m.id === id);
    if(mascota) {
        mascota.atendido = !mascota.atendido;
        guardarDatos();
    }
}

// Función validarFormulario(). Se encarga de aplicar buenas prácticas de seguridad. Verifica que los nombres tengan al menos 3 caracteres y que la edad sea un número lógico (entre 0 y 30). Si alguna validación falla, muestra el error en el DOM y devuelve falso, deteniendo el registro.
function validarFormulario(nombre, dueno, edad) {
    if (nombre.length <= 2 || dueno.length <= 2) {
        mostrarError("Los nombres deben ser más largos, al menos 3 caracteres.");
        return false;
    }
    if (isNaN(edad) || edad < 0 || edad > 30) {
        mostrarError("Edad inválida.");
        return false;
    }
    return true; // Retorna true si todo es correcto
}

// Función registrarMascota(). Dependiendo de si estamos en modo edición o creación, actualizamos el arreglo inventarioMascotas. Si editamos, actualizamos las propiedades; si creamos, generamos un nuevo objeto con un ID único basado en Date.now(), y lo agregamos al arreglo. Finalmente se guardan los datos.
function registrarMascota(nombre, dueno, edad, telefono, tipo, raza) {
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
}


// OPERACIONES DE GUARDADO, ELIMINACIÓN Y EDICIÓN

// La función guardarDatos convierte el arreglo a JSON y lo almacena en localStorage, asegurando que los cambios persistan. Después llama a mostrarMascotas para reflejar inmediatamente cualquier cambio en la interfaz.
function guardarDatos() {
    localStorage.setItem('pacientesVeterinaria', JSON.stringify(inventarioMascotas));
    mostrarMascotas();
}

// La función eliminarMascota recibe un ID de mascota y solicita confirmación al usuario. Si se confirma, filtra el arreglo para excluirla, actualiza el local storage y refresca la pantalla.
function eliminarMascota(id) {
    if(confirm("¿Estás seguro de eliminar este registro?")) {
        inventarioMascotas = inventarioMascotas.filter(mascota => mascota.id !== id);
        guardarDatos();
    }
}

// La función cargarDatosParaEdicion busca una mascota por su ID y llena el formulario con sus datos existentes, permitiendo editarlos. También ajusta dinámicamente los selectores de raza/especie y cambia el botón para indicar que es una actualización.
function cargarDatosParaEdicion(id) {
    const mascota = inventarioMascotas.find(m => m.id === id);
    if(mascota) {
        document.getElementById('nombre-mascota').value = mascota.nombre;
        document.getElementById('nombre-dueño').value = mascota.dueno;
        document.getElementById('edad').value = mascota.edad;
        document.getElementById('telefono').value = mascota.telefono;
        
        selectTipoMascota.value = mascota.tipo;
        const eventoChange = new Event('change');
        selectTipoMascota.dispatchEvent(eventoChange);
        
        selectSubTipo.value = mascota.raza;
        if (!selectSubTipo.value) {
            selectSubTipo.value = 'otro';
            selectSubTipo.dispatchEvent(new Event('change'));
            inputRazaPersonalizada.value = mascota.raza;
        }

        mascotaEnEdicionId = id;
        btnSubmit.textContent = 'Actualizar Datos';
        window.scrollTo(0, 0); // Llevamos la pantalla arriba
    }
}

// EVENTOS DE FORMULARIO Y FILTROS

// Evento 'submit' principal del formulario. Previene recargar la página, captura los valores, y utiliza las funciones exigidas "validarFormulario" y "registrarMascota" para mantener la lógica separada, estructurada y limpia.
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    // Capturamos y limpiamos los valores del formulario
    const nombre = document.getElementById('nombre-mascota').value.trim();
    const dueno = document.getElementById('nombre-dueño').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const telefono = document.getElementById('telefono').value.trim();
    const tipo = document.getElementById('tipoMascota').value;

    let raza = selectSubTipo.value;
    if (raza === 'otro') {
        raza = inputRazaPersonalizada.value.trim(); 
    }

    // Delegamos la lógica en las funciones requeridas por la pauta
    if (validarFormulario(nombre, dueno, edad)) {
        registrarMascota(nombre, dueno, edad, telefono, tipo, raza);
        
        // Limpieza de campos y restablecimiento de selectores
        formulario.reset();
        selectSubTipo.innerHTML = '<option value="" disabled selected>Primero selecciona tipo...</option>';
        selectSubTipo.disabled = true;
        inputRazaPersonalizada.style.display = 'none';
    }
});

// BUSCADOR Y FILTROS DE MASCOTAS

// Buscador de mascotas por nombre. Filtra el arreglo inventarioMascotas para encontrar coincidencias ignorando mayúsculas/minúsculas y luego pasa el resultado a la función mostrarMascotas.
buscadorNombre.addEventListener('input', (evento) => {
    const textoBusqueda = evento.target.value.toLowerCase();
    const resultados = inventarioMascotas.filter(mascota => 
        mascota.nombre.toLowerCase().includes(textoBusqueda)
    );
    mostrarMascotas(resultados);
});

// Variable para recordar el estado del orden
let ordenAscendente = true;

// Ordenar A-Z y Z-A alternadamente utilizando el método sort() sobre una copia del arreglo para no alterar el original.
btnOrdenar.addEventListener('click', () => {
    const listaOrdenada = [...inventarioMascotas].sort((a, b) => {
        if (ordenAscendente) {
            return a.nombre.localeCompare(b.nombre);
        } else {
            return b.nombre.localeCompare(a.nombre);
        }
    });

    if (ordenAscendente) {
        btnOrdenar.textContent = 'Ordenar Z-A';
    } else {
        btnOrdenar.textContent = 'Ordenar A-Z';
    }

    ordenAscendente = !ordenAscendente;
    mostrarMascotas(listaOrdenada);
});

// Botones de filtro de estado. Utilizan filter() sobre el arreglo principal y pasan el subconjunto resultante a mostrarMascotas() para enfocar la vista en Todos, Pendientes o Atendidos.
btnTodos.addEventListener('click', () => mostrarMascotas(inventarioMascotas));

btnPendientes.addEventListener('click', () => {
    const pendientes = inventarioMascotas.filter(m => m.atendido === false);
    mostrarMascotas(pendientes);
});

btnAtendidos.addEventListener('click', () => {
    const atendidos = inventarioMascotas.filter(m => m.atendido === true);
    mostrarMascotas(atendidos);
});

// INICIALIZACIÓN DE LA APLICACIÓN

// Al cargar la página, llamamos a la función principal para pintar la lista almacenada y actualizar los paneles estadísticos.
mostrarMascotas();