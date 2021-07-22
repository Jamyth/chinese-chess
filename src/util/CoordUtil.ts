function toString(x: number, y: number) {
    return `${x}.${y}`;
}

function toCoord(coord: string): [number, number] {
    const [x, y] = coord.split('.');
    return [parseInt(x, 10), parseInt(y, 10)];
}

export const CoordUtil = Object.freeze({
    toString,
    toCoord,
});
