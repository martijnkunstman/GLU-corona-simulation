"use strict";
//
// classes
//
var World = /** @class */ (function () {
    function World(width, height, denisty, framerate) {
        this.width = width;
        this.height = height;
        this.denisty = denisty;
        this.personCount = Math.round(width * height * denisty);
        console.log("person count:" + this.personCount);
        this.temp = 0;
        this.persons = [];
        this.framerate = 1000 / framerate;
    }
    World.prototype.init = function () {
        var canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.zIndex = "1";
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        for (var a = 0; a < this.personCount; a++) {
            var person = new Person(randomIntFromInterval(0, this.width), randomIntFromInterval(0, this.height), this.width, this.height, this.infection, "uninfected");
            this.persons.push(person);
        }
        this.persons[0].state = "infected";
        this.animationStep();
    };
    World.prototype.animationStep = function () {
        var _this = this;
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
        for (var a = 0; a < this.persons.length; a++) {
            for (var b = 0; b < this.persons.length; b++) {
                if (this.persons[a].state == "infected") {
                    if (this.persons[a].xPosition == this.persons[b].xPosition) {
                        if (this.persons[a].yPosition == this.persons[b].yPosition) {
                            this.persons[b].state = "infected";
                        }
                    }
                }
            }
        }
        for (var a = 0; a < this.persons.length; a++) {
            this.persons[a].move();
            this.persons[a].draw(ctx);
        }
        this.temp++;
        setTimeout(function () {
            _this.animationStep();
            console.log(_this.temp);
        }, this.framerate);
    };
    ;
    return World;
}());
var Infection = /** @class */ (function () {
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
    function Person(xPosition, yPosition, xPositionMax, yPositionMax, infection, state) {
        if (state === void 0) { state = "uninfected"; }
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.infection = infection;
        this.xPositionMax = xPositionMax;
        this.yPositionMax = yPositionMax;
        this.state = state;
    }
    Person.prototype.move = function () {
        if (this.state != "deceased") {
            this.xPosition = this.xPosition - randomIntFromInterval(-10, 10);
            this.yPosition = this.yPosition - randomIntFromInterval(-10, 10);
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
    Person.prototype.setState = function (state) {
        this.state = state;
    };
    Person.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.xPosition, this.yPosition, this.infection.reach, 0, 360);
        ctx.stroke();
        if (this.state == "uninfected") {
            ctx.fillStyle = "blue";
        }
        if (this.state == "infected") {
            ctx.fillStyle = "orange";
        }
        if (this.state == "recovered") {
            ctx.fillStyle = "green";
        }
        if (this.state == "deceased") {
            ctx.fillStyle = "red";
        }
        ctx.fill();
    };
    return Person;
}());
//
// helper functiona
//
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//
// let's do it...
//
var speed = 30;
var world = new World(200, 200, 0.01, speed);
var infection = new Infection(10, 0.05, 5);
var mobility = new Mobility(1, 10);
world.infection = infection;
world.mobility = mobility;
world.init();
