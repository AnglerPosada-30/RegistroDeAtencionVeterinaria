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