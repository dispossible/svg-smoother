import "mocha";
import { expect } from "chai";
import { parsePath } from "./index";

describe("Path parsing", () => {
    it("Can parse a line", () => {
        expect(parsePath("L 100 100")).to.deep.equal([
            {
                rawCommand: "L 100 100",
                operation: "L",
                relative: false,
                values: [100, 100],
                end: {
                    x: 100,
                    y: 100,
                },
            },
        ]);
    });

    it("Deals with no spaces", () => {
        expect(parsePath("L100,100")).to.deep.equal([
            {
                rawCommand: "L 100 100",
                operation: "L",
                relative: false,
                values: [100, 100],
                end: {
                    x: 100,
                    y: 100,
                },
            },
        ]);
    });

    it("Can parse a square", () => {
        expect(parsePath("M 50 50 H 50 V 50 H -50 Z")).to.deep.equal([
            {
                rawCommand: "M 50 50",
                operation: "M",
                relative: false,
                values: [50, 50],
                end: {
                    x: 50,
                    y: 50,
                },
            },
            {
                rawCommand: "H 50",
                operation: "H",
                relative: false,
                values: [50],
                x: 50,
            },
            {
                rawCommand: "V 50",
                operation: "V",
                relative: false,
                values: [50],
                y: 50,
            },
            {
                rawCommand: "H -50",
                operation: "H",
                relative: false,
                values: [-50],
                x: -50,
            },
            {
                rawCommand: "Z",
                operation: "Z",
                relative: false,
                values: [],
            },
        ]);
    });

    it("Can parse a square with random whitespace", () => {
        expect(parsePath("M50  50H50V50H -50, Z")).to.deep.equal([
            {
                rawCommand: "M 50 50",
                operation: "M",
                relative: false,
                values: [50, 50],
                end: {
                    x: 50,
                    y: 50,
                },
            },
            {
                rawCommand: "H 50",
                operation: "H",
                relative: false,
                values: [50],
                x: 50,
            },
            {
                rawCommand: "V 50",
                operation: "V",
                relative: false,
                values: [50],
                y: 50,
            },
            {
                rawCommand: "H -50",
                operation: "H",
                relative: false,
                values: [-50],
                x: -50,
            },
            {
                rawCommand: "Z",
                operation: "Z",
                relative: false,
                values: [],
            },
        ]);
    });

    it("Can parse Cubics", () => {
        expect(parsePath("C 50 60 150 140 200 205")).to.deep.equal([
            {
                rawCommand: "C 50 60 150 140 200 205",
                operation: "C",
                relative: false,
                values: [50, 60, 150, 140, 200, 205],
                controlPointA: {
                    x: 50,
                    y: 60,
                },
                controlPointB: {
                    x: 150,
                    y: 140,
                },
                end: {
                    x: 200,
                    y: 205,
                },
            },
        ]);
    });

    it("Can parse Smooth Cubics", () => {
        expect(parsePath("S 50 60 200 205")).to.deep.equal([
            {
                rawCommand: "S 50 60 200 205",
                operation: "S",
                relative: false,
                values: [50, 60, 200, 205],
                controlPoint: {
                    x: 50,
                    y: 60,
                },
                end: {
                    x: 200,
                    y: 205,
                },
            },
        ]);
    });

    it("Can parse Quadratics", () => {
        expect(parsePath("Q 50 60 150 140")).to.deep.equal([
            {
                rawCommand: "Q 50 60 150 140",
                operation: "Q",
                relative: false,
                values: [50, 60, 150, 140],
                controlPoint: {
                    x: 50,
                    y: 60,
                },
                end: {
                    x: 150,
                    y: 140,
                },
            },
        ]);
    });

    it("Can parse Smooth Quadratics", () => {
        expect(parsePath("T 150 140")).to.deep.equal([
            {
                rawCommand: "T 150 140",
                operation: "T",
                relative: false,
                values: [150, 140],
                end: {
                    x: 150,
                    y: 140,
                },
            },
        ]);
    });

    it("Can parse Arcs", () => {
        expect(parsePath("A 50 40 190 0 1 100 120")).to.deep.equal([
            {
                rawCommand: "A 50 40 190 0 1 100 120",
                operation: "A",
                relative: false,
                values: [50, 40, 190, 0, 1, 100, 120],
                radiusX: 50,
                radiusY: 40,
                angle: 190,
                largeArc: false,
                sweep: true,
                end: {
                    x: 100,
                    y: 120,
                },
            },
        ]);
    });

    it("Can parse Close commands", () => {
        expect(parsePath("Z")).to.deep.equal([
            {
                rawCommand: "Z",
                operation: "Z",
                relative: false,
                values: [],
            },
        ]);
    });

    it("Can deal with looping commands", () => {
        expect(parsePath("L 50 50, 20 10, 35 80, 100 120")).to.deep.equal([
            {
                rawCommand: "L 50 50",
                operation: "L",
                relative: false,
                values: [50, 50],
                end: {
                    x: 50,
                    y: 50,
                },
            },
            {
                rawCommand: "L 20 10",
                operation: "L",
                relative: false,
                values: [20, 10],
                end: {
                    x: 20,
                    y: 10,
                },
            },
            {
                rawCommand: "L 35 80",
                operation: "L",
                relative: false,
                values: [35, 80],
                end: {
                    x: 35,
                    y: 80,
                },
            },
            {
                rawCommand: "L 100 120",
                operation: "L",
                relative: false,
                values: [100, 120],
                end: {
                    x: 100,
                    y: 120,
                },
            },
        ]);
    });

    it("Move loops to Line commands", () => {
        expect(parsePath("M 50 50, 20 10, 35 80, 100 120")).to.deep.equal([
            {
                rawCommand: "M 50 50",
                operation: "M",
                relative: false,
                values: [50, 50],
                end: {
                    x: 50,
                    y: 50,
                },
            },
            {
                rawCommand: "L 20 10",
                operation: "L",
                relative: false,
                values: [20, 10],
                end: {
                    x: 20,
                    y: 10,
                },
            },
            {
                rawCommand: "L 35 80",
                operation: "L",
                relative: false,
                values: [35, 80],
                end: {
                    x: 35,
                    y: 80,
                },
            },
            {
                rawCommand: "L 100 120",
                operation: "L",
                relative: false,
                values: [100, 120],
                end: {
                    x: 100,
                    y: 120,
                },
            },
        ]);
    });

    it("Can parse a relative square", () => {
        expect(parsePath("m 50 50 h 50 v 50 h -50 z")).to.deep.equal([
            {
                rawCommand: "m 50 50",
                operation: "M",
                relative: true,
                values: [50, 50],
                end: {
                    x: 50,
                    y: 50,
                },
            },
            {
                rawCommand: "h 50",
                operation: "H",
                relative: true,
                values: [50],
                x: 50,
            },
            {
                rawCommand: "v 50",
                operation: "V",
                relative: true,
                values: [50],
                y: 50,
            },
            {
                rawCommand: "h -50",
                operation: "H",
                relative: true,
                values: [-50],
                x: -50,
            },
            {
                rawCommand: "z",
                operation: "Z",
                relative: true,
                values: [],
            },
        ]);
    });

    it("Relative Move loops to Line commands", () => {
        expect(parsePath("m 50 50, 20 10, 35 80, 100 120")).to.deep.equal([
            {
                rawCommand: "m 50 50",
                operation: "M",
                relative: true,
                values: [50, 50],
                end: {
                    x: 50,
                    y: 50,
                },
            },
            {
                rawCommand: "l 20 10",
                operation: "L",
                relative: true,
                values: [20, 10],
                end: {
                    x: 20,
                    y: 10,
                },
            },
            {
                rawCommand: "l 35 80",
                operation: "L",
                relative: true,
                values: [35, 80],
                end: {
                    x: 35,
                    y: 80,
                },
            },
            {
                rawCommand: "l 100 120",
                operation: "L",
                relative: true,
                values: [100, 120],
                end: {
                    x: 100,
                    y: 120,
                },
            },
        ]);
    });

    it("Fails to parse unknown commands", () => {
        expect(() => parsePath("P 40 50")).to.throw();
    });
});
