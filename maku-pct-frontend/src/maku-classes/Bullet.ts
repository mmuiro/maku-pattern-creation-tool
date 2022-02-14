import p5Types from "p5";
import getDrawingContext from "../p5-utils/getDrawingContext";

const DEFAULT_RADIUS: number = 10;
const DEFAULT_MAX_SPEED: number = 5;
const DEFAULT_MIN_SPEED: number = 0;

export default class Bullet {
    color: p5Types.Color;
    pos: p5Types.Vector;
    speed: number;
    accel: number;
    angle: number; // in radians
    radius: number;
    maxSpeed: number;
    minSpeed: number;
    constructor(color: p5Types.Color, 
                initPos: p5Types.Vector, 
                initSpeed: number, 
                initAccel: number,
                initAngle: number,
                radius: number,
                maxSpeed: number,
                minSpeed: number) {
        this.color = color;
        this.pos = initPos;
        this.speed = initSpeed;
        this.accel = initAccel;
        this.angle = initAngle;
        this.radius = radius;
        this.maxSpeed = maxSpeed;
        this.minSpeed = minSpeed;
    }

    update(p5: p5Types) {
        this.pos.x += Math.cos(this.angle) * this.speed;
        this.pos.y += Math.sin(this.angle) * this.speed;
        this.speed += this.accel;
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        } else if (this.speed < this.minSpeed) {
            this.speed = this.minSpeed;
        }
    }

    draw(p5: p5Types) {
        p5.push();
        p5.noStroke();
        p5.fill(p5.color(255,255,255));
        const drawingContext: CanvasRenderingContext2D = getDrawingContext(p5)!;
        drawingContext.shadowBlur = 12;
        drawingContext.shadowColor = this.color.toString();
        p5.circle(this.pos.x, this.pos.y, this.radius);
        drawingContext.shadowBlur = 0;
        p5.pop();
    }
}