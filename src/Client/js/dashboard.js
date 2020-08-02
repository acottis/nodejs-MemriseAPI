const API_URL = 'http://localhost:8080/api'
const PROFILE_URL = '/profile'
const LOGOUT_URL = '/logout'
const MEMRISE_CREDS_URL = '/memrise/creds'

const svrout = document.querySelector('.svr-res')
const loadingElement = document.querySelector('.loader')
const logout = document.querySelector('#logoutbutton')
const memrise_creds_form = document.querySelector('#login-memrise-form')
const memrise_creds_button = document.querySelector('#memrisecreds')



// Switches to the memrise login
memrise_creds_button.addEventListener('click', () => {
    svrout.style.display = 'none'
    if (memrise_creds_form.style.display === 'none') {
        memrise_creds_form.style.display = ''
    }
    else {
        memrise_creds_form.style.display = 'none'
        memrise_creds_form.reset()
    }
})

// Runs on Page load
function on_page_load() {

    fetch(API_URL + PROFILE_URL, {
        method: 'GET',
        credentials: 'include',
    }).then(function (res) {
        if (res.status == 200) {
            res.json().then(function (data) {
                svrout.textContent = JSON.stringify(data)
                //  svrout.textContent = data['message']
            })
        }
        else {
            res.json().then(function (data) {
                // svrout.textContent = JSON.stringify(data)
                svrout.textContent = data['message']
            })
        }
        loadingElement.style.display = 'none'
    })

}


logout.addEventListener('click', (event) => {
    fetch(API_URL + LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
    }).then(function (res) {
        document.location.href = '/'
        res.json()
    })
})

memrise_creds_form.addEventListener('submit', (event) => {
    loadingElement.style.display = ''
    event.preventDefault()
    const formData = new FormData(memrise_creds_form)
    const name = formData.get("username")
    const password = formData.get("password")

    const creds = {
        name,
        password
    }

    memrise_creds_form.style.display = 'none'
    memrise_creds_form.reset()

    fetch(API_URL + MEMRISE_CREDS_URL, {
        method: 'POST',
        body: JSON.stringify(creds),
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        }
    }).then(function (res) {
        console.log(res.status)
        if (res.status == 200) {
            res.json().then(function (data) {
               // svrout.textContent = JSON.stringify(data)
                svrout.textContent = data['message']
            })
        }
        else {
            res.json().then(function (data) {
                //svrout.textContent = JSON.stringify(data)
                svrout.textContent = data['message']
            })
            //form.style.display = ''
        }
        loadingElement.style.display = 'none'
        svrout.style.display = ''
    })
})


on_page_load()