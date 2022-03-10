import p5Types from 'p5';
import Vec2D from './Vec2D';

export default interface Path {
    period: number;
    getCoordsAt(t: number): Vec2D;
    // add a debug draw function, to visualize paths (particularly bezier)
    draw(ctx: CanvasRenderingContext2D): void;
}
