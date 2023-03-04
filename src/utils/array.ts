export function chunkArray<T>(arr: T[], size: number): T[][] {
    if (size < 1) {
        return [arr];
    }
    if (arr.length % size !== 0) {
        console.warn(
            `Warning: Chucked array does not group evenly into ${size} length chunks, final value set will have length ${
                arr.length % size
            }`
        );
    }

    const chunks: T[][] = [];

    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }

    return chunks;
}
