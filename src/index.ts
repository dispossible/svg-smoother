import { parsePath } from "./parsing";
import { smoothCommands } from "./smoother";
import { stringifyCommands } from "./utils/commands";
import { parsePolygon, Polygon } from "./parsing/polygon";
import { defaultConfig, defaultPolygonConfig, PolygonSmootherConfig, SmootherConfig } from "./domain/config";

const SVG_NS = "http://www.w3.org/2000/svg";

export function smoothPath(path: string, config?: Partial<SmootherConfig>): string {
    const fullConfig = defaultConfig(config);
    const inputCommands = parsePath(path);
    const smoothed = smoothCommands(inputCommands, fullConfig);
    return stringifyCommands(smoothed);
}

export function smoothPathElement(pathEl: SVGPathElement, config?: Partial<SmootherConfig>): SVGPathElement {
    const pathString = pathEl.getAttributeNS(SVG_NS, "d") ?? "";
    if (!pathString) {
        return pathEl;
    }
    const smoothedPath = smoothPath(pathString, config);
    pathEl.setAttributeNS(SVG_NS, "d", smoothedPath);
    return pathEl;
}

export function smoothPolygon(polygon: Polygon, config?: Partial<PolygonSmootherConfig>): string {
    const fullConfig = defaultPolygonConfig(config);
    const inputCommands = parsePolygon(polygon, fullConfig.closePath);
    const smoothed = smoothCommands(inputCommands, fullConfig);
    return stringifyCommands(smoothed);
}
