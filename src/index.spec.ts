import "mocha";
import { expect } from "chai";
import { JSDOM } from "jsdom";

import { smoothPath, smoothPathElement, smoothPolygon } from "./index";

describe("SVG Smoother", () => {
    it("smoothPath is a function", () => {
        expect(smoothPath).to.be.a("function");
    });

    it("Smooth a simple corner", () => {
        expect(smoothPath("M 10 10 L 40 10 L 40 40")).to.equal("M 10 10 H 30 C 35 10 40 15 40 20 V 40");
    });

    it("Smooth a square", () => {
        expect(smoothPath("M 0 0 H 100 V 100 H 0 Z")).to.equal(
            "M 10 0 H 90 C 95 0 100 5 100 10 V 90 C 100 95 95 100 90 100 H 10 C 5 100 0 95 0 90 V 10 C 0 5 5 0 10 0 Z"
        );
    });

    it("Smooth a relative square", () => {
        expect(smoothPath("m 0 0 h 100 v 100 h -100 z")).to.equal(
            "M 10 0 H 90 C 95 0 100 5 100 10 V 90 C 100 95 95 100 90 100 H 10 C 5 100 0 95 0 90 V 10 C 0 5 5 0 10 0 Z"
        );
    });

    it("Smooth a multi-part path", () => {
        expect(smoothPath("M 10 10 H 40 V 40 M 10 20 H 30 V 40")).to.equal(
            "M 10 10 H 30 C 35 10 40 15 40 20 V 40 M 10 20 H 20 C 25 20 30 25 30 30 V 40"
        );
    });

    it("Doesn't mess up a shape made of curves", () => {
        expect(
            smoothPath(
                "M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z"
            )
        ).to.equal(
            "M 100 0 C 103.395 53.76 146.24 96.605 200 100 C 146.24 103.395 103.395 146.24 100 200 C 96.605 146.24 53.76 103.395 0 100 C 53.76 96.605 96.605 53.76 100 0 V 0 Z"
        );
    });

    it("Removes 0 distance moves and ignores curves", () => {
        expect(
            smoothPath(
                "M100 0V0C103.395 53.7596 146.24 96.6052 200 100V100V100C146.24 103.395 103.395 146.24 100 200V200V200C96.6052 146.24 53.7596 103.395 0 100V100V100C53.7596 96.6052 96.6052 53.7596 100 0Z"
            )
        ).to.equal(
            "M 100 0 C 103.395 53.76 146.24 96.605 200 100 C 146.24 103.395 103.395 146.24 100 200 C 96.605 146.24 53.76 103.395 0 100 C 53.76 96.605 96.605 53.76 100 0 V 0 Z"
        );
    });
});

describe("SVG Element Smoother", () => {
    const SVG_NS = "http://www.w3.org/2000/svg";

    it("smoothPathElement is a function", () => {
        expect(smoothPathElement).to.be.a("function");
    });

    it("Smooth a simple path element", () => {
        const dom = new JSDOM();
        const pathEl = dom.window.document.createElementNS(SVG_NS, "path");
        pathEl?.setAttributeNS(SVG_NS, "d", "M 10 10 L 40 10 L 40 40");

        smoothPathElement(pathEl);
        const newPath = pathEl?.getAttributeNS(SVG_NS, "d");

        expect(newPath).to.equal("M 10 10 H 30 C 35 10 40 15 40 20 V 40");
    });
});

describe("Polygon smoother", () => {
    it("smoothPolygon is a function", () => {
        expect(smoothPolygon).to.be.a("function");
    });

    it("Smooth a square", () => {
        expect(
            smoothPolygon([
                [0, 0],
                [100, 0],
                [100, 100],
                [0, 100],
            ])
        ).to.equal(
            "M 10 0 H 90 C 95 0 100 5 100 10 V 90 C 100 95 95 100 90 100 H 10 C 5 100 0 95 0 90 V 10 C 0 5 5 0 10 0 Z"
        );
    });

    it("Smooth a simple corner", () => {
        expect(
            smoothPolygon(
                [
                    [10, 10],
                    [40, 10],
                    [40, 40],
                ],
                { closePath: false }
            )
        ).to.equal("M 10 10 H 30 C 35 10 40 15 40 20 V 40");
    });
});
