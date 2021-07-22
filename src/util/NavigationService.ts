import type React from 'react';
import { async } from 'coil-react';

export type Path = '/lobby' | '/game/normal';

export const NavigationService: Record<Path, React.ComponentType> = {
    '/lobby': async(() => import('module/lobby'), 'MainComponent'),
    '/game/normal': async(() => import('module/game/normal'), 'MainComponent'),
};
