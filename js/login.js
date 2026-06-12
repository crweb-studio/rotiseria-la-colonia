// registrar usuario

function registrarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;

    if (!email || !password) {
        alert("Debe completar email y contraseña");
        return;
    }

    // guardamos los datos del usuario en localStorage (esto está bien)
    localStorage.setItem("usuario", JSON.stringify({ nombre, apellido, email, password, fechaNacimiento }));

    alert("Registro exitoso. Ahora puedes iniciar sesión.");

    // volvemos al login
    window.location.href = "../login.html";
}

// LOGIN (con sessionStorage)
function checkLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    // si ya está logueado va directo al index (sessionStorage)
    const logged = sessionStorage.getItem("usuarioLogueado");
    if (logged === "true") {
        window.location.href = "index.html";
        return;
    }

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const emailIngresado = document.getElementById("usuario").value;
        const passwordIngresada = document.getElementById("clave").value;

        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (usuario && usuario.email === emailIngresado && usuario.password === passwordIngresada) {

            sessionStorage.setItem("usuarioLogueado", "true");

            window.location.href = "index.html";
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    });
}

// cerrar sesión
function logoutUser() {
    sessionStorage.removeItem("usuarioLogueado");

    const dentroDePages = window.location.href.includes("pages/");
    const loginPath = dentroDePages ? "../login.html" : "login.html";

    window.location.href = loginPath;
    
}