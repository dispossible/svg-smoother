import {
    ArcSVGCommand,
    CloseSVGCommand,
    CubicSVGCommand,
    LineSVGCommand,
    MoveSVGCommand,
    ParsedSVGCommand,
    QuadraticSVGCommand,
    SmoothCubicSVGCommand,
    SmoothQuadraticSVGCommand,
    SVGOperation,
} from "../domain";
import { equalPoint } from "../utils/math";

type NonLinearSVGCommand =
    | MoveSVGCommand
    | LineSVGCommand
    | CubicSVGCommand
    | SmoothCubicSVGCommand
    | QuadraticSVGCommand
    | SmoothQuadraticSVGCommand
    | ArcSVGCommand
    | CloseSVGCommand;

/**
 * This function requires all commands passed to be absolute.
 * It also doesn't handle sub paths, only pass in single paths
 */
export function removeLinearCommands(commands: ParsedSVGCommand[]): NonLinearSVGCommand[] {
    let currentPoint = {
        x: 0,
        y: 0,
    };

    const clearedCommands = commands.map((command) => {
        if (command.relative) {
            throw new Error("Unable to remove linear commands from a sequence that includes relative moves");
        }

        switch (command.operation) {
            case SVGOperation.HORIZONTAL: {
                command = {
                    operation: SVGOperation.LINE,
                    rawCommand: "",
                    values: [],
                    relative: false,
                    end: {
                        x: command.x,
                        y: currentPoint.y,
                    },
                };
                break;
            }
            case SVGOperation.VERTICAL: {
                command = {
                    operation: SVGOperation.LINE,
                    rawCommand: "",
                    values: [],
                    relative: false,
                    end: {
                        x: currentPoint.x,
                        y: command.y,
                    },
                };
                break;
            }
        }

        // Remove commands that make 0 length lines, they get in the way later
        // Arguably could be used to add sharp corners to the smoothed result,
        // but more likely just a badly written path
        if (SVGOperation.LINE === command.operation && equalPoint(command.end, currentPoint, 10)) {
            return null;
        }

        if (command.operation !== SVGOperation.CLOSE) {
            currentPoint = { ...command.end };
        }
        return command;
    });

    return clearedCommands.filter((cmd) => !!cmd) as NonLinearSVGCommand[];
}

/**
 * This function requires all commands passed to be absolute.
 * It also doesn't handle sub paths, only pass in single paths
 */
export function replaceLinearCommands(commands: ParsedSVGCommand[]): ParsedSVGCommand[] {
    let currentPoint = {
        x: 0,
        y: 0,
    };

    return commands.map((command) => {
        if (command.relative) {
            throw new Error("Unable to remove linear commands from a sequence that includes relative moves");
        }

        if (command.operation === SVGOperation.LINE) {
            if (command.end.x === currentPoint.x) {
                currentPoint.y = command.end.y;
                return {
                    operation: SVGOperation.VERTICAL,
                    relative: false,
                    values: [],
                    rawCommand: "",
                    y: command.end.y,
                };
            }
            if (command.end.y === currentPoint.y) {
                currentPoint.x = command.end.x;
                return {
                    operation: SVGOperation.HORIZONTAL,
                    relative: false,
                    values: [],
                    rawCommand: "",
                    x: command.end.x,
                };
            }
        }

        if (
            command.operation !== SVGOperation.CLOSE &&
            command.operation !== SVGOperation.VERTICAL &&
            command.operation !== SVGOperation.HORIZONTAL
        ) {
            currentPoint = { ...command.end };
        }
        return command;
    });
}
