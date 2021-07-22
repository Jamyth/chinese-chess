import type React from 'react';

export type SafeReactChild = React.ReactChild | boolean | undefined;
export type SafeReactChildren = SafeReactChild | SafeReactChild[];
