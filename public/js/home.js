document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/userdata");
    const data = await response.json();
    console.log(data[0].name);
    const user = data[0].name;
  
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.innerText = `Welcome Back, ${user}!`;
  });
  