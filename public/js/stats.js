async function fillStats() {

    let username = document.cookie;

    let json = {'userID': username};
    let body = JSON.stringify(json);

    const response = await fetch("/userInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
    const text = await response.text()
    let mydata = JSON.parse(text);

    let wins = mydata.wins;
    let games = mydata.wins + mydata.losses;

    let games_stat = document.getElementById("games-played");
    let win_stat = document.getElementById("total-wins");

    games_stat.innerHTML = games_stat.innerHTML + games;
    win_stat.innerHTML = win_stat.innerHTML + wins;
}

async function makeWinRate() {

    let username = document.cookie;

    let json = {'userID': username};
    let body = JSON.stringify(json);

    const response = await fetch("/userInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
    const text = await response.text()
    let mydata = JSON.parse(text);

    let data = {win: mydata.wins, loss: mydata.losses};

    let percent = data.win / (data.win + data.loss);

    var margin = {top: 20, right: 100, bottom: 20, left: 40},
        width = 440 - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;

    var radius = Math.min(width, height) / 2 - margin.top;

    var svg = d3.select("#svg-win-rate").append('svg')
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pie = d3.pie()
        .value(function(d) { return d.value; });
    var pie_data = pie(d3.entries(data));

    svg.selectAll('arcs')
        .data(pie_data)
        .enter()
        .append('path')
            .attr('d', d3.arc()
                .innerRadius(100)
                .outerRadius(radius)
            )
            .attr('fill', function(d) { 
                if(d.data.key == 'win') {
                    return '#007559';
                } else {
                    return '#9A9A9A';
                }
            })
            .attr("stroke", "none")
            .style("opacity", 1);

    var centerText = svg.append('text')
        .attr("font-size", "50px")
        .attr("text-anchor", "middle")
        .attr("y", 10)
        .text(d3.format(".0%")(percent));

}

async function makeWinRateTime() {

    let username = document.cookie;

    let json = {'userID': username};
    let body = JSON.stringify(json);

    const response = await fetch("/userHistory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
    const text = await response.text()
    let mydata = JSON.parse(text);

    let data = []
    mydata.forEach((g) => {
        if(g.winner == username) {
            data.push(1);
        } else {
            data.push(0);
        }
    })

    let winrate = [];

    for(let i = 0; i < data.length; i++) {
        cur = data.slice(0, i + 1).reduce((partial, e) => partial + e, 0) / (i+1);
        winrate.push(cur);
    }

    var margin = {top: 20, right: 20, bottom: 60, left: 60},
            width = 600 - margin.left - margin.right,
            height = 340 - margin.top - margin.bottom;

    var svg = d3.select("#svg-win-rate-time").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
     // create axes
     var x = d3.scaleLinear()
        .domain([1, data.length])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0).ticks(5).tickPadding(10));

    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height, 0 ]);
    
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).ticks(5).tickPadding(10));

    // add line plot
    svg.append("path")
        .datum(winrate)
            .attr("fill", "none")
            .attr("stroke", "#007559")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x((d, i) => { return x(i + 1) })
                .y((d) => { return y(d) }));

    // add label
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "start")
        .attr("x", 0)
        .attr("y", height + 40)
        .text("Games")
        .attr("font-size", "16px");

}

async function makeGameDist() {

    let username = document.cookie;

    let json = {'userID': username};
    let body = JSON.stringify(json);

    const response = await fetch("/userHistory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
    const text = await response.text()
    let mydata = JSON.parse(text);

    let data = [];

    mydata.forEach((g) => {
        let curix = g.winnerOrder.indexOf(username);
        data.push(curix);
    })

    // data = [2, 1, 2, 1, 3, 5, 4, 0, 3, 2, 3, 2, 1, 0, 2, 4, 2, 1, 3, 1, 2, 2, 1, 5, 5, 6]
    let sums = new Array(d3.max(data) + 1).fill(0);

    data.forEach((d) => {
        sums[d] = sums[d] + 1;
    });

    let domain = []
    for(let i = 1; i <= sums.length; i++) {
        domain.push(i);
    }

    var margin = {top: 30, right: 30, bottom: 60, left: 30},
            width = 600 - margin.left - margin.right,
            height = 330 - margin.top - margin.bottom;

    var svg = d3.select("#svg-game-dist").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // create axes
    var x = d3.scaleBand()
        .domain(domain)
        .range([0, width])
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0).ticks(5).tickPadding(10));

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(sums)]);   // d3.hist has to be called before the Y axis obviously

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).ticks(4).tickPadding(10));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(sums)
        .enter()
        .append("rect")
            .attr("x", function (d, i) { return x(i + 1); })
            .attr("y", function (d) { return y(d); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d); })
            .style("fill", "#007559");

    // add label
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "start")
        .attr("x", 0)
        .attr("y", height + 40)
        .text("Placements (1 = 1st place)")
        .attr("font-size", "16px");

}

window.onload = () => {
    fillStats();
    makeWinRate();
    makeWinRateTime();
    makeGameDist();
}