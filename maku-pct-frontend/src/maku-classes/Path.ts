import p5Types from "p5";

export default interface Path {
    period: number;
    getCoordsAt(t: number, p5: p5Types): p5Types.Vector;
}