import BulletSource from './BulletSource';
import Color from './Color';
import Path from './Path';
import StillPath from './StillPath';
import Vec2D from './Vec2D';

const DEFAULT_RADIUS: number = 5;
const DEFAULT_MAX_SPEED: number = 20;
const DEFAULT_MIN_SPEED: number = 0;
const DEFAULT_SPREAD_ANGLE: number = 6.28318530717958647693;
const DEFAULT_DURATION: number = Infinity;
const DEFAULT_START_DELAY: number = 0;
const DEFAULT_STACK_LENGTH: number = 1;
const DEFAULT_LIFESPAN: number = 120;
const DEFAULT_ANGLE: number = 0;
const DEFAULT_PATH_PAUSE: number = 0;
const DEFAULT_BULLET_ROT_SPEED: number = 0;
const DEFAULT_REVERSE_ROT_PER: number = Infinity;
const DEFAULT_SMOOTH_REV: Boolean = false;
const DEFAULT_BULLET_MAX_ANGLE_CHANGE = Infinity;

interface PatternArgs {
    startDelay?: number;
    fireInterval: number;
    duration?: number;
    stackLength?: number;
    spokeCount: number;
    initAngle?: number;
    initPos: Vec2D;
    bulletLowerSpeed: number;
    bulletUpperSpeed?: number;
    bulletAccel: number;
    rotationSpeed: number;
    reverseRotPeriod?: number;
    smoothReversing?: Boolean;
    spreadAngle?: number;
    color: Color;
    bulletRadius?: number;
    bulletLowerRotSpeed?: number;
    bulletUpperRotSpeed?: number;
    bulletMaxAngleChange?: number;
    bulletMaxSpeed?: number;
    bulletMinSpeed?: number;
    bulletLifeSpan?: number;
    sourcePath?: Path;
    pathPause?: number;
}

export default class Pattern {
    // all "time" measurements are in frames
    source: BulletSource;
    startDelay: number;
    duration: number;
    fireInterval: number;
    passedFrames: number;
    spokeCount: number;
    spreadAngle: number;
    firingFrames: number;

    constructor(args: PatternArgs) {
        if (!args.startDelay) args.startDelay = DEFAULT_START_DELAY;
        if (!args.stackLength) args.stackLength = DEFAULT_STACK_LENGTH;
        if (!args.duration) args.duration = DEFAULT_DURATION;
        if (!args.spreadAngle) args.spreadAngle = DEFAULT_SPREAD_ANGLE;
        if (!args.bulletRadius) args.bulletRadius = DEFAULT_RADIUS;
        if (!args.bulletMaxSpeed) args.bulletMaxSpeed = DEFAULT_MAX_SPEED;
        if (!args.bulletMinSpeed) args.bulletMinSpeed = DEFAULT_MIN_SPEED;
        if (!args.bulletLifeSpan) args.bulletLifeSpan = DEFAULT_LIFESPAN;
        if (!args.initAngle) args.initAngle = DEFAULT_ANGLE;
        if (!args.bulletUpperSpeed)
            args.bulletUpperSpeed = args.bulletLowerSpeed;
        if (!args.pathPause) args.pathPause = DEFAULT_PATH_PAUSE;
        if (!args.bulletLowerRotSpeed)
            args.bulletLowerRotSpeed = DEFAULT_BULLET_ROT_SPEED;
        if (!args.bulletUpperRotSpeed)
            args.bulletUpperRotSpeed = args.bulletLowerRotSpeed;
        if (!args.reverseRotPeriod)
            args.reverseRotPeriod = DEFAULT_REVERSE_ROT_PER;
        if (!args.smoothReversing) args.smoothReversing = DEFAULT_SMOOTH_REV;
        if (!args.bulletMaxAngleChange)
            args.bulletMaxAngleChange = DEFAULT_BULLET_MAX_ANGLE_CHANGE;
        if (!args.sourcePath) {
            args.sourcePath = new StillPath(args.initPos.copy(), Infinity);
        }
        this.passedFrames = 0;
        this.startDelay = args.startDelay;
        this.duration = args.duration;
        this.fireInterval = args.fireInterval;
        this.spokeCount = args.spokeCount;
        this.spreadAngle = args.spreadAngle;
        this.firingFrames = 0;
        this.source = new BulletSource(
            args.initAngle,
            args.rotationSpeed,
            args.reverseRotPeriod,
            args.smoothReversing,
            args.initPos,
            args.color,
            args.bulletLowerSpeed,
            args.bulletUpperSpeed,
            args.bulletAccel,
            args.bulletRadius,
            args.bulletLowerRotSpeed,
            args.bulletUpperRotSpeed,
            args.bulletMaxAngleChange,
            args.bulletMaxSpeed,
            args.bulletMinSpeed,
            args.bulletLifeSpan,
            args.stackLength,
            args.sourcePath,
            args.pathPause
        );
    }

    update(canvas: HTMLCanvasElement) {
        if (this.passedFrames >= this.startDelay) {
            this.source.update(canvas);
            if (!this.source.paused) {
                if (this.firingFrames === 0) this.fire();
                this.firingFrames = (this.firingFrames + 1) % this.fireInterval;
            }
        }
        this.passedFrames++;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.passedFrames - this.startDelay < this.duration)
            this.source.draw(ctx);
    }

    fire() {
        let angleDivide =
            this.spokeCount > 1
                ? this.spreadAngle /
                  ((this.spreadAngle % 2) * Math.PI === 0
                      ? this.spokeCount - 1
                      : this.spokeCount)
                : 0;
        for (let i = 0; i < this.spokeCount; i++) {
            this.source.fire();
            this.source.rotate(angleDivide);
        }
        this.source.resetAngle();
    }
}
