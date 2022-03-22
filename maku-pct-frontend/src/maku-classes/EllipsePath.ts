import Path from './Path';
import Vec2D from './Vec2D';

export default class EllipsePath implements Path {
    center: Vec2D;
    a: number;
    b: number;
    period: number;
    direction: number;
    constructor(
        center: Vec2D,
        xAxis: number,
        yAxis: number,
        period: number,
        direction: number
    ) {
        this.center = center;
        this.a = xAxis;
        this.b = yAxis;
        this.period = period;
        this.direction = direction;
    }

    getCoordsAt(t: number): Vec2D {
        t %= this.period;
        return new Vec2D(
            this.center.x +
                this.a *
                    Math.cos(this.direction * (t / this.period) * 2 * Math.PI),
            this.center.y +
                this.b *
                    Math.sin(this.direction * (t / this.period) * 2 * Math.PI)
        );
    }

    draw(ctx: CanvasRenderingContext2D): void {}
}
