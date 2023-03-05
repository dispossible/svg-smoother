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
} from "../domain/index.js";

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

        if (command.operation !== SVGOperation.CLOSE) {
            currentPoint = command.end;
        }
        return command;
    });

    return clearedCommands;
}
