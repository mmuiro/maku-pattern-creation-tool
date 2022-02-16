export default class Vec2D {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vec2D(this.x, this.y);
    }

    distTo(other: Vec2D) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
}