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


## Diseño y Estilos (Archivo `styles.css`)

Si el HTML es el esqueleto y el JavaScript es el cerebro, este archivo es la "piel" y la identidad visual del sistema. El objetivo aquí fue dejar de lado el aspecto de "formulario genérico" y darle a la aplicación una apariencia moderna, profesional y amigable, muy similar a la que se diseñaría en herramientas de prototipado como Figma.

### 1. Variables de Diseño y Tipografía Local
Para mantener un diseño consistente, el código inicia declarando "variables" de CSS (`:root`). Esto permite guardar los colores corporativos de la veterinaria (azul principal, azul secundario, rojo de acento y colores de fondo) en un solo lugar. Si en el futuro se desea cambiar la paleta de colores, solo se modifica esa línea y toda la página se actualiza automáticamente. 
Además, se implementó la regla `@font-face` para cargar la fuente "Caveat" de manera local desde la carpeta `fonts`, asegurando que el título principal siempre mantenga su identidad redondeada sin depender de una conexión externa.

### 2. Tratamiento del Fondo de Pantalla
Para darle más vida a la clínica, se agregó una imagen de fondo con animales. Sin embargo, para evitar que esta imagen compitiera con el texto y dificultara la lectura, se aplicó una técnica visual usando `linear-gradient`. Esto crea una "capa de vidrio esmerilado" (un color claro semi-transparente) por encima de la foto, logrando que los animales se vean sutilmente de fondo mientras que las tarjetas y el formulario destacan con total claridad.

### 3. Maquetación Inteligente (Grid y Flexbox)
En lugar de dejar que los elementos cayeran uno debajo del otro, se utilizaron técnicas modernas de alineación:
* **CSS Grid (Cuadrículas):** Se usó para dividir la pantalla principal en dos grandes columnas: una fija a la izquierda para el formulario de registro y una sección amplia a la derecha para el inventario. También se usó Grid para que las tarjetas de los pacientes se acomoden solas en filas y columnas según el espacio disponible en la pantalla.
* **Flexbox:** Se utilizó para detalles más precisos, como alinear perfectamente el icono SVG del logo junto al título en la cabecera, o para distribuir equitativamente los botones de "Editar" y "Eliminar" dentro de cada tarjeta.

### 4. Tarjetas, Formularios e Interacción
Se aplicaron principios de diseño UI para mejorar la experiencia del usuario (UX):
* A las tarjetas (`cards`) y al formulario se les dio un fondo blanco puro, bordes redondeados y una sombra sutil (`box-shadow`) para que parezca que están "flotando" sobre el fondo.
* Se agregaron pequeñas animaciones de transición (`hover`). Por ejemplo, cuando el usuario pasa el mouse sobre una tarjeta, esta se eleva un poco; y si pasa el mouse sobre el logotipo del estetoscopio, este hace un pequeño giro, dándole dinamismo a la página.

### 5. Indicadores Visuales (Badges)
Para que el usuario pueda saber el estado de un paciente con un solo vistazo, se crearon etiquetas de colores (badges). Si el paciente está "Pendiente", su etiqueta tiene un fondo naranja/amarillo llamativo; si ya fue "Atendido", el sistema de JavaScript le inyecta una clase de CSS que cambia automáticamente esa etiqueta a un verde de confirmación.

### 6. Diseño Responsivo (Adaptación a Celulares)
Finalmente, el sistema no está pensado solo para computadoras de escritorio. Mediante el uso de *Media Queries* (`@media`), se le dio la instrucción al CSS de que, si la pantalla del dispositivo es menor a 800 píxeles de ancho (como un teléfono celular o una tablet pequeña), rompa la cuadrícula de dos columnas y coloque el formulario en la parte superior y la lista de pacientes debajo, garantizando que el sistema sea 100% usable desde cualquier dispositivo.



## Uso de Inteligencia Artificial como Apoyo al Desarrollo

Al finalizar este proyecto, se reflexiona sobre el uso de herramientas de Inteligencia Artificial durante el proceso de codificación:

**1. ¿Qué herramienta utilizó?**
Utilicé Gemini, el modelo de lenguaje grande de Google.

**2. ¿Qué consulta realizó?**
Realicé diversas consultas enfocadas en la resolución de problemas lógicos y arquitectónicos. Algunas de las principales fueron:
* ¿Cómo validar correctamente los tipos de datos en el formulario para evitar ingresos ilógicos?
* ¿Por qué el uso de `alert()` congelaba la ejecución de la página y cómo solucionarlo?
* ¿Cómo estructurar el código para implementar métodos de manipulación del DOM (como `createElement` o `textContent`) y separar los datos de la vista visual?
* ¿Cuál es la mejor manera de manipular el botón de ordenamiento para que alterne dinámicamente y cómo integrar archivos gráficos SVG manteniendo limpio el HTML?

**3. ¿Qué sugerencia entregó la IA?**
La herramienta proporcionó explicaciones conceptuales y correcciones de sintaxis. Sugirió reemplazar los procesos síncronos bloqueantes (`alert()`) por notificaciones visuales dinámicas inyectadas directamente en el DOM. Además, recomendó el uso de funciones como `isNaN()` combinadas con `parseInt()` para una validación numérica estricta, la implementación de `localStorage` para la persistencia de los datos, y buenas prácticas de "Self-hosting" para tipografías y recursos vectoriales.


**4. ¿La utilizó completamente o realizó modificaciones?**

No utilicé el código generado de forma íntegra ni en su primera versión. El desarrollo fue un proceso iterativo donde la IA actuó como un consultor técnico, pero las decisiones de arquitectura, diseño y escalabilidad fueron guiadas por mis propios requerimientos. Entre las modificaciones y decisiones clave destaco:

*   **Refactorización de la manipulación del DOM:** Inicialmente, el sistema utilizaba métodos básicos y ventanas emergentes bloqueantes (`alert`). Fui yo quien determinó la necesidad de modernizar el código exigiendo la implementación estricta de métodos como `createElement()`, `appendChild()`, `textContent` y `classList`. Esto permitió crear notificaciones visuales dinámicas y hacer el sistema a prueba de inyecciones de código (XSS).
*   **Expansión de la lógica (CRUD y Filtros):** Partimos de un formulario de registro básico, sobre el cual solicité construir un sistema completo. Cuando la IA estructuró la función para ordenar la lista de la A a la Z, me di cuenta de que la usabilidad estaba incompleta, por lo que exigí modificar la lógica para incluir un interruptor (una variable booleana) que permitiera alternar el ordenamiento de Z a A dinámicamente.
*   **Decisiones de Arquitectura (Self-hosting y Modularidad):** No acepté las primeras propuestas de integración de recursos. Cuando la IA sugirió usar la tipografía "Poppins" mediante un enlace CDN de Google Fonts, decidí cambiarla por "Concert One" y aplicar la técnica de *self-hosting* (descargar el archivo `.ttf` y usar `@font-face`), garantizando la carga de la fuente sin depender de internet. 
*   **Limpieza de Código:** De igual forma, cuando generamos el logotipo vectorial, la IA entregó el código `<svg>` para incrustarlo directamente en el HTML. Tomé la decisión arquitectónica de no utilizarlo así para no ensuciar el documento principal, extrayendo el código matemático hacia un archivo externo independiente (`logo.svg`) y llamándolo mediante una etiqueta de imagen, aplicando así el principio de separación de responsabilidades.


**5. ¿Por qué considera importante revisar las respuestas generadas por la IA antes de utilizarlas?**
Porque la IA puede entregar bloques de código que "funcionan" técnicamente en primera instancia, pero que pueden estar desalineados con las buenas prácticas de ingeniería, la escalabilidad o la experiencia de usuario (UX) deseada. Por ejemplo, al tener conocimiento en la sintaxis de otros lenguajes como Python, es fácil confundir operadores lógicos; la IA ayuda a traducir esa lógica a JavaScript, pero es fundamental revisar la respuesta para entender el comportamiento nativo del lenguaje en el navegador. Si el código se copia sin análisis, el desarrollador pierde el control sobre la arquitectura de la aplicación y se anula el proceso de aprendizaje.






