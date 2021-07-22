import type { Game } from 'type/Chess';

export interface State {
    game: Game | null;
    selectedChess: string | null;
}
