import { smoothPathElement } from "../dist/index.mjs";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Must keep this manually in sync with the defaults of config
const defaultConfig = {
    radius: 10,
    reduceCommands: true,
    numberAccuracy: 3,
    preventOverflow: true,
    allowEllipse: true,
};

const SVG_NS = "http://www.w3.org/2000/svg";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const template = fs.readFileSync(path.join(__dirname, "./examples.html"), "utf-8");
const dom = new JSDOM(template);

const examples = [
    ["Square", "0 0 200 200", "M 20 20 h 160 v 160 h -160 Z", { radius: 20 }],
    ["Triangle", "0 0 200 200", "M 100 20 L 180 180 L 20 180 Z", { radius: 20 }],
    [
        "Star",
        "0 0 200 200",
        "M100 0L124.1 58.2576L186.603 50L148.2 100L186.603 150L124.1 141.742L100 200L75.9 141.742L13.3975 150L51.8 100L13.3975 50L75.9 58.2576Z",
        { radius: 20 },
    ],
    [
        "Asterisk",
        "-5 -5 210 210",
        "M120 0H80V51.7157L43.4315 15.1472L15.1472 43.4314L51.7158 80H0V120H51.7157L15.1472 156.568L43.4315 184.853L80 148.284V200H120V148.284L156.569 184.853L184.853 156.569L148.284 120H200V80H148.284L184.853 43.4314L156.569 15.1471L120 51.7157Z",
        { radius: 20 },
    ],
    [
        "Shuriken",
        "0 0 200 200",
        "M99.995 200V143.969L0 99.995H56.0313L99.995 0V56.0313L200 99.995H143.969Z",
        { radius: 20 },
    ],
    [
        "Subpaths",
        "0 0 200 200",
        "M156.064 143.936L112.127 100L156.064 56.0636L200 100ZM43.9364 143.936L0 100L43.9364 56.0636L87.8728 100ZM100 200L56.0636 156.064L100 112.127L143.936 156.064ZM100 87.8728L56.0636 43.9364L100 0L143.936 43.9364Z",
        { radius: 20 },
    ],
    ["Overflow", "0 0 200 200", "M 20 20 h 160 v 160 h -160 Z", { radius: 120 }],
    ["Overflow2", "0 0 200 200", "M 20 20 h 160 v 160 h -160 Z", { radius: 120, preventOverflow: false }],
    ["Ellipse", "0 0 200 200", "M 20 20 h 75 v 160 h -75 Z", { radius: 120 }],
    ["Pill", "0 0 200 200", "M 20 20 h 160 v 75 h -160 Z", { radius: 120, allowEllipse: false }],
    [
        "Rainbow",
        "-5 -5 210 210",
        "M200 150H143.75C143.75 125.838 124.162 106.25 100 106.25C75.8375 106.25 56.25 125.838 56.25 150H0C0 94.7715 44.7715 50 100 50C155.228 50 200 94.7715 200 150Z",
        { radius: 20 },
    ],
    [
        "Semicircle",
        "-5 -5 210 210",
        "M200 150C200 94.7715 155.228 50 100 50C44.7715 50 0 94.7715 0 150Z",
        { radius: 20 },
    ],
    [
        "Iris",
        "-5 -5 210 210",
        "M200 99.5882C200 99.5882 155.228 150.176 100 150.176C44.7715 150.176 0 99.5882 0 99.5882C0 99.5882 44.7715 49 100 49C155.228 49 200 99.5882 200 99.5882Z",
        { radius: 20 },
    ],
    [
        "Sparkle",
        "-5 -5 210 210",
        "M100 0V0C103.395 53.7596 146.24 96.6052 200 100V100V100C146.24 103.395 103.395 146.24 100 200V200V200C96.6052 146.24 53.7596 103.395 0 100V100V100C53.7596 96.6052 96.6052 53.7596 100 0Z",
        { radius: 20 },
    ],
    ["Random Poly", "0 0 200 200", createRandomPath(200, 200), { radius: 20 }],
    ["Random Poly", "0 0 200 200", createRandomPath(200, 200), { radius: 20 }],
    ["Random Poly", "0 0 200 200", createRandomPath(200, 200), { radius: 20 }],
    ["Random Poly", "0 0 200 200", createRandomPath(200, 200), { radius: 20 }],
    ["Random Poly", "0 0 200 200", createRandomPath(200, 200), { radius: 20 }],
];

/**
 *
 * @param {string} path
 * @param {number} radius
 */
function createPathElements(path, config) {
    const pathEl = dom.window.document.createElementNS(SVG_NS, "path");
    pathEl?.setAttributeNS(SVG_NS, "d", path);
    const pathElSmooth = dom.window.document.createElementNS(SVG_NS, "path");
    pathElSmooth?.setAttributeNS(SVG_NS, "d", path);

    pathEl.setAttributeNS(SVG_NS, "stroke", "hsla(250deg 100% 70% / 60%)");
    pathEl.setAttributeNS(SVG_NS, "stroke-width", "3");
    pathEl.setAttributeNS(SVG_NS, "fill", "none");

    pathElSmooth.setAttributeNS(SVG_NS, "stroke", "hsl(290deg 100% 90%)");
    pathElSmooth.setAttributeNS(SVG_NS, "stroke-width", "1");
    pathElSmooth.setAttributeNS(SVG_NS, "fill", "none");

    return [pathEl, smoothPathElement(pathElSmooth, config)];
}

function createSVGElement(viewBox, path, config) {
    const svgEl = dom.window.document.createElementNS(SVG_NS, "svg");
    svgEl.setAttribute("xmlns", SVG_NS);
    svgEl.setAttributeNS(SVG_NS, "viewBox", viewBox);
    const pathEls = createPathElements(path, config);
    pathEls.forEach((pathEl) => {
        svgEl.append(pathEl);
    });
    return svgEl;
}

function createRandomPath(width = 100, height = 100) {
    const points = new Array(16).fill([0, 0]).map(() => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return [x, y];
    });
    return (
        points
            .map(([x, y], i) => {
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ") + " Z"
    );
}

const list = dom.window.document.createElement("ul");
examples.forEach(([title, viewBox, path, config]) => {
    const svgEl = createSVGElement(viewBox, path, config);
    const li = dom.window.document.createElement("li");
    const configEl = dom.window.document.createElement("div");
    configEl.classList.add("config");
    configEl.innerHTML = title + "\n" + JSON.stringify({ ...defaultConfig, ...config }, null, 4);
    li.append(svgEl);
    li.append(configEl);
    list.append(li);
});
dom.window.document.body.append(list);

fs.writeFileSync("./examples.html", dom.serialize(), "utf-8");
