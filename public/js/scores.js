// FRONT-END (CLIENT) JAVASCRIPT HERE

/**
 * Function to get scores for the user
 * @returns a JSON string that contains all the scores a certain user has achieved
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

var getPersonal = async function () {
  var response = await fetch ( "/getPersonal", {
    method:"GET"
  })

  // Parses the returned data into a readable format
  var text = await response.text();
  let score = JSON.parse(text);

  // Returns to the function caller
  return score
}

/**
 * Adds a score to the database from a post request.
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
  let tableBody = table.createTBody();
  let row = tableBody.insertRow();
  let count = 0;

  // For each score in the list, it builds out a row with that entry
  for (let score of scores){
    delete score['_id'];
    let row = tableBody.insertRow();
    row.setAttribute("scope", "row")
    if(count===0){
      let medal = row.insertCell()
      let img = document.createElement("img")
      img.setAttribute("src", "/images/goldMedal.png")
      img.setAttribute("style","width:20px;aspect-ratio:0.84")
      img.setAttribute("alt", "First Place Medal")
      medal.appendChild(img)
    } else if (count===1){
      let medal = row.insertCell()
      let img = document.createElement("img")
      img.setAttribute("src", "/images/silverMedal.png")
      img.setAttribute("style","width:20px;height:20px;")
      img.setAttribute("alt", "Second Place Medal")
      medal.appendChild(img)
    } else if (count ===2) {
      let medal = row.insertCell()
      let img = document.createElement("img")
      img.setAttribute("src", "/images/bronzeMedal.png")
      img.setAttribute("style","width:20px;height:20px;")
      img.setAttribute("alt", "Third Place Medal")
      medal.appendChild(img)
    } else {
      let position = row.insertCell()
      let content = document.createTextNode(count+1);
      position.appendChild(content)
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
        let row = tableBody.insertRow();
        row.setAttribute("scope", "row")
        for (const property in columnNames) {
            let data = row.insertCell();
            data.setAttribute("class", classNames[property]);
            if(property==0){
              var content = document.createTextNode((10-(10-count))+scores.length+1);
            } else {
              var content = document.createTextNode("-");
            }
            
            data.appendChild(content);
          }
    }
  }

  let blankRow = tableBody.insertRow();
  blankRow.setAttribute("scope", "row");
  blankRow.insertCell();
  blankRow.insertCell();
  blankRow.insertCell();

  let personalRecord = await getPersonal();
  let personalRow = tableBody.insertRow();

  if(personalRecord.ranking==undefined){
    for (const property in classNames) {
      let data = personalRow.insertCell();
      data.setAttribute("class", classNames[property]);
      let content = document.createTextNode("-");
      data.appendChild(content);
    }
  } else {
    for (const property in personalRecord) {
      let data = personalRow.insertCell();
      data.setAttribute("class", property);
      let content = document.createTextNode(personalRecord[property]);
      data.appendChild(content);
    }
  }

  // Adds the table headers (column names)
  let rowHead  = tableHead.insertRow();
  for (let count = 0; count<3; count++){
    let th = document.createElement("th");
    let cName = document.createTextNode(columnNames[count]);
    th.setAttribute("scope","col")
    th.appendChild(cName);
    th.setAttribute("class", classNames[count])
    th.setAttribute("style", width[count])
    rowHead.appendChild(th);
  }
};
