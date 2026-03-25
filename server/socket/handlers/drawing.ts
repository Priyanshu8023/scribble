import { Server, Socket } from "socket.io";

export const drawingHandler = (io: Server, socket: Socket) => {
    socket.on("draw", (data: { roomId: string; [key: string]: unknown }) => {
        const { roomId } = data;
        socket.to(roomId).emit("drawing", data);
    });
};