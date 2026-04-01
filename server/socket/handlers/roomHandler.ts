import { Server, Socket } from "socket.io";
import { gameStore } from "@/server/store/gameState";

export const roomHandler = (io: Server, socket: Socket) => {

    socket.on("join_room", async ({ roomId, name, playerId }: { roomId: string, name: string, playerId: string }) => {
        socket.join(roomId);

        await gameStore.addPlayer(roomId, {
            id: playerId || socket.id,
            socketId: socket.id,
            name: name,
            score: 0,
            hasGuessed: false,
        });

        const updatedRoom = await gameStore.getRoom(roomId);
        io.to(roomId).emit("room_updated", updatedRoom);
        console.log(`User ${socket.id} (Player ${playerId}) joined: ${roomId}`);
    })

    socket.on("chat_message", async ({ roomId, message }: { roomId: string, message: string }) => {
        const room = await gameStore.getRoom(roomId);
        const player = room?.players.find(p => p.socketId === socket.id);
        const userName = player?.name;

        if (!player) return;

        const isCorrectGuess = await gameStore.checkGuess(roomId, player.id, message, io);

        if (isCorrectGuess) {
            io.to(roomId).emit("system_message", {
                type: "CORRECT_GUESS",
                userId: socket.id,
                userName: userName,
            });

            io.to(roomId).emit("room_state_updated", await gameStore.getRoom(roomId));
        } else {
            io.to(roomId).emit("receive_message", {
                userId: socket.id,
                userName: userName,
                message,
            })
        }
    })

    socket.on("start_game", async (roomId: string) => {
        await gameStore.startGame(roomId, io);
    });

    socket.on("disconnect", async () => {
        const roomId = await gameStore.removePlayerFromAllRooms(socket.id);

        if (roomId) {
            const updatedRoom = await gameStore.getRoom(roomId);
            if (updatedRoom) {
                io.to(roomId).emit("room_updated", updatedRoom);
            }
        }
    })
}