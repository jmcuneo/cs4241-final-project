// document.getElementById("login").onclick = async () => {
//   let body = JSON.stringify({user: "test", pass: "moretest"})
//   const login = await fetch("/login", {method: "POST", body:body});
//   // let resp = await login.text();
// }

document.getElementById("set").onclick = async () => {
  let body = JSON.stringify({goatbucks: 11111})
  console.log(body)
  const gb = await fetch("/set_goatbucks", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
    body:body});
  console.log(gb)
}