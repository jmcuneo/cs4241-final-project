window.onload = function() {
    const signUpBtn = document.getElementById("signUp")
    signUpBtn.onclick = signUp
    const signInBtn = document.getElementById("signIn")
    signInBtn.onclick = signIn
    const githubBtn = document.getElementById("githubSign")
    githubBtn.onclick = github
    const guestLogin = document.getElementById("guestLogin")
    guestLogin.onclick = guest
    if(document.cookie){
      document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
      window.location = "/"
      return false
    }
}

async function signUp() {
    const user = document.querySelector("#signUpUser"),
          email = document.querySelector("#signUpEmail"),
          pass = document.querySelector("#signUpPass")
    let body = {username: user.value, email: email.value, password: pass.value}
    body = JSON.stringify(body);
    const response = await fetch( "/add", {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
        body
    })
    console.log(await response);
}

async function signIn(event) {
    event.preventDefault()
    let username = null
    let email = null    
    const userEmail = document.querySelector("#signInName"),
    pass = document.querySelector("#signInPass")
    let parsedName = userEmail.value.match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    
    if(parsedName != null) {
        email = parsedName
    } else {
        username = userEmail.value
    }
    
    let body = {username: username, email: email, password: pass.value}
    
    body = JSON.stringify(body);
    const response = await fetch( "/login/auth", {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
        body
    }).then(response => response.json())
    .then(response =>{
        if(response !== "bad login"){
            document.cookie = `token=${response}`;
            window.location = "/play-game"
            return false;
        }
        else console.log("bad login");
    })
}

function github() {
    try {
        window.location = "/auth/github";
        return false;
    } catch (error) {
        console.error("Error redirecting to GitHub authentication:", error);
    }   
}

function guest() {
    window.location = "/play-game"
    return false
}
