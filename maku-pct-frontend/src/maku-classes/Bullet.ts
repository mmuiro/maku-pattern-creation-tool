import p5Types from "p5";
import getDrawingContext from "../p5-utils/getDrawingContext";

const DEFAULT_RADIUS: number = 10;

export default class Bullet {
    color: p5Types.Color;
    pos: p5Types.Vector;
    speed: number;
    accel: number;
    angle: number; // in radians
    radius: number;
    constructor(color: p5Types.Color, 
                initPos: p5Types.Vector, 
                initSpeed: number, 
                initAccel: number,
                initAngle: number,
                radius: number = DEFAULT_RADIUS) {
        this.color = color;
        this.pos = initPos;
        this.speed = initSpeed;
        this.accel = initAccel;
        this.angle = initAngle;
        this.radius = radius;
    }

    update(p5: p5Types) {
        this.pos.x += p5.cos(this.angle) * this.speed;
        this.pos.y += p5.sin(this.angle) * this.speed;
        this.speed += this.accel;
    }

    draw(p5: p5Types) {
        p5.push();
        p5.fill(p5.color(255, 255, 255));
        p5.noStroke();
        const drawingContext: CanvasRenderingContext2D = getDrawingContext(p5)!;
        drawingContext.shadowBlur = 12;
        drawingContext.shadowColor = this.color.toString();
        p5.circle(this.pos.x, this.pos.y, this.radius);
        drawingContext.shadowBlur = 0;
        p5.pop();
    }
}