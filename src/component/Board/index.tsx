import React from 'react';

export interface BaseProps {
    size: number;
}

export const Board = React.memo(({ size }: BaseProps) => {
    const [boardDrawn, setBoardDrawn] = React.useState(false);
    const width = size * 9;
    const height = size * 10;

    const drawBoard = React.useCallback(
        (canvas: HTMLCanvasElement) => {
            if (boardDrawn || !canvas) {
                return;
            }

            function drawLine(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, b: number) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + a, y + b);
                ctx.stroke();
            }

            function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
                drawLine(ctx, x - 5, y - 15, 0, 10);
                drawLine(ctx, x - 5, y - 5, -10, 0);
                drawLine(ctx, x - 5, y + 5, 0, 10);
                drawLine(ctx, x - 5, y + 5, -10, 0);
                drawLine(ctx, x + 5, y - 15, 0, 10);
                drawLine(ctx, x + 15, y - 5, -10, 0);
                drawLine(ctx, x + 5, y + 5, 0, 10);
                drawLine(ctx, x + 15, y + 5, -10, 0);
            }

            function drawHalfLeftPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
                drawLine(ctx, x - 5, y - 15, 0, 10);
                drawLine(ctx, x - 5, y - 5, -10, 0);
                drawLine(ctx, x - 5, y + 5, 0, 10);
                drawLine(ctx, x - 5, y + 5, -10, 0);
            }

            function drawHalfRightPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
                drawLine(ctx, x + 5, y - 15, 0, 10);
                drawLine(ctx, x + 15, y - 5, -10, 0);
                drawLine(ctx, x + 5, y + 5, 0, 10);
                drawLine(ctx, x + 15, y + 5, -10, 0);
            }

            canvas.height = height;
            canvas.width = width;
            const ROOT_X = size / 2;
            const ROOT_Y = size / 2;
            let x = ROOT_X;
            let y = ROOT_Y;

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return;
            }
            ctx.beginPath();
            ctx.fillStyle = '#fcaf3e';
            ctx.fillRect(ROOT_X - 45, ROOT_Y - 45, 90 + size * 8, 90 + size * 9);

            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 9; i++) {
                if (i === 0 || i === 8) {
                    drawLine(ctx, x, y, 0, size * 9);
                } else {
                    drawLine(ctx, x, y, 0, size * 4);
                    drawLine(ctx, x, y + size * 5, 0, size * 4);
                }
                x += size;
            }
            x = ROOT_X;
            y = ROOT_Y;
            for (let i = 0; i < 10; i++) {
                drawLine(ctx, x, y, size * 8, 0);
                y += size;
            }

            // Draw crosses
            drawLine(ctx, ROOT_X + size * 3, ROOT_X, size * 2, size * 2);
            drawLine(ctx, ROOT_X + size * 5, ROOT_X, -size * 2, size * 2);
            drawLine(ctx, ROOT_X + size * 3, ROOT_X + size * 7, size * 2, size * 2);
            drawLine(ctx, ROOT_X + size * 5, ROOT_X + size * 7, -size * 2, size * 2);

            // Draw Border
            drawLine(ctx, ROOT_X - 5, ROOT_Y - 5, 0, size * 9 + 10);
            drawLine(ctx, ROOT_X - 5, ROOT_Y - 5, size * 8 + 10, 0);
            drawLine(ctx, ROOT_X - 5, size * 9 + ROOT_Y + 5, size * 8 + 10, 0);
            drawLine(ctx, size * 8 + ROOT_X + 5, ROOT_Y - 5, 0, size * 9 + 10);

            // Draw texts
            ctx.font = '28px serif';
            ctx.strokeText('楚', ROOT_X + size * 5 + 10, ROOT_Y + size * 5 - 15);
            ctx.strokeText('河', ROOT_X + size * 6 + 10, ROOT_Y + size * 5 - 15);
            ctx.strokeText('漢', ROOT_X + size + 10, ROOT_Y + size * 5 - 15);
            ctx.strokeText('界', ROOT_X + size * 2 + 10, ROOT_Y + size * 5 - 15);

            drawPoint(ctx, ROOT_X + size, ROOT_Y + size * 2);
            drawPoint(ctx, ROOT_X + size * 2, ROOT_Y + size * 3);
            drawPoint(ctx, ROOT_X + size * 4, ROOT_Y + size * 3);
            drawPoint(ctx, ROOT_X + size * 6, ROOT_Y + size * 3);
            drawPoint(ctx, ROOT_X + size * 7, ROOT_Y + size * 2);

            drawPoint(ctx, ROOT_X + size, ROOT_Y + size * 7);
            drawPoint(ctx, ROOT_X + size * 2, ROOT_Y + size * 6);
            drawPoint(ctx, ROOT_X + size * 4, ROOT_Y + size * 6);
            drawPoint(ctx, ROOT_X + size * 6, ROOT_Y + size * 6);
            drawPoint(ctx, ROOT_X + size * 7, ROOT_Y + size * 7);

            drawHalfLeftPoint(ctx, ROOT_X + size * 8, ROOT_Y + size * 3);
            drawHalfLeftPoint(ctx, ROOT_X + size * 8, ROOT_Y + size * 6);
            drawHalfRightPoint(ctx, ROOT_X, ROOT_Y + size * 3);
            drawHalfRightPoint(ctx, ROOT_X, ROOT_Y + size * 6);
            setBoardDrawn(true);
        },
        [boardDrawn, height, width, size],
    );

    return <canvas ref={drawBoard} />;
});
