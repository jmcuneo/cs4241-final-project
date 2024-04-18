//profile info 

window.onload = function() {
    const profileInfo = fetch("/user", {
        method: "GET",
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        const username = data.username;
        document.getElementById("user").innerHTML = username;
      });

}

