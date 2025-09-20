const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", (event)=>{
    event.preventDefault()
    
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    if(email==="ejem@gmail.com" && password==="1"){
        const payload = {
            email,
            rol: "usuario",
            exp: Date.now() + (60000/2)
        }
        //Ver el tiempo del TOKEN, no olvidar!
        //Ahora crearemos el token con su información(payload)
        const token = btoa( JSON.stringify(payload) )
        localStorage.setItem("token",token)
        window.location.href = "producto.html"
    }

    if(email==="admin@gmail.com" && password==="2"){
        const payload = {
            email,
            rol: "usuario",
            exp: Date.now() + (60000/2)
        }
        //Ver el tiempo del TOKEN, no olvidar!
        //Ahora crearemos el token con su información(payload)
        const token = btoa( JSON.stringify(payload) )
        localStorage.setItem("token",token)
        window.location.href = "##########################################"//Aqui se pone la ruta de la pagina de inicio de admin
    }
})