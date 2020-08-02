const API_URL = 'http://localhost:8080/api'
const PROFILE_URL = '/profile'
const LOGOUT_URL = '/logout'
const MEMRISE_CREDS_URL = '/memrise/creds'
const MEMRISE_COURSES_URL = '/memrise/courses'
const MEMRISE_COURSE_URL = '/memrise/course?'

const svrout = document.querySelector('.svr-res')
const loadingElement = document.querySelector('.loader')
const logout = document.querySelector('#logoutbutton')
const memrise_creds_form = document.querySelector('#login-memrise-form')
const memrise_creds_button = document.querySelector('#memrisecreds')
const get_courses_button = document.querySelector('#courselist')

// Listens for clicks on dynamic buttons
document.addEventListener('click', async (event) => {
    if (event.target.className === 'course-button')
        await lookup_course(event.target.id)

})

// Looks up data on a specific course
async function lookup_course(id) {
    const res = await fetch(API_URL + MEMRISE_COURSE_URL + "url=" + id, {
        method: 'GET',
        credentials: 'include'
    })
    data = await res.json()
    console.log(data)

    // data.forEach(function (item, i) {
    //     const div = document.createElement("div");
    //     div.innerText = 'kr: '+item['kr']+' en: '+item['en']
    //     svrout.appendChild(div)
    // })

    // Generates table to output too

    if (document.getElementById('word-list')) {
        svrout.removeChild(document.getElementById('word-list'));
    }
    const table = document.createElement("table")
    table.id = "word-list"
    svrout.appendChild(table)

    let thread = table.createTHead()
    let row = thread.insertRow()

    for (let key of Object.keys(data[0])) {
        let th = document.createElement("th")
        let text = document.createTextNode(key)
        th.appendChild(text)
        row.appendChild(th)
    }
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

// gets a list of courses and returns buttons
get_courses_button.addEventListener('click', async () => {
    const res = await fetch(API_URL + MEMRISE_COURSES_URL, {
        method: 'GET',
        credentials: 'include'
    })
    data = await res.json()

    // Hide old Elements
    memrise_creds_form.style.display = 'none'
    svrout.innerHTML = "Which course would you use? <br/><br/>"
    svrout.style.display = ''

    console.log(data)
    // Output data
    data.forEach(function (item) {
        const button = document.createElement("button");
        button.id = item['url']
        button.className = "course-button"
        button.innerText = item['name'];
        svrout.appendChild(button)
        console.log(item)
    })
    // append each person to our page
    //svrout.textContent = JSON.stringify(data)


})

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
                // svrout.textContent = JSON.stringify(data)
                svrout.textContent = "안녕하세요 " + data
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

// Deletes cookie and returns to login page
logout.addEventListener('click', (event) => {
    fetch(API_URL + LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
    }).then(function (res) {
        document.location.href = '/'
        res.json()
    })
})

//Adds memrise creds to database
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