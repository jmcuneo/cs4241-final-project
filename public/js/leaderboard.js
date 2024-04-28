const loadTable = async function (){
    await fetch("/allUsers").then(response => response.json())
        .then(data => {
            const existingTableBody = document.getElementById("leaderboardBody");
            data.sort((a, b) => (b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses)))
            for (let i = 0; i < data.length; i++) {
                console.log("loadTable: ", data[i])
                const row = document.createElement("tr");
                for (let j = 0; j < 4; j++) {
                    const cell = document.createElement("td");
                    let content = "";
                    switch(j) {
                        case 0:
                            content = data[i].userID
                            break;
                        case 1:
                            content = data[i].wins
                            break;
                        case 2:
                            content = data[i].losses
                            break;
                        case 3:
                            content = data[i].wins / (data[i].wins + data[i].losses)
                            content = (content * 100).toFixed(2) + '%';
                            break;
                    }
                    const cellText = document.createTextNode(content);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                }
                existingTableBody.appendChild(row);
            }

        })

}

window.onload = function() {
    loadTable();
}