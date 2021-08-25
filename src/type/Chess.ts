export enum ChessPiece {
    SOLDIER = 'SOLDIER',
    CANNON = 'CANNON',
    TESLA = 'TESLA',
    KNIGHT = 'KNIGHT',
    BISHOP = 'BISHOP',
    MINISTER = 'MINISTER',
    GENERAL = 'GENERAL',
}

export enum Side {
    RED = 'RED',
    BLACK = 'BLACK',
}

export interface Chess {
    side: Side;
    piece: ChessPiece;
}

interface Coordinate {
    x: number;
    y: number;
}

export interface StepHistory {
    chess: Chess;
    from: Coordinate;
    to: Coordinate;
}

export interface Game {
    turn: Side;
    board: (Chess | null)[][];
    redEaten: Chess[];
    blackEaten: Chess[];
}
