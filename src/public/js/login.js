window.onload = function() {
    const signUpBtn = document.getElementById("signUp")
    signUpBtn.onclick = signUp
    const signInBtn = document.getElementById("signIn")
    signInBtn.onclick = signIn
    const githubBtn = document.getElementById("githubSign")
    githubBtn.onclick = github
}

async function signUp() {
    const user = document.querySelector("#signUpUser"),
          email = document.querySelector("#signUpEmail"),
          pass = document.querySelector("#signUpPass")
    let body = {username: user.value, email: email.value, password: pass.value}
    const response = await fetch( "/add", {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
        body
    })
}

async function signIn() {
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
    const response = await fetch( "/login", {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
        body
    })
}

async function github() {
    const response = await fetch( "/auth/github", {
        method:'POST',
        headers: { 'Content-Type': 'application/json'}
    })   
}