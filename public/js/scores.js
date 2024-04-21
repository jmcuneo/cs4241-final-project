// FRONT-END (CLIENT) JAVASCRIPT HERE

/**
 * Function to get books for the user
 * @returns a JSON string that contains all the books a certain user has read
 */
var getScores = async function () {

  // Makes the get request to get the array of people from the server
  var response = await fetch ( "/getScores", {
    method:"GET"
  })

  // Parses the returned data into a readable format
  var text = await response.text();
  let scores = JSON.parse(text);

  // Returns to the function caller
  return scores
} 

/**
 * Adds a book to the database from a post request.
 * @param {*} event 
 *
const submitAdd = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  // Takes the first and last name of the person as well as their age
  const input = document.querySelectorAll( "#title, #author, #pagenum, #dateread" ),
        genreSelect = getGenre('genre')
        json = { bookTitle: input[0].value, author: input[1].value, genre: genreSelect, pageCount: input[2].value, dateCompleted: input[3].value },
        body = JSON.stringify( json );

  // Makes the post request with the body data
  const response = await fetch( "/submitAdd", {
    method:"POST",
    body 
  })*

  // Resets the forms to clear the values and then refreshes the table data to reflect changes
  const text = await response.text();
  document.getElementById("formOne").reset();
  addDataToTable();

}; */




// Adds the onclick functionality to all buttons on the site and the respective function
// calls once the buttons are clicked as well as builds the table displaying the people data

window.onload = function() {
    addDataToTable();
};

// Function that retrieves the people data from the server and uses for loops
// to build an HTML table's rows out with said data

async function addDataToTable(table){
  table = document.querySelector("#scoresTable");
  table.innerHTML = "";

  let scores = await getScores();
  let columnNames = ["User","Score"];
  let tableHead = table.createTHead();
  let row = tableHead.insertRow();

  // For each score in the list, it builds out a row with that entry
  for (let score of scores){
    delete score['_id'];
    let row = table.insertRow();
    row.setAttribute("scope", "row")

    for (const property in score) {
      let data = row.insertCell();
      let content = document.createTextNode(score[property]);
      data.appendChild(content);
    }
  }

  if(scores.length<10){
    for(let count = 0; count<10-scores.length; count++){
        let row = table.insertRow();
        for (const property in columnNames) {
            let data = row.insertCell();
            let content = document.createTextNode("-");
            data.appendChild(content);
          }
    }
  }

  // Adds the table headers (column names)
  for (let name of columnNames){
    let th = document.createElement("th");
    let cName = document.createTextNode(name);
    th.setAttribute("scope","col")
    th.appendChild(cName);
    row.appendChild(th);
  }
};
