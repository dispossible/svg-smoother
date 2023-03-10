import "mocha";
import { expect } from "chai";

import { assertCommandLength, stringifyCommandFromCommand, stringifyCommands, updateCommandValues } from "./commands";
import { SVGOperation } from "../domain";

describe("Command length", () => {
    it("Does not throw for correct length", () => {
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.LINE,
                relative: false,
                rawCommand: "L 50 50",
                values: [50, 50],
            })
        ).to.not.throw();
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.CUBIC,
                relative: false,
                rawCommand: "C 50 50 120 130 200 250",
                values: [50, 50, 120, 130, 200, 250],
            })
        ).to.not.throw();
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.CLOSE,
                relative: false,
                rawCommand: "Z",
                values: [],
            })
        ).to.not.throw();
    });

    it("Does not throw for looped commands", () => {
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.LINE,
                relative: false,
                rawCommand: "L 50 50 100 100 230 240 300 301",
                values: [50, 50, 100, 100, 230, 240, 300, 301],
            })
        ).to.not.throw();
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.QUADRATIC,
                relative: false,
                rawCommand: "Q 50 50 100 100 230 240 300 301",
                values: [50, 50, 100, 100, 230, 240, 300, 301],
            })
        ).to.not.throw();
    });

    it("Does throw for invalid length", () => {
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.LINE,
                relative: false,
                rawCommand: "L 50 50 50",
                values: [50, 50, 50],
            })
        ).to.throw();
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.CUBIC,
                relative: false,
                rawCommand: "C 50 50 120 130 200",
                values: [50, 50, 120, 130, 200],
            })
        ).to.throw();
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.CLOSE,
                relative: false,
                rawCommand: "Z 5",
                values: [5],
            })
        ).to.throw();
        expect(() =>
            assertCommandLength({
                operation: SVGOperation.CUBIC,
                relative: false,
                rawCommand: "C 50 50 120 130 200 210 245 300",
                values: [50, 50, 120, 130, 200, 210, 245, 300],
            })
        ).to.throw();
    });
});

describe("Stringify commands", () => {
    it("Stringify from command object", () => {
        expect(
            stringifyCommandFromCommand({
                operation: SVGOperation.LINE,
                rawCommand: "",
                relative: false,
                values: [50, 50],
            })
        ).to.equal("L 50 50");
        expect(
            stringifyCommandFromCommand({
                operation: SVGOperation.ARC,
                rawCommand: "",
                relative: false,
                values: [50, 50, 350, 0, 1, 100, 100],
            })
        ).to.equal("A 50 50 350 0 1 100 100");
    });

    it("Stringify from relative command object", () => {
        expect(
            stringifyCommandFromCommand({
                operation: SVGOperation.LINE,
                rawCommand: "",
                relative: true,
                values: [50, 50],
            })
        ).to.equal("l 50 50");
        expect(
            stringifyCommandFromCommand({
                operation: SVGOperation.QUADRATIC,
                rawCommand: "",
                relative: true,
                values: [50, 50, 200, 200],
            })
        ).to.equal("q 50 50 200 200");
    });

    it("Stringify command array", () => {
        expect(
            stringifyCommands([
                {
                    operation: SVGOperation.MOVE,
                    rawCommand: "",
                    relative: false,
                    values: [50, 50],
                },
                {
                    operation: SVGOperation.LINE,
                    rawCommand: "",
                    relative: true,
                    values: [100, 100],
                },
                {
                    operation: SVGOperation.VERTICAL,
                    rawCommand: "",
                    relative: true,
                    values: [50],
                },
                {
                    operation: SVGOperation.CLOSE,
                    rawCommand: "",
                    relative: false,
                    values: [],
                },
            ])
        ).to.equal("M 50 50 l 100 100 v 50 Z");
    });
});

describe("Update command values", () => {
    it("Can update a move command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.MOVE,
            values: [],
            rawCommand: "",
            relative: false,
            end: {
                x: 10,
                y: 20,
            },
        });
        expect(command.values).to.deep.equal([10, 20]);
        expect(command.rawCommand).to.equal("M 10 20");
    });

    it("Can update a line command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.LINE,
            values: [],
            rawCommand: "",
            relative: false,
            end: {
                x: 20,
                y: 10,
            },
        });
        expect(command.values).to.deep.equal([20, 10]);
        expect(command.rawCommand).to.equal("L 20 10");
    });

    it("Can update a relative line command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.LINE,
            values: [],
            rawCommand: "",
            relative: true,
            end: {
                x: 10,
                y: 20,
            },
        });
        expect(command.values).to.deep.equal([10, 20]);
        expect(command.rawCommand).to.equal("l 10 20");
    });

    it("Can update a horizontal command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.HORIZONTAL,
            values: [],
            rawCommand: "",
            relative: false,
            x: 10,
        });
        expect(command.values).to.deep.equal([10]);
        expect(command.rawCommand).to.equal("H 10");
    });

    it("Can update a vertical command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.VERTICAL,
            values: [],
            rawCommand: "",
            relative: false,
            y: 10,
        });
        expect(command.values).to.deep.equal([10]);
        expect(command.rawCommand).to.equal("V 10");
    });

    it("Can update a cubic command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.CUBIC,
            values: [],
            rawCommand: "",
            relative: false,
            controlPointA: {
                x: 5,
                y: 15,
            },
            controlPointB: {
                x: 5,
                y: 8,
            },
            end: {
                x: 20,
                y: 10,
            },
        });
        expect(command.values).to.deep.equal([5, 15, 5, 8, 20, 10]);
        expect(command.rawCommand).to.equal("C 5 15 5 8 20 10");
    });

    it("Can update a smooth cubic command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.SMOOTH_CUBIC,
            values: [],
            rawCommand: "",
            relative: false,
            controlPoint: {
                x: 5,
                y: 15,
            },
            end: {
                x: 20,
                y: 10,
            },
        });
        expect(command.values).to.deep.equal([5, 15, 20, 10]);
        expect(command.rawCommand).to.equal("S 5 15 20 10");
    });

    it("Can update a quadratic command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.QUADRATIC,
            values: [],
            rawCommand: "",
            relative: false,
            controlPoint: {
                x: 5,
                y: 15,
            },
            end: {
                x: 20,
                y: 10,
            },
        });
        expect(command.values).to.deep.equal([5, 15, 20, 10]);
        expect(command.rawCommand).to.equal("Q 5 15 20 10");
    });

    it("Can update a smooth quadratic command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.SMOOTH_QUADRATIC,
            values: [],
            rawCommand: "",
            relative: false,
            end: {
                x: 20,
                y: 10,
            },
        });
        expect(command.values).to.deep.equal([20, 10]);
        expect(command.rawCommand).to.equal("T 20 10");
    });

    it("Can update an arc command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.ARC,
            values: [],
            rawCommand: "",
            relative: false,
            radiusX: 18,
            radiusY: 23,
            angle: 330,
            largeArc: true,
            sweep: false,
            end: {
                x: 20,
                y: 10,
            },
        });
        expect(command.values).to.deep.equal([18, 23, 330, 1, 0, 20, 10]);
        expect(command.rawCommand).to.equal("A 18 23 330 1 0 20 10");

        const command2 = updateCommandValues({
            operation: SVGOperation.ARC,
            values: [],
            rawCommand: "",
            relative: true,
            radiusX: 26,
            radiusY: 41,
            angle: 270,
            largeArc: false,
            sweep: true,
            end: {
                x: 15,
                y: 6,
            },
        });
        expect(command2.values).to.deep.equal([26, 41, 270, 0, 1, 15, 6]);
        expect(command2.rawCommand).to.equal("a 26 41 270 0 1 15 6");
    });

    it("Can update a close command", () => {
        const command = updateCommandValues({
            operation: SVGOperation.CLOSE,
            values: [],
            rawCommand: "",
            relative: false,
        });
        expect(command.values).to.deep.equal([]);
        expect(command.rawCommand).to.equal("Z");
    });
});
