import {
    ArcSVGCommand,
    CubicSVGCommand,
    LineSVGCommand,
    MoveSVGCommand,
    ParsedSVGCommand,
    QuadraticSVGCommand,
    SmoothCubicSVGCommand,
    SmoothQuadraticSVGCommand,
    SVGOperation,
} from "../domain";
import { convertToAbsolute } from "./absolute";
import { moveTowards, moveTowardsFractional } from "../utils/math";
import { updateCommandValues } from "../utils/commands";
import { removeLinearCommands, replaceLinearCommands } from "./linear";
import { separateSubPaths } from "./subPaths";
import { SmootherConfig } from "../domain/config";

export function smoothCommands(inputCommands: ParsedSVGCommand[], config: SmootherConfig): ParsedSVGCommand[] {
    const absoluteCommands = convertToAbsolute(inputCommands);
    const subPaths = separateSubPaths(absoluteCommands);

    const smoothedSubPaths = subPaths.map((commands) => {
        const smoothedCommands = smoothAbsoluteCommands(commands, config);
        if (config.reduceCommands) {
            return replaceLinearCommands(smoothedCommands);
        }
        return smoothedCommands;
    });

    return smoothedSubPaths.flat(1).map((command) => updateCommandValues(command, config.numberAccuracy));
}

function smoothAbsoluteCommands(inputCommands: ParsedSVGCommand[], config: SmootherConfig): ParsedSVGCommand[] {
    const smoothedCommands: ParsedSVGCommand[] = [];
    inputCommands = removeLinearCommands(inputCommands);

    const firstCommand = inputCommands[0];
    const lastCommand = inputCommands[inputCommands.length - 1];

    let closeCommand: ParsedSVGCommand | null = null;
    if (lastCommand.operation === SVGOperation.CLOSE && firstCommand.operation === SVGOperation.MOVE) {
        closeCommand = {
            ...firstCommand,
            operation: SVGOperation.LINE,
        };
        // Replace the Z command with an L for now to allow the final corner to be smoothed
        inputCommands[inputCommands.length - 1] = closeCommand;
    }

    // Add the first command, but will likely need to fix it later
    smoothedCommands.push(inputCommands[0]);

    for (let i = 1; i < inputCommands.length; i++) {
        const prevCmd = inputCommands[i - 1];
        const currCmd = inputCommands[i];
        const nextCmd = i === inputCommands.length - 1 && closeCommand ? inputCommands[1] : inputCommands[i + 1];

        if (
            isValidPoint(prevCmd) &&
            isValidPoint(currCmd) &&
            isValidPoint(nextCmd) &&
            nextCmd.operation === SVGOperation.LINE &&
            currCmd.operation === SVGOperation.LINE
        ) {
            const curveStart = moveTowards(currCmd.end, prevCmd.end, config.radius);
            const curveEnd = moveTowards(currCmd.end, nextCmd.end, config.radius);

            // Add a line to the start position
            smoothedCommands.push({
                operation: SVGOperation.LINE,
                relative: false,
                values: [],
                rawCommand: "",
                end: curveStart,
            });

            const startControl = moveTowardsFractional(curveStart, currCmd.end, 0.5);
            const endControl = moveTowardsFractional(currCmd.end, curveEnd, 0.5);

            smoothedCommands.push({
                operation: SVGOperation.CUBIC,
                relative: false,
                rawCommand: "",
                values: [],
                controlPointA: startControl,
                controlPointB: endControl,
                end: curveEnd,
            });
        } else {
            smoothedCommands.push(currCmd);
        }
    }

    if (closeCommand) {
        // Re-add the Z command if it was removed earlier
        const firstCmd = smoothedCommands[0] as MoveSVGCommand;
        const lastCmd = smoothedCommands[smoothedCommands.length - 1] as LineSVGCommand;
        firstCmd.operation = SVGOperation.MOVE;
        firstCmd.end = {
            ...lastCmd.end,
        };
        smoothedCommands.push({
            rawCommand: "Z",
            operation: SVGOperation.CLOSE,
            relative: false,
            values: [],
        });
    }

    return smoothedCommands;
}

function isValidPoint(
    command: ParsedSVGCommand
): command is
    | MoveSVGCommand
    | LineSVGCommand
    | CubicSVGCommand
    | SmoothCubicSVGCommand
    | QuadraticSVGCommand
    | SmoothQuadraticSVGCommand
    | ArcSVGCommand {
    return [
        SVGOperation.MOVE,
        SVGOperation.LINE,
        SVGOperation.CUBIC,
        SVGOperation.SMOOTH_CUBIC,
        SVGOperation.QUADRATIC,
        SVGOperation.SMOOTH_QUADRATIC,
        SVGOperation.ARC,
    ].includes(command?.operation);
}
