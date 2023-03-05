import { parsePath } from "./parsing/index.js";
import { smoothCommands } from "./smoother/index.js";
import { stringifyCommands } from "./utils/commands.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export function smoothPath(path: string, radius = 8): string {
    const inputCommands = parsePath(path);
    const smoothed = smoothCommands(inputCommands, radius);
    return stringifyCommands(smoothed);
}

export function smoothPathElement(pathEl: SVGPathElement, radius = 8): SVGPathElement {
    const pathString = pathEl.getAttributeNS(SVG_NS, "d") ?? "";
    const smoothedPath = smoothPath(pathString, radius);
    pathEl.setAttributeNS(SVG_NS, "d", smoothedPath);
    return pathEl;
}
