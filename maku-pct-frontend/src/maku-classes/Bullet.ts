import Color from './Color';
import Vec2D from './Vec2D';
import getDrawingContext from '../p5-utils/getDrawingContext';

const DEFAULT_RADIUS: number = 5;
const DEFAULT_MAX_SPEED: number = 5;
const DEFAULT_MIN_SPEED: number = 0;

export default class Bullet {
    color: Color;
    pos: Vec2D;
    speed: number;
    accel: number;
    angle: number; // in radians
    rotationSpeed: number;
    maxAngleChange: number;
    netAngleChange: number;
    radius: number;
    maxSpeed: number;
    minSpeed: number;
    lifespan: number;
    framesPassed: number;
    constructor(
        color: Color,
        initPos: Vec2D,
        initSpeed: number,
        initAccel: number,
        initAngle: number,
        rotationSpeed: number,
        maxAngleChange: number,
        radius: number,
        maxSpeed: number,
        minSpeed: number,
        lifespan: number
    ) {
        this.color = color;
        this.pos = initPos;
        this.speed = initSpeed;
        this.accel = initAccel;
        this.angle = initAngle;
        this.rotationSpeed = rotationSpeed;
        this.maxAngleChange = maxAngleChange;
        this.radius = radius;
        this.maxSpeed = maxSpeed;
        this.minSpeed = minSpeed;
        this.lifespan = lifespan;
        this.framesPassed = 0;
        this.netAngleChange = 0;
    }

    update() {
        this.pos.x += Math.cos(this.angle) * this.speed;
        this.pos.y += Math.sin(this.angle) * this.speed;
        this.speed += this.accel;
        if (this.netAngleChange < this.maxAngleChange) {
            let angleInc = Math.min(
                this.rotationSpeed,
                this.maxAngleChange - this.netAngleChange
            );
            this.angle += angleInc;
            this.netAngleChange += Math.abs(angleInc);
        }
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        } else if (this.speed < this.minSpeed) {
            this.speed = this.minSpeed;
        }
        this.framesPassed++;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        let alpha = Math.sqrt(1 - this.framesPassed / this.lifespan);
        this.color.a = alpha;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.strokeStyle = this.color.toString();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        /*p5.push();
        p5.noStroke();
        let alpha = Math.sqrt(1 - this.framesPassed / this.lifespan) * 255;
        this.color.setAlpha(alpha);
        p5.fill(p5.color(255, 255, 255, alpha));
        p5.stroke(this.color);
        //const drawingContext: CanvasRenderingContext2D = getDrawingContext(p5)!;
        p5.circle(this.pos.x, this.pos.y, this.radius);
        p5.pop();*/
    }
}
