import "mocha";
import { expect } from "chai";

import { moveTowards } from "./math";

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
