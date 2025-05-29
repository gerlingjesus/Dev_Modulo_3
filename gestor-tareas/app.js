//URL APi local
const API_URL = `http://localhost:3000/tareas`;

//Dom
//Referenciar los elementos del DOM para trabajar con ellos Dashboard y botonnes

const Tareas_Form = document.getElementById(`Tareas_Form`);
const resetBtn = document.getElementById(`reset-btn`);
const TareasPendiente = document.getElementById('Tareas-Pendiente');
const TareasProceso = document.getElementById('Tareas-EnProceso');
const TareasTerminado = document.getElementById('Tareas-Terminado');

//DOM formulario opciones de entrada
const inputId = document.getElementById(`Tarea_Id`);
const inputTitulo = document.getElementById(`Tarea_Titulo`);
const inputDescripcion = document.getElementById(`Tarea_Descripcion`);
const inputEstado = document.getElementById(`Tarea_Estado`);
const inputResponsable = document.getElementById(`Tarea_Responsable`);

//Evento para Crear nueva actividad
Tareas_Form.addEventListener('submit', async (e) => {
    e.preventDefault(); //evitar que la pagina se recargue
    
    const titulo = inputTitulo.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const estado = inputEstado.value;
    const responsable = inputResponsable.value.trim();
    const id = inputId.value.trim();
    
    //Validaciòn que no halla campos vacios
    if(!titulo || !descripcion || !estado || !responsable){
        showError(`Por favor completa todos los campos correctamente`);
        return;
    }
    if(estado === "Estado"){
        alert('Coloca un estado valido');
        return;
    }
    //Creamos un objeto con los datos obtenidos por el formulario
    const payload = {titulo,descripcion,estado,responsable};

    try {
        let response; // Variable para almacenar la respuesta del servidor

        if(id){
            // si el producto ya tiene un ID, significa que estamos actualiizando un producto existente (método PUT)
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT', // Método para actualizar un producto existente
                headers: {'Content-Type': 'application/json'}, // Indicar que el cuerpo de la solicitud es JSON
                body: JSON.stringify(payload), // Convertir el objeto payload a una cadena JSON
            })
        }
        else{
            const allTareasRes = await fetch(API_URL); //Obtener las tareas actuales
            const allTareas = await allTareasRes.json(); //convertir la respuesta obtenidad a .json

            // al tener la lista de productos, generar un nuevo ID 
            const newId = allTareas.length 
            ? Math.max(...allTareas.map(p => Number(p.id))) + 1
            : 1; // Generar un nuevo ID basado en el máximo ID existente

            response = await fetch(API_URL, {
                method: 'POST', //metodo para agregar una nueva tarea
                //verificar si podemos trabajar sin ello.
                headers: {'Content-Type': 'application/json'}, // Indicar que el cuerpo de la solicitud es JSON
                body: JSON.stringify({id: String(newId), ...payload}), //convertimos el objeto payload a una cadena JSON y lo pasamos al metodo
            });

            if(!response.ok) throw new Error(`status: ${response.status}`);
            await getTareas();
            Tareas_Form.reset();
        }
        
    } catch (error) {
        showError('Error al enviar los datos: ' + error.message); // Mostrar un mensaje de error si ocurre un error al enviar los datos   
    }

});

//Obtenemos los datos del servidor local
async function getTareas(){
    try {
        const response = await fetch(API_URL);
        const tareas = await response.json();
        //Enviamos a renderizar los datos obtenidos
        renderTareas(tareas);
    } 
    catch (error) {
        showError('Error al obtener las tareas: ' + error.message)
    }

}

//funciòn para pintar los resultados obtenidos del servidor local
function renderTareas(tareas){
    TareasPendiente.innerHTML = '';
   //metodo para obtener y pintar las actividades "Pendientes"
    tareas.forEach(t => {
        if(t.estado === "pendiente"){
            const row = document.createElement('tr');
            row.className = "card";
            row.innerHTML = `
            <td>
                <p>Titulo: ${t.titulo}</p>
                <p>Descripciòn: ${t.descripcion}</p>
                <p>Responsable: ${t.responsable}</p>
                 <button class="btn btn-outline-info btn-sm edit-btn" data-id="${t.id}">Editar</button>
                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${t.id}">Eliminar</button>      
            </td>
            `
            TareasPendiente.appendChild(row);
        }

    });
    //metodo para obtener y pintar las actividades "En progreso"
    TareasProceso.innerHTML = '';
    tareas.forEach(t => {
        if(t.estado == "en progreso"){
            const row = document.createElement('tr');
            row.className = "card";
            row.innerHTML = `
            <td>
                <p>Titulo: ${t.titulo}</p>
                <p>Descripciòn: ${t.descripcion}</p>
                <p>Responsable: ${t.responsable}</p>
                <button class="btn btn-outline-info btn-sm edit-btn" data-id="${t.id}">Editar</button>
                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${t.id}">Eliminar</button>  
            </td>
            `
            TareasProceso.appendChild(row);
        }
    });
    //metodo para obtener y pintar las actividades "Terminadas"
    TareasTerminado.innerHTML = '';
    tareas.forEach(t => {
        if(t.estado == "terminada"){
            const row = document.createElement('tr');
            row.className = "card";
            row.innerHTML = `
            <td>
                <p>Titulo: ${t.titulo}</p>
                <p>Descripciòn: ${t.descripcion}</p>
                <p>Responsable: ${t.responsable}</p>
                <button class="btn btn-outline-info btn-sm edit-btn" data-id="${t.id}">Editar</button>
                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${t.id}">Eliminar</button>  
            </td>
            `
            TareasTerminado.appendChild(row);
        }
    });

    //Evento para asignar un evento escucha a cada uno de los botones de eliminar de cada actividad
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteTarea(id);
        });

    });

    //Evento para asignar un evento escucha a cada uno de los botones de editar de cada actividad
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            editTarea(id);
        } );

    });
}

//Funcion asincrona para eliminar una tarea por ID
 async function deleteTarea(id){
    //asegurar que el parametro sea un numero
    const idNumber = Number(id);

    //pedir confirmaciòn para eliminar dicha tarea
    if(!confirm('¿Realmente deseas eliminar la tarea?')) return;
    
    try {
        //hacer solicitud con el metodo DELETE al servidor
        const response = await fetch(`${API_URL}/${idNumber}`, {method: 'DELETE',});
        //en caso de error
        if(!response.ok) throw new Error(`Status: ${response.status}`);
        //comenzamos llamando a la funcion principal para pintar el nuevo resultado
        getTareas();
 
    } catch (error) {
        showError('Error al eliminar el producto: ' + error.message); // Mostrar un mensaje de error si ocurre un error al eliminar
    }
 }

 //Funcion asincrona para editar una tarea por ID

async function editTarea(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const tarea = await response.json();
        inputId.value = tarea.id;
        inputTitulo.value = tarea.titulo;
        inputDescripcion.value = tarea.descripcion;
        inputEstado.value = tarea.estado;
        inputResponsable.value = tarea.responsable;

    } catch (error) {
        showError('Error al editar la tarea: ' + error.message); // Mostrar un mensaje de error si ocurre un error al editar 
    }
    
}




//Llamado a la funciòn principal para consultar al servidor local
getTareas();