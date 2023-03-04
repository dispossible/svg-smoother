import "mocha";
import { expect } from "chai";

import { smoothPath } from "../src/index";

describe("SVG Smoother", () => {
    it("Smoother is a function", () => {
        expect(smoothPath).to.be.a("function");
    });
});
