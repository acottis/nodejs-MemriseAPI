const form = document.querySelector("form");
const svrout = document.querySelector(".svr-res");
// const reglogbut = document.getElementById('reglogbut')
// const reglogsub = document.getElementById('reglogsub')

const loadingElement = document.querySelector(".loader");
const API_URL = "http://localhost:8080/api";
// const REGISTER_URL = '/Register'
const LOGIN_URL = "/login";

loadingElement.style.display = "none";

// reglogbut.addEventListener('click', (event) => {

//     console.log("button clicked")

//     if (reglogbut.textContent == "Register") {
//         reglogbut.textContent = "Login"
//         reglogsub.textContent = "Register"
//     }
//     else {
//         reglogbut.textContent = "Register"
//         reglogsub.textContent = "Login"
//     }

// })

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("form was submitted");
  const formData = new FormData(form);
  const name = formData.get("username");
  const password = formData.get("password");

  const creds = {
    name,
    password,
  };

  loadingElement.style.display = "";
  form.style.display = "none";

  // If the response is 200 it redirects you to profile, else it displays relevent error
  fetch(API_URL + LOGIN_URL, {
    method: "POST",
    body: JSON.stringify(creds),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  }).then(function (res) {
    console.log(res.status);
    if (res.status == 200) {
      document.location.href = "/dashboard.html";
    } else {
      res.json().then(function (data) {
        // svrout.textContent = JSON.stringify(data)
        svrout.textContent = data["message"];
      });
      loadingElement.style.display = "none";
      form.style.display = "";
    }
  });
});
