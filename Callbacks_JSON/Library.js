// Datos iniciales de libros en formato JSON
let biblioteca = {
    "libros": [
        { "titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "genero": "Realismo mágico", "disponible": true },
        { "titulo": "1984", "autor": "George Orwell", "genero": "Distopía", "disponible": true }
    ]
};

// Función para simular la lectura de datos (asimilar la lectura de un archivo JSON)
function leerDatos(callback) {
    setTimeout(() => {
        // Aquí simulas leer el JSON con un retraso de 1 segundo
        callback(biblioteca);
    }, 1000);
}

// Función para mostrar todos los libros en consola
function mostrarLibros() {
    leerDatos((datos) => {
        console.log("Inventario de libros:");
        datos.libros.forEach((libro, index) => {
            console.log(`${index + 1}. ${libro.titulo} - ${libro.autor} (${libro.disponible ? 'Disponible' : 'Prestado'})`);
        });
    });
}

// Función para agregar un nuevo libro
function agregarLibro(titulo, autor, genero, disponible) {
    const nuevoLibro = { titulo, autor, genero, disponible };
    // Aquí falta la simulación de escribir el libro en el "archivo" (es decir, agregarlo al objeto)
        biblioteca.libros.push({titulo: `${nuevoLibro.titulo}`, autor: `${nuevoLibro.autor}`, genero: `${nuevoLibro.genero}`, disponible: nuevoLibro.disponible});
    setTimeout(() => {
        // Pista: deberías agregar el nuevo libro a `biblioteca.libros`
         
    }, 1000);
}

// Función para cambiar la disponibilidad de un libro
function actualizarDisponibilidad(titulo, nuevoEstado) {
    // Simula un retraso antes de actualizar la disponibilidad
    biblioteca.libros.forEach(biblio =>{
        if(biblio.titulo === titulo){
            biblio.disponible = nuevoEstado;
        }
    });
    setTimeout(() => {
        // Pista: busca el libro por título y cambia la propiedad 'disponible' a nuevoEstado
    }, 1000);
}

// Ejemplo de cómo ejecutar la aplicación
mostrarLibros();
agregarLibro("El principito", "Antoine de Saint-Exupéry", "Fábula", true);
actualizarDisponibilidad("El principito", false);
mostrarLibros();