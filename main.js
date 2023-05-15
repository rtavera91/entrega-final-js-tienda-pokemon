// Array para almacenar los datos de los pokémon y el carrito de compras
let pokemonData = [];
let carrito = [];

// Hacemos el enlace entre el DOM y el archivo JS
const contenedorPokemon = document.getElementById("contenedor-pokemon");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const precioTotal = document.getElementById("precioTotal");
const vaciarCarrito = document.getElementById("vaciarCarrito");

// Obtenemos los datos de la API para guardarlos en el array pokemonData
const pokeAPI = 'https://pokeapi.co/api/v2/pokemon/';

fetch(pokeAPI)
  .then(response => response.json())
  .then(data => {
    pokemonData = data.results.map(pokemon => ({
      nombre: pokemon.name,
      id: null,
      atributos: null,
      imagen: null,
      precio: Math.floor(Math.random() * 1000)
    }));

    // Tenemos que buscar el ID, los atributos y la imagen de los pokémon en otra API
    const promises = pokemonData.map((pokemon, i) => {
      return fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
        .then(response => response.json())
        .then(data => {
          pokemon.id = data.id;
          pokemon.atributos = data.types.map(type => type.type.name).join(', ');
          pokemon.imagen = data.sprites.other['dream_world'].front_default;
        });
    });

    // Esperamos a que se resuelvan todas las promesas
    Promise.all(promises).then(() => {
      renderizarPokemon();
      cargarCarrito();
    });
  })
  .catch(error => {
    console.log('Error: no podemos mostrar los pokémon en este momento');
  });

// Función para renderizar los pokémon en el DOM
const renderizarPokemon = () => {
  contenedorPokemon.innerHTML = '';
  pokemonData.forEach(pokemon => {
    const tarjetaPokemon = document.createElement('div');
    tarjetaPokemon.classList.add('col-xl-2', 'col-lg-4', 'col-md-6', 'col-xs-12', 'mb-4');
    tarjetaPokemon.innerHTML = `
      <div class="card rounded-3 border shadow-lg tarjeta" style="width: 20rem;">
        <img src="${pokemon.imagen}" class="card-img-top img-pokemon" alt="...">
        <div class="card-body">
          <h5 class="card-title">${pokemon.nombre}</h5>
          <p class="card-text">ID: ${pokemon.id}</p>
          <p class="card-text">Atributos: ${pokemon.atributos}</p>
          <p class="card-text">Precio: $ ${pokemon.precio}</p>
          <button class="btn btn-primary agregarCarrito">Añadir al carrito</button>
        </div>
      </div>
    `;
    // Ligamos los divs creados al div padre
    contenedorPokemon.appendChild(tarjetaPokemon);

    // Agregamos el evento click al botón de añadir al carrito
    const añadirCarrito = tarjetaPokemon.querySelector('.agregarCarrito');
    añadirCarrito.addEventListener('click', () => {
      agregarAlCarrito(pokemon);
    });
  });
};

// Función para agregar un pokémon al carrito de compras
function agregarAlCarrito(pokemon) {
    // Comprobamos si el pokémon ya está en el carrito
    const existe = carrito.some(item => item.id === pokemon.id);
  
    if (existe) {
      // Si el pokémon ya está en el carrito, aumentamos su cantidad
      carrito.forEach(item => {
        if (item.id === pokemon.id) {
          item.cantidad++;
        }
      });
    } else {
      // Si el pokémon no está en el carrito, lo agregamos
      carrito.push({ ...pokemon, cantidad: 1 });
    }
  
    guardarCarrito();
    renderizarCarrito();
    calcularPrecioTotal();
  }

    // Función para renderizar el carrito de compras en el DOM
    const renderizarCarrito = () => {
        contenedorCarrito.innerHTML = '';
        carrito.forEach(pokemon => {
            const carritoPokemon = document.createElement('div');
            carritoPokemon.classList.add('col-xl-2', 'col-lg-4', 'col-md-6', 'col-xs-12','mb-4');
            carritoPokemon.innerHTML = `
            <div class="card rounded-3 border shadow-lg" style="width: 20rem;">
                        <img src="${pokemon.imagen}" class="card-img-top img-pokemon" alt="...">
                        <div class="card-body">
                        <h5 class="card-title">${pokemon.nombre}</h5>
                          <p class="card-text">Cantidad: ${pokemon.cantidad}</p>
                          <p class="card-text">Monto Total: $ ${pokemon.precio * pokemon.cantidad}</p>
                          <button id="eliminarCarrito" class="btn btn-danger">Eliminar</button>
                        </div>
                    </div>
                        `;
            contenedorCarrito.appendChild(carritoPokemon);
    
            //Agregamos el evento click al botón de eliminar del carrito
            const eliminarCarrito = carritoPokemon.querySelector('#eliminarCarrito');
            eliminarCarrito.addEventListener('click', () => {
                eliminarDelCarrito(pokemon);
                cargarCarrito();
            });
        });
    };
  
  // Función para eliminar un pokémon del carrito de compras
  function eliminarDelCarrito(pokemon) {
    // Comprobamos si el pokémon tiene más de una unidad en el carrito
    const index = carrito.findIndex(item => item.id === pokemon.id);
  
    if (index !== -1) {
      if (carrito[index].cantidad > 1) {
        // Si tiene más de una unidad, disminuimos su cantidad
        carrito[index].cantidad--;
      } else {
        // Si tiene una unidad, lo eliminamos del carrito
        carrito.splice(index, 1);
      }
    }
  
    guardarCarrito();
    renderizarCarrito();
    calcularPrecioTotal();
  }
  
  // Función para calcular el precio total de los pokémon en el carrito
  function calcularPrecioTotal() {
    let total = 0;
  
    carrito.forEach(item => {
      total += item.precio * item.cantidad;
    });
  
    precioTotal.textContent = `Tu total es de $ ${total}`;
  }
  
  // Función para vaciar el carrito de compras
  function vaciarElCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    calcularPrecioTotal();
  }
  
  // Función para guardar el carrito de compras en localStorage
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
  // Función para cargar el carrito de compras desde localStorage
  function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
  
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
    } else {
      carrito = [];
    }
  }
  
  // Agregamos el evento click al botón de vaciar el carrito
  vaciarCarrito.addEventListener('click', vaciarElCarrito);
  
  // Cargamos el carrito de compras al cargar la página
  cargarCarrito();
  renderizarCarrito();
  calcularPrecioTotal();


  
