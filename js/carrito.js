// revisar si estamos dentro de /pages/
const dentroDePages = window.location.href.includes("pages/");
const basePath = dentroDePages ? "../" : "";

// cargo el carrito guardado, si no existe arranca vacio
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// traer productos desde JSON
let productos = [];
fetch(basePath + "assets/productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarCarrito();
  })
  .catch(err => console.error("Error al cargar productos:", err));

// funcion para mostrar carrito
function mostrarCarrito() {
    const cont = document.getElementById("carrito-contenedor");
    cont.innerHTML = "";

    const btnFinalizar = document.getElementById("btn-finalizar");

    if (carrito.length === 0) {
        cont.innerHTML = `<p style="text-align:center; font-size:18px; margin:20px;">No hay productos en el carrito.</p>`;
        document.getElementById("total-carrito").innerText = "";
        btnFinalizar.style.display = "none"; // ocultar boton si carrito vacio
        return;
    }

    // crear encabezado de la tabla del carrito
    const header = document.createElement("div");
    header.classList.add("carrito-header");
    header.innerHTML = `
        <div>Producto</div>
        <div>Precio</div>
        <div>Cantidad</div>
        <div>Subtotal</div>
        <div>Eliminar</div>
    `;
    cont.appendChild(header);

    let total = 0;

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);

        if (!producto) return;

        // Precio actualizado deempanadas (antes la media valia 4500 y la docena 8000)
        let subtotal = 0;

        let precioUnitario = producto.precio;

        if (item.extraJQ) {
            precioUnitario += 500;
        }
        
        if (producto.categoria === "Empanadas") {
            const cantidad = item.cantidad;

            const docenas = Math.floor(cantidad / 12);
            const resto = cantidad % 12;

            // docenas completas (12 = 9000)
            subtotal = docenas * 9000;

            // media docena (6 = 5000)
            if (resto === 6) {
                subtotal += 5000;
            }
        
        } else {
            subtotal = precioUnitario * item.cantidad;
        }

        total += subtotal;

        // input de cantidad según categoría
        const inputHTML = producto.categoria === "Empanadas"
            ? `<input type="number" min="6" step="6" value="${item.cantidad}" data-id="${item.id}" class="cantidad-input">`
            : `<input type="number" min="1" step="1" value="${item.cantidad}" data-id="${item.id}" class="cantidad-input">`;

        const div = document.createElement("div");
        div.classList.add("carrito-item");
        
        div.innerHTML = `
            <div class="producto-info">
                <img src="${basePath + producto.imagen}" alt="${producto.titulo}">
                <span>
                    ${producto.titulo}
                    ${item.extraJQ ? " (+ Jamón y Queso)" : ""}
                </span>
            </div>

            <div class="precio">
                <span class="titulo-mobile">Precio:</span>
                $${precioUnitario.toLocaleString("es-AR")}
            </div>

            <div class="cantidad">
                <span class="titulo-mobile">Cantidad:</span>
                ${inputHTML}
            </div>

            <div class="subtotal">
                <span class="titulo-mobile">Subtotal:</span>
                $${subtotal.toLocaleString("es-AR")}
            </div>

            <div>
                <button class="btn-eliminar" data-id="${item.id}">
                    Eliminar
                </button>
            </div>
        `;
        cont.appendChild(div);
    });

    
    document.getElementById("total-carrito").innerText = `Total: $${total.toLocaleString("es-AR")}`;

    agregarListenersCarrito();

    // mostrar el boton finalizar si hay productos
    btnFinalizar.style.display = "inline-block";
}

// agregar los eventos para cambiar cantidad o eliminar productos
function agregarListenersCarrito() {
    document.querySelectorAll(".cantidad-input").forEach(input => {
        input.addEventListener("change", function() {
            const id = parseInt(this.dataset.id);
            let nuevaCant = parseInt(this.value);
            if (isNaN(nuevaCant) || nuevaCant < 1) nuevaCant = 1;

            const producto = productos.find(p => p.id === id);

            if (producto.categoria === "Empanadas") {
                // asegurar múltiplo de 6 solo para empanadas
                nuevaCant = Math.ceil(nuevaCant / 6) * 6;
            }

            cambiarCantidad(id, nuevaCant);
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = parseInt(this.dataset.id);
            eliminarDelCarrito(id);
        });
    });
}

// cambiar cantidad de un producto
function cambiarCantidad(id, nuevaCantidad) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad = nuevaCantidad;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

// eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(i => i.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}