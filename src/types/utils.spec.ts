import "mocha";
import { expect } from "chai";

import { castToSVGOperation } from "./utils";
import { SVGOperation } from ".";

describe("Cast enums", () => {
    it("Can cast to a SVGOperations", () => {
        expect(castToSVGOperation("M")).to.be.eq(SVGOperation.MOVE);
        expect(castToSVGOperation("L")).to.be.eq(SVGOperation.LINE);
        expect(castToSVGOperation("c")).to.be.eq(SVGOperation.CUBIC);
        expect(castToSVGOperation("a")).to.be.eq(SVGOperation.ARC);
    });

    it("Fails to convert unknown operations", () => {
        expect(() => castToSVGOperation("F")).to.throw();
    });
});
