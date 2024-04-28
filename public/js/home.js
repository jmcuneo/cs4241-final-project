document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/userdata");
  const data = await response.json();
  
  const user = data[0].name;
  const pfp = data[0].pfp;

  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.innerText = `Welcome Back, ${user}!`;

});

window.onload = async function(){
  if (document.cookie == ""){
    const response = await fetch("/userdata");
    const data = await response.json();
    const userInfo = data[data.length - 1];
    console.log("Current user: " + userInfo.username);
    document.cookie = `user=${userInfo.username}`;
    
  }
  console.log(document.cookie);
}