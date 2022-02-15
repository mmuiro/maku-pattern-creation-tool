import Path from "./Path";
import p5Types from "p5";

export default class BezierPath implements Path {
    period: number;
    points: p5Types.Vector[];
    controlPoints: p5Types.Vector[]; // same length as points;
    segmentCount: number;
    segmentLength: number;
    constructor(points: p5Types.Vector[], controlPoints: p5Types.Vector[], period: number) {
        this.points = points;
        this.controlPoints = controlPoints;
        this.period = period;
        this.segmentCount = points.length - 1;
        this.segmentLength = period / this.segmentCount;
    }

    getCoordsAt(t: number, p5: p5Types): p5Types.Vector { // change this to use approximate arc length parameterization
        t %= this.period;
        let segI = Math.floor((t / this.period) * this.segmentCount);
        t = (t - segI * this.segmentLength) / this.segmentLength;
        let x = p5.bezierPoint(this.points[segI].x, this.controlPoints[segI].x,
                                this.controlPoints[segI + 1].x, this.points[segI + 1].x, t);
        let y = p5.bezierPoint(this.points[segI].y, this.controlPoints[segI].y,
            this.controlPoints[segI + 1].y, this.points[segI + 1].y, t);
        return p5.createVector(x, y);
    }

}