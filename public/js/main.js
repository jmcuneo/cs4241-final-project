

let totalMoney = 0
let clickWorth = 1
let passiveIncome = 0
let timer = 0
let upgrades = {
    "1upgrade1": false,
    "1upgrade2": false,
    "1upgrade3": false,
    "2upgrade1": false,
    "2upgrade2": false,
    "2upgrade3": false,
    "3upgrade1": false,
    "3upgrade2": false,
    "3upgrade3": false,
    "4upgrade1": false,
    "4upgrade2": false,
    "4upgrade3": false,
}
let leaderboardData =
    [
        {user: "Steve", highscore: 1500},
        {user: "Dale", highscore: 30000},
        {user: "Alex", highscore: 15},
        {user: "Joe", highscore: 20},
        {user: "Alice", highscore: 500}
    ]
let currUser = "Steve"
let isDone = false

async function updateStuff(){
    try{
        updateDisplay()
        await updateServerTimeAndMoney()
    }
    catch(error){
        console.error("Error updating server: ", error)
    }
}

async function handleMainClick(){
    totalMoney += clickWorth
    updateDisplay()
}

function updateDisplay(){
    document.getElementById("totalMoney").innerText = "$" + totalMoney
    for (const upgrade in upgrades){
        const buttonElement = document.getElementById(upgrade)
        if(upgrades[upgrade]) {
            buttonElement.style.opacity = "0"
            buttonElement.disabled = true
        }
        else{
            buttonElement.style.opacity = "1"
            buttonElement.disabled = false
        }
    }
}

async function updateServerTimeAndMoney(){
    console.log("Updating server with total money: " + totalMoney + "\nand timer: " + timer)

    try {
        await fetch("/save", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                goatbucks: totalMoney,
                time: timer,
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log(json)
        })
    }
    catch(error){
        console.error("Error updating server: ", error)
    }
}

async function updateServerPurchases(){
    console.log("Updating server with total money: " + totalMoney + "\nand timer: " + timer)
    console.log("\nandclickWorth: " + clickWorth + "\nand passiveIncome: " + passiveIncome + "\nand upgrades: " + upgrades)

    try {
        await fetch("/save", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                goatbucks: totalMoney,
                clickWorth: clickWorth,
                passive: passiveIncome,
                time: timer,
                restaurant: upgrades
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log(json)
        })
    }
    catch(error){
        console.error("Error updating server: ", error)
    }
}

async function purchaseClickUpgrade(cost, upgradeValue, upgrade){
    if (totalMoney >= cost){
        totalMoney -= cost
        clickWorth += upgradeValue
        upgrades[upgrade] = true
        updateDisplay()
        await updateServerPurchases()
    }
    else{
        alert("Not enough money to purchase this upgrade!")
    }
}

async function purchasePassiveUpgrade(cost, upgradeValue, upgrade){
    if (totalMoney >= cost){
        document.getElementById("mainButton")
        totalMoney -= cost
        passiveIncome += upgradeValue
        upgrades[upgrade] = true
        updateDisplay()
        await updateServerPurchases()

    }
    else{
        alert("Not enough money to purchase this upgrade!")
    }
}

async function fetchEverything(){
    try{
        const response = await fetch("/load")
        if(!response.ok){
            new Error("Failed to fetch data")
        }
        const data = await response.json()
        totalMoney = data.goatbucks
        clickWorth = data.clickWorth
        passiveIncome = data.passive
        timer = data.time
        upgrades = data.restaurant
        currUser = data.user
      
        const scores = await fetch("/scores")
        const scoreData = await scores.json()
        leaderboardData = scoreData
      
        updateLeaderboard()
        updateDisplay()
    }
    catch (error){
        console.error("Error fetching data: ", error)
    }
}

function updateLeaderboard(){
    const leaderboardTable = document.querySelector(".leaderboard-table")
    
    while (leaderboardTable.firstChild) {
        leaderboardTable.removeChild(leaderboardTable.firstChild);
    }

    leaderboardData.sort((a, b) => b.highscore - a.highscore)

    leaderboardData.forEach(((entry, index) => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${entry.user}</td>
            <td>${"$" + entry.highscore}</td>
        `
        row.id = `leaderboard-row-${index}`
        leaderboardTable.appendChild(row)
    }))
}

function areAllUpgradesPurchased(){
    for (const upgrade in upgrades){
        if(!upgrades[upgrade]){
            return false
        }
    }
    return true
}

async function restart(){
    totalMoney = 0
    clickWorth = 1
    passiveIncome = 0
    upgrades = {
        "1upgrade1": false,
        "1upgrade2": false,
        "1upgrade3": false,
        "2upgrade1": false,
        "2upgrade2": false,
        "2upgrade3": false,
        "3upgrade1": false,
        "3upgrade2": false,
        "3upgrade3": false,
        "4upgrade1": false,
        "4upgrade2": false,
        "4upgrade3": false,
    }
    await updateServerPurchases()
    updateDisplay()
    isDone = false
}

setInterval(async function(){
    if(!isDone){
      totalMoney += passiveIncome
      timer++
      const yearProgress = Math.min(((timer % 60) / 60) * 100, 100)
      document.getElementById("yearProgress").style.width = `${yearProgress}%`
      document.getElementById("yearCount").innerText = `Year ${Math.floor(timer/60) + 1}`
      await updateStuff()
    }
    if(timer >= 240 && areAllUpgradesPurchased()){
        timer = 0
        isDone = true
        console.log("Updating server with highscore: " + totalMoney)
        const currUserData = leaderboardData.find(entry => entry.user === currUser)
          if (!(currUserData) || totalMoney > currUserData.highscore){
            try {
            await fetch("/save", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    highscore: totalMoney
                })
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                console.log(json)
            })
            }
            catch(error){
                console.error("Error updating server: ", error)
            }
          }
        alert("YOU WON!!")
      
        const scores = await fetch("/scores")
        const scoreData = await scores.json()
        leaderboardData = scoreData
      
        updateLeaderboard()
        
        await restart()
    }
    if (timer >= 240 && !areAllUpgradesPurchased()){
        timer = 0
        isDone = true
        alert("YOU LOST!!")
        await restart()
    }

    

}, 1000)



window.onload = async function() {

    await fetchEverything()

    document.getElementById("user").innerText = `You are currently logged in as ${currUser}`

    document.getElementById("mainButton").addEventListener("click", handleMainClick)

    document.getElementById("1upgrade1").addEventListener("click", function() {
        purchaseClickUpgrade(30, 1, "1upgrade1")
    })
    document.getElementById("1upgrade2").addEventListener("click", function() {
        purchaseClickUpgrade(150, 3, "1upgrade2")
    })
    document.getElementById("1upgrade3").addEventListener("click", function() {
        purchaseClickUpgrade(400, 5, "1upgrade3")
    })

    document.getElementById("2upgrade1").addEventListener("click", function() {
        purchasePassiveUpgrade(20, 1, "2upgrade1")
    })
    document.getElementById("2upgrade2").addEventListener("click", function() {
        purchasePassiveUpgrade(100, 2, "2upgrade2")
    })
    document.getElementById("2upgrade3").addEventListener("click", function() {
        purchasePassiveUpgrade(300, 3, "2upgrade3")
    })

    document.getElementById("3upgrade1").addEventListener("click", function() {
        purchaseClickUpgrade(700, 10, "3upgrade1")
    })
    document.getElementById("3upgrade2").addEventListener("click", function() {
        purchaseClickUpgrade(3000, 12, "3upgrade2")
    })
    document.getElementById("3upgrade3").addEventListener("click", function() {
        purchaseClickUpgrade(8000, 15, "3upgrade3")
    })

    document.getElementById("4upgrade1").addEventListener("click", function() {
        purchasePassiveUpgrade(500, 5, "4upgrade1")
    })
    document.getElementById("4upgrade2").addEventListener("click", function() {
        purchasePassiveUpgrade(2500, 10, "4upgrade2")
    })
    document.getElementById("4upgrade3").addEventListener("click", function() {
        purchasePassiveUpgrade(6000, 15, "4upgrade3")
    })
    
    document.getElementById("logout").addEventListener("click", () => { document.location.href = "/logout" })
}