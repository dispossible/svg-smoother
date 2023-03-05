import "mocha";
import { expect } from "chai";
import { JSDOM } from "jsdom";

import { smoothPath, smoothPathElement } from "./index";

describe("SVG Smoother", () => {
    it("smoothPath is a function", () => {
        expect(smoothPath).to.be.a("function");
    });

    it("Smooth a simple corner", () => {
        expect(smoothPath("M 10 10 L 40 10 L 40 40", 10)).to.equal("M 10 10 L 30 10 C 35 10 40 15 40 20 L 40 40");
    });

    it("Smooth a square", () => {
        expect(smoothPath("M 0 0 H 100 V 100 H 0 Z", 10)).to.equal(
            "M 10 0 L 90 0 C 95 0 100 5 100 10 L 100 90 C 100 95 95 100 90 100 L 10 100 C 5 100 0 95 0 90 L 0 10 C 0 5 5 0 10 0 Z"
        );
    });

    it("Smooth a relative square", () => {
        expect(smoothPath("m 0 0 h 100 v 100 h -100 z", 10)).to.equal(
            "M 10 0 L 90 0 C 95 0 100 5 100 10 L 100 90 C 100 95 95 100 90 100 L 10 100 C 5 100 0 95 0 90 L 0 10 C 0 5 5 0 10 0 Z"
        );
    });
});

describe("SVG Element Smoother", () => {
    const SVG_NS = "http://www.w3.org/2000/svg";

    it("smoothPathElement is a function", () => {
        expect(smoothPathElement).to.be.a("function");
    });

    it("Smooth a simple path element", () => {
        const dom: JSDOM = new JSDOM();
        const pathEl = dom.window.document.createElementNS(SVG_NS, "path");
        pathEl?.setAttributeNS(SVG_NS, "d", "M 10 10 L 40 10 L 40 40");

        smoothPathElement(pathEl, 10);
        const newPath = pathEl?.getAttributeNS(SVG_NS, "d");

        expect(newPath).to.equal("M 10 10 L 30 10 C 35 10 40 15 40 20 L 40 40");
    });
});
