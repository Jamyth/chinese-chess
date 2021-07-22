import Recoil from 'recoil'
import { LobbyState } from 'module/lobby'
import type { State } from './type'

export const useLobbyState = <T>(fn: (state: State) => T): T => {
    const state = Recoil.useRecoilValue(LobbyState);
    return fn(state);
}