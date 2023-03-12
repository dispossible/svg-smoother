import "mocha";
import { expect } from "chai";

import { separateSubPaths } from "./subPaths";
import { parsePath } from "../parsing";

describe("Separate Sub Paths", () => {
    it("Can separate a path with two sub paths", () => {
        const commands = parsePath("M 10 10 L 20 20 M 10 20 L 30 20");
        expect(separateSubPaths(commands)).to.have.length(2);
    });
    it("Can separate a path with four sub paths", () => {
        const commands = parsePath("M 10 10 L 20 20 M 10 20 L 30 20 Z M 10 10 L 20 20 Z M 10 20 L 30 20");
        expect(separateSubPaths(commands)).to.have.length(4);
    });
    it("Doesn't separate a single path", () => {
        const commands = parsePath("M 10 10 L 20 20 L 10 20 L 30 20 Z");
        expect(separateSubPaths(commands)).to.have.length(1);
    });
});
