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
    const { onChessSelect, onMove, onGoBack } = useGameNormalAction();
    // const boardStyle: React.CSSProperties = {
    //     width: height * 9 + 'px',
    //     height: height * 10 + 'px',
    // };
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
            <button type="button" onClick={onGoBack}>
                Go Back
            </button>
        </div>
    );
});
