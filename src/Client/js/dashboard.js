
const API_URL = "http://localhost:8080/api";
//const API_URL = "https://memrisetts.nw.r.appspot.com/api";

const PROFILE_URL = "/profile";
const LOGOUT_URL = "/logout";
const MEMRISE_CREDS_URL = "/memrise/creds";
const MEMRISE_COURSES_URL = "/memrise/courses?";
const MEMRISE_COURSE_URL = "/memrise/getwordlist?";
const MEMRISE_UPLOAD_URL = "/memrise/upload";

const svrout = document.querySelector(".svr-res");
const loadingElement = document.querySelector(".loader");
const logout = document.querySelector("#logoutbutton");
const form_upload_words = document.querySelector("#upload-words");
const memrise_creds_form = document.querySelector("#login-memrise-form");
const memrise_creds_button = document.querySelector("#memrisecreds");
const get_courses_button = document.querySelector("#courselist");
const upload_words_button = document.querySelector("#uploadwords");

const display_apps = {
  memrisecreds: "login-memrise-form",
  svrout: "svr-res",
  uploadwords: "upload-words",
};

// Hides unsused apps
const hide_apps = (event) => {
  for (let app in display_apps) {
    document.getElementById(`${display_apps[app]}`).style.display = "none";
  }

  let visible_app = document.querySelector(`#${display_apps[event.target.id]}`);
  visible_app.style.display = "";
};

// Listens for clicks on dynamic buttons
document.addEventListener("click", async (event) => {
  if (event.target.className === "course-button")
    await lookup_course(event.target.id);
  if (event.target.id === "upload-words-button") await upload_words(event);
});

const upload_words = async (event) => {
  event.preventDefault();

  const formData = new FormData(form_upload_words);
  const wordlist = formData.get("text");
  const course = formData.get("course");

  const payload = {
    course,
    wordlist,
  };
  console.log(payload);

  //form_upload_words.style.display = 'none'
  //form_upload_words.reset()

  const res = await fetch(API_URL + MEMRISE_UPLOAD_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  });
  console.log(res);
  data = await res.json()
  console.log(data)
  svrout.style.display = ''
  svrout.textContent = data['message']
};

// Make the form to enter a word list appear and generate course names
upload_words_button.addEventListener("click", async (event) => {
  hide_apps(event);

  //Fetch word list for the options
  const res = await fetch(API_URL + MEMRISE_COURSES_URL + "renew=false", {
    method: "GET",
    credentials: "include",
  });
  data = await res.json();

  data.forEach((item) => {
    const option = document.createElement("option");
    option.id = item["url"];
    option.innerText = item["name"];
    document.querySelector("#select-course").appendChild(option);
  });


});

// Looks up data on a specific course
async function lookup_course(id) {
  // Need to ask user if they want to renew or do a cache check on server
  const res = await fetch(API_URL + MEMRISE_COURSE_URL + "url=" + id + "&renew=true", {
    method: "GET",
    credentials: "include",
  });
  data = await res.json();
  console.log(data);

  // Generates table to output too
  if (document.getElementById("word-list")) {
    svrout.removeChild(document.getElementById("word-list"));
  }
  const table = document.createElement("table");
  table.id = "word-list";
  svrout.appendChild(table);

  let thread = table.createTHead();
  let row = thread.insertRow();

  for (let key of Object.keys(data[0])) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
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
get_courses_button.addEventListener("click", async () => {
  const res = await fetch(API_URL + MEMRISE_COURSES_URL + "renew=true", {
    method: "GET",
    credentials: "include",
  });
  data = await res.json();

  // Hide old Elements
  memrise_creds_form.style.display = "none";
  svrout.innerHTML = "Which course would you use? <br/><br/>";
  svrout.style.display = "";

  console.log(data);
  // Output data
  data.forEach(function (item) {
    const button = document.createElement("button");
    button.id = item["url"];
    button.className = "course-button";
    button.innerText = item["name"];
    svrout.appendChild(button);
    console.log(item);
  });
  // append each person to our page
  //svrout.textContent = JSON.stringify(data)
});

// Switches to the memrise login
memrise_creds_button.addEventListener("click", (event) => {
  hide_apps(event);

  memrise_creds_form.reset();
});

// Runs on Page load
const on_page_load = () => {
  fetch(API_URL + PROFILE_URL, {
    method: "GET",
    credentials: "include",
  }).then(function (res) {
    if (res.status == 200) {
      res.json().then(function (data) {
        // svrout.textContent = JSON.stringify(data)
        svrout.textContent = "안녕하세요 " + data;
      });
    } else {
      res.json().then(function (data) {
        // svrout.textContent = JSON.stringify(data)
        svrout.textContent = data["message"];
      });
    }
  });
};

// Deletes cookie and returns to login page
logout.addEventListener("click", (event) => {
  fetch(API_URL + LOGOUT_URL, {
    method: "POST",
    credentials: "include",
  }).then(function (res) {
    document.location.href = "/";
    res.json();
  });
});

//Adds memrise creds to database
memrise_creds_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(memrise_creds_form);
  const name = formData.get("username");
  const password = formData.get("password");

  const creds = {
    name,
    password,
  };

  memrise_creds_form.style.display = "none";
  memrise_creds_form.reset();
  svrout.style.display = "";

  fetch(API_URL + MEMRISE_CREDS_URL, {
    method: "POST",
    body: JSON.stringify(creds),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  }).then(function (res) {
    console.log(res.status);
    if (res.status == 200) {
      res.json().then(function (data) {
        // svrout.textContent = JSON.stringify(data)
        svrout.textContent = data["message"];
      });
    } else {
      res.json().then(function (data) {
        //svrout.textContent = JSON.stringify(data)
        svrout.textContent = data["message"];
      });
    }
  });
});

on_page_load();
