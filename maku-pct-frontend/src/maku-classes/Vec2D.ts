export default class Vec2D {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy(): Vec2D {
        return new Vec2D(this.x, this.y);
    }

    distTo(other: Vec2D): number {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
        );
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(other: Vec2D): Vec2D {
        return new Vec2D(this.x + other.x, this.y + other.y);
    }

    dot(other: Vec2D): number {
        return this.x * other.x + this.y * other.y;
    }

    mul(scalar: number): Vec2D {
        return new Vec2D(scalar * this.x, scalar * this.y);
    }
}
