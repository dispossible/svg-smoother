import { ParsedSVGCommand, Point, SVGOperation } from "../domain";

export function convertToAbsolute(commands: ParsedSVGCommand[]): ParsedSVGCommand[] {
    let currentPosition: Point = {
        x: 0,
        y: 0,
    };

    let subPathStart: Point = {
        x: 0,
        y: 0,
    };

    const absoluteCommands = commands.map((command) => {
        if (command.operation === SVGOperation.CLOSE) {
            currentPosition = { ...subPathStart };
            return {
                ...command,
                relative: false,
            };
        }

        if (!command.relative) {
            currentPosition = getEndPoint(command, currentPosition);
            if (command.operation === SVGOperation.MOVE) {
                subPathStart = { ...currentPosition };
            }
            return { ...command };
        }

        let absoluteCommand: ParsedSVGCommand = {
            ...command,
        };
        switch (command.operation) {
            case SVGOperation.MOVE:
            case SVGOperation.LINE:
            case SVGOperation.SMOOTH_QUADRATIC:
            case SVGOperation.ARC: {
                absoluteCommand = {
                    ...command,
                    relative: false,
                    end: {
                        x: currentPosition.x + command.end.x,
                        y: currentPosition.y + command.end.y,
                    },
                };
                break;
            }
            case SVGOperation.HORIZONTAL: {
                absoluteCommand = {
                    ...command,
                    operation: SVGOperation.LINE,
                    relative: false,
                    end: {
                        x: currentPosition.x + command.x,
                        y: currentPosition.y,
                    },
                };
                // @ts-expect-error Tidying up from type conversion
                delete absoluteCommand.x;
                break;
            }
            case SVGOperation.VERTICAL: {
                absoluteCommand = {
                    ...command,
                    operation: SVGOperation.LINE,
                    relative: false,
                    end: {
                        x: currentPosition.x,
                        y: currentPosition.y + command.y,
                    },
                };
                // @ts-expect-error Tidying up from type conversion
                delete absoluteCommand.y;
                break;
            }
            case SVGOperation.CUBIC: {
                absoluteCommand = {
                    ...command,
                    relative: false,
                    controlPointA: {
                        x: currentPosition.x + command.controlPointA.x,
                        y: currentPosition.y + command.controlPointA.y,
                    },
                    controlPointB: {
                        x: currentPosition.x + command.controlPointB.x,
                        y: currentPosition.y + command.controlPointB.y,
                    },
                    end: {
                        x: currentPosition.x + command.end.x,
                        y: currentPosition.y + command.end.y,
                    },
                };
                break;
            }
            case SVGOperation.SMOOTH_CUBIC:
            case SVGOperation.QUADRATIC: {
                absoluteCommand = {
                    ...command,
                    relative: false,
                    controlPoint: {
                        x: currentPosition.x + command.controlPoint.x,
                        y: currentPosition.y + command.controlPoint.y,
                    },
                    end: {
                        x: currentPosition.x + command.end.x,
                        y: currentPosition.y + command.end.y,
                    },
                };
                break;
            }
        }

        currentPosition = getEndPoint(absoluteCommand, currentPosition);
        if (absoluteCommand.operation === SVGOperation.MOVE) {
            subPathStart = { ...currentPosition };
        }
        return absoluteCommand;
    });

    return absoluteCommands;
}

function getEndPoint(command: ParsedSVGCommand, prevPoint: Point | null): Point {
    // In theory all these ifs are un-hittable, it's here to handle things smoothly if something went wrong elsewhere

    if (command.operation === SVGOperation.CLOSE) {
        throw Error(`Unable to get end position of a ${SVGOperation.CLOSE} command`);
    }

    if (command.operation === SVGOperation.HORIZONTAL) {
        return {
            x: command.x,
            y: prevPoint?.y ?? NaN,
        };
    }

    if (command.operation === SVGOperation.VERTICAL) {
        return {
            x: prevPoint?.x ?? NaN,
            y: command.y,
        };
    }

    return command.end;
}
