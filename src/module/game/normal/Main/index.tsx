import React from 'react';
import { Board } from 'component/Board';
import { Game } from 'component/Game';
import { useGameNormalState } from '../hooks';
import { useGameNormalAction } from '../index';
import './index.less';

export const Main = React.memo(() => {
    let height = (window.innerHeight - 30) / 10;
    if (height * 9 > window.innerWidth) {
        height = window.innerWidth / 10;
    }
    const game = useGameNormalState((state) => state.game);
    const selectedChess = useGameNormalState((state) => state.selectedChess);
    const { onChessSelect, onMove } = useGameNormalAction();

    return (
        <div className="g-game-normal">
            <Board size={height} />
            <Game
                size={height}
                game={game?.board ?? []}
                selectedChess={selectedChess}
                onMove={onMove}
                onSelect={onChessSelect}
            />
        </div>
    );
});
