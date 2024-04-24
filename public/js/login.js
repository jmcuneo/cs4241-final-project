const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const errorStr = document.getElementById("feedback")
console.log(urlParams.get("failed"))
if(urlParams.get("failed") === "1") {
  errorStr.innerHTML = "Incorrect password for " + urlParams.get("user") + "."
  document.getElementById("user").value = urlParams.get("user")
}

// document.getElementById("set").onclick = async () => {
//   let body = JSON.stringify({goatbucks: 11111})
//   console.log(body)
//   const gb = await fetch("/set_goatbucks", {
//     method: "POST", 
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body:body});
//   console.log(gb)
// }

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