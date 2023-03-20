import "mocha";
import { expect } from "chai";

import { equalPoint, getDistance, moveTowards, roundToDp, safeDivide } from "./math";

describe("moveTowards utility", () => {
    it("Move toward point horizontally", () => {
        const point = {
            x: 0,
            y: 0,
        };
        const destination = {
            x: 100,
            y: 0,
        };
        expect(moveTowards(point, destination, 10)).to.deep.equal({
            x: 10,
            y: 0,
        });
    });

    it("Move toward point vertically", () => {
        const point = {
            x: 0,
            y: 0,
        };
        const destination = {
            x: 0,
            y: 100,
        };
        expect(moveTowards(point, destination, 10)).to.deep.equal({
            x: 0,
            y: 10,
        });
    });

    it("Move toward point diagonally", () => {
        const point = {
            x: 0,
            y: 0,
        };
        const destination = {
            x: 100,
            y: 100,
        };
        const movement = Math.sqrt((10 * 10) / 2);
        expect(moveTowards(point, destination, 10)).to.deep.equal({
            x: movement,
            y: movement,
        });
    });

    it("Move toward point diagonally up and left", () => {
        const point = {
            x: 100,
            y: 100,
        };
        const destination = {
            x: 0,
            y: 0,
        };
        const movement = 100 - Math.sqrt((10 * 10) / 2);
        expect(moveTowards(point, destination, 10)).to.deep.equal({
            x: movement,
            y: movement,
        });
    });

    it("Move toward point diagonally at offset", () => {
        const point = {
            x: 50,
            y: 50,
        };
        const destination = {
            x: 100,
            y: 100,
        };
        const movement = 50 + Math.sqrt((10 * 10) / 2);
        expect(moveTowards(point, destination, 10)).to.deep.equal({
            x: movement,
            y: movement,
        });
    });

    it("Move toward point diagonally at offset up and left", () => {
        const point = {
            x: 100,
            y: 100,
        };
        const destination = {
            x: 50,
            y: 50,
        };
        const movement = 100 - Math.sqrt((10 * 10) / 2);
        expect(moveTowards(point, destination, 10)).to.deep.equal({
            x: movement,
            y: movement,
        });
    });
});

describe("roundToDp", () => {
    it("Rounds to 2 dp", () => {
        expect(roundToDp(1.23456, 2)).to.equal(1.23);
        expect(roundToDp(653245.55482, 2)).to.equal(653245.55);
        expect(roundToDp(1.23756, 2)).to.equal(1.24);
    });

    it("Rounds to 3 dp", () => {
        expect(roundToDp(1.23456, 3)).to.equal(1.235);
        expect(roundToDp(653245.55482, 3)).to.equal(653245.555);
    });

    it("Rounds to 4 dp", () => {
        expect(roundToDp(1.23456, 4)).to.equal(1.2346);
        expect(roundToDp(653245.55482, 4)).to.equal(653245.5548);
    });

    it("Doesn't round when doesn't need to", () => {
        expect(roundToDp(1.23, 4)).to.equal(1.23);
        expect(roundToDp(123456, 4)).to.equal(123456);
    });
});

describe("getDistance", () => {
    it("Can calculate the distance between 2 points", () => {
        // (10 - 8 = 2) then Pythagoras 2^2 + 2^2 = sqrt(8)
        expect(getDistance({ x: 8, y: 8 }, { x: 10, y: 10 })).to.equal(Math.sqrt(8));
    });

    it("Can calculate the distance when negative", () => {
        expect(getDistance({ x: 10, y: 10 }, { x: 8, y: 8 })).to.equal(Math.sqrt(8));
    });

    it("Works for strait lines", () => {
        expect(getDistance({ x: 10, y: 10 }, { x: 10, y: 50 })).to.equal(40);
    });
});

describe("equalPoint", () => {
    it("Can match two points", () => {
        expect(equalPoint({ x: 5, y: 5 }, { x: 5, y: 5 }, 2)).to.be.true;
    });
    it("Works with rounding", () => {
        expect(equalPoint({ x: 5.00035, y: 5 }, { x: 5, y: 4.997 }, 2)).to.be.true;
    });
    it("Doesn't match different points", () => {
        expect(equalPoint({ x: 4, y: 5 }, { x: 5, y: 6 }, 2)).to.be.false;
        expect(equalPoint({ x: 5, y: 5 }, { x: 5, y: 6 }, 2)).to.be.false;
    });
    it("Doesn't match with rounding", () => {
        expect(equalPoint({ x: 5, y: 5 }, { x: 5, y: 5.007 }, 2)).to.be.false;
    });
});

describe("safeDivide", () => {
    it("Can divide two numbers", () => {
        expect(safeDivide(5, 2)).to.equal(2.5);
        expect(safeDivide(10, 5)).to.equal(2);
        expect(safeDivide(5, 10)).to.equal(0.5);
    });

    it("Can handle missing values", () => {
        expect(safeDivide(5, undefined)).to.equal(0);
        expect(safeDivide(undefined, 5)).to.equal(0);
        expect(safeDivide(undefined, undefined)).to.equal(0);
    });

    it("Can handle divide by zero", () => {
        expect(safeDivide(5, 0)).to.equal(0);
        expect(safeDivide(0, 0)).to.equal(0);
        expect(safeDivide(0, 5)).to.equal(0);
    });
});
