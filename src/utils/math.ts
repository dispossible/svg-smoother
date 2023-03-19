import { Point } from "../domain";

export function moveTowards(movingPoint: Point, targetPoint: Point, amount: number): Point {
    const width = targetPoint.x - movingPoint.x;
    const height = targetPoint.y - movingPoint.y;

    const distance = Math.sqrt(width * width + height * height);

    return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, safeDivide(amount, distance)));
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

export function getDistance(pointOne: Point, pointTwo: Point): number {
    return Math.hypot(difference(pointOne.x, pointTwo.x), difference(pointOne.y, pointTwo.y));
}

export function difference(valOne: number, valTwo: number): number {
    return Math.abs(valOne - valTwo);
}

export function equalPoint(pointOne: Point, pointTwo: Point, decimalPlaces: number): boolean {
    return (
        roundToDp(pointOne.x, decimalPlaces) === roundToDp(pointTwo.x, decimalPlaces) &&
        roundToDp(pointOne.y, decimalPlaces) === roundToDp(pointTwo.y, decimalPlaces)
    );
}

export function safeDivide(a?: number, b?: number): number {
    if (!a || !b || a === 0 || b === 0) {
        return 0;
    }
    return a / b;
}
