export default class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
