
const test = [
    {img: "", title: "Person 1", info: "good", alt: "test here"},
    {img: "", title: "Person 2", info: "shit", alt: "test here"},
    {img: "", title: "Event 1", info: "bad", alt: "test here"},
    {img: "", title: "Event 2", info: "great", alt: "test here"},
    {img: "", title: "Person 3", info: "ahhhh", alt: "test here"},
    {img: "", title: "Event 3", info: "kiss kiss", alt: "test here"},
    {img: "", title: "Person 4", info: "mwah", alt: "test here"},
    {img: "", title: "Event 4", info: "sup", alt: "test here"},
    {img: "", title: "Event 5", info: "dying", alt: "test here"},
    {img: "", title: "Person 5", info: "bro", alt: "test here"},
    {img: "", title: "Person 6", info: "good shit", alt: "test here"},
    {img: "", title: "Event 6", info: "bruh", alt: "test here"}
]

let selected1 = null
let selected2 = null

let defaultColor = "azure"
let selectedColor = "rgb(176, 224, 193)"

let totalTime = 0
let minute = 0
let second = 0
let timer = true

window.onload = function() {
    for(let i = 0; i < test.length ;i++) {
        addCell(test[i])
    }
    setInterval(stopWatch, 1000); 
}

function addCell(content) {
    let grid = document.getElementById("grid")
    let cell = makeElem("div", "cell", "", grid)
    cell.id = content.title
    cell.addEventListener("click", select)
    cell.addEventListener("mouseenter", showInfo)
    let box = makeElem("div", "box", "", cell)
    let cont = makeElem("p", "", content.title, box)
    
}

function makeElem(type, classType, inner, parent) {
    let item = document.createElement(type)
    item.className = classType
    item.innerHTML = inner
    parent.appendChild(item)
    return item
}

function select(event) {
    let elem = this.childNodes[0]
    let id = this.id
    if(id != selected1 && id != selected2) {
        if (selected2 != null) {
            let oldSelected = document.getElementById(selected1).childNodes[0]
            oldSelected.style.backgroundColor = defaultColor 
            selected1 = selected2
            selected2 = id         
        } else if (selected1 != null){
            selected2 = id
        } else {
            selected1 = id
        }
        elem.style.backgroundColor = selectedColor
    }
}

function showInfo(event) {
    let id = this.id
    let infoSection = document.getElementById("info")
    let info = test.find((element) => element.title === id).info //Change this later based on server-side setup
    infoSection.innerHTML = info
}

function stopWatch() { 
    totalTime++
    second++
    if (second == 60) { 
        minute++
        second = 0
    } 
    let minString = minute; 
    let secString = second; 

    if (minute < 10) { 
        minString = "0" + minString
    } 

    if (second < 10) { 
        secString = "0" + secString
    } 

    document.getElementById('min').innerHTML = minString
    document.getElementById('sec').innerHTML = secString
}