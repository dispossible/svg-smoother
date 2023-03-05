import { ParsedSVGCommand, RawSVGCommand, SVGOperation } from "../domain/index.js";

export const COMMAND_LENGTH: Record<SVGOperation, number> = {
    [SVGOperation.MOVE]: 2,
    [SVGOperation.LINE]: 2,
    [SVGOperation.HORIZONTAL]: 1,
    [SVGOperation.VERTICAL]: 1,
    [SVGOperation.CUBIC]: 6,
    [SVGOperation.SMOOTH_CUBIC]: 4,
    [SVGOperation.QUADRATIC]: 4,
    [SVGOperation.SMOOTH_QUADRATIC]: 2,
    [SVGOperation.ARC]: 7,
    [SVGOperation.CLOSE]: 0,
};

export function assertCommandLength(command: RawSVGCommand): void {
    const sequenceLength = COMMAND_LENGTH[command.operation];
    if (sequenceLength === command.values.length) {
        return;
    }
    if (command.values.length % sequenceLength !== 0) {
        throw new Error(
            `Found invalid amount of arguments (${command.values.length}) provided for ${command.operation} command`
        );
    }
}

export function stringifyCommandFromCommand(command: RawSVGCommand): string {
    return stringifyCommand(command.operation, command.relative, command.values);
}

export function stringifyCommandWithValues(command: RawSVGCommand, values: number[]) {
    return stringifyCommand(command.operation, command.relative, values);
}

export function stringifyCommand(operation: SVGOperation, relative: boolean, values: number[]): string {
    const operationStr = relative ? operation.toLocaleLowerCase() : operation.toLocaleUpperCase();
    return [operationStr, ...values].join(" ");
}

export function stringifyCommands(commands: RawSVGCommand[]): string {
    return commands.map(stringifyCommandFromCommand).join(" ");
}

export function updateCommandValues(command: ParsedSVGCommand): ParsedSVGCommand {
    switch (command.operation) {
        case SVGOperation.MOVE:
        case SVGOperation.LINE:
        case SVGOperation.SMOOTH_QUADRATIC: {
            command.values = [command.end.x, command.end.y];
            break;
        }
        case SVGOperation.HORIZONTAL: {
            command.values = [command.x];
            break;
        }
        case SVGOperation.VERTICAL: {
            command.values = [command.y];
            break;
        }
        case SVGOperation.CUBIC: {
            command.values = [
                command.controlPointA.x,
                command.controlPointA.y,
                command.controlPointB.x,
                command.controlPointB.y,
                command.end.x,
                command.end.y,
            ];
            break;
        }
        case SVGOperation.SMOOTH_CUBIC:
        case SVGOperation.QUADRATIC: {
            command.values = [command.controlPoint.x, command.controlPoint.y, command.end.x, command.end.y];
            break;
        }
        case SVGOperation.ARC: {
            command.values = [
                command.radiusX,
                command.radiusY,
                command.angle,
                command.largeArc ? 1 : 0,
                command.sweep ? 1 : 0,
                command.end.x,
                command.end.y,
            ];
            break;
        }
        case SVGOperation.CLOSE: {
            command.values = [];
            break;
        }
    }

    command.rawCommand = stringifyCommandFromCommand(command);
    return command;
}
