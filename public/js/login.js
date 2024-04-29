const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const errorStr = document.getElementById("feedback")
console.log(urlParams.get("failed"))
if(urlParams.get("failed") === "1") {
  errorStr.innerHTML = "Incorrect password for " + urlParams.get("user") + "."
  document.getElementById("user").value = urlParams.get("user")
}

const login = document.getElementById("login_btn")

async function checkUE() {
  console.log("hello")
  let uname = document.getElementById("user").value
  const req = await fetch(`/user_exists?user=${uname}`, {
    method: "GET"
  })
  let data = await req.text();
  if (+data == 1) {
    login.value = "Login"
  } else {
    login.value = "Create Account"
  }
}