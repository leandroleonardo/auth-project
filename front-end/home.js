const token = localStorage.getItem('token');
const container = document.getElementById('container');
const BASE_URL = 'https://urban-space-pancake-vrrjrrpg67p3w94w-5000.app.github.dev/'

async function home() {

    console.log('\ntoken: ' + token + `\n\n\nPara testes com Postman, utilize a seguinte Base URL:${BASE_URL}home\n\nDentro do Postman, navegue até a seção de autorização e selecione o tipo 'Bearer Token'. Em seguida, adicione o token gerado e faça uma requisição do tipo GET."\n\nObs.: Para obter o token, é necessário fazer o login com o GitHub.\n\n__`)

    try {
        const response = await fetch(`${BASE_URL}home`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            container.innerHTML = `<a id="exit" onclick="exit()">/Logout</a><br><br><h3 style="color:#FFFF;">Hello, ${await response.text()}!</h3>`;
        } else {
            container.innerHTML = `<a href="index.html" >/Fazer Login</a><br><br>${await response.text()}!`;
        }

    } catch (error) {
        console.error(error);
    }
}

function exit() {
    localStorage.setItem("token", "");
    window.location.href = 'index.html'
}

home()