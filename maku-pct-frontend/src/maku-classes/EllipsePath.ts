import Path from "./Path";
import p5Types from "p5";

export default class EllipsePath implements Path {
    center: p5Types.Vector;
    a: number;
    b: number;
    period: number;
    constructor(center: p5Types.Vector, xAxis: number, yAxis: number, period: number) {
        this.center = center;
        this.a = xAxis;
        this.b = yAxis;
        this.period = period;
    }

    getCoordsAt(t: number, p5: p5Types): p5Types.Vector {
        t %= this.period;
        return p5.createVector(this.center.x + this.a * Math.cos((t / this.period) * p5.TWO_PI), 
                                this.center.y + this.b * Math.sin((t / this.period) * p5.TWO_PI));
    }
}