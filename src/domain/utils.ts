import { SVGOperation } from "./index.js";

export function castToEnum<T>(str: string | number, enumType: T): T[keyof T] {
    // Cast the type to a Record to make TS ignore this as there is no good way (that I know of) to say that T must be an enum
    const enumValues = Object.values(enumType as Record<string, string | number>);

    if (enumValues.includes(str)) {
        return str as T[keyof T];
    }

    throw new TypeError(`String of ${JSON.stringify(str)} could not be cast to enum`);
}

export function castToSVGOperation(str: string): SVGOperation {
    return castToEnum(str.toLocaleUpperCase(), SVGOperation);
}
