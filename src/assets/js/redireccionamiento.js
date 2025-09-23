const logoLink = document.getElementById('logolink'); 

if (logoLink) {
    const token = localStorage.getItem('token');

    if (token) {
        logoLink.href = '/src/tienda/tienda.html'; 
    } else {
        logoLink.href = '/index.html';
    }
}

