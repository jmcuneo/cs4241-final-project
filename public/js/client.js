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

const getPersonalCalendar = function() {
    fetch("/user-events", {
        method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        const list = document.querySelector("#events");
        list.innerHTML = "";
        data.forEach((e) => list.innerHTML += `<li>${JSON.stringify(e)}</li>`);
    });
};