import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import Pattern from "./maku-classes/Pattern";

interface CanvasProps {
    // figure out props
}

const Canvas: React.FC<any> = () => {
    // we don't need to use states when dealing with anything the sketch handles itself.
    let patterns: Pattern[];
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.disableFriendlyErrors = true;
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        p5.angleMode(p5.RADIANS);
        patterns = [];
        patterns.push(new Pattern({
            fireInterval: 10,
            stackInterval: 1,
            spokeCount: 5,
            initAngle: 0,
            initPos: p5.createVector(p5.windowWidth / 2, p5.windowHeight / 2),
            bulletSpeed: 8,
            bulletAccel: -0.05,
            rotationSpeed: (p5.TWO_PI) / 60,
            color: p5.color(0, 255, 0)
        }));
        patterns.push(new Pattern({
            fireInterval: 10,
            stackInterval: 1,
            spokeCount: 5,
            initAngle: 0,
            initPos: p5.createVector(p5.windowWidth / 2, p5.windowHeight / 2),
            bulletSpeed: 8,
            bulletAccel: -0.05,
            rotationSpeed: -(p5.TWO_PI) / 60,
            color: p5.color(0, 255, 255)
        }));
    }

    const draw = (p5: p5Types) => {
        p5.background(p5.color(0, 0, 0));
        patterns.forEach((pattern: Pattern) => {
            pattern.draw(p5);
            pattern.update(p5);
        });
        // console.log(patterns[0].source.bullets.length);
    }


    return <Sketch setup={setup} draw={draw} />;
}

export default Canvas;