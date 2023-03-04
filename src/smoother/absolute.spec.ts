import "mocha";
import { expect } from "chai";

import { convertToAbsolute } from "./absolute";
import { SVGOperation } from "../domain";

describe("Absolute conversion", () => {
    it("Can absolute a line", () => {
        expect(
            convertToAbsolute([
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [10, 10],
                    rawCommand: "",
                    end: {
                        x: 10,
                        y: 10,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [10, 10],
                rawCommand: "",
                end: {
                    x: 10,
                    y: 10,
                },
            },
        ]);
    });

    it("Can absolute a sequence of lines", () => {
        expect(
            convertToAbsolute([
                {
                    operation: SVGOperation.MOVE,
                    relative: true,
                    values: [10, 10],
                    rawCommand: "",
                    end: {
                        x: 10,
                        y: 10,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [20, 20],
                    rawCommand: "",
                    end: {
                        x: 20,
                        y: 20,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [0, 10],
                    rawCommand: "",
                    end: {
                        x: 0,
                        y: 10,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [-20, -10],
                    rawCommand: "",
                    end: {
                        x: -20,
                        y: -10,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [50, -15],
                    rawCommand: "",
                    end: {
                        x: 50,
                        y: -15,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.MOVE,
                relative: false,
                values: [10, 10],
                rawCommand: "",
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [20, 20],
                rawCommand: "",
                end: {
                    x: 30,
                    y: 30,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [0, 10],
                rawCommand: "",
                end: {
                    x: 30,
                    y: 40,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [-20, -10],
                rawCommand: "",
                end: {
                    x: 10,
                    y: 30,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [50, -15],
                rawCommand: "",
                end: {
                    x: 60,
                    y: 15,
                },
            },
        ]);
    });

    it("Can absolute already absolute command", () => {
        expect(
            convertToAbsolute([
                {
                    operation: SVGOperation.LINE,
                    relative: false,
                    values: [10, 10],
                    rawCommand: "",
                    end: {
                        x: 10,
                        y: 10,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: false,
                    values: [20, 20],
                    rawCommand: "",
                    end: {
                        x: 20,
                        y: 20,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [10, 10],
                rawCommand: "",
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [20, 20],
                rawCommand: "",
                end: {
                    x: 20,
                    y: 20,
                },
            },
        ]);
    });

    it("Deals with a mix of relative and absolute", () => {
        expect(
            convertToAbsolute([
                {
                    operation: SVGOperation.MOVE,
                    relative: false,
                    values: [10, 10],
                    rawCommand: "",
                    end: {
                        x: 10,
                        y: 10,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [20, 0],
                    rawCommand: "",
                    end: {
                        x: 20,
                        y: 0,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [0, 20],
                    rawCommand: "",
                    end: {
                        x: 0,
                        y: 20,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: false,
                    values: [35, 35],
                    rawCommand: "",
                    end: {
                        x: 35,
                        y: 35,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    relative: true,
                    values: [10, 10],
                    rawCommand: "",
                    end: {
                        x: 10,
                        y: 10,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.MOVE,
                relative: false,
                values: [10, 10],
                rawCommand: "",
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [20, 0],
                rawCommand: "",
                end: {
                    x: 30,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [0, 20],
                rawCommand: "",
                end: {
                    x: 30,
                    y: 30,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [35, 35],
                rawCommand: "",
                end: {
                    x: 35,
                    y: 35,
                },
            },
            {
                operation: SVGOperation.LINE,
                relative: false,
                values: [10, 10],
                rawCommand: "",
                end: {
                    x: 45,
                    y: 45,
                },
            },
        ]);
    });

    it("Can absolute all commands", () => {
        expect(
            convertToAbsolute([
                {
                    operation: SVGOperation.MOVE,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    end: {
                        x: 10,
                        y: 10,
                    },
                },
                {
                    operation: SVGOperation.LINE,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    end: {
                        x: 10,
                        y: 10,
                    },
                },
                {
                    operation: SVGOperation.HORIZONTAL,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    x: 10,
                },
                {
                    operation: SVGOperation.VERTICAL,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    y: -10,
                },
                {
                    operation: SVGOperation.CUBIC,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    controlPointA: {
                        x: 10,
                        y: 15,
                    },
                    controlPointB: {
                        x: 5,
                        y: 20,
                    },
                    end: {
                        x: 30,
                        y: 40,
                    },
                },
                {
                    operation: SVGOperation.SMOOTH_CUBIC,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    controlPoint: {
                        x: -5,
                        y: -20,
                    },
                    end: {
                        x: -10,
                        y: -20,
                    },
                },
                {
                    operation: SVGOperation.QUADRATIC,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    controlPoint: {
                        x: 10,
                        y: 20,
                    },
                    end: {
                        x: 40,
                        y: 40,
                    },
                },
                {
                    operation: SVGOperation.SMOOTH_QUADRATIC,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    end: {
                        x: -10,
                        y: -15,
                    },
                },
                {
                    operation: SVGOperation.ARC,
                    rawCommand: "",
                    relative: true,
                    values: [],
                    angle: 100,
                    largeArc: false,
                    sweep: true,
                    radiusX: 100,
                    radiusY: 120,
                    end: {
                        x: 10,
                        y: 20,
                    },
                },
                {
                    operation: SVGOperation.CLOSE,
                    rawCommand: "",
                    relative: true,
                    values: [],
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.MOVE,
                rawCommand: "",
                relative: false,
                values: [],
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.LINE,
                rawCommand: "",
                relative: false,
                values: [],
                end: {
                    x: 20,
                    y: 20,
                },
            },
            {
                operation: SVGOperation.LINE,
                rawCommand: "",
                relative: false,
                values: [],
                end: {
                    x: 30,
                    y: 20,
                },
            },
            {
                operation: SVGOperation.LINE,
                rawCommand: "",
                relative: false,
                values: [],
                end: {
                    x: 30,
                    y: 10,
                },
            },
            {
                operation: SVGOperation.CUBIC,
                rawCommand: "",
                relative: false,
                values: [],
                controlPointA: {
                    x: 40,
                    y: 25,
                },
                controlPointB: {
                    x: 35,
                    y: 30,
                },
                end: {
                    x: 60,
                    y: 50,
                },
            },
            {
                operation: SVGOperation.SMOOTH_CUBIC,
                rawCommand: "",
                relative: false,
                values: [],
                controlPoint: {
                    x: 55,
                    y: 30,
                },
                end: {
                    x: 50,
                    y: 30,
                },
            },
            {
                operation: SVGOperation.QUADRATIC,
                rawCommand: "",
                relative: false,
                values: [],
                controlPoint: {
                    x: 60,
                    y: 50,
                },
                end: {
                    x: 90,
                    y: 70,
                },
            },
            {
                operation: SVGOperation.SMOOTH_QUADRATIC,
                rawCommand: "",
                relative: false,
                values: [],
                end: {
                    x: 80,
                    y: 55,
                },
            },
            {
                operation: SVGOperation.ARC,
                rawCommand: "",
                relative: false,
                values: [],
                angle: 100,
                largeArc: false,
                sweep: true,
                radiusX: 100,
                radiusY: 120,
                end: {
                    x: 90,
                    y: 75,
                },
            },
            {
                operation: SVGOperation.CLOSE,
                rawCommand: "",
                relative: false,
                values: [],
            },
        ]);
    });
});
