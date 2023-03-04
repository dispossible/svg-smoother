export interface Point {
    x: number;
    y: number;
}

export interface RawSVGCommand {
    rawCommand: string;
    values: number[];
    operation: SVGOperation;
    relative: boolean;
}

export enum SVGOperation {
    MOVE = "M",
    LINE = "L",
    HORIZONTAL = "H",
    VERTICAL = "V",
    CUBIC = "C",
    SMOOTH_CUBIC = "S",
    QUADRATIC = "Q",
    SMOOTH_QUADRATIC = "T",
    ARC = "A",
    CLOSE = "Z",
}

export interface MoveSVGCommand extends RawSVGCommand {
    operation: SVGOperation.MOVE;
    end: Point;
}

export interface LineSVGCommand extends RawSVGCommand {
    operation: SVGOperation.LINE;
    end: Point;
}

export interface HorizontalSVGCommand extends RawSVGCommand {
    operation: SVGOperation.HORIZONTAL;
    x: number;
}

export interface VerticalSVGCommand extends RawSVGCommand {
    operation: SVGOperation.VERTICAL;
    y: number;
}

export interface CubicSVGCommand extends RawSVGCommand {
    operation: SVGOperation.CUBIC;
    controlPointA: Point;
    controlPointB: Point;
    end: Point;
}

export interface SmoothCubicSVGCommand extends RawSVGCommand {
    operation: SVGOperation.SMOOTH_CUBIC;
    controlPoint: Point;
    end: Point;
}

export interface QuadraticSVGCommand extends RawSVGCommand {
    operation: SVGOperation.QUADRATIC;
    controlPoint: Point;
    end: Point;
}

export interface SmoothQuadraticSVGCommand extends RawSVGCommand {
    operation: SVGOperation.SMOOTH_QUADRATIC;
    end: Point;
}

export interface ArcSVGCommand extends RawSVGCommand {
    operation: SVGOperation.ARC;
    radiusX: number;
    radiusY: number;
    angle: number;
    largeArc: boolean;
    sweep: boolean;
    end: Point;
}

export interface CloseSVGCommand extends RawSVGCommand {
    operation: SVGOperation.CLOSE;
}

export type ParsedSVGCommand =
    | MoveSVGCommand
    | LineSVGCommand
    | HorizontalSVGCommand
    | VerticalSVGCommand
    | CubicSVGCommand
    | SmoothCubicSVGCommand
    | QuadraticSVGCommand
    | SmoothQuadraticSVGCommand
    | ArcSVGCommand
    | CloseSVGCommand;
