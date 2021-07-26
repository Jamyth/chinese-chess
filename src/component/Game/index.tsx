import React from 'react';
import { ChessUtil } from 'util/ChessUtil';
import type { Chess } from 'type/Chess';
import { CoordUtil } from 'util/CoordUtil';
import { Marker } from 'component/Marker';
import './index.less';

interface Props {
    game: (Chess | null)[][];
    size: number;
    selectedChess: string | null;
    onSelect: (chessOrNull: string | null) => void;
    onMove: (x: number, y: number) => void;
}

// eslint-disable-next-line sonarjs/cognitive-complexity -- TODO/Jamyth temp fix need refactor
export const Game = React.memo(({ game, size, selectedChess, onSelect, onMove }: Props) => {
    const boardStyle: React.CSSProperties = {
        width: size * 9 + 'px',
        height: size * 10 + 'px',
    };
    const chessStyle: React.CSSProperties = {
        minWidth: size + 'px',
        height: size + 'px',
        lineHeight: size + 'px',
    };
    const innerChessStyle: React.CSSProperties = {
        minWidth: size - 9 + 'px',
        height: size - 9 + 'px',
        fontSize: size * 0.55 + 'px',
        lineHeight: size - 9 + 'px',
    };

    const chess = selectedChess ? ChessUtil.getChess(selectedChess, game) : null;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked
    const availableMoves = chess ? ChessUtil.getAvailableMove(chess, selectedChess!, game) : [];

    const onBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const x = Math.floor((e.clientX - e.currentTarget.offsetLeft - e.currentTarget.scrollLeft) / size);
        const y = Math.floor((e.clientY - e.currentTarget.offsetTop + e.currentTarget.scrollTop) / size);
        if (selectedChess === null) {
            onSelect(CoordUtil.toString(x, y));
            return;
        }
        if (selectedChess === CoordUtil.toString(x, y)) {
            onSelect(null);
            return;
        }
        const [selectedX, selectedY] = CoordUtil.toCoord(selectedChess);
        const isSameSide = game[selectedY][selectedX]?.side === game[y][x]?.side;
        if (isSameSide) {
            onSelect(CoordUtil.toString(x, y));
            return;
        }
        onMove(x, y);
    };

    return (
        <div className="g-game-container" style={boardStyle} onClick={onBoardClick}>
            {game.map((row, y) => {
                return (
                    <div className="row" key={`${y + 1}`}>
                        {row.map((chess, x) => {
                            const isSelected = CoordUtil.toString(x, y) === selectedChess;
                            const isHighlighted = availableMoves.includes(CoordUtil.toString(x, y));
                            return (
                                <div className="container" style={chessStyle} key={`${x + 1}`}>
                                    {isSelected && (
                                        <div className="marker-container" style={chessStyle}>
                                            <Marker size={size} />
                                        </div>
                                    )}
                                    <div
                                        className={`${
                                            chess
                                                ? `chess ${isHighlighted ? 'eatable' : ''} ${chess.side} ${
                                                      isSelected ? 'selected' : ''
                                                  }`
                                                : 'empty'
                                        }`}
                                        style={chessStyle}
                                    >
                                        {chess ? (
                                            <div style={innerChessStyle}>
                                                {ChessUtil.translate(chess.piece, chess.side)}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
});
