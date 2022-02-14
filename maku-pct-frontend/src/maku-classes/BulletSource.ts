import p5Types from "p5";
import Bullet from "./Bullet";

export default class BulletSource {
    defaultAngle: number;
    angle: number; // in radians
    rotationSpeed: number; // radians per frame
    position: p5Types.Vector;
    bulletColor: p5Types.Color;
    bulletSpeed: number;
    bulletAccel: number;
    bulletRadius: number;
    bulletMaxSpeed: number;
    bulletMinSpeed: number;
    bullets: Bullet[];
    
    constructor(initAngle: number,
                rotationSpeed: number,
                initPos: p5Types.Vector,
                bulletColor: p5Types.Color,
                bulletSpeed: number,
                bulletAccel: number,
                bulletRadius: number,
                bulletMaxSpeed: number,
                bulletMinSpeed: number) {
        this.bullets = [];
        this.defaultAngle = initAngle;
        this.angle = initAngle;
        this.rotationSpeed = rotationSpeed;
        this.position = initPos;
        this.bulletColor = bulletColor;
        this.bulletSpeed = bulletSpeed;
        this.bulletAccel = bulletAccel;
        this.bulletRadius = bulletRadius;
        this.bulletMaxSpeed = bulletMaxSpeed;
        this.bulletMinSpeed = bulletMinSpeed;
        console.log(this);
    }

    update(p5: p5Types) {
        this.bullets.forEach((bullet: Bullet) => {
            // console.log(bullet);
            bullet.update(p5);
        });
        this.bullets = this.bullets.filter((bullet: Bullet) => {
            return (bullet.pos.x >= 0 && bullet.pos.x <= p5.width)
            && (bullet.pos.y >= 0 && bullet.pos.y <= p5.height);
        });
        this.rotate(this.rotationSpeed);
        this.defaultAngle += this.rotationSpeed;
    }

    rotate(rotationAngel: number) {
        this.angle += rotationAngel;
    }

    draw(p5: p5Types) {
        this.bullets.forEach((bullet: Bullet) => {
            bullet.draw(p5);
        });
    }

    fire() {
        this.bullets.push(new Bullet(this.bulletColor, 
                        this.position.copy(),
                        this.bulletSpeed,
                        this.bulletAccel,
                        this.angle,
                        this.bulletRadius,
                        this.bulletMaxSpeed,
                        this.bulletMinSpeed));
    }

    resetAngle() {
        this.angle = this.defaultAngle;
    }
}