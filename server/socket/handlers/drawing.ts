import { Server, Socket } from "socket.io";
import { gameStore } from "@/server/store/gameState";

export const drawingHandler = (io: Server, socket: Socket) => {
    socket.on("draw_batch", async (data: { roomId: string; points: any[] }) => {
        const { roomId, points } = data;
        
        if (!Array.isArray(points) || points.length > 200) return; // Prevent huge payloads

        const room = await gameStore.getRoom(roomId);
        const playerId = await gameStore.getPlayerIdBySocket(socket.id);

        // Ensure the game exists and the sender is the current drawer
        if (room && playerId && room.drawerId === playerId) {
            socket.to(roomId).emit("draw_batch", data);
        }
    });
};