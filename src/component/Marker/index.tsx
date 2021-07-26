import React from 'react';
import './index.less';

interface Props {
    size: number;
}

export const Marker = React.memo(({ size }: Props) => {
    const style: React.CSSProperties = {
        minWidth: size + 'px',
        height: size + 'px',
        lineHeight: size + 'px',
    };

    return (
        <div className="g-marker" style={style}>
            <div className="container top-left" />
            <div className="container top-right" />
            <div className="container bottom-left" />
            <div className="container bottom-right" />
        </div>
    );
});
