import type { Game, StepHistory } from 'type/Chess';

export interface State {
    game: Game | null;
    selectedChess: string | null;
    stepHistory: StepHistory[];
}
