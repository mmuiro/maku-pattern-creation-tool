import BulletSource from "./BulletSource";
import p5Types from "p5";

const DEFAULT_RADIUS: number = 10;
const DEFAULT_MAX_SPEED: number = 20;
const DEFAULT_MIN_SPEED: number = 2;
const DEFAULT_SPREAD_ANGLE: number = 6.28318530717958647693;
const DEFAULT_DURATION:number = Infinity;
const DEFAULT_START_DELAY: number = 0;
const DEFAULT_STACK_LENGTH: number = 0;

interface PatternArgs {
    startDelay?: number,
    fireInterval: number,
    duration?: number,
    stackInterval: number,
    stackLength?: number,
    spokeCount: number,
    initAngle: number,
    initPos: p5Types.Vector,
    bulletSpeed: number,
    bulletAccel: number,
    rotationSpeed: number,
    spreadAngle?: number,
    color: p5Types.Color,
    bulletRadius?: number,
    bulletMaxSpeed?: number,
    bulletMinSpeed?: number
}

export default class Pattern {
    // all "time" measurements are in frames
    source: BulletSource;
    startDelay: number;
    duration: number;
    fireInterval: number;
    stackLength: number;
    stackInterval: number;
    stackCounter: number;
    passedFrames: number;
    spokeCount: number;
    spreadAngle: number;
    firing: Boolean;
    firingFrames: number;

    constructor(args: PatternArgs) {
        if (!args.startDelay) args.startDelay = DEFAULT_START_DELAY;
        if (!args.stackLength) args.stackLength = DEFAULT_STACK_LENGTH;
        if (!args.duration) args.duration = DEFAULT_DURATION;
        if (!args.spreadAngle) args.spreadAngle = DEFAULT_SPREAD_ANGLE;
        if (!args.bulletRadius) args.bulletRadius = DEFAULT_RADIUS;
        if (!args.bulletMaxSpeed) args.bulletMaxSpeed = DEFAULT_MAX_SPEED;
        if (!args.bulletMinSpeed) args.bulletMinSpeed = DEFAULT_MIN_SPEED;
        console.log(args.rotationSpeed);
        this.passedFrames = 0;
        this.startDelay = args.startDelay;
        this.duration = args.duration;
        this.fireInterval = args.fireInterval;
        this.stackLength = args.stackLength;
        this.stackInterval = args.stackInterval;
        this.spokeCount = args.spokeCount;
        this.spreadAngle = args.spreadAngle;
        this.firing = false;
        this.firingFrames = 0;
        this.stackCounter = 0;
        this.source = new BulletSource(args.initAngle,
            args.rotationSpeed,
            args.initPos,
            args.color,
            args.bulletSpeed,
            args.bulletAccel,
            args.bulletRadius,
            args.bulletMaxSpeed,
            args.bulletMinSpeed);
        console.log(this);
    }

    update(p5: p5Types) {
        if (this.passedFrames >= this.startDelay) {
            this.source.update(p5);
            if (this.firing && this.firingFrames === this.stackInterval) {
                this.fire();
                this.firingFrames = 0;
                this.stackCounter++;
                if (this.stackCounter === this.stackLength) {
                    this.firing = false;
                }
            } else if (!this.firing && this.firingFrames === this.fireInterval) {
                this.firing = true;
                this.fire();
                this.stackCounter = 0;
                this.firingFrames = 0;
            }
            this.firingFrames++;
        }
        this.passedFrames++;
    }

    draw(p5: p5Types) {
        if (this.passedFrames - this.startDelay < this.duration) this.source.draw(p5);
    }

    fire() {
        let angleDivide = this.spreadAngle / this.spokeCount;
        for (let i = 0; i < this.spokeCount; i++) {
            this.source.fire();
            // console.log('fire');
            this.source.rotate(angleDivide);
        }
        this.source.resetAngle();
    }
}