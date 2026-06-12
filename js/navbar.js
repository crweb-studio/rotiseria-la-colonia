// categorías visibles para todos
const paginasProtegidas = [
    { titulo: "Empanadas", link: "pages/categoria1.html" },
    { titulo: "Pizzas", link: "pages/categoria2.html" },
    { titulo: "Papas", link: "pages/categoria3.html" },
    { titulo: "Hamburguesas", link: "pages/categoria4.html" },
    { titulo: "Tortillas", link: "pages/categoria5.html" }
];

// función para generar navbar
function generarNavbar() {
    const nav = document.querySelector(".navbar");
    if (!nav) return;

    const dentroDePages = window.location.pathname.includes("/pages/");
    const basePath = dentroDePages ? "../" : "";

    let html = `
        <div class="logo">
            <a href="${basePath}index.html">
                <img src="${basePath}assets/imagenes/logo-roti.png" alt="Logo La Colonia">
                <span>La Colonia</span>
            </a>
        </div>

        <ul class="nav-links">
            <li><a href="${basePath}index.html">Inicio</a></li>
    `;

    // categorías para todos
    paginasProtegidas.forEach(p => {
        html += `<li><a href="${basePath}${p.link}">${p.titulo}</a></li>`;
    });

    // carrito para todos
    html += `
        <li>
            <a href="${basePath}pages/carrito.html" class="carrito-btn">
                🛒 Carrito
            </a>
        </li>
    `;

    html += `
        </ul>
    `;

    nav.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", generarNavbar);