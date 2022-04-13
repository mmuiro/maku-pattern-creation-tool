import React, {
    ReactElement,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    pathType,
    Pattern,
    PatternArgs,
    PointStringPair,
} from '../maku-classes/Pattern';
import Vec2D from '../maku-classes/Vec2D';
import { createDebouncedFunction } from '../utils/utils';
import { StringMap } from '../views/EditorPage';

type distanceChecker = (x: number, y: number) => boolean;
type updateFn = (dx: number, dy: number) => void;

interface CanvasProps {
    width: number;
    height: number;
    patterns: PatternArgs[];
    editorParamsList: PatternArgs[];
    editorParamsAsStringsList: StringMap[];
    editorMode: Boolean;
    updater: Function;
}

interface Selectable {
    pos: Vec2D;
    near: distanceChecker;
    radius: number;
    update: updateFn;
}

const Canvas: React.FC<any> = (props: CanvasProps) => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const { width, height, editorMode, updater } = props;

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
        return new Vec2D(Math.round(x1), Math.round(y1));
    };

    const makeNearChecker = useCallback(
        (item: Selectable, xScale: number, yScale: number) => {
            return (x: number, y: number) => {
                const mousePos = viewToCanvasTransform(x, y, xScale, yScale);
                return item.pos.distTo(mousePos) < item.radius;
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
        for (let i in props.editorParamsList) {
            let [params, paramsAsStrings] = [
                props.editorParamsList[i],
                props.editorParamsAsStringsList[i],
            ];
            const sourceItem: Selectable = {
                pos: new Vec2D(params.initX, params.initY),
                radius: 15,
                near: () => true,
                update: () => null,
            };
            sourceItem.near = makeNearChecker(sourceItem, xScale, yScale);
            sourceItem.update = (x: number, y: number) => {
                const mousePos = viewToCanvasTransform(x, y, xScale, yScale);
                [params.initX, params.initY] = [mousePos.x, mousePos.y];
                [paramsAsStrings.initX, paramsAsStrings.initY] = [
                    String(mousePos.x),
                    String(mousePos.y),
                ];
                sourceItem.pos = mousePos;
            };
            ret.push(sourceItem);
            let allPoints: PointStringPair[];
            if (params.pathType === pathType.Line) {
                allPoints = params.LPParams!.pairs;
            } else if (params.pathType === pathType.Bezier) {
                allPoints = [
                    ...params.BPParams!.pairs,
                    ...params.BPParams!.controlPairs,
                ];
            }
            if (typeof allPoints! !== 'undefined') {
                for (let pair of allPoints) {
                    const { point, pointAS } = pair;
                    const item: Selectable = {
                        pos: point,
                        radius: 12,
                        near: () => true,
                        update: () => null,
                    };
                    item.near = makeNearChecker(item, xScale, yScale);
                    item.update = (x: number, y: number) => {
                        const mousePos = viewToCanvasTransform(
                            x,
                            y,
                            xScale,
                            yScale
                        );
                        [point.x, point.y] = [mousePos.x, mousePos.y];
                        [pointAS.x, pointAS.y] = [
                            String(mousePos.x),
                            String(mousePos.y),
                        ];
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
                        updatedParams.LPParams.pairs =
                            updatedParams.LPParams.pairs.map((pair) => {
                                const npoint = transformPosVec(pair.point);
                                return {
                                    point: npoint,
                                    pointAS: {
                                        x: String(npoint.x),
                                        y: String(npoint.y),
                                    },
                                };
                            });
                        break;
                    case pathType.Bezier:
                        updatedParams.BPParams = { ...params.BPParams! };
                        updatedParams.BPParams.pairs =
                            updatedParams.BPParams.pairs.map((pair) => {
                                const npoint = transformPosVec(pair.point);
                                return {
                                    point: npoint,
                                    pointAS: {
                                        x: String(npoint.x),
                                        y: String(npoint.y),
                                    },
                                };
                            });
                        updatedParams.BPParams.controlPairs =
                            updatedParams.BPParams.controlPairs.map((pair) => {
                                const npoint = transformPosVec(pair.point);
                                return {
                                    point: npoint,
                                    pointAS: {
                                        x: String(npoint.x),
                                        y: String(npoint.y),
                                    },
                                };
                            });
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
        editorPatterns.current = paramsListToPatterns(props.editorParamsList);
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
    };

    const debouncedParamUpdater = useCallback(
        createDebouncedFunction(updater, 100),
        [updater, createDebouncedFunction]
    );

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        for (let item of selectables.current) {
            if (item.near(e.clientX, e.clientY)) {
                selectedItem.current = item;
                break;
            }
        }
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
            selectedItem.current.update(e.clientX, e.clientY);
            editorPatterns.current = paramsListToPatterns(
                props.editorParamsList
            );
            debouncedParamUpdater();
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
