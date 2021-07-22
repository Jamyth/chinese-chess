import Recoil from 'recoil'
import { GameNormalState } from 'module/game/normal'
import type { State } from './type'

export const useGameNormalState = <T>(fn: (state: State) => T): T => {
    const state = Recoil.useRecoilValue(GameNormalState);
    return fn(state);
}