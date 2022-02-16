import Path from "./Path";
import p5Types from "p5";
import Vec2D from "./Vec2D";

export default class LinePath implements Path {
    period: number;
    points: Vec2D[];
    constructor(points: Vec2D[], period: number) {
        this.points = points;
        this.period = period;
    }

    getCoordsAt(t: number, p5: p5Types): Vec2D {
        return new Vec2D(0, 0);
    }

    draw(p5: p5Types): void {
        
    }
}