
//const API_URL = "http://localhost:8080/api";
// const API_URL = "https://memrisetts.nw.r.appspot.com/api";
const API_URL = "/api"

const form = document.querySelector("form");
const svrout = document.querySelector(".svr-res");


const loadingElement = document.querySelector(".loader");

const LOGIN_URL = "/login";

loadingElement.style.display = "none";

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
