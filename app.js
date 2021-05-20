"use strict";
//
// classes
//
var World = /** @class */ (function () {
    function World(width, height, density, framerate, personSize) {
        this.graphData = [];
        this.first = 0;
        this.animationRuns = false;
        this.width = width;
        this.height = height;
        this.density = density;
        this.persons = [];
        this.framerate = 1000 / framerate;
        this.personSize = personSize;
    }
    World.prototype.init = function () {
        var body = document.getElementById("container");
        var canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.border = "1px solid";
        body.appendChild(canvas);
        var canvasChart = document.createElement('canvas');
        canvasChart.id = "chart";
        canvasChart.width = 700;
        canvasChart.height = 700;
        canvasChart.style.border = "1px solid";
        body.appendChild(canvasChart);
        this.chart = new Chart(canvasChart, {
            type: 'line',
            data: {
                datasets: [{
                        barPercentage: 1,
                        lineTension: 0,
                        pointRadius: 0,
                        label: 'uninfected',
                        data: [],
                        backgroundColor: '#0000ff'
                    },
                    {
                        barPercentage: 1,
                        lineTension: 0,
                        pointRadius: 0,
                        label: 'infected',
                        data: [],
                        backgroundColor: '#ffaf00'
                    },
                    {
                        barPercentage: 1,
                        lineTension: 0,
                        pointRadius: 0,
                        label: 'deceased',
                        data: [],
                        backgroundColor: '#ff0000'
                    },
                    {
                        barPercentage: 1,
                        lineTension: 0,
                        pointRadius: 0,
                        label: 'recovered',
                        data: [],
                        backgroundColor: '#00ff00',
                    }]
            },
            options: {
                tooltips: { enabled: false },
                hover: { mode: null },
                animation: {
                    duration: 0
                },
                elements: {
                    line: {
                        cubicInterpolationMode: 'monotone'
                    }
                },
                responsiveAnimationDuration: 0,
                responsive: false,
                scales: {
                    xAxes: [{
                            stacked: true,
                        }],
                    yAxes: [{
                            stacked: true,
                        }]
                }
            }
        });
        this.load();
    };
    World.prototype.load = function () {
        this.first = 0;
        this.persons = [];
        this.graphData = [];
        this.personCount = this.width * this.height * 0.0001 * this.density;
        for (var a = 0; a < this.personCount; a++) {
            var person = new Person(randomIntFromInterval(0, this.width), randomIntFromInterval(0, this.height), this.width, this.height, this.infection, this.mobility, "uninfected", this.personSize);
            this.persons.push(person);
        }
        if (!this.animationRuns) {
            this.animationStep();
            this.animationRuns = true;
        }
    };
    World.prototype.animationStep = function () {
        var _this = this;
        this.first++;
        if (this.first == 2) {
            this.persons[0].state = "infected";
        }
        //
        var uninfected = 0;
        var infected = 0;
        var deceased = 0;
        var recovered = 0;
        //
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
        for (var a = 0; a < this.persons.length; a++) {
            for (var b = 0; b < this.persons.length; b++) {
                if (this.persons[a].state == "infected") {
                    var dist = Math.sqrt(Math.pow((this.persons[a].xPosition - this.persons[b].xPosition), 2) + Math.pow((this.persons[a].yPosition - this.persons[b].yPosition), 2));
                    if (dist < this.persons[a].infection.reach + this.persons[a].size) {
                        if (this.persons[b].state == "uninfected") {
                            this.persons[b].state = "infected";
                        }
                    }
                }
            }
            if (this.persons[a].state == "uninfected") {
                uninfected++;
            }
            if (this.persons[a].state == "infected") {
                infected++;
            }
            if (this.persons[a].state == "deceased") {
                deceased++;
            }
            if (this.persons[a].state == "recovered") {
                recovered++;
            }
        }
        if (this.first > 2 && infected > 0) {
            this.graphData.push({ "uninfected": uninfected, "infected": infected, "deceased": deceased, "recovered": recovered });
        }
        //convert data
        var labels = [];
        var uninfectedArray = [];
        var infectedArray = [];
        var deceasedArray = [];
        var recoveredArray = [];
        for (var a = 0; a < this.graphData.length; a++) {
            labels.push(a + "");
            uninfectedArray.push(this.graphData[a].uninfected);
            infectedArray.push(this.graphData[a].infected);
            deceasedArray.push(this.graphData[a].deceased);
            recoveredArray.push(this.graphData[a].recovered);
        }
        var xaxisstep = 20;
        labels = convertArrayLenght(labels, xaxisstep);
        uninfectedArray = convertArrayLenght(uninfectedArray, xaxisstep);
        infectedArray = convertArrayLenght(infectedArray, xaxisstep);
        deceasedArray = convertArrayLenght(deceasedArray, xaxisstep);
        recoveredArray = convertArrayLenght(recoveredArray, xaxisstep);
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = uninfectedArray;
        this.chart.data.datasets[1].data = infectedArray;
        this.chart.data.datasets[2].data = deceasedArray;
        this.chart.data.datasets[3].data = recoveredArray;
        this.chart.update();
        for (var a = 0; a < this.persons.length; a++) {
            this.persons[a].stateChange();
            this.persons[a].move();
            this.persons[a].draw(ctx);
        }
        setTimeout(function () {
            _this.animationStep();
        }, this.framerate);
    };
    return World;
}());
var Infection = /** @class */ (function () {
    //public exposure: number
    //public icnubation: number
    function Infection(duration, mortality, reach) {
        this.duration = duration;
        this.mortality = mortality;
        this.reach = reach;
    }
    return Infection;
}());
var Mobility = /** @class */ (function () {
    function Mobility(speed, distance) {
        this.speed = speed;
        this.distance = distance;
    }
    return Mobility;
}());
var Person = /** @class */ (function () {
    function Person(xPosition, yPosition, xPositionMax, yPositionMax, infection, mobility, state, personSize) {
        if (state === void 0) { state = "uninfected"; }
        this.infectionCounter = 0;
        this.moveStep = 0;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.infection = infection;
        this.xPositionMax = xPositionMax;
        this.yPositionMax = yPositionMax;
        this.mobility = mobility;
        this.state = state;
        this.size = personSize;
    }
    Person.prototype.move = function () {
        if (this.state != "deceased") {
            this.xPosition = this.xPosition + this.xMove;
            this.yPosition = this.yPosition + this.yMove;
            if (this.xPosition < 0) {
                this.xPosition = this.xPositionMax + this.xPosition;
            }
            if (this.xPosition > this.xPositionMax) {
                this.xPosition = this.xPosition - this.xPositionMax;
            }
            if (this.yPosition < 0) {
                this.yPosition = this.yPositionMax + this.yPosition;
            }
            if (this.yPosition > this.yPositionMax) {
                this.yPosition = this.yPosition - this.yPositionMax;
            }
        }
    };
    Person.prototype.stateChange = function () {
        // if target is reached create a new target
        if (this.moveStep == 0) {
            var angle = Math.random() * Math.PI * 2;
            this.xMove = Math.sin(angle) * this.mobility.speed;
            this.yMove = Math.cos(angle) * this.mobility.speed;
        }
        this.moveStep++;
        if (this.moveStep > this.mobility.distance / this.mobility.speed) {
            this.moveStep = 0;
        }
        //
        if (this.infectionCounter > this.infection.duration) {
            this.state = "recovered";
        }
        if (this.state == "infected") {
            this.infectionCounter++;
            var d = Math.random();
            if (d < this.infection.mortality / this.infection.duration) {
                this.state = "deceased";
            }
        }
    };
    Person.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.xPosition, this.yPosition, this.size, 0, 360);
        ctx.strokeStyle = "rgba(0,0,0,5)";
        ctx.stroke();
        if (this.state == "uninfected") {
            ctx.fillStyle = "rgba(0,0,255,0.5)";
        }
        if (this.state == "infected") {
            ctx.fillStyle = "rgba(255,175,0,0.5)";
        }
        if (this.state == "recovered") {
            ctx.fillStyle = "rgba(0,255,0,0.5)";
        }
        if (this.state == "deceased") {
            ctx.fillStyle = "rgba(255,0,0,0.5)";
        }
        ctx.fill();
        if (this.state == "infected") {
            ctx.beginPath();
            ctx.arc(this.xPosition, this.yPosition, this.infection.reach, 0, 360);
            ctx.fillStyle = "rgba(255,175,0,0.5)";
            ctx.fill();
        }
    };
    return Person;
}());
//
// helper functions
//
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function convertArrayLenght(inputArray, length) {
    //return inputArray
    length = length - 1;
    var myNewArray = [];
    for (var a = 0; a < length; a++) {
        myNewArray.push(inputArray[Math.floor(a / length * inputArray.length)]);
    }
    myNewArray.push(inputArray[Math.ceil(inputArray.length - 1)]);
    return myNewArray;
}
//
// let's do it...
//
var framerate = 30;
var personSize = 6;
var world = new World(700, 700, 10, framerate, personSize); // width, height, density, framerate, personSize
var infection = new Infection(200, 0.3, 12); // duration, mortality, reach
var mobility = new Mobility(1, 13); // speed, distance
world.infection = infection;
world.mobility = mobility;
world.init();
//
// dat.gui
//
var gui = new dat.GUI();
var slider1 = gui.add(world, 'density').min(1).max(20).step(1);
var slider2 = gui.add(world, 'personSize').min(2).max(10).step(1);
var slider3 = gui.add(world.infection, 'duration').min(50).max(500).step(50);
var slider4 = gui.add(world.infection, 'mortality').min(0).max(1).step(0.1);
var slider5 = gui.add(world.infection, 'reach').min(1).max(20).step(1);
var slider6 = gui.add(world.mobility, 'speed').min(0).max(2).step(0.1);
var slider7 = gui.add(world.mobility, 'distance').min(1).max(50).step(1);
slider1.onChange(function () { world.load(); });
slider2.onChange(function () { world.load(); });
slider3.onChange(function () { world.load(); });
slider4.onChange(function () { world.load(); });
slider5.onChange(function () { world.load(); });
slider6.onChange(function () { world.load(); });
slider7.onChange(function () { world.load(); });
console.log("ok");
