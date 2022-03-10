import Color from './Color';
import Bullet from './Bullet';
import Path from './Path';
import Vec2D from './Vec2D';

export default class BulletSource {
    defaultAngle: number;
    angle: number; // in radians
    rotationSpeed: number; // radians per frame
    baseRotationSpeed: number;
    reverseRotPeriod: number;
    smoothReversing: Boolean;
    position: Vec2D;
    bulletColor: Color;
    bulletLowerSpeed: number;
    bulletUpperSpeed: number;
    bulletAccel: number;
    bulletRadius: number;
    bulletLowerRotSpeed: number;
    bulletUpperRotSpeed: number;
    bulletMaxAngleChange: number;
    bulletMaxSpeed: number;
    bulletMinSpeed: number;
    bulletLifespan: number;
    bulletStackLength: number;
    bullets: Bullet[];
    path: Path;
    framesPassed: number;
    pathPause: number;
    pauseFrames: number;
    paused: Boolean;

    constructor(
        initAngle: number,
        rotationSpeed: number,
        reverseRotPeriod: number,
        smoothReversing: Boolean,
        initPos: Vec2D,
        bulletColor: Color,
        bulletLowerSpeed: number,
        bulletUpperSpeed: number,
        bulletAccel: number,
        bulletRadius: number,
        bulletLowerRotSpeed: number,
        bulletUpperRotSpeed: number,
        bulletMaxAngleChange: number,
        bulletMaxSpeed: number,
        bulletMinSpeed: number,
        bulletLifespan: number,
        bulletStackLength: number,
        path: Path,
        pathPause: number
    ) {
        this.bullets = [];
        this.defaultAngle = initAngle;
        this.angle = initAngle;
        this.rotationSpeed = rotationSpeed;
        this.baseRotationSpeed = rotationSpeed;
        this.reverseRotPeriod = reverseRotPeriod;
        this.smoothReversing = smoothReversing;
        this.position = initPos;
        this.bulletColor = bulletColor;
        this.bulletLowerSpeed = bulletLowerSpeed;
        this.bulletUpperSpeed = bulletUpperSpeed;
        this.bulletMaxAngleChange = bulletMaxAngleChange;
        this.bulletAccel = bulletAccel;
        this.bulletRadius = bulletRadius;
        this.bulletLowerRotSpeed = bulletLowerRotSpeed;
        this.bulletUpperRotSpeed = bulletUpperRotSpeed;
        this.bulletMaxSpeed = bulletMaxSpeed;
        this.bulletMinSpeed = bulletMinSpeed;
        this.bulletLifespan = bulletLifespan;
        this.bulletStackLength = bulletStackLength;
        this.path = path;
        this.pathPause = pathPause;
        this.framesPassed = 0;
        this.pauseFrames = 0;
        this.paused = false;
    }

    update(canvas: HTMLCanvasElement) {
        this.bullets.forEach((bullet: Bullet) => {
            bullet.update();
        });
        this.bullets = this.bullets.filter((bullet: Bullet) => {
            return (
                bullet.pos.x >= 0 &&
                bullet.pos.x <= canvas.width &&
                bullet.pos.y >= 0 &&
                bullet.pos.y <= canvas.height &&
                bullet.framesPassed < bullet.lifespan
            );
        });
        if (!this.paused) {
            this.position = this.path.getCoordsAt(this.framesPassed);
            this.rotate(this.rotationSpeed);
            this.defaultAngle += this.rotationSpeed;
            this.framesPassed++;
            if (this.smoothReversing) {
                this.rotationSpeed =
                    this.baseRotationSpeed *
                    Math.sin(
                        (this.framesPassed / this.reverseRotPeriod) * Math.PI
                    );
            } else if (this.framesPassed % this.reverseRotPeriod === 0) {
                this.rotationSpeed *= -1;
            }
            if (
                this.framesPassed % this.path.period === 0 &&
                this.pathPause > 0
            ) {
                this.paused = true;
            }
        } else {
            this.pauseFrames++;
            if (this.pauseFrames === this.pathPause) {
                this.pauseFrames = 0;
                this.paused = false;
            }
        }
    }

    rotate(rotationAngel: number) {
        this.angle += rotationAngel;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.bullets.forEach((bullet: Bullet) => {
            bullet.draw(ctx);
        });
        // this.path.draw(ctx);
    }

    fire() {
        let speedInc =
            (this.bulletUpperSpeed - this.bulletLowerSpeed) /
            this.bulletStackLength;
        let rotSpeedInc =
            (this.bulletUpperRotSpeed - this.bulletLowerRotSpeed) /
            this.bulletStackLength;
        for (let i = 0; i < this.bulletStackLength; i++) {
            let speed = this.bulletLowerSpeed + i * speedInc;
            let rotSpeed = this.bulletLowerRotSpeed + i * rotSpeedInc; // needs change to be like speed
            this.bullets.push(
                new Bullet(
                    this.bulletColor,
                    this.position.copy(),
                    speed,
                    this.bulletAccel,
                    this.angle,
                    rotSpeed,
                    this.bulletMaxAngleChange,
                    this.bulletRadius,
                    this.bulletMaxSpeed,
                    this.bulletMinSpeed,
                    this.bulletLifespan
                )
            );
        }
    }

    resetAngle() {
        this.angle = this.defaultAngle;
    }
}
