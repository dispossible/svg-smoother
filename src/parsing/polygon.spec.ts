import "mocha";
import { expect } from "chai";

import { parsePolygon } from "./polygon";

describe("Polygon parsing", () => {
    it("Can parse a simple triangle", () => {
        expect(
            parsePolygon([
                [0, 0],
                [10, 0],
                [10, 10],
            ])
        ).to.deep.equal([
            {
                rawCommand: "M 0 0",
                operation: "M",
                relative: false,
                values: [0, 0],
                end: {
                    x: 0,
                    y: 0,
                },
            },
            {
                rawCommand: "L 10 0",
                operation: "L",
                relative: false,
                values: [10, 0],
                end: {
                    x: 10,
                    y: 0,
                },
            },
            {
                rawCommand: "L 10 10",
                operation: "L",
                relative: false,
                values: [10, 10],
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                rawCommand: "Z",
                operation: "Z",
                relative: false,
                values: [],
            },
        ]);
    });

    it("Throws an error if typing is incorrect", () => {
        // @ts-expect-error intentionally giving a bad value to test error is thrown
        expect(() => parsePolygon("M 0 0 L 10 0 L 10 10 Z")).to.throw();
        expect(() =>
            parsePolygon([
                [0, 10],
                // @ts-expect-error intentionally giving a bad value to test error is thrown
                [10, "foo"],
                [10, 10],
            ])
        ).to.throw();
        // @ts-expect-error intentionally giving a bad value to test error is thrown
        expect(() => parsePolygon([[0, 10], [10], [10, 10]])).to.throw();
        expect(() =>
            parsePolygon([
                [0, 10],
                [10, 0],
                // @ts-expect-error intentionally giving a bad value to test error is thrown
                [10, 10, 20],
            ])
        ).to.throw();
    });

    it("Can choose to close the path", () => {
        expect(
            parsePolygon(
                [
                    [10, 10],
                    [40, 10],
                ],
                true
            )
        ).to.deep.equal([
            {
                rawCommand: "M 10 10",
                operation: "M",
                relative: false,
                values: [10, 10],
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                rawCommand: "L 40 10",
                operation: "L",
                relative: false,
                values: [40, 10],
                end: {
                    x: 40,
                    y: 10,
                },
            },
            {
                rawCommand: "Z",
                operation: "Z",
                relative: false,
                values: [],
            },
        ]);
        expect(
            parsePolygon(
                [
                    [10, 10],
                    [40, 10],
                ],
                false
            )
        ).to.deep.equal([
            {
                rawCommand: "M 10 10",
                operation: "M",
                relative: false,
                values: [10, 10],
                end: {
                    x: 10,
                    y: 10,
                },
            },
            {
                rawCommand: "L 40 10",
                operation: "L",
                relative: false,
                values: [40, 10],
                end: {
                    x: 40,
                    y: 10,
                },
            },
        ]);
    });
});
