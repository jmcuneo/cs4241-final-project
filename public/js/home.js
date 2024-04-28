document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/userdata");
    const data = await response.json();
    const user = data[0].name;
    const pfp = data[0].pfp;
  
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.innerText = `Welcome Back, ${user}!`;

  });
  