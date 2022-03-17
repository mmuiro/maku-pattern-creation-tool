import React, {
    ReactElement,
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import Color from './maku-classes/Color';
import { Pattern } from './maku-classes/Pattern';
import EllipsePath from './maku-classes/EllipsePath';
import BezierPath from './maku-classes/BezierPath';
import StillPath from './maku-classes/StillPath';
import LinePath from './maku-classes/LinePath';
import Vec2D from './maku-classes/Vec2D';

interface CanvasProps {
    width: number;
    height: number;
}

const Canvas: React.FC<any> = (props: CanvasProps) => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);

    const canvasRef: RefObject<HTMLCanvasElement> =
        useRef<HTMLCanvasElement>(null);
    let animationRequestID: number;
    let lastFrameCheck: number;

    const getFrameRate = () => {
        let ret = performance.now() - lastFrameCheck;
        lastFrameCheck = performance.now();
        return 1000 / ret;
    };

    const setup = () => {
        //canvasRef.current!.width = canvasRef.current!.offsetWidth;
        //canvasRef.current!.height = canvasRef.current!.offsetHeight;
        patterns.push(
            new Pattern({
                fireInterval: 1,
                spokeCount: 6,
                initX: props.width / 2,
                initY: props.height / 2,
                bulletLowerSpeed: 6,
                bulletUpperSpeed: 8,
                bulletAccel: 0.05,
                bulletRadius: 6,
                bulletMaxSpeed: 8,
                initAngle: 0,
                rotationSpeed: 3,
                bulletLowerRotSpeed: 1.8,
                reverseRotPeriod: 120,
                smoothReversing: true,
                bulletLifeSpan: 120,
                color: new Color(0, 255, 0),
                stackLength: 1,
            })
        );
        patterns.push(
            new Pattern({
                fireInterval: 1,
                spokeCount: 6,
                initX: props.width / 2,
                initY: props.height / 2,
                bulletLowerSpeed: 6,
                bulletUpperSpeed: 8,
                bulletAccel: 0.05,
                bulletRadius: 6,
                bulletMaxSpeed: 8,
                initAngle: 0,
                rotationSpeed: -3,
                bulletLowerRotSpeed: -1.8,
                reverseRotPeriod: 120,
                smoothReversing: true,
                bulletLifeSpan: 120,
                color: new Color(0, 100, 155),
                stackLength: 1,
            })
        );
        patterns.push(
            new Pattern({
                fireInterval: 120,
                spokeCount: 120,
                initX: props.width / 2,
                initY: props.height / 2,
                bulletLowerSpeed: 6,
                bulletUpperSpeed: 8,
                bulletAccel: 0.05,
                bulletRadius: 6,
                bulletMaxSpeed: 8,
                initAngle: 0,
                rotationSpeed: -3,
                bulletLowerRotSpeed: 1.8,
                reverseRotPeriod: 120,
                smoothReversing: true,
                bulletLifeSpan: 120,
                color: new Color(200, 0, 200),
                stackLength: 1,
            })
        );
        /*
        let points = [];
        let controlPoints = [];
        for (let i = 0; i < 4; i++) {
            points.push(
                new Vec2D(
                    Math.random() * props.width,
                    Math.random() * props.height
                )
            );
            controlPoints.push(
                new Vec2D(
                    Math.random() * props.width,
                    Math.random() * props.height
                )
            );
        }
        patterns.push(
            new Pattern({
                fireInterval: 1,
                spokeCount: 5,
                initAngle: 0,
                initPos: new Vec2D(props.width / 2, props.height / 2),
                bulletLowerSpeed: 6,
                bulletUpperSpeed: 8,
                bulletAccel: -0.075,
                rotationSpeed: 0.1,
                color: new Color(
                    Math.ceil(Math.random() * 255),
                    Math.ceil(Math.random() * 255),
                    Math.ceil(Math.random() * 255)
                ),
                stackLength: 1,
                sourcePath: new BezierPath(points, controlPoints, 180),
            })
        );
        */
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let pattern of patterns) {
            pattern.draw(ctx);
            pattern.update(canvas);
        }
    };

    const update = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx = canvas!.getContext('2d')!;
        // console.clear();
        // console.log(getFrameRate());
        draw(ctx, canvas);
        animationRequestID = requestAnimationFrame(update);
    };

    useEffect(() => {
        setup();
        animationRequestID = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationRequestID);
    }, []); // alter it to change each time you update the update function (so whenever you modify patterns).

    return (
        <canvas
            id="main"
            ref={canvasRef}
            width={props.width}
            height={props.height}
            style={{
                width: '100%',
                height: '100%',
            }}
        />
    );
};

export default Canvas;
