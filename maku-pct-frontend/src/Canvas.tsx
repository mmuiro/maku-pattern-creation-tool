import React, {
    ReactElement,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Pattern, PatternArgs } from './maku-classes/Pattern';

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
        console.log(getFrameRate());
        draw(ctx, canvas);
        animationRequestID = requestAnimationFrame(update);
    };

    /*useEffect(() => {
        console.log(props.patterns);
        setPatterns(() =>
            props.patterns.map((params) => {
                let updatedParams: PatternArgs = {
                    ...params,
                    initX: params.initX + props.width / 2,
                    initY: params.initY + props.height / 2,
                };
                return new Pattern(updatedParams);
            })
        );
    }, [props.patterns, props.width, props.height]);*/

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
