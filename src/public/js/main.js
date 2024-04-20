const testData = ["Person", "Event", "Person", "Event",
                  "Event", "Person", "Event", "Person",
                  "Person", "Person", "Event", "Event",]

window.onload = function() {
    for(let item in testData) {
        addCell(testData[item])
    }
}

function addCell(content) {
    let grid = document.getElementById("grid")
    let cell = makeElem("div", "cell", "", grid)
    let box = makeElem("div", "box", "", cell)
    let cont = makeElem("p", "", content, box)
}

function makeElem(type, classType, inner, parent) {
    let item = document.createElement(type)
    item.className = classType
    item.innerHTML = inner
    parent.appendChild(item)
    return item
}