# Desarrollo de la Prueba

En el presente trabajo se detalla el proceso de desarrollo de la aplicación web, con el objetivo de evidenciar un entendimiento sólido sobre la integración y el funcionamiento conjunto de HTML, CSS y JavaScript. Es importante destacar que el uso de inteligencia artificial se limitó a la resolución de dudas puntuales y como apoyo conceptual, asegurando que el código fuente no fue simplemente replicado, sino analizado, comprendido y estructurado bajo autoría propia.

A continuación, se detalla el paso a paso seguido para la creación del sitio web:

## Estructura del Archivo `index.html`

Este archivo define el esqueleto principal de la aplicación web, diseñada para el registro y control de pacientes en una clínica veterinaria. El documento organiza la información en secciones semánticas bien diferenciadas y se apoya en archivos externos para los estilos (`styles.css`) y la lógica computacional (`script.js`).

### 1. Configuración Inicial (`<head>`)
* Se declara el tipo de documento HTML5 y el idioma base de la página.
* Se establece la codificación UTF-8 y la etiqueta `viewport` para garantizar un diseño responsivo adaptable a dispositivos móviles.
* Se define el título visible en la pestaña del navegador.
* Se enlaza la hoja de estilos externa encargada del diseño visual.

### 2. Encabezado (`<header>`)
* Contiene el título principal de la aplicación: "Control de Pacientes Veterinarios".
* Actúa como la principal referencia visual e introductoria para el usuario.

### 3. Contenido Principal (`<main>`)
El núcleo de la página está dividido en dos grandes áreas operativas:

**Sección de Registro de Nuevos Pacientes**
* Formulario estructurado para ingresar los datos de la mascota y su dueño (Nombre, Edad, Teléfono).
* Selector base para el "Tipo de mascota" (perro, gato, exótico, ave).
* Menú dinámico de "Especie/Raza" que se actualiza en tiempo real según el tipo de animal seleccionado previamente.
* Campo de texto oculto para capturar una raza personalizada, el cual se despliega únicamente al seleccionar la opción "Otro".
* Uso estratégico de atributos `id` en cada entrada de datos para facilitar su captura y procesamiento mediante JavaScript al momento de accionar el botón "Añadir Paciente".

**Sección de Lista y Gestión de Pacientes**
* Panel interactivo donde se visualizan los pacientes mediante tarjetas (`cards`) generadas dinámicamente.
* Controles de filtrado integrados para alternar la vista entre "Todos", "Pendientes" y "Ya Atendidos".
* Barra de búsqueda en tiempo real para localizar mascotas por su nombre.
* Botón de ordenamiento para organizar el inventario de manera alfabética (A-Z o Z-A).
* Contenedor base (`#contenedor-lista`) reservado para que el DOM inyecte las tarjetas con la información y los botones de acción correspondientes a cada paciente.

### 4. Conexión de la Lógica (`<script>`)
* Al final del cuerpo del documento se enlaza el archivo `script.js`.
* Esta ubicación estratégica garantiza que toda la lógica de registro, filtros, ordenamiento y control de estados se ejecute únicamente cuando el árbol HTML ya ha sido completamente renderizado por el navegador.


## Lógica de la Aplicación (Archivo `script.js`)

En esta sección se explica el "cerebro" de la página web. El objetivo principal de este archivo es darle vida a la interfaz, asegurando que los datos no se pierdan, validando la información y haciendo que sea fácil interactuar con el sistema.

### 1. Memoria y Estado del Sistema
Para evitar que la información se borre al recargar la página, el sistema utiliza la memoria del navegador (`localStorage`). 
* **El Inventario:** Todas las mascotas se guardan en una lista principal. Si es la primera vez que se abre la página, esta lista arranca vacía para recibir ingresos. Si ya existen datos, los recupera automáticamente.
* **Modo Edición:** Se implementó un "interruptor" interno que le avisa al formulario si estamos registrando a un paciente nuevo, o si estamos corrigiendo los datos de uno que ya existe.

### 2. Conexión con la Interfaz
Lo primero que hace el código es "capturar" todas las partes interactivas de la página (los botones, las cajas de texto, los menús). De esta forma, cuando el usuario hace clic o escribe algo, el sistema sabe exactamente de dónde sacar la información o qué acción tomar.

### 3. Formularios Inteligentes
Para facilitar el registro, los menús cambian según lo que elija el usuario. Por ejemplo, si seleccionas "Perro", el siguiente menú solo te mostrará razas de perros. Además, si la mascota no encaja en las opciones predeterminadas, al elegir "Otro", el sistema despliega automáticamente una caja de texto nueva para escribir la especie o raza a mano.

### 4. Avisos de Error Amigables
En lugar de usar ventanas emergentes molestas que bloquean la pantalla cuando el usuario se equivoca (por ejemplo, poniendo una edad irreal), se creó una función que muestra un pequeño cuadro de advertencia en el formulario. Este mensaje desaparece solo después de unos segundos, manteniendo la pantalla limpia.

### 5. Creación de las Tarjetas de Pacientes
Existe una función maestra encargada de "dibujar" a los pacientes en la pantalla. Esta función toma la lista de mascotas y crea una tarjeta visual para cada una, mostrando su nombre, dueño, edad, teléfono y un indicador que señala si su estado es "Pendiente" o "Atendido". También le agrega a cada tarjeta los botones individuales para interactuar con ella.

### 6. Guardar, Editar y Eliminar
* **Guardar:** Cada vez que hacemos un cambio (agregar a alguien, editarlo o atenderlo), el sistema actualiza la memoria del navegador y redibuja la pantalla al instante para mostrar la información más reciente.
* **Eliminar:** Si queremos borrar un registro, el sistema primero lanza una alerta de confirmación para evitar accidentes.
* **Editar:** Al presionar el botón de editar, el sistema toma los datos de la tarjeta seleccionada y los vuelve a cargar en el formulario principal para que podamos corregirlos fácilmente.

### 7. Validaciones de Seguridad
Antes de dejar que un paciente sea registrado, el código revisa que los datos tengan sentido lógico. Por ejemplo, obliga a que los nombres tengan más de dos letras y comprueba que la edad sea un número real, entre 0 y 30 años. Si algo no cuadra, frena el proceso y lanza el aviso de error.

### 8. Buscador, Filtros y Orden
Para que sea fácil manejar una gran cantidad de pacientes, se agregaron herramientas de organización:
* **Buscador:** Una barra de texto que filtra las tarjetas en tiempo real a medida que escribes el nombre de la mascota.
* **Orden Alfabético:** Un botón que organiza toda la lista de la A a la Z. Si el usuario lo vuelve a presionar, la lista se invierte de la Z a la A.
* **Filtros rápidos:** Botones para limpiar la pantalla y ver únicamente a los pacientes "Pendientes", solo a los "Atendidos", o volver a verlos a "Todos".






