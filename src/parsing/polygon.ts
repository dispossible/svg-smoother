import { LineSVGCommand, MoveSVGCommand, ParsedSVGCommand, SVGOperation } from "../domain";
import { updateCommandValues } from "../utils/commands";

export type Polygon = [number, number][];

export function parsePolygon(polygon: Polygon, closedPath = true): ParsedSVGCommand[] {
    if (!Array.isArray(polygon)) {
        throw new TypeError(`Provided polygon was not an array of number pairs`);
    }
    const commands = polygon.map((point, i): ParsedSVGCommand => {
        if (
            point.length !== 2 ||
            typeof point[0] !== "number" ||
            typeof point[1] !== "number" ||
            isNaN(point[0]) ||
            isNaN(point[1])
        ) {
            throw new Error(`Invalid number pair found: ${point}`);
        }
        const command = {
            operation: i === 0 ? SVGOperation.MOVE : SVGOperation.LINE,
            relative: false,
            rawCommand: "",
            values: point,
            end: {
                x: point[0],
                y: point[1],
            },
        } as MoveSVGCommand | LineSVGCommand;
        return updateCommandValues(command, 3);
    });

    if (closedPath) {
        commands.push({
            operation: SVGOperation.CLOSE,
            rawCommand: "Z",
            values: [],
            relative: false,
        });
    }

    return commands;
}
