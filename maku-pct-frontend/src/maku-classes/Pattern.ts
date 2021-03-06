import React from 'react';
import { StringMap } from '../views/EditorPage';
import BezierPath from './BezierPath';
import BulletSource from './BulletSource';
import Color from './Color';
import EllipsePath from './EllipsePath';
import LinePath from './LinePath';
import Path from './Path';
import StillPath from './StillPath';
import Vec2D from './Vec2D';

export enum pathType {
    None = 'None',
    Ellipse = 'Ellipse',
    Line = 'Line',
    Bezier = 'Bezier',
}

export interface PathParams {
    pause: number;
    period: number;
}

export interface SVec2D {
    x: string;
    y: string;
}

export interface PointStringPair {
    point: Vec2D;
    pointAS: SVec2D;
}

export interface EPParams extends PathParams {
    xAxis: number;
    yAxis: number;
    centerX: number;
    centerY: number;
    direction: number;
}

export interface LPParams extends PathParams {
    pairs: PointStringPair[];
    idList: number[];
}

export interface BPParams extends PathParams {
    pairs: PointStringPair[];
    controlPairs: PointStringPair[];
    idList: number[];
}

export interface PatternArgs {
    startDelay: number;
    fireInterval: number;
    duration: number;
    stackLength: number;
    spokeCount: number;
    initAngle: number;
    initX: number;
    initY: number;
    bulletLowerSpeed: number;
    bulletUpperSpeed: number;
    bulletAccel: number;
    rotationSpeed: number;
    reverseRotPeriod: number;
    smoothReversing: Boolean;
    spreadAngle: number;
    color: Color;
    bulletRadius: number;
    bulletLowerRotSpeed: number;
    bulletUpperRotSpeed: number;
    bulletMaxAngleChange: number;
    bulletMaxSpeed: number;
    bulletMinSpeed: number;
    bulletLifeSpan: number;
    pathType: pathType;
    EPParams?: EPParams;
    LPParams?: LPParams;
    BPParams?: BPParams;
    PParamsAsStrings?: { [s: string]: any }; // replace with appropriate type later
    sourcePath?: Path;
    pathPause?: number;
    [key: string]:
        | number
        | Color
        | Path
        | Boolean
        | Vec2D
        | pathType
        | PathParams
        | { [s: string]: any }
        | string
        | undefined;
}

export const DEFAULTS: PatternArgs = {
    // default pattern arguments, representing a normal ring burst.
    startDelay: 0,
    fireInterval: 60,
    duration: Infinity,
    stackLength: 1,
    spokeCount: 20,
    initAngle: 0,
    initX: 0,
    initY: 0,
    bulletLowerSpeed: 5,
    bulletUpperSpeed: 5,
    bulletAccel: 0,
    bulletMinSpeed: -Infinity,
    bulletMaxSpeed: Infinity,
    rotationSpeed: 0,
    reverseRotPeriod: Infinity,
    smoothReversing: false,
    spreadAngle: 360,
    color: new Color(28, 221, 255),
    bulletRadius: 6,
    bulletLowerRotSpeed: 0,
    bulletUpperRotSpeed: 0,
    bulletMaxAngleChange: Infinity,
    bulletLifeSpan: Infinity,
    pathType: pathType.None,
};

const ANGLE_PARAMS = [
    'initAngle',
    'rotationSpeed',
    'spreadAngle',
    'bulletLowerRotSpeed',
    'bulletUpperRotSpeed',
    'bulletMaxAngleChange',
];

export class Pattern {
    // all "time" measurements are in frames
    source: BulletSource;
    startDelay: number;
    duration: number;
    fireInterval: number;
    passedFrames: number;
    spokeCount: number;
    spreadAngle: number;
    firingFrames: number;

    constructor(args: Partial<PatternArgs>) {
        let updatedArgs: PatternArgs = { ...DEFAULTS, ...args };
        let pathParams, points;
        switch (updatedArgs.pathType) {
            case pathType.Ellipse:
                pathParams = updatedArgs.EPParams!;
                updatedArgs.sourcePath = new EllipsePath(
                    new Vec2D(pathParams.centerX, pathParams.centerY),
                    pathParams.xAxis,
                    pathParams.yAxis,
                    pathParams.period,
                    pathParams.direction
                );
                updatedArgs.pathPause = pathParams.pause;
                break;
            case pathType.Line:
                pathParams = updatedArgs.LPParams!;
                points = pathParams.pairs.map((pair) => pair.point);
                updatedArgs.sourcePath = new LinePath(
                    points,
                    pathParams.period
                );
                updatedArgs.pathPause = pathParams.pause;
                break;
            case pathType.Bezier:
                pathParams = updatedArgs.BPParams!;
                points = pathParams.pairs.map((pair) => pair.point);
                const controlPoints = pathParams.controlPairs.map(
                    (pair) => pair.point
                );
                updatedArgs.sourcePath = new BezierPath(
                    points,
                    controlPoints,
                    pathParams.period
                );
                updatedArgs.pathPause = pathParams.pause;
                break;
            default:
                updatedArgs.sourcePath = new StillPath(
                    new Vec2D(updatedArgs.initX, updatedArgs.initY),
                    Infinity
                );
                updatedArgs.pathPause = 0;
        }
        for (let param of ANGLE_PARAMS) {
            updatedArgs[param] = (Number(updatedArgs[param]) * Math.PI) / 180;
        }
        this.passedFrames = 0;
        this.startDelay = updatedArgs.startDelay!;
        this.duration = updatedArgs.duration!;
        this.fireInterval = updatedArgs.fireInterval;
        this.spokeCount = updatedArgs.spokeCount;
        this.spreadAngle = updatedArgs.spreadAngle;
        this.firingFrames = 0;
        this.source = new BulletSource(
            updatedArgs.initAngle,
            updatedArgs.rotationSpeed,
            updatedArgs.reverseRotPeriod,
            updatedArgs.smoothReversing,
            new Vec2D(updatedArgs.initX, updatedArgs.initY),
            updatedArgs.color,
            updatedArgs.bulletLowerSpeed,
            updatedArgs.bulletUpperSpeed,
            updatedArgs.bulletAccel,
            updatedArgs.bulletRadius,
            updatedArgs.bulletLowerRotSpeed,
            updatedArgs.bulletUpperRotSpeed,
            updatedArgs.bulletMaxAngleChange,
            updatedArgs.bulletMaxSpeed,
            updatedArgs.bulletMinSpeed,
            updatedArgs.bulletLifeSpan,
            updatedArgs.stackLength,
            updatedArgs.sourcePath,
            updatedArgs.pathPause
        );
    }

    update(canvas: HTMLCanvasElement) {
        if (this.passedFrames >= this.startDelay) {
            this.source.update(canvas);
            if (
                !this.source.paused &&
                this.passedFrames - this.startDelay < this.duration
            ) {
                if (this.firingFrames === 0) this.fire();
                this.firingFrames = (this.firingFrames + 1) % this.fireInterval;
            }
        }
        this.passedFrames++;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.source.draw(ctx);
    }

    editorDraw(ctx: CanvasRenderingContext2D) {
        this.source.editorDraw(ctx);
    }

    fire() {
        let angleDivide =
            this.spokeCount > 1
                ? this.spreadAngle /
                  ((this.spreadAngle % 2) * Math.PI === 0
                      ? this.spokeCount - 1
                      : this.spokeCount)
                : 0;
        for (let i = 0; i < this.spokeCount; i++) {
            this.source.fire();
            this.source.rotate(angleDivide);
        }
        this.source.resetAngle();
    }
}
