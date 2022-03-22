import React, {
    ReactElement,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { pathType, Pattern, PatternArgs } from './maku-classes/Pattern';
import Vec2D from './maku-classes/Vec2D';

interface CanvasProps {
    width: number;
    height: number;
    patterns: PatternArgs[];
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

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let pattern of patterns) {
                pattern.draw(ctx);
                pattern.update(canvas);
            }
        },
        [patterns]
    );

    const update = () => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx = canvas!.getContext('2d')!;
        // console.log(getFrameRate());
        draw(ctx, canvas);
        animationRequestID = requestAnimationFrame(update);
    };

    const transformPos = (x: number, y: number): number[] => {
        return [x + props.width / 2, -y + props.height / 2];
    };

    const transformPosVec = (vec: Vec2D): Vec2D => {
        return new Vec2D(vec.x + props.width / 2, -vec.y + props.height / 2);
    };

    useEffect(() => {
        console.log(props.patterns);
        setPatterns(() =>
            props.patterns.map((params) => {
                let updatedParams: PatternArgs = {
                    ...params,
                };
                [updatedParams.initX, updatedParams.initY] = transformPos(
                    updatedParams.initX,
                    updatedParams.initY
                );
                switch (updatedParams.pathType) {
                    case pathType.Ellipse:
                        updatedParams.EPParams = { ...params.EPParams! };
                        [
                            updatedParams.EPParams!.centerX,
                            updatedParams.EPParams!.centerY,
                        ] = transformPos(
                            updatedParams.EPParams!.centerX,
                            updatedParams.EPParams!.centerY
                        );
                        break;
                    case pathType.Line:
                        updatedParams.LPParams = { ...params.LPParams! };
                        updatedParams.LPParams.points =
                            updatedParams.LPParams.points.map((point) =>
                                transformPosVec(point)
                            );
                        break;
                    case pathType.Bezier:
                        updatedParams.BPParams = { ...params.BPParams! };
                        updatedParams.BPParams.points =
                            updatedParams.BPParams.points.map((point) =>
                                transformPosVec(point)
                            );
                        updatedParams.BPParams.controlPoints =
                            updatedParams.BPParams.controlPoints.map((point) =>
                                transformPosVec(point)
                            );
                        break;
                }
                return new Pattern(updatedParams);
            })
        );
    }, [props.patterns, props.width, props.height]);

    useEffect(() => {
        animationRequestID = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationRequestID);
    }, [patterns]);

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
