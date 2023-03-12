import { ParsedSVGCommand, SVGOperation } from "../domain/index";

export function separateSubPaths(commands: ParsedSVGCommand[]): ParsedSVGCommand[][] {
    const subPaths = commands.reduce(
        (subPaths, command) => {
            let currentPath = subPaths[subPaths.length - 1];
            if (command.operation === SVGOperation.MOVE && currentPath.length > 0) {
                subPaths.push([]);
                currentPath = subPaths[subPaths.length - 1];
            }
            currentPath.push(command);
            return subPaths;
        },
        [[]] as ParsedSVGCommand[][]
    );

    return subPaths;
}
