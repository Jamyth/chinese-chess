import Recoil from 'recoil';
import { injectLifeCycle, useCoilState } from 'coil-react';
import { Main } from './Main';
import type { State } from './type';
import { ChessUtil } from 'util/ChessUtil';
import type { Game } from 'type/Chess';
import { Side } from 'type/Chess';
import { CoordUtil } from 'util/CoordUtil';

const initialState: State = {
    game: null,
    selectedChess: null,
};

export const GameNormalState = Recoil.atom({
    key: 'GameNormalState',
    default: initialState,
});

export const useGameNormalAction = () => {
    const { getState, setState } = useCoilState(GameNormalState);

    const onMount = () => {
        if (getState().game === null) {
            const game: Game = {
                turn: Side.RED,
                board: ChessUtil.init(),
                redEaten: [],
                blackEaten: [],
            };
            setState((state) => (state.game = game));
        }
    };

    const onChessSelect = (chess: string | null) => {
        const game = getState().game;
        if (!game) {
            return;
        }
        if (chess) {
            const selectedChess = ChessUtil.getChess(chess, game.board);
            if (selectedChess?.side !== game.turn) {
                return;
            }
        }
        setState((state) => (state.selectedChess = chess));
    };

    const onMove = (x: number, y: number) => {
        const selectedChess = getState().selectedChess;
        if (!selectedChess) {
            return;
        }
        setState((state) => {
            if (!state.game) {
                return;
            }
            ChessUtil.move(selectedChess, CoordUtil.toString(x, y), state.game);
            state.selectedChess = null;
        });
    };

    return {
        onMount,
        onChessSelect,
        onMove,
    };
};

export const MainComponent = injectLifeCycle<any, any>(Main, useGameNormalAction);
