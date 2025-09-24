const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", (event)=>{
    event.preventDefault()
    
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    if(email==="cliente@gmail.com" && password==="Clientes1"){
        const payload = {
            email,
            rol: "usuario",
            exp: Date.now() + 10 * 60 * 1000
        }
        
        const token = btoa( JSON.stringify(payload) )
        localStorage.setItem("token",token)
        window.location.href = "tienda.html"
    }

    if(email==="admin@gmail.com" && password==="Administrador1"){
        const payload = {
            email,
            rol: "admin",
            exp: Date.now() + 10 * 60 * 1000
        }
        
        const token = btoa( JSON.stringify(payload) )
        localStorage.setItem("token",token)
        window.location.href = "../admin/admin.html"//Aqui se pone la ruta de la pagina de inicio de admin
    }
})