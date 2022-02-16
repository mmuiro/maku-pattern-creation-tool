import Path from "./Path";
import p5Types from "p5";
import Vec2D from "./Vec2D";

export default class EllipsePath implements Path {
    center: Vec2D;
    a: number;
    b: number;
    period: number;
    constructor(center: Vec2D, xAxis: number, yAxis: number, period: number) {
        this.center = center;
        this.a = xAxis;
        this.b = yAxis;
        this.period = period;
    }

    getCoordsAt(t: number, p5: p5Types): Vec2D {
        t %= this.period;
        return new Vec2D(this.center.x + this.a * Math.cos((t / this.period) * p5.TWO_PI), 
                                this.center.y + this.b * Math.sin((t / this.period) * p5.TWO_PI));
    }
}