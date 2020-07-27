const API_URL = 'http://localhost:8080/api'
const PROFILE_URL = '/profile'
const LOGOUT_URL = '/logout'

const svrout = document.querySelector('.svr-res')
const loadingElement = document.querySelector('.loading')
const logout = document.querySelector('#logoutbutton')

loadingElement.style.display = ''

fetch(API_URL + PROFILE_URL, {
    method: 'GET',
    credentials: 'include',
}).then(function (res) {
    console.log(res.status)
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


logout.addEventListener('click', (event) => {
    fetch(API_URL + LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
    }).then(function (res) {       
        document.location.href = '/'
        res.json()
})
})