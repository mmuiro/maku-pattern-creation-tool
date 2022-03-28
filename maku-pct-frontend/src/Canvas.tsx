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

type distanceChecker = (x: number, y: number) => boolean;
type updateFn = (dx: number, dy: number) => void;

interface CanvasProps {
    width: number;
    height: number;
    patterns: PatternArgs[];
    editorParamsList: PatternArgs[];
    editorMode: Boolean;
    applyEditorChanges: () => void;
}

interface Selectable {
    pos: Vec2D;
    near: distanceChecker;
    update: updateFn;
}

const Canvas: React.FC<any> = (props: CanvasProps) => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const { width, height, editorMode } = props;
    console.log(width, height);

    const canvasRef: RefObject<HTMLCanvasElement> =
        useRef<HTMLCanvasElement>(null);
    let animationRequestID: number;
    let lastFrameCheck: number;

    const viewToCanvasTransform = (
        x: number,
        y: number,
        xScale: number,
        yScale: number
    ): Vec2D => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        let x1 = xScale * (x - rect.left) - width / 2;
        let y1 = -yScale * (y - rect.top) + height / 2;
        return new Vec2D(x1, y1);
    };

    const makeNearChecker = useCallback(
        (item: Selectable, xScale: number, yScale: number) => {
            return (x: number, y: number) => {
                const mousePos = viewToCanvasTransform(x, y, xScale, yScale);
                return item.pos.distTo(mousePos) < 25;
            };
        },
        [viewToCanvasTransform]
    );

    const getSelectables = () => {
        const ret: Selectable[] = [];
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const xScale = width / rect.width;
        const yScale = height / rect.height;
        for (let params of props.editorParamsList) {
            const sourceItem: Selectable = {
                pos: new Vec2D(params.initX, params.initY),
                near: () => true,
                update: () => null,
            };
            sourceItem.near = makeNearChecker(sourceItem, xScale, yScale);
            sourceItem.update = (dx: number, dy: number) => {
                params.initX += xScale * dx;
                params.initY -= yScale * dy;
                sourceItem.pos = new Vec2D(params.initX, params.initY);
            };
            ret.push(sourceItem);
            if (params.pathType === pathType.Line) {
                for (let point of params.LPParams!.points) {
                    const item: Selectable = {
                        pos: point,
                        near: () => true,
                        update: () => null,
                    };
                    item.near = makeNearChecker(item, xScale, yScale);
                    item.update = (dx: number, dy: number) => {
                        point.x += xScale * dx;
                        point.y -= yScale * dy;
                    };
                    ret.push(item);
                }
            } else if (params.pathType === pathType.Bezier) {
                for (let point of params.BPParams!.points) {
                    const item: Selectable = {
                        pos: point,
                        near: () => true,
                        update: () => null,
                    };
                    item.near = makeNearChecker(item, xScale, yScale);
                    item.update = (dx: number, dy: number) => {
                        point.x += xScale * dx;
                        point.y -= yScale * dy;
                    };
                    ret.push(item);
                }
                for (let point of params.BPParams!.controlPoints) {
                    const item: Selectable = {
                        pos: point,
                        near: () => true,
                        update: () => null,
                    };
                    item.near = makeNearChecker(item, xScale, yScale);
                    item.update = (dx: number, dy: number) => {
                        point.x += xScale * dx;
                        point.y -= yScale * dy;
                    };
                    ret.push(item);
                }
            }
        }
        return ret;
    };

    const selectables = useRef<Selectable[]>([]);
    const selectedItem = useRef<Selectable | null>(null);
    const editorPatterns = useRef<Pattern[]>([]);

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

    const drawEditorFrame = useCallback(
        (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let pattern of editorPatterns.current) {
                pattern.editorDraw(ctx);
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
        return [x + width / 2, -y + height / 2];
    };

    const transformPosVec = (vec: Vec2D): Vec2D => {
        return new Vec2D(vec.x + width / 2, -vec.y + height / 2);
    };

    const paramsListToPatterns = useCallback(
        (paramsList: PatternArgs[]) => {
            return paramsList.map((params) => {
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
            });
        },
        [width, height]
    );

    useEffect(() => {
        setPatterns(paramsListToPatterns(props.patterns));
    }, [props.patterns, width, height, paramsListToPatterns]);

    useEffect(() => {
        editorPatterns.current = paramsListToPatterns(props.editorParamsList);
    }, [paramsListToPatterns]);

    const canvasEditorSetup = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        selectables.current = getSelectables();
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        drawEditorFrame(ctx, canvas);
    };

    const canvasEditorCleanup = () => {
        const canvas = canvasRef.current!;
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        console.log('boggers');
    };

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        console.log('clique');
        for (let item of selectables.current) {
            if (item.near(e.clientX, e.clientY)) {
                selectedItem.current = item;
                break;
            }
        }
        console.log(selectedItem.current);
    };

    const handleMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        selectedItem.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        e.preventDefault();
        if (selectedItem.current !== null) {
            selectedItem.current.update(e.movementX, e.movementY);
            editorPatterns.current = paramsListToPatterns(
                props.editorParamsList
            );
        }
        drawEditorFrame(ctx, canvas);
    };

    useEffect(() => {
        editorPatterns.current = paramsListToPatterns(props.editorParamsList);
    }, [props.editorParamsList]);

    useEffect(() => {
        selectables.current = getSelectables();
    }, [width, height]);

    useEffect(() => {
        if (editorMode) {
            canvasEditorSetup();
        } else {
            animationRequestID = requestAnimationFrame(update);
        }
        return () => {
            editorMode
                ? canvasEditorCleanup()
                : cancelAnimationFrame(animationRequestID);
        };
    }, [patterns, editorMode]);

    return (
        <canvas
            id="main"
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                width: '100%',
                height: '100%',
            }}
        />
    );
};

export default Canvas;
