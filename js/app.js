import { listadoProductos, categoriasSelect, buscadorBtn, buscadorInput } from './selectores.js' //Se importan los selectores

//Se define un objeto para recibir parametros de busqueda de productos
const objBusqueda = {
    producto: '',
    categoria: ''
}


//Carga consulta por defecto de productos
document.addEventListener('DOMContentLoaded', () => {
    consultarCategorias();
    

    //Carga los eventos para obtener los valores de los inputs html
    buscadorInput.addEventListener('input', leervalor);
    categoriasSelect.addEventListener('change', leervalor);

    //Carga evento submit del formulario para busqueda de productos y le asigna funcion
    buscadorBtn.addEventListener('submit', validarBusqueda);

    consultarProductos('');
})

function leervalor(e) {
    //Obtiene el valor de los input, los asigna al objeto y realiza la consulta para enlistar datos
    objBusqueda[e.target.name] = e.target.value;
    let {producto, categoria} = objBusqueda;
    consultarProductos(producto, categoria)
}




function validarBusqueda(e) {
    e.preventDefault();
    //Envia los datos de busqueda a la consulta
    let { producto, categoria } = objBusqueda;
    consultarProductos(producto, categoria);

}

//Request a la api
function consultarProductos(nombreProducto, categoriaProducto) {
    // spinner();

    let url = verificarDatos(nombreProducto, categoriaProducto);

    try {
        //Se realiza la peticion GET para listar productos
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(peticion => peticion.json())
            .then(productos => {
                limpiarHTML();
                listarProductos(productos)
            })
            .catch(error => console.log(error));

    } catch (error) {
        console.log(error);
    }

}

//Verificacion de vacios en inputs
function verificarDatos(nombreProducto, categoriaProducto) {

    let url = "";
    //Verifica que no se envien parametros vacios o NaN a la peticion
    if (nombreProducto !== '') {
        url = `https://apirestbsale.herokuapp.com/product/p/${nombreProducto}`;
    } else if (categoriaProducto !== '' && !isNaN(categoriaProducto)) {
        url = `https://apirestbsale.herokuapp.com/product/c/${Number(categoriaProducto)}`;
    } else {
        url = `https://apirestbsale.herokuapp.com/product`;
    }

    return url
}

//Se realiza peticion GET para obtener las categorias de los productos
function consultarCategorias() {

    let url = `https://apirestbsale.herokuapp.com/category/`; //Ruta de API para categorias

    try {
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(respuesta => respuesta.json())
            .then(peticion => obtenerCategorias(peticion))
            .then(categorias => selectCategorias(categorias))
            .catch(error => console.log(error));

    } catch (error) {
        console.log(error);
    }

}

//Una vez se obtienen las categorias se devuelven en resolve
const obtenerCategorias = categorias => new Promise(resolve => {
    resolve(categorias);
})


//Se cargan en el Select los datos obtenidos en la consulta de categorias hacia 
function selectCategorias(categorias) {
    categorias.forEach(categoria => {
        const { id, name } = categoria;
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        categoriasSelect.appendChild(option);
    });
}

//Se enlistan los productos
function listarProductos(productos) {

    //Verifica que haya minimo 1 producto 
    if (productos.length > 0) {
        productos.forEach(producto => {
            let { name, url_image, price } = producto; //Extrae los datos del arreglo de productos

            //Asigna imagen por defecto a productos sin url
            if (url_image === '' || url_image === null) {
                url_image = '../img/default.jpg'
            }

            //Agrega el listado de productos con los datos extraidos al HTML
            listadoProductos.innerHTML += `
            <div class="bg-white inline-block shadow-xl mt-10 ml-10 w-2/12">
                <div class="mb-5 ">
                    <img class="ml-10  mt-5 h-52 w-9/12" src="${url_image}">
                    <p class="font-bold font-sans text-center mt-4 text-xl">${name}</p>
                </div>
                <hr>
                <div class="mt-5 mb-5 text-center ">
                    <p class="inline-block mr-4 text-xl">$${price}</p>
                    <img class="inline-block" src="../img/carrito2.png"></a>
                </div>
                
            </div>
            `;

        });

    } else {
        //En caso de no encontrar un producto para enlistar muestra alerta
        mostrarAlerta('Lo sentimos, no encontramos resultados');
    }

}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.textError');

    //Si no existe alerta previa, se crea una
    if (!existeAlerta) {
        const alerta = document.createElement('p');

        //Se definen estilos para la alerta
        alerta.classList.add('border-red-400', 'px-20', 'py-40', 'text-red-700', 'rounded', 'mx-auto', 'mt-6', 'text-center', 'w-full', 'textError',);
        //Inserta HTML a la alerta creada
        alerta.innerHTML = `
                    <strong class="font-bold font-sans text-3xl">${mensaje}</strong>
                    </br>
                    <span class="block sm:inline font-sans text-2xl">Por favor, intentalo nuevamente.</span>   
                    </br></br>
                    <a class=" flex justify-center" href="../public/index.html">
                        <img class-"" src="../img/recargar.png">
                    </a>     
            `;

        listadoProductos.appendChild(alerta); //Agrega alerta como hijo al DIV definido en el HTML, para mostrarla

    }
}

//Borra residuos previos de hijos agregados al DIV en el HTML
function limpiarHTML() {
    while (listadoProductos.firstChild) {
        listadoProductos.removeChild(listadoProductos.firstChild);
    }
}

//Agrega function y diseño de spinner para carga
// function spinner() {
//     limpiarHTML();
//     const divSpinner = document.createElement('div');
//     divSpinner.classList.add('sk-circle');
//     divSpinner.innerHTML = `
//             <div class="sk-circle1 sk-child"></div>
//             <div class="sk-circle2 sk-child"></div>
//             <div class="sk-circle3 sk-child"></div>
//             <div class="sk-circle4 sk-child"></div>
//             <div class="sk-circle5 sk-child"></div>
//             <div class="sk-circle6 sk-child"></div>
//             <div class="sk-circle7 sk-child"></div>
//             <div class="sk-circle8 sk-child"></div>
//             <div class="sk-circle9 sk-child"></div>
//             <div class="sk-circle10 sk-child"></div>
//             <div class="sk-circle11 sk-child"></div>
//             <div class="sk-circle12 sk-child"></div>
//     `;

//     listadoProductos.appendChild(divSpinner); //Agrega Spinner al DIV de listado de productos ya establecido en el HTML
// }