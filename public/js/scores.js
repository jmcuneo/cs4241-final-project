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
  let columnNames = ["","User","Score"];
  let classNames = ["","username","score"]
  let width = ["width:25px", "width:40%", "width:40%"]
  let tableHead = table.createTHead();
  let row = tableHead.insertRow();
  let count = 0;

  // For each score in the list, it builds out a row with that entry
  for (let score of scores){
    delete score['_id'];
    let row = table.insertRow();
    row.setAttribute("scope", "row")
    if(count===0){
      let medal = row.insertCell()
      let img = document.createElement("img")
      img.setAttribute("src", "/images/goldMedal.png")
      img.setAttribute("style","width:20px;height:20px;")
      medal.appendChild(img)
    } else if (count===1){
      let medal = row.insertCell()
      let img = document.createElement("img")
      img.setAttribute("src", "/images/silverMedal.png")
      img.setAttribute("style","width:20px;height:20px;")
      medal.appendChild(img)
    } else if (count ===2) {
      let medal = row.insertCell()
      let img = document.createElement("img")
      img.setAttribute("src", "/images/bronzeMedal.png")
      img.setAttribute("style","width:20px;height:20px;")
      medal.appendChild(img)
    }

    for (const property in score) {
      let data = row.insertCell();
      data.setAttribute("class", property);
      let content = document.createTextNode(score[property]);
      data.appendChild(content);
    }
    count++;
  }
  

  if(scores.length<10){
    for(let count = 0; count<10-scores.length; count++){
        let row = table.insertRow();
        row.setAttribute("scope", "row")
        for (const property in columnNames) {
            let data = row.insertCell();
            data.setAttribute("class",classNames[property]);
            if(property==0){
              var content = document.createTextNode((10-(10-count))+scores.length+1);
            } else {
              var content = document.createTextNode("-");
            }
            
            data.appendChild(content);
          }
    }
  }

  // Adds the table headers (column names)
  for (let count = 0; count<3; count++){
    let th = document.createElement("th");
    let cName = document.createTextNode(columnNames[count]);
    th.setAttribute("scope","col")
    th.appendChild(cName);
    th.setAttribute("class", classNames[count])
    th.setAttribute("style", width[count])
    row.appendChild(th);
  }
};
