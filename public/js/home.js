window.onload = async function(){
  if (document.cookie == ""){
    const response = await fetch("/userdata");
    const data = await response.json();
    const userInfo = data[data.length - 1];
    console.log("Current user: " + userInfo.username);
    document.cookie = `${userInfo.username}`;
    
  }


  const user = document.cookie;
  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.innerText = `Welcome Back, ${user}!`;
}