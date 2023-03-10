import "mocha";
import { expect } from "chai";

import { removeLinearCommands, replaceLinearCommands } from "./linear";
import { SVGOperation } from "../domain";

describe("Remove linear commands", () => {
    it("Will replace horizontals", () => {
        expect(
            removeLinearCommands([
                {
                    operation: SVGOperation.HORIZONTAL,
                    rawCommand: "H 100",
                    relative: false,
                    values: [100],
                    x: 100,
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.LINE,
                rawCommand: "",
                relative: false,
                values: [],
                end: {
                    x: 100,
                    y: 0,
                },
            },
        ]);
    });
    it("Will replace verticals", () => {
        expect(
            removeLinearCommands([
                {
                    operation: SVGOperation.VERTICAL,
                    rawCommand: "V 100",
                    relative: false,
                    values: [100],
                    y: 100,
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.LINE,
                rawCommand: "",
                relative: false,
                values: [],
                end: {
                    x: 0,
                    y: 100,
                },
            },
        ]);
    });
    it("Wont replace diagonals", () => {
        expect(
            removeLinearCommands([
                {
                    operation: SVGOperation.LINE,
                    rawCommand: "L 100 100",
                    relative: false,
                    values: [100, 100],
                    end: {
                        x: 100,
                        y: 100,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.LINE,
                rawCommand: "L 100 100",
                relative: false,
                values: [100, 100],
                end: {
                    x: 100,
                    y: 100,
                },
            },
        ]);
    });

    it("Will not accept relative commands", () => {
        expect(() =>
            removeLinearCommands([
                {
                    operation: SVGOperation.VERTICAL,
                    rawCommand: "V 100",
                    relative: true,
                    values: [100],
                    y: 100,
                },
            ])
        ).to.throw();
    });
});

describe("Replace linear commands", () => {
    it("Will add in horizontal commands", () => {
        expect(
            replaceLinearCommands([
                {
                    operation: SVGOperation.LINE,
                    rawCommand: "",
                    relative: false,
                    values: [],
                    end: {
                        x: 100,
                        y: 0,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.HORIZONTAL,
                rawCommand: "",
                relative: false,
                values: [],
                x: 100,
            },
        ]);
    });
    it("Will add in vertical commands", () => {
        expect(
            replaceLinearCommands([
                {
                    operation: SVGOperation.LINE,
                    rawCommand: "",
                    relative: false,
                    values: [],
                    end: {
                        x: 0,
                        y: 100,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.VERTICAL,
                rawCommand: "",
                relative: false,
                values: [],
                y: 100,
            },
        ]);
    });
    it("Won't replace diagonal commands", () => {
        expect(
            replaceLinearCommands([
                {
                    operation: SVGOperation.LINE,
                    rawCommand: "L 100 100",
                    relative: false,
                    values: [100, 100],
                    end: {
                        x: 100,
                        y: 100,
                    },
                },
            ])
        ).to.deep.equal([
            {
                operation: SVGOperation.LINE,
                rawCommand: "L 100 100",
                relative: false,
                values: [100, 100],
                end: {
                    x: 100,
                    y: 100,
                },
            },
        ]);
    });

    it("Will not accept relative commands", () => {
        expect(() =>
            replaceLinearCommands([
                {
                    operation: SVGOperation.LINE,
                    rawCommand: "L 100 100",
                    relative: true,
                    values: [100, 100],
                    end: {
                        x: 100,
                        y: 100,
                    },
                },
            ])
        ).to.throw();
    });
});
