import "mocha";
import { expect } from "chai";

import { smoothCommands } from "./index";
import { SVGOperation } from "../domain";

describe("Smooth commands", () => {
    it("Smooth a simple corner", () => {
        expect(
            smoothCommands(
                [
                    {
                        operation: SVGOperation.MOVE,
                        relative: false,
                        rawCommand: "M 10 10",
                        values: [10, 10],
                        end: {
                            x: 10,
                            y: 10,
                        },
                    },
                    {
                        operation: SVGOperation.LINE,
                        relative: false,
                        rawCommand: "L 40 10",
                        values: [40, 10],
                        end: {
                            x: 40,
                            y: 10,
                        },
                    },
                    {
                        operation: SVGOperation.LINE,
                        relative: false,
                        rawCommand: "L 40 40",
                        values: [40, 40],
                        end: {
                            x: 40,
                            y: 40,
                        },
                    },
                ],
                10
            )
        ).to.deep.equal([
            {
                operation: SVGOperation.MOVE,
                relative: false,
                rawCommand: "M 10 10",
                values: [10, 10],
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                rawCommand: "L 30 10",
                values: [30, 10],
                end: {
                    x: 30,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.CUBIC,
                relative: false,
                rawCommand: "C 35 10 40 15 40 20",
                values: [35, 10, 40, 15, 40, 20],
                controlPointA: {
                    x: 35,
                    y: 10,
                },
                controlPointB: {
                    x: 40,
                    y: 15,
                },
                end: {
                    x: 40,
                    y: 20,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                rawCommand: "L 40 40",
                values: [40, 40],
                end: {
                    x: 40,
                    y: 40,
                },
            },
        ]);
    });
});
