import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import Pattern from "./maku-classes/Pattern";
import EllipsePath from "./maku-classes/EllipsePath";
import BezierPath from "./maku-classes/BezierPath";

interface CanvasProps {
    // figure out props
}

const Canvas: React.FC<any> = () => {
    // we don't need to use states when dealing with anything the sketch handles itself.
    let patterns: Pattern[];
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.disableFriendlyErrors = true;
        p5.createCanvas(800, 800).parent(canvasParentRef);
        p5.angleMode(p5.RADIANS);
        patterns = [];
        patterns.push(new Pattern({
            fireInterval: 1,
            stackInterval: 2,
            spokeCount: 5,
            initAngle: 0,
            initPos: p5.createVector(p5.width / 2, p5.height / 2),
            bulletSpeed: 8,
            bulletAccel: -0.075,
            rotationSpeed: (p5.TWO_PI) / 240,
            color: p5.color(0, 255, 0),
            stackLength: 4
        }));
        patterns.push(new Pattern({
            fireInterval: 1,
            stackInterval: 2,
            spokeCount: 5,
            initAngle: 0,
            initPos: p5.createVector(p5.width / 2, p5.height / 2),
            bulletSpeed: 8,
            bulletAccel: -0.075,
            rotationSpeed: -(p5.TWO_PI) / 240,
            color: p5.color(0, 255, 255),
            stackLength: 4
        }));
        let points = [];
        let controlPoints = [];
        for (let i = 0; i < 5; i++) {
            points.push(p5.createVector(Math.random() * p5.width, Math.random() * p5.height));
            controlPoints.push(p5.createVector(Math.random() * p5.width, Math.random() * p5.height));
        }
        patterns.push(new Pattern({
            fireInterval: 60,
            stackInterval: 1,
            spokeCount: 60,
            initAngle: 0,
            initPos: p5.createVector(p5.width / 2, p5.height / 2),
            bulletSpeed: 8,
            bulletAccel: -0.075,
            rotationSpeed: 0,
            color: p5.color(255, 0, 255),
            stackLength: 2,
            sourcePath: new BezierPath(points, controlPoints, 120)
        }));
    }

    const draw = (p5: p5Types) => {
        p5.background(p5.color(0, 0, 0));
        patterns.forEach((pattern: Pattern) => {
            pattern.draw(p5);
            pattern.update(p5);
        });
        p5.frameRate(60);
        // console.log(patterns[0].source.bullets.length);
    }


    return <Sketch setup={setup} draw={draw} />;
}

export default Canvas;