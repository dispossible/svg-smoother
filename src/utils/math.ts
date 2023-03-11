import { Point } from "../domain";

export function moveTowards(movingPoint: Point, targetPoint: Point, amount: number): Point {
    const width = targetPoint.x - movingPoint.x;
    const height = targetPoint.y - movingPoint.y;

    const distance = Math.sqrt(width * width + height * height);

    return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance));
}

/**
 * @param fraction Must be between 0-1
 */
export function moveTowardsFractional(movingPoint: Point, targetPoint: Point, fraction: number): Point {
    return {
        x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
        y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
    };
}

export function roundToDp(value: number, decimalPlaces: number) {
    // ChatGPT wrote this. It's basically making a power of 10 based on the decimalPlaces,
    // then uses that to offset the decimal place in the value before rounding.
    // So 2dp is 100, 3 is 1000, 4 is 10000, etc
    const factor = 10 ** decimalPlaces;
    return Math.round(value * factor) / factor;
}
