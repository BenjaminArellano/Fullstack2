const token = localStorage.getItem("token");

if (!token) {
    alert("Debe iniciar sesión como administrador.");
    window.location.href = "../tienda/Login.html";
} else {
    const payload = JSON.parse(atob(token));
    if (Date.now() > payload.exp) {
        localStorage.removeItem("token");
        alert("Tu sesión ha expirado.");
        window.location.href = "../tienda/Login.html";
    }
}

const btnLogout = document.getElementById("btnLogout");
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../../../index.html";
});
