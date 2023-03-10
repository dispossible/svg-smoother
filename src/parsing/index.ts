import { ParsedSVGCommand, RawSVGCommand, SVGOperation } from "../domain";
import { castToSVGOperation } from "../domain/utils";
import {
    assertCommandLength,
    COMMAND_LENGTH,
    stringifyCommandFromCommand,
    stringifyCommandWithValues,
} from "../utils/commands";
import { chunkArray } from "../utils/array";

export function parsePath(pathString: string): ParsedSVGCommand[] {
    if (typeof pathString !== "string") {
        throw new TypeError("Provided path must be a string");
    }
    const normalizedPath = normalizePath(pathString);
    const rawCommands = readPathToCommands(normalizedPath);
    return parseCommands(rawCommands);
}

function normalizePath(pathString: string): string {
    return (
        pathString
            // Remove commas
            .replace(/,/g, " ")
            // Remove any runs of spaces
            .replace(/\s{2,}/g, " ")
            // Space out any letters that are touching other things
            .replace(/([a-zA-Z])([a-zA-Z])/g, "$1 $2")
            .replace(/(\S)([a-zA-Z])/g, "$1 $2")
            .replace(/([a-zA-Z])(\S)/g, "$1 $2")
            // Remove any leading and trailing space
            .trim()
    );
}

function readPathToCommands(pathString: string): RawSVGCommand[] {
    return (
        pathString
            // Get every value
            .split(/[,\s]/)
            // Combine the values in groups for commands
            .reduce((commands, part) => {
                if (!isNaN(parseFloat(part)) && commands.length) {
                    commands[commands.length - 1].push(part);
                } else if (part.trim() !== "") {
                    commands.push([part]);
                }
                return commands;
            }, [] as string[][])
            .reduce((commands, commandArr) => {
                const command: RawSVGCommand = {
                    rawCommand: commandArr.join(" "),
                    values: commandArr.slice(1).map((d) => parseFloat(d)),
                    operation: castToSVGOperation(commandArr[0]),
                    relative: commandArr[0] === commandArr[0].toLocaleLowerCase(),
                };
                commands.push(command);
                return commands;
            }, [] as RawSVGCommand[])
    );
}

function parseCommands(commands: RawSVGCommand[]): ParsedSVGCommand[] {
    const parsedCommands = commands.reduce((parsedCommands, rawCommand) => {
        // Separate implied command sequences [1]
        const sequenceLength = COMMAND_LENGTH[rawCommand.operation];
        assertCommandLength(rawCommand);
        const valueSets = chunkArray(rawCommand.values, sequenceLength);
        const rawCommands: RawSVGCommand[] = valueSets.map((values) => {
            return {
                rawCommand: stringifyCommandWithValues(rawCommand, values),
                values: values,
                operation: rawCommand.operation,
                relative: rawCommand.relative,
            };
        });

        // Fix looped Move commands to be Lines
        if (rawCommand.operation === SVGOperation.MOVE && rawCommands.length > 1) {
            rawCommands.forEach((cmd, i) => {
                if (i > 0) {
                    cmd.operation = SVGOperation.LINE;
                    cmd.rawCommand = stringifyCommandFromCommand(cmd);
                }
            });
        }

        // Parse the command values
        parsedCommands.push(...rawCommands.map(parseCommandValues));

        return parsedCommands;
    }, [] as ParsedSVGCommand[]);

    return parsedCommands;
}

// [1] In SVG path syntax if a sequence of commands all use the same operation then the operation letter can be omitted
//     "L 5 5 L 10 10" === "L 5 5 10 10"

function parseCommandValues(rawCommand: RawSVGCommand): ParsedSVGCommand {
    assertCommandLength(rawCommand);

    switch (rawCommand.operation) {
        case SVGOperation.MOVE: {
            return {
                ...rawCommand,
                operation: SVGOperation.MOVE,
                end: {
                    x: rawCommand.values[0],
                    y: rawCommand.values[1],
                },
            };
        }

        case SVGOperation.LINE: {
            return {
                ...rawCommand,
                operation: SVGOperation.LINE,
                end: {
                    x: rawCommand.values[0],
                    y: rawCommand.values[1],
                },
            };
        }

        case SVGOperation.HORIZONTAL: {
            return {
                ...rawCommand,
                operation: SVGOperation.HORIZONTAL,
                x: rawCommand.values[0],
            };
        }

        case SVGOperation.VERTICAL: {
            return {
                ...rawCommand,
                operation: SVGOperation.VERTICAL,
                y: rawCommand.values[0],
            };
        }

        case SVGOperation.CUBIC: {
            return {
                ...rawCommand,
                operation: SVGOperation.CUBIC,
                controlPointA: {
                    x: rawCommand.values[0],
                    y: rawCommand.values[1],
                },
                controlPointB: {
                    x: rawCommand.values[2],
                    y: rawCommand.values[3],
                },
                end: {
                    x: rawCommand.values[4],
                    y: rawCommand.values[5],
                },
            };
        }

        case SVGOperation.SMOOTH_CUBIC: {
            return {
                ...rawCommand,
                operation: SVGOperation.SMOOTH_CUBIC,
                controlPoint: {
                    x: rawCommand.values[0],
                    y: rawCommand.values[1],
                },
                end: {
                    x: rawCommand.values[2],
                    y: rawCommand.values[3],
                },
            };
        }

        case SVGOperation.QUADRATIC: {
            return {
                ...rawCommand,
                operation: SVGOperation.QUADRATIC,
                controlPoint: {
                    x: rawCommand.values[0],
                    y: rawCommand.values[1],
                },
                end: {
                    x: rawCommand.values[2],
                    y: rawCommand.values[3],
                },
            };
        }

        case SVGOperation.SMOOTH_QUADRATIC: {
            return {
                ...rawCommand,
                operation: SVGOperation.SMOOTH_QUADRATIC,
                end: {
                    x: rawCommand.values[0],
                    y: rawCommand.values[1],
                },
            };
        }

        case SVGOperation.ARC: {
            return {
                ...rawCommand,
                operation: SVGOperation.ARC,
                radiusX: rawCommand.values[0],
                radiusY: rawCommand.values[1],
                angle: rawCommand.values[2],
                largeArc: rawCommand.values[3] === 1,
                sweep: rawCommand.values[4] === 1,
                end: {
                    x: rawCommand.values[5],
                    y: rawCommand.values[6],
                },
            };
        }

        case SVGOperation.CLOSE: {
            return {
                ...rawCommand,
                operation: SVGOperation.CLOSE,
            };
        }

        default:
            throw new Error(`Unknown SVG path command: ${rawCommand.operation}`);
    }
}
