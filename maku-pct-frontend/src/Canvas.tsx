import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import Bullet from "./maku-classes/Bullet";

interface CanvasProps {
    // figure out props
}

const Canvas: React.FC<any> = () => {
    // we don't need to use states when dealing with anything the sketch handles itself.
    let bullets: Bullet[];
    let width: number;
    let height: number;
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        p5.angleMode(p5.RADIANS);
        width = p5.windowWidth;
        height = p5.windowHeight;
        bullets = [];
    }

    const draw = (p5: p5Types) => {
        p5.background(p5.color(0, 0, 0));
        bullets.push(new Bullet(
            p5.color(0, 255, 89),
            p5.createVector(width / 2, height / 2),
            10,
            -0.05,
            p5.atan2(p5.mouseY - (height / 2), p5.mouseX - (width / 2))));
        bullets.forEach((bullet: Bullet) => {
            bullet.update(p5);
            bullet.draw(p5);
        });
        bullets = bullets.filter((bullet: Bullet) => checkInBounds(bullet));
        console.log(bullets.length);
    }

    const checkInBounds = (bullet: Bullet) => {
        return (0 <= bullet.pos.x && bullet.pos.x <= width) 
        && (0 <= bullet.pos.y && bullet.pos.y <= height);
    }

    return <Sketch setup={setup} draw={draw} />;
}

export default Canvas;