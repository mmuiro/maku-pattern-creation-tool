import Vec2D from './Vec2D';
export default class BezierCurve {
    start: Vec2D;
    control1: Vec2D;
    control2: Vec2D;
    end: Vec2D;

    constructor(
        sx: number,
        sy: number,
        c1x: number,
        c1y: number,
        c2x: number,
        c2y: number,
        ex: number,
        ey: number
    ) {
        this.start = new Vec2D(sx, sy);
        this.control1 = new Vec2D(c1x, c1y);
        this.control2 = new Vec2D(c2x, c2y);
        this.end = new Vec2D(ex, ey);
    }
    // cubic bezier curve implementation

    coordsAtT(t: number): Vec2D {
        return this.start
            .mul(Math.pow(1 - t, 3))
            .add(this.control1.mul(3 * Math.pow(1 - t, 2) * t))
            .add(this.control2.mul(3 * (1 - t) * t * t))
            .add(this.end.mul(t * t * t));
    }
}
