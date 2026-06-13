console.log("pago.js cargado");

// abrir modal al presionar "Finalizar compra"
document.getElementById("btn-finalizar").addEventListener("click", function () {
    document.getElementById("modal-pago").style.display = "flex";
});

// procesar formulario y abrir WhatsApp
document.getElementById("form-pago").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const observaciones = document.getElementById("observaciones").value;

    const formaPago = document.querySelector('input[name="pago"]:checked').value;

    const tipoEntrega = document.querySelector('input[name="entrega"]:checked').value;

    // obtener carrito guardado
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // detectar ruta
    const dentroDePages = window.location.href.includes("pages/");
    const basePath = dentroDePages ? "../" : "";

    try {

        // cargar productos.json
        const response = await fetch(basePath + "assets/productos.json");
        const productos = await response.json();

        let productosTexto = "";
        let total = 0;

        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);

            if (!producto) return;

            let subtotal = 0;

            if (producto.categoria === "Empanadas") {
                const cantidad = item.cantidad;

                const docenas = Math.floor(cantidad / 12);
                const resto = cantidad % 12;

                subtotal = docenas * 9000;
                if (resto === 6) {
                    subtotal += 5000;
                }

            } else {
                let precioUnitario = producto.precio;

                if (item.extraJQ) {
                    precioUnitario += 500;
                }

                subtotal = precioUnitario * item.cantidad;
            }

            total += subtotal;

            let nombreProducto = producto.titulo;
            if (item.extraJQ) {
                nombreProducto += " + Jamón y Queso";
            }

            productosTexto +=
                `• ${nombreProducto} x${item.cantidad} - $${subtotal.toLocaleString("es-AR")}\n`;
        });

        // costo de entrega
        const costoDelivery = tipoEntrega === "Delivery" ? 500 : 0;
        total += costoDelivery;


        // 🔥 NÚMERO DE PEDIDO PROFESIONAL ALEATORIO

        const numeroPedido = "PED-" + Math.floor(1000 + Math.random() * 9000);

        // reemplazar por el número real de la rotisería
        const numeroRotiseria = "5493518112819";

        const mensaje =
        `*NUEVO PEDIDO - ROTISERÍA LA COLONIA*

        *REFERENCIA:* ${numeroPedido}

        *Cliente:* ${nombre}
        *Teléfono:* ${telefono}
        *Dirección:* ${direccion}

        *PRODUCTOS:*
        ${productosTexto}

        *Total:* $${total.toLocaleString("es-AR")}

        *Forma de pago:* ${formaPago}

        *Observaciones:*
        ${observaciones || "Sin observaciones"}`;

        const url = `https://wa.me/${numeroRotiseria}?text=${encodeURIComponent(mensaje)}`;

        // abrir WhatsApp
        window.open(url, "_blank");

        // vaciar carrito
        localStorage.removeItem("carrito");

        // cerrar modal
        cerrarModal();

        // redirigir a gracias.html
        setTimeout(() => {
            window.location.href = "gracias.html";
        }, 500);

    } catch (error) {
        console.error("Error al generar el pedido:", error);
        alert("Ocurrió un error al generar el pedido.");
    }
});
// mostrar u ocultar dirección según tipo de entrega
const radiosEntrega = document.querySelectorAll('input[name="entrega"]');
const campoDireccion = document.getElementById("campo-direccion");
const direccionInput = document.getElementById("direccion");

radiosEntrega.forEach(radio => {
    radio.addEventListener("change", function () {

        if (this.value === "Delivery") {
            campoDireccion.style.display = "block";
            direccionInput.required = true;
        } else {
            campoDireccion.style.display = "none";
            direccionInput.required = false;
            direccionInput.value = "";
        }

    });
});

// función para cerrar modal
function cerrarModal() {
    document.getElementById("modal-pago").style.display = "none";
}