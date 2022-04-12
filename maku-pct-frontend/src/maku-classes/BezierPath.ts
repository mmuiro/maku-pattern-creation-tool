import Path from './Path';
import Vec2D from './Vec2D';
import BezierCurve from './BezierCurve';

const PATH_DIST_FACTOR: number = 20;

interface LookupEntry {
    cumulativeDistance: number;
    t: number;
    segIndex: number;
}

export default class BezierPath implements Path {
    period: number;
    points: Vec2D[];
    controlPoints: Vec2D[]; // same length as points;
    mirrorControlPoints: Vec2D[];
    segmentCount: number;
    segments: BezierCurve[];
    lookup: LookupEntry[];
    pps: number;
    constructor(points: Vec2D[], controlPoints: Vec2D[], period: number) {
        this.points = points;
        this.controlPoints = controlPoints;
        this.mirrorControlPoints = this.calcMirrorControlPoints();
        this.period = period;
        this.segmentCount = points.length - 1;
        this.segments = this.getCurves();
        this.lookup = [];
        this.pps = 0;
        this.calcLUT();
    }

    calcMirrorControlPoints(): Vec2D[] {
        let mcPoints: Vec2D[] = [];
        mcPoints.push(this.controlPoints[0]);
        for (let i = 1; i < this.controlPoints.length - 1; i++) {
            let diffX: number = this.points[i].x - this.controlPoints[i].x;
            let diffY: number = this.points[i].y - this.controlPoints[i].y;
            let x = this.points[i].x + diffX;
            let y = this.points[i].y + diffY;
            mcPoints.push(new Vec2D(x, y));
        }
        mcPoints.push(this.controlPoints[this.controlPoints.length - 1]);
        return mcPoints;
    }

    getCurves(): BezierCurve[] {
        const segmentList: BezierCurve[] = [];
        for (let i = 0; i < this.segmentCount; i++) {
            segmentList.push(
                new BezierCurve(
                    this.points[i].x,
                    this.points[i].y,
                    this.mirrorControlPoints[i].x,
                    this.mirrorControlPoints[i].y,
                    this.controlPoints[i + 1].x,
                    this.controlPoints[i + 1].y,
                    this.points[i + 1].x,
                    this.points[i + 1].y
                )
            );
        }
        return segmentList;
    }

    calcAvgApproxPPS(): number {
        // parts per segment
        let avgdist = 0;
        for (let i = 0; i < this.segmentCount; i++) {
            avgdist += this.points[i].distTo(this.points[i + 1]);
        }
        avgdist /= this.segmentCount;
        return Math.max(1, Math.ceil(avgdist * PATH_DIST_FACTOR));
    }

    calcLUT() {
        // fills up both lookup and segmentLengths
        this.pps = this.calcAvgApproxPPS();
        let cumulativeDist = 0;
        let prevPoint = this.points[0];
        for (let segI = 0; segI < this.segmentCount; segI++) {
            for (let t = 0; t < this.pps; t++) {
                let time = t / this.pps;
                let curPoint = this.segments[segI].coordsAtT(time);
                let partDist = prevPoint.distTo(curPoint);
                prevPoint = curPoint;
                cumulativeDist += partDist;
                let entry: LookupEntry = {
                    cumulativeDistance: cumulativeDist,
                    t: time,
                    segIndex: segI,
                };
                this.lookup.push(entry);
            }
        }
    }

    lookupToData(dist: number): [number, number] {
        // binary search for faster lookup times
        let [left, right, mid] = [
            0,
            this.lookup.length - 1,
            Math.floor((this.lookup.length - 1) / 2),
        ];
        while (mid !== right) {
            let leftDist = this.lookup[mid].cumulativeDistance;
            let rightDist = this.lookup[mid + 1].cumulativeDistance;
            if (leftDist <= dist && dist < rightDist) {
                let startTime = this.lookup[mid].t;
                let time =
                    startTime +
                    (dist - leftDist) / ((dist - rightDist) * this.pps);
                return [time, this.lookup[mid].segIndex];
            } else if (dist > leftDist) {
                left = mid + 1;
            } else {
                right = mid;
            }
            mid = Math.floor((left + right) / 2);
        }
        return [0, 0];
    }

    getCoordsAt(t: number): Vec2D {
        t %= this.period;
        let dist =
            (t / this.period) *
            this.lookup[this.lookup.length - 1].cumulativeDistance;
        let [time, segI] = this.lookupToData(dist);
        return this.segments[segI].coordsAtT(time);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let segI = 0; segI < this.segmentCount; segI++) {
            ctx.bezierCurveTo(
                this.mirrorControlPoints[segI].x,
                this.mirrorControlPoints[segI].y,
                this.controlPoints[segI + 1].x,
                this.controlPoints[segI + 1].y,
                this.points[segI + 1].x,
                this.points[segI + 1].y
            );
        }
        ctx.stroke();
        for (let i = 0; i <= this.segmentCount; i++) {
            ctx.beginPath();
            ctx.moveTo(this.controlPoints[i].x, this.controlPoints[i].y);
            ctx.lineTo(this.points[i].x, this.points[i].y);
            ctx.lineTo(
                this.mirrorControlPoints[i].x,
                this.mirrorControlPoints[i].y
            );
            ctx.stroke();
            ctx.fillStyle = 'rgb(22, 94, 201)';
            ctx.beginPath();
            ctx.arc(this.points[i].x, this.points[i].y, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.beginPath();
            ctx.arc(
                this.mirrorControlPoints[i].x,
                this.mirrorControlPoints[i].y,
                8,
                0,
                2 * Math.PI
            );
            ctx.fill();
            ctx.fillStyle = 'rgb(0, 200, 40)';
            ctx.beginPath();
            ctx.arc(
                this.controlPoints[i].x,
                this.controlPoints[i].y,
                8,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }
        ctx.restore();
    }
}
