//
// classes
//
class World {
    public width: number
    public height: number
    public denisty: number
    public infection: Infection
    public mobility: Mobility
    public framerate: number
    private personCount: number;
    private persons: any;
    public temp: number; //temp
    constructor(width: number, height: number, denisty: number, framerate: number) {
        this.width = width
        this.height = height
        this.denisty = denisty
        this.personCount = Math.round(width * height * denisty);
        console.log("person count:" + this.personCount)
        this.temp = 0;
        this.persons = [];
        this.framerate = 1000 / framerate;
    }
    init() {
        let canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.zIndex = "1";
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        for (let a: number = 0; a < this.personCount; a++) {
            let person = new Person(randomIntFromInterval(0, this.width), randomIntFromInterval(0, this.height), this.width, this.height, this.infection, "uninfected");
            this.persons.push(person);
        }
        this.persons[0].state = "infected";
        this.animationStep();
    }
    animationStep() {
        var canvas: any = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
        for (let a: number = 0; a < this.persons.length; a++) {            
            for (let b: number = 0; b < this.persons.length; b++) {            
                if (this.persons[a].state == "infected")
                {
                    if (this.persons[a].xPosition == this.persons[b].xPosition)
                    {
                        if (this.persons[a].yPosition == this.persons[b].yPosition)
                        {
                            this.persons[b].state = "infected";
                        }
                    }
                }
            }
        }
        for (let a: number = 0; a < this.persons.length; a++) {            
            this.persons[a].move();
            this.persons[a].draw(ctx);
        }
        this.temp++;
        setTimeout(() => {
            this.animationStep()
            console.log(this.temp)
        }, this.framerate);
    };
}
class Infection {
    public duration: number
    public mortality: number
    public reach: number
    constructor(duration: number, mortality: number, reach: number) {
        this.duration = duration
        this.mortality = mortality
        this.reach = reach
    }
}
class Mobility {
    public speed: number
    public distance: number
    constructor(speed: number, distance: number) {
        this.speed = speed
        this.distance = distance
    }
}
class Person {
    public xPosition: number
    public yPosition: number
    public xPositionMax: number
    public yPositionMax: number
    public infection: Infection;
    public state: string;
    constructor(xPosition: number, yPosition: number, xPositionMax: number, yPositionMax: number, infection: Infection, state: string = "uninfected") {
        this.xPosition = xPosition
        this.yPosition = yPosition
        this.infection = infection
        this.xPositionMax = xPositionMax;
        this.yPositionMax = yPositionMax;
        this.state = state
    }
    move() {
        if (this.state != "deceased") {
            this.xPosition = this.xPosition - randomIntFromInterval(-10, 10);
            this.yPosition = this.yPosition - randomIntFromInterval(-10, 10);
            if (this.xPosition<0)
            {
                this.xPosition = this.xPositionMax + this.xPosition; 
            }
            if (this.xPosition>this.xPositionMax)
            {
                this.xPosition = this.xPosition - this.xPositionMax;
            }
            if (this.yPosition<0)
            {
                this.yPosition = this.yPositionMax + this.yPosition; 
            }
            if (this.yPosition>this.yPositionMax)
            {
                this.yPosition = this.yPosition - this.yPositionMax;
            }
        }
    }
    setState(state: string) {
        this.state = state;
    }
    draw(ctx: any) {
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
    }

}
//
// helper functiona
//
function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//
// let's do it...
//
let speed: number = 30;
let world = new World(200, 200, 0.01, speed)
let infection = new Infection(10, 0.05, 5)
let mobility = new Mobility(1, 10);
world.infection = infection;
world.mobility = mobility;
world.init();