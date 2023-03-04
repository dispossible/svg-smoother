import "mocha";
import { expect } from "chai";

import { assertCommandLength, stringifyCommandFromCommand, stringifyCommands } from "./commands";
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
