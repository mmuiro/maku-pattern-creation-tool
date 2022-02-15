import Path from "./Path";
import p5Types from "p5";

export default class StillPath implements Path {
    period: number;
    position: p5Types.Vector;
    constructor(position: p5Types.Vector, period: number) {
        this.period = period;
        this.position = position;
    }

    getCoordsAt(t: number, p5: p5Types): p5Types.Vector {
        return p5.createVector(this.position.x, this.position.y);
    }
}