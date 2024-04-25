const login = function (event) {
    event.preventDefault();
    window.location.href = "/auth/github/login";
  };
  
  window.onload = function () {
    const loginButton = document.querySelector(".login_button");
    loginButton.addEventListener('click', login);
  };