import Path from "./Path";
import p5Types from "p5";
import Vec2D from "./Vec2D";

const PATH_DIST_FACTOR: number = 12;

interface LookupEntry {
    cumulativeDistance: number,
    t: number,
    segIndex: number
}

export default class BezierPath implements Path {
    period: number;
    points: Vec2D[];
    controlPoints: Vec2D[]; // same length as points;
    mirrorControlPoints: Vec2D[];
    segmentCount: number;
    lookup: LookupEntry[];
    pps: number;
    constructor(points: Vec2D[], controlPoints: Vec2D[], period: number, p5: p5Types) {
        this.points = points;
        this.controlPoints = controlPoints;
        this.mirrorControlPoints = this.calcMirrorControlPoints();
        this.period = period;
        this.segmentCount = points.length - 1;
        this.lookup = [];
        this.pps = 0;
        this.calcLUT(p5);
    }
    
    calcMirrorControlPoints(): Vec2D[] {
        let mcPoints: Vec2D[] = [];
        mcPoints.push(this.controlPoints[0]);
        for (let i = 1; i < this.controlPoints.length - 1; i++) {
            let diffX: number = this.points[i].x - this.controlPoints[i].x ;
            let diffY: number = this.points[i].y - this.controlPoints[i].y;
            let x = this.points[i].x + diffX;
            let y = this.points[i].y + diffY;
            mcPoints.push(new Vec2D(x, y));
        }
        mcPoints.push(this.controlPoints[this.controlPoints.length - 1]);
        return mcPoints;
    }

    calcAvgApproxPPS(): number { // parts per segment
        let avgdist = 0;
        for (let i = 0; i < this.segmentCount; i++) {
            avgdist += this.points[i].distTo(this.points[i+1]);
        }
        avgdist /= this.segmentCount;
        return Math.ceil(avgdist * PATH_DIST_FACTOR);
    }

    calcLUT(p5: p5Types) { // fills up both lookup and segmentLengths
        this.pps = this.calcAvgApproxPPS();
        let cumulativeDist = 0;
        let prevPoint = this.points[0];
        for (let segI = 0; segI < this.segmentCount; segI++) {
            for (let t = 0; t < this.pps; t++) {
                let time = t / this.pps;
                let x = p5.bezierPoint(this.points[segI].x, this.mirrorControlPoints[segI].x,
                                        this.controlPoints[segI + 1].x, this.points[segI + 1].x, time);
                let y = p5.bezierPoint(this.points[segI].y, this.mirrorControlPoints[segI].y,
                                        this.controlPoints[segI + 1].y, this.points[segI + 1].y, time);
                let curPoint = new Vec2D(x, y);
                let partDist = prevPoint.distTo(curPoint);
                prevPoint = curPoint;
                cumulativeDist += partDist;
                let entry: LookupEntry = {
                    cumulativeDistance: cumulativeDist,
                    t: time,
                    segIndex: segI
                };
                this.lookup.push(entry);
            }
        }
    }

    lookupToData(dist: number): [number, number] { // binary search for faster lookup times
        let [left, right, mid] = [0, this.lookup.length - 1, Math.floor((this.lookup.length - 1) / 2)];
        while (mid !== right) {
            let leftDist = this.lookup[mid].cumulativeDistance;
            let rightDist = this.lookup[mid + 1].cumulativeDistance;
            if (leftDist <= dist && dist < rightDist) {
                let startTime = this.lookup[mid].t;
                let time = startTime + ((dist - leftDist) / ((dist - rightDist) * this.pps));
                return [time, this.lookup[mid].segIndex];
            } else if (dist > leftDist) {
                left = mid + 1;
            } else {
                right = mid;
            }
            mid = Math.floor((left + right) / 2);
        }
        return [NaN, NaN];
        
    }

    getCoordsAt(t: number, p5: p5Types): Vec2D { // change this to use approximate arc length parameterization
        t %= this.period;
        let dist = (t / this.period) * this.lookup[this.lookup.length - 1].cumulativeDistance;
        let [time, segI] = this.lookupToData(dist);
        let x = p5.bezierPoint(this.points[segI].x, this.mirrorControlPoints[segI].x,
            this.controlPoints[segI + 1].x, this.points[segI + 1].x, time);
        let y = p5.bezierPoint(this.points[segI].y, this.mirrorControlPoints[segI].y,
            this.controlPoints[segI + 1].y, this.points[segI + 1].y, time);
        return new Vec2D(x, y);
    }

    draw(p5: p5Types) {
        p5.push();
        p5.noFill();
        for (let segI = 0; segI < this.segmentCount; segI++) {
            p5.stroke(255, 255, 255);
            p5.bezier(this.points[segI].x, this.points[segI].y,
                    this.mirrorControlPoints[segI].x, this.mirrorControlPoints[segI].y,
                    this.controlPoints[segI + 1].x, this.controlPoints[segI + 1].y,
                    this.points[segI + 1].x, this.points[segI + 1].y);
        }
        for (let i = 0; i <= this.segmentCount; i++) {
            p5.fill(22, 94, 201);
            p5.circle(this.points[i].x, this.points[i].y, 5);
            p5.circle(this.controlPoints[i].x, this.controlPoints[i].y, 10);
            p5.circle(this.mirrorControlPoints[i].x, this.mirrorControlPoints[i].y, 10);
            p5.noFill();
            p5.line(this.controlPoints[i].x, this.controlPoints[i].y,
                    this.points[i].x, this.points[i].y);
            p5.line(this.mirrorControlPoints[i].x, this.mirrorControlPoints[i].y,
                this.points[i].x, this.points[i].y);
        }
    }

}