window.onload = async function(){
  if (document.cookie == ""){
    const response = await fetch("/userdata");
    const data = await response.json();
    const userInfo = data[data.length - 1];
    console.log("Current user: " + userInfo.username);
    document.cookie = `user=${userInfo.username}`;
    
  }

  let cookie = document.cookie.split(';').reduce((cookieObject, cookieString) => {
    let splitCookie = cookieString.split('=')
    try {
      cookieObject[splitCookie[0].trim()] = decodeURIComponent(splitCookie[1])
    } catch (error) {
      cookieObject[splitCookie[0].trim()] = splitCookie[1]
    }
    return cookieObject
  }, [])
  const user = cookie.user;
  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.innerText = `Welcome Back, ${user}!`;
}