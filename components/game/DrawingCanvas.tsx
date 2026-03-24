"use client"

import { useRef, useEffect, useState } from "react";
import { socket } from "@/lib/socket"

export default function DrawingCanvas({ roomId, isDrawer }: { roomId: string; isDrawer: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const lastEmitTime = useRef<number>(0);

    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(3);

    const drawLine = useCallback((x0: number, y0: number, x1: number, y1: number, c: string, s: number) => {
        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.strokeStyle = c;
        ctx.lineWidth = s;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.closePath();
    }, []);

    const throttleEmit = (data: any) => {
        const now = Date.now();

        if (now - lastEmitTime.current > 16) {
            socket.emit("draw", data);
            lastEmitTime.current = now;
        }
    };

    const draw = (e: React.MouseEvent) => {
        if (!drawing || !isDrawer || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const prevX = x - e.movementX;
        const prevY = y - e.movementY;

        drawLine(prevX, prevY, x, y, color, size);

        throttleEmit({ roomId, x, y, prevX, prevY, color, size });

    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ctxRef.current = canvas.getContext("2d")

        canvas.width = 800;
        canvas.height = 500;

        const handleRemoteDraw = (data: any) => {
            if (!isDrawer) drawLine(data.prevX, data.prevY, data.x, data.y, data.color, data.size);
        }

        socket.on("drawing", handleRemoteDraw);
        return () => { socket.off("drawing", handleRemoteDraw) }
    }, [isDrawer, drawLine]);

    return (
        <canvas
            ref={canvasRef}
            className="border bg-white rounded-lg cursor-crosshair touch-none"
            onMouseDown={() => isDrawer && setDrawing(true)}
            onMouseMove={draw}
            onMouseUp={() => setDrawing(false)}
            onMouseLeave={() => setDrawing(false)}
        />
    );
}