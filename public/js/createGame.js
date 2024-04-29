const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    
    var health = document.querySelector( "#total-health" ),
          players = document.querySelector( "#numb-players" ),
          json = { players: players.value, health: parseInt(health.value)},
          body = JSON.stringify( json )

    // console.log(body)
  
    const response = await fetch( "/createGame", {
      method:"POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body 
    })

    if(response.status = 200) {
      window.location.href = '/game.html';
    } else {
      health.value = '';
      players.value = '';
      window.alert(data.msg);
    }
  }

  const checkIfGameMade = async function() {
    const response = await fetch( "/isGameCreated", {
      method:"GET",
      headers: {
        "Content-Type": 'application/json'
      },
    })
    const data = await response.json()
    if(data.gameStatus){
      window.location.href = '/game.html';
    }
  }

window.onload = function () {
    const submitBtn = document.querySelector("#submit");
    
    submitBtn.onclick = submit;

    checkIfGameMade()
}