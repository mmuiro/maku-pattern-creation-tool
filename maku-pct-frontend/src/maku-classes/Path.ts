import p5Types from "p5";
import Vec2D from "./Vec2D";

export default interface Path {
    period: number;
    getCoordsAt(t: number, p5: p5Types): Vec2D;
}