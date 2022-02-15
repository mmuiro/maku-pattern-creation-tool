import Path from "./Path";
import p5Types from "p5";

export default class LinePath implements Path {
    period: number;
    points: p5Types.Vector[];
    constructor(points: p5Types.Vector[], period: number) {
        this.points = points;
        this.period = period;
    }

    getCoordsAt(t: number, p5: p5Types): p5Types.Vector {
        return p5.createVector(0, 0);
    }
}