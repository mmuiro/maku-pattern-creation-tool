import Path from "./Path";
import p5Types from "p5";
import Vec2D from "./Vec2D";

export default class StillPath implements Path {
    period: number;
    position: Vec2D;
    constructor(position: Vec2D, period: number) {
        this.period = period;
        this.position = position;
    }

    getCoordsAt(t: number, p5: p5Types): Vec2D {
        return new Vec2D(this.position.x, this.position.y);
    }
    
    draw(p5: p5Types): void {
        
    }
}