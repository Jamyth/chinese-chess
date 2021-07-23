import { ChessPiece, Side } from 'type/Chess';
import type { Chess, Game } from 'type/Chess';
import { CoordUtil } from 'util/CoordUtil';

interface MoveConfig {
    isLeftMost: boolean;
    isRightMost: boolean;
    isTopMost: boolean;
    isBottomMost: boolean;
}

type Direction = 'top' | 'left' | 'right' | 'bottom';

function init(): (Chess | null)[][] {
    const emptyRow = [null, null, null, null, null, null, null, null, null, null];
    const baseRow = [
        ChessPiece.TESLA,
        ChessPiece.KNIGHT,
        ChessPiece.BISHOP,
        ChessPiece.MINISTER,
        ChessPiece.GENERAL,
        ChessPiece.MINISTER,
        ChessPiece.BISHOP,
        ChessPiece.KNIGHT,
        ChessPiece.TESLA,
    ];
    const cannonRow = [null, ChessPiece.CANNON, null, null, null, null, null, ChessPiece.CANNON, null];
    const soldierRow = [
        ChessPiece.SOLDIER,
        null,
        ChessPiece.SOLDIER,
        null,
        ChessPiece.SOLDIER,
        null,
        ChessPiece.SOLDIER,
        null,
        ChessPiece.SOLDIER,
    ];

    const withSide =
        (side: Side) =>
        (chessOrEmpty: ChessPiece | null): Chess | null =>
            chessOrEmpty
                ? {
                      side,
                      piece: chessOrEmpty,
                  }
                : null;

    const baseRowRed = baseRow.map(withSide(Side.RED));
    const cannonRowRed = cannonRow.map(withSide(Side.RED));
    const soldierRowRed = soldierRow.map(withSide(Side.RED));

    const baseRowBlack = baseRow.map(withSide(Side.BLACK));
    const cannonRowBlack = cannonRow.map(withSide(Side.BLACK));
    const soldierRowBlack = soldierRow.map(withSide(Side.BLACK));
    return [
        baseRowBlack,
        emptyRow,
        cannonRowBlack,
        soldierRowBlack,
        emptyRow,
        emptyRow,
        soldierRowRed,
        cannonRowRed,
        emptyRow,
        baseRowRed,
    ];
}

function translate(piece: ChessPiece, side: Side): string {
    switch (piece) {
        case ChessPiece.GENERAL:
            return side === Side.BLACK ? '將' : '帥';
        case ChessPiece.MINISTER:
            return '士';
        case ChessPiece.BISHOP:
            return side === Side.BLACK ? '象' : '相';
        case ChessPiece.KNIGHT:
            return '馬';
        case ChessPiece.TESLA:
            return '車';
        case ChessPiece.CANNON:
            return '砲';
        case ChessPiece.SOLDIER:
            return side === Side.BLACK ? '卒' : '兵';
    }
}

function getChess(selectedChess: string, board: (Chess | null)[][]) {
    const [x, y] = CoordUtil.toCoord(selectedChess);
    return board[y][x];
}

function move(selectedCoord: string, targetCoord: string, game: Game) {
    const { turn, board, redEaten, blackEaten } = game;
    const [selectedX, selectedY] = CoordUtil.toCoord(selectedCoord);
    const [targetX, targetY] = CoordUtil.toCoord(targetCoord);

    const selected = getChess(selectedCoord, board);
    const target = getChess(targetCoord, board);

    if (!selected) {
        return;
    }

    const availableMoves = getAvailableMove(selected, selectedCoord, board);
    if (!availableMoves.includes(targetCoord)) {
        return;
    }

    board[targetY][targetX] = selected;
    board[selectedY][selectedX] = null;

    if (target) {
        if (target.side === Side.BLACK) {
            redEaten.push(target);
        } else {
            blackEaten.push(target);
        }
    }
    game.turn = turn === Side.BLACK ? Side.RED : Side.BLACK;
}

function getAvailableMove(chess: Chess, coordinate: string, board: (Chess | null)[][]): string[] {
    const isRed = chess.side === Side.RED;
    const [x, y] = CoordUtil.toCoord(coordinate);
    const moveConfig: MoveConfig = {
        isLeftMost: x === 0,
        isRightMost: x === 8,
        isTopMost: y === 0,
        isBottomMost: y === 9,
    };
    let moves: string[] = [];
    switch (chess.piece) {
        case ChessPiece.SOLDIER:
            moves = getSoldierAvailableMoves(isRed, x, y, moveConfig);
            break;
        case ChessPiece.BISHOP:
            moves = getBishopAvailableMoves(isRed, x, y);
            break;
        case ChessPiece.MINISTER:
            moves = getMinisterAvailableMoves(isRed, x, y);
            break;
        case ChessPiece.TESLA:
            moves = getTeslaAvailableMoves(chess.side, x, y, board);
            break;
        case ChessPiece.CANNON:
            moves = getCannonAvailableMoves(chess.side, x, y, board);
            break;
        case ChessPiece.GENERAL:
            moves = getGeneralAvailableMoves(isRed, x, y, board);
            break;
        case ChessPiece.KNIGHT:
            moves = getKnightAvailableMoves(x, y, board);
            break;
    }
    return moves.filter(filterOwnSideChess(isRed, board));
}

function booleanFilter<T extends string>(target: string | false): target is T {
    return target !== false;
}

/**
 * available moves includes coordinates that same-side-chess is on
 * need to remove
 */
function filterOwnSideChess(isRed: boolean, board: (Chess | null)[][]) {
    return (coordinate: string) => {
        const chess = getChess(coordinate, board);
        return chess?.side !== (isRed ? Side.RED : Side.BLACK);
    };
}

function getSoldierAvailableMoves(
    isRed: boolean,
    x: number,
    y: number,
    { isBottomMost, isLeftMost, isRightMost, isTopMost }: MoveConfig,
): string[] {
    const leftRightCoords = [!isLeftMost && CoordUtil.toString(x - 1, y), !isRightMost && CoordUtil.toString(x + 1, y)];

    const redMoves = [!isTopMost && CoordUtil.toString(x, y - 1), ...(y < 5 ? leftRightCoords : [])].filter(
        booleanFilter,
    );
    const blackMoves = [!isBottomMost && CoordUtil.toString(x, y + 1), ...(y > 4 ? leftRightCoords : [])].filter(
        booleanFilter,
    );
    return isRed ? redMoves : blackMoves;
}

function getBishopAvailableMoves(isRed: boolean, x: number, y: number): string[] {
    const topLeft = [x - 2, y - 2];
    const topRight = [x + 2, y - 2];
    const bottomLeft = [x - 2, y + 2];
    const bottomRight = [x + 2, y + 2];

    const filter = isRed
        ? ([x, y]: number[]) => {
              return x >= 0 && x < 9 && y > 4 && y < 10;
          }
        : ([x, y]: number[]) => {
              return x >= 0 && x < 9 && y > 0 && y < 5;
          };

    return [topLeft, topRight, bottomLeft, bottomRight].filter(filter).map(([x, y]) => CoordUtil.toString(x, y));
}

function getMinisterAvailableMoves(isRed: boolean, x: number, y: number): string[] {
    const topLeft = [x - 1, y - 1];
    const topRight = [x + 1, y - 1];
    const bottomLeft = [x - 1, y + 1];
    const bottomRight = [x + 1, y + 1];

    const filter = isRed
        ? ([x, y]: number[]) => {
              return x >= 3 && x < 6 && y > 6 && y < 10;
          }
        : ([x, y]: number[]) => {
              return x >= 3 && x < 6 && y >= 0 && y < 3;
          };

    return [topLeft, topRight, bottomLeft, bottomRight].filter(filter).map(([x, y]) => CoordUtil.toString(x, y));
}

function getTeslaAvailableMoves(side: Side, x: number, y: number, board: (Chess | null)[][]) {
    const topMostChess = getClosestChess('top', x, y, board);
    const rightMostChess = getClosestChess('right', x, y, board);
    const bottomMostChess = getClosestChess('bottom', x, y, board);
    const leftMostChess = getClosestChess('left', x, y, board);

    const horizontal = [...new Array(9)].map((_, x) => CoordUtil.toString(x, y));
    const vertical = [...new Array(10)].map((_, y) => CoordUtil.toString(x, y));

    const minX = leftMostChess ? leftMostChess.x + (leftMostChess.chess.side === side ? 1 : 0) : undefined;
    const maxX = rightMostChess ? rightMostChess.x + (rightMostChess.chess.side === side ? 0 : 1) : undefined;
    const minY = topMostChess ? topMostChess.y + (topMostChess.chess.side === side ? 1 : 0) : undefined;
    const maxY = bottomMostChess ? bottomMostChess.y + (bottomMostChess.chess.side === side ? 0 : 1) : undefined;

    return [
        ...horizontal.slice(minX, x),
        ...horizontal.slice(x, maxX),
        ...vertical.slice(minY, y),
        ...vertical.slice(y, maxY),
    ];
}

function getCannonAvailableMoves(side: Side, x: number, y: number, board: (Chess | null)[][]) {
    const topMostChess = getClosestChess('top', x, y, board);
    const rightMostChess = getClosestChess('right', x, y, board);
    const bottomMostChess = getClosestChess('bottom', x, y, board);
    const leftMostChess = getClosestChess('left', x, y, board);

    const horizontal = [...new Array(9)].map((_, x) => CoordUtil.toString(x, y));
    const vertical = [...new Array(10)].map((_, y) => CoordUtil.toString(x, y));

    const minX = leftMostChess ? leftMostChess.x + 1 : undefined;
    const maxX = rightMostChess ? rightMostChess.x : undefined;
    const minY = topMostChess ? topMostChess.y + 1 : undefined;
    const maxY = bottomMostChess ? bottomMostChess.y : undefined;

    const topSkippedChess = topMostChess ? getClosestChess('top', topMostChess.x, topMostChess.y, board) : null;
    const leftSkippedChess = leftMostChess ? getClosestChess('left', leftMostChess.x, leftMostChess.y, board) : null;
    const rightSkippedChess = rightMostChess
        ? getClosestChess('right', rightMostChess.x, rightMostChess.y, board)
        : null;
    const bottomSkippedChess = bottomMostChess
        ? getClosestChess('bottom', bottomMostChess.x, bottomMostChess.y, board)
        : null;

    const filter = (
        chess: { chess: Chess; x: number; y: number } | null,
    ): chess is { chess: Chess; x: number; y: number } => {
        return chess !== null && chess.chess.side !== side;
    };

    const eatableChess = [topSkippedChess, leftSkippedChess, rightSkippedChess, bottomSkippedChess]
        .filter(filter)
        .map(({ x, y }) => CoordUtil.toString(x, y));

    return [
        ...horizontal.slice(minX, x),
        ...horizontal.slice(x, maxX),
        ...vertical.slice(minY, y),
        ...vertical.slice(y, maxY),
        ...eatableChess,
    ];
}

function getGeneralAvailableMoves(isRed: boolean, x: number, y: number, board: (Chess | null)[][]) {
    const top = [x, y - 1];
    const bottom = [x, y + 1];
    const right = [x + 1, y];
    const left = [x - 1, y];

    const filter = isRed
        ? ([x, y]: number[]) => {
              return x >= 3 && x < 6 && y > 6 && y < 10;
          }
        : ([x, y]: number[]) => {
              return x >= 3 && x < 6 && y >= 0 && y < 3;
          };

    const moves: string[] = [top, left, right, bottom].filter(filter).map(([x, y]) => CoordUtil.toString(x, y));

    const oppositeChess = getClosestChess(isRed ? 'top' : 'bottom', x, y, board);
    if (oppositeChess && oppositeChess.chess.piece === ChessPiece.GENERAL) {
        moves.push(CoordUtil.toString(oppositeChess.x, oppositeChess.y));
    }

    return moves;
}

function getKnightAvailableMoves(x: number, y: number, board: (Chess | null)[][]) {
    const topLeft = [x - 1, y - 2];
    const topRight = [x + 1, y - 2];
    const leftTop = [x - 2, y - 1];
    const leftBottom = [x - 2, y + 1];
    const rightTop = [x + 2, y - 1];
    const rightBottom = [x + 2, y + 1];
    const bottomLeft = [x - 1, y + 2];
    const bottomRight = [x + 1, y + 2];

    const isTopBlocked = y - 1 >= 0 ? getChess(CoordUtil.toString(x, y - 1), board) !== null : false;
    const isLeftBlocked = x - 1 >= 0 ? getChess(CoordUtil.toString(x - 1, y), board) !== null : false;
    const isRightBlocked = x + 1 < 9 ? getChess(CoordUtil.toString(x + 1, y), board) !== null : false;
    const isBottomBlocked = y + 1 < 10 ? getChess(CoordUtil.toString(x, y + 1), board) !== null : false;

    const filter = ([x, y]: number[]) => {
        return x >= 0 && x < 9 && y >= 0 && y < 10;
    };

    const topGroup = !isTopBlocked ? [topLeft, topRight] : [];
    const leftGroup = !isLeftBlocked ? [leftTop, leftBottom] : [];
    const rightGroup = !isRightBlocked ? [rightTop, rightBottom] : [];
    const bottomGroup = !isBottomBlocked ? [bottomLeft, bottomRight] : [];

    return [...topGroup, ...leftGroup, ...rightGroup, ...bottomGroup]
        .filter(filter)
        .map(([x, y]) => CoordUtil.toString(x, y));
}

function getClosestChess(
    direction: Direction,
    x: number,
    y: number,
    board: (Chess | null)[][],
): { chess: Chess; x: number; y: number } | null {
    const accumulator = (x: number, y: number): [number, number] => {
        switch (direction) {
            case 'right':
                return [x + 1, y];
            case 'bottom':
                return [x, y + 1];
            case 'top':
                return [x, y - 1];
            case 'left':
                return [x - 1, y];
        }
    };
    if (
        (direction === 'right' && x === 8) ||
        (direction === 'bottom' && y === 9) ||
        (direction === 'top' && y === 0) ||
        (direction === 'left' && x === 0)
    ) {
        return null;
    }
    let coordinate = accumulator(x, y);
    let chess = getChess(CoordUtil.toString(coordinate[0], coordinate[1]), board);
    while (!chess) {
        coordinate = accumulator(coordinate[0], coordinate[1]);
        // Check if out of bounce
        if (coordinate[0] < 0 || coordinate[0] > 8 || coordinate[1] < 0 || coordinate[1] > 9) {
            return null;
        }
        chess = getChess(CoordUtil.toString(coordinate[0], coordinate[1]), board);
    }

    return {
        chess,
        x: coordinate[0],
        y: coordinate[1],
    };
}

export const ChessUtil = Object.freeze({ init, translate, move, getChess, getAvailableMove });
