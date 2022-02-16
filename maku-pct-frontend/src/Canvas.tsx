import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import Pattern from "./maku-classes/Pattern";
import EllipsePath from "./maku-classes/EllipsePath";
import BezierPath from "./maku-classes/BezierPath";
import Vec2D from "./maku-classes/Vec2D";
import StillPath from "./maku-classes/StillPath";

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
            spokeCount: 6,
            initPos: new Vec2D(p5.width / 2, p5.height / 2),
            bulletLowerSpeed: 8,
            bulletAccel: -0.05,
            bulletRadius: 8,
            initAngle: p5.HALF_PI,
            rotationSpeed: 0.05,
            bulletLifeSpan: 120,
            color: p5.color(0, 255, 0),
        }));
        /* let points = [];
        let controlPoints = [];
        for (let k = 0; k < 5; k++) {
            points = [];
            controlPoints = [];
            for (let i = 0; i < 8; i++) {
                points.push(new Vec2D(Math.random() * p5.width, Math.random() * p5.height));
                controlPoints.push(new Vec2D(Math.random() * p5.width, Math.random() * p5.height));
            }
            patterns.push(new Pattern({
                startDelay: Math.floor(Math.random() * 60),
                fireInterval: 60,
                spokeCount: 20,
                initAngle: 0,
                initPos: new Vec2D(p5.width / 2, p5.height / 2),
                bulletLowerSpeed: 6,
                bulletUpperSpeed: 8,
                bulletAccel: -0.075,
                rotationSpeed: 0.1,
                color: p5.color(Math.ceil(Math.random() * 255), 
                                Math.ceil(Math.random() * 255), 
                                Math.ceil(Math.random() * 255)),
                stackLength: 4,
                sourcePath: new BezierPath(points, controlPoints, 180, p5)
            }));
        }*/
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