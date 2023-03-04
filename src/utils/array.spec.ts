import "mocha";
import { expect } from "chai";

import { chunkArray } from "./array";

describe("Array chunking", () => {
    it("Chunks into even sized arrays", () => {
        expect(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2)).to.deep.equal([
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
            [9, 10],
        ]);
    });

    it("Deals with remainders", () => {
        expect(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3)).to.deep.equal([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });
});
