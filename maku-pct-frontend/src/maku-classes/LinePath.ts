import Path from './Path';
import Vec2D from './Vec2D';

export default class LinePath implements Path {
    period: number;
    points: Vec2D[];
    lookup: Vec2D[];

    constructor(points: Vec2D[], period: number) {
        this.points = points;
        this.period = period;
        this.lookup = [];
        this.calculateLUT();
    }

    calculateLUT() {
        // get segment cumulative lengths
        let cumulSegLengths = [];
        cumulSegLengths.push(this.points[0].distTo(this.points[1]));
        for (let i = 1; i < this.points.length - 1; i++) {
            cumulSegLengths.push(
                cumulSegLengths[i - 1] +
                    this.points[i].distTo(this.points[i + 1])
            );
        }
        // generate lookup table
        let cumulPrevSegDist = 0;
        let segI = 0;
        let distInc =
            cumulSegLengths[cumulSegLengths.length - 1] / (this.period - 1);
        for (let t = 0; t < this.period; t++) {
            let curDist = t * distInc;
            if (curDist > cumulSegLengths[segI]) {
                cumulPrevSegDist = cumulSegLengths[segI];
                segI++;
            }
            if (this.points[segI].distTo(this.points[segI + 1]) === 0) {
                this.lookup.push(this.points[segI]);
            } else {
                this.lookup.push(
                    this.points[segI].add(
                        this.points[segI + 1]
                            .add(this.points[segI].mul(-1))
                            .mul(
                                (curDist - cumulPrevSegDist) /
                                    this.points[segI].distTo(
                                        this.points[segI + 1]
                                    )
                            )
                    )
                );
            }
        }
    }

    getCoordsAt(t: number): Vec2D {
        return this.lookup[t % this.period];
    }

    draw(ctx: CanvasRenderingContext2D): void {}
}
