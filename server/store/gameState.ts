import { redis } from "@/lib/redisClient";

export type Player = {
    id: string;
    name: string;
    score: number;
    hasGuessed: boolean;
};

export type GameStatus =
    | "LOBBY"
    | "CHOOSING_WORD"
    | "PLAYING"
    | "ROUND_END"
    | "GAME_OVER";

export type RoomState = {
    roomId: string;
    players: Player[];
    status: GameStatus;
    drawerId: string | null;
    currentWord: string | null;
    timer: number;
    round: number;
    maxRounds: number;
};

export class GameStore {
    private timers: Record<
        string,
        { interval?: NodeJS.Timeout; timeout?: NodeJS.Timeout }
    > = {};

    async getRoom(roomId: string): Promise<RoomState | null> {
        const data = await redis.get(`room:${roomId}`);
        return data ? JSON.parse(data) : null;
    }

    async saveRoom(room: RoomState) {
        await redis.set(`room:${room.roomId}`, JSON.stringify(room));
    }

    async deleteRoom(roomId: string) {
        await redis.del(`room:${roomId}`);
    }


    async createRoom(roomId: string) {
        const exists = await this.getRoom(roomId);
        if (exists) return;

        const room: RoomState = {
            roomId,
            players: [],
            status: "LOBBY",
            round: 1,
            maxRounds: 3,
            drawerId: null,
            currentWord: null,
            timer: 0,
        };

        await this.saveRoom(room);
    }

    async addPlayer(roomId: string, player: Player) {
        await this.createRoom(roomId);

        const room = await this.getRoom(roomId);
        if (!room) return;

        room.players.push(player);
        await this.saveRoom(room);
    }

    async removePlayer(roomId: string, socketId: string) {
        const room = await this.getRoom(roomId);
        if (!room) return;

        const wasDrawer = room.drawerId === socketId;

        room.players = room.players.filter(p => p.id !== socketId);

        if (wasDrawer) {
            room.drawerId = this.getNextDrawer(room.players, null);
        }

        if (room.players.length < 2) {
            this.clearTimers(roomId);

            room.status = "LOBBY";
            room.drawerId = null;
            room.currentWord = null;
        }

        if (room.players.length === 0) {
            this.clearTimers(roomId);
            await this.deleteRoom(roomId);
            return;
        }

        await this.saveRoom(room);
    }

    async removePlayerFromAllRooms(socketId: string): Promise<string | null> {
        const keys = await redis.keys("room:*");

        for (const key of keys) {
            const roomId = key.split(":")[1];
            const room = await this.getRoom(roomId);

            if (room?.players.find(p => p.id === socketId)) {
                await this.removePlayer(roomId, socketId);
                return roomId;
            }
        }

        return null;
    }


    async startGame(roomId: string, io: any) {
        const room = await this.getRoom(roomId);
        if (!room || room.players.length < 2 || room.status !== "LOBBY") return;

        room.status = "CHOOSING_WORD";
        room.round = 1;
        room.drawerId = room.players[0].id;

        room.players.forEach(p => (p.score = 0));

        await this.saveRoom(room);

        this.startRound(roomId, io);
    }

    async startRound(roomId: string, io: any) {
        const room = await this.getRoom(roomId);
        if (!room || room.players.length < 2) return;

        room.players.forEach(p => (p.hasGuessed = false));

        const WORDS = ["apple", "dog", "house", "car", "javascript", "react"];
        room.currentWord =
            WORDS[Math.floor(Math.random() * WORDS.length)];

        room.status = "PLAYING";
        room.timer = 60;

        await this.saveRoom(room);

        io.to(roomId).emit("room_updated", room);

        this.clearTimers(roomId);

        this.timers[roomId] = {
            interval: setInterval(async () => {
                const updatedRoom = await this.getRoom(roomId);

                if (!updatedRoom) {
                    this.clearTimers(roomId);
                    return;
                }

                updatedRoom.timer -= 1;

                await this.saveRoom(updatedRoom);

                io.to(roomId).emit("timer_tick", updatedRoom.timer);

                if (updatedRoom.timer <= 0) {
                    this.clearTimers(roomId);
                    this.endRound(roomId, io);
                }
            }, 1000),
        };
    }

    async endRound(roomId: string, io: any) {
        const room = await this.getRoom(roomId);
        if (!room) return;

        this.clearTimers(roomId);

        room.status = "ROUND_END";

        await this.saveRoom(room);

        io.to(roomId).emit("room_updated", room);
        io.to(roomId).emit("system_message", {
            type: "ROUND_END",
            word: room.currentWord,
        });

        // 🔥 Timeout runs in Node.js
        this.timers[roomId] = {
            timeout: setTimeout(async () => {
                const room = await this.getRoom(roomId);

                if (!room) return;

                if (room.players.length < 2) {
                    room.status = "LOBBY";
                    room.drawerId = null;

                    await this.saveRoom(room);
                    io.to(roomId).emit("room_updated", room);
                    return;
                }

                room.drawerId = this.getNextDrawer(
                    room.players,
                    room.drawerId
                );

                if (room.drawerId === room.players[0].id) {
                    room.round += 1;
                }

                if (room.round > room.maxRounds) {
                    room.status = "GAME_OVER";
                    await this.saveRoom(room);
                    io.to(roomId).emit("room_updated", room);
                } else {
                    await this.saveRoom(room);
                    this.startRound(roomId, io);
                }
            }, 5000),
        };
    }

    getNextDrawer(
        players: Player[],
        currentDrawerId: string | null
    ): string | null {
        if (players.length === 0) return null;

        if (!currentDrawerId) return players[0].id;

        const index = players.findIndex(p => p.id === currentDrawerId);
        if (index === -1) return players[0].id;

        return players[(index + 1) % players.length].id;
    }

    clearTimers(roomId: string) {
        const t = this.timers[roomId];

        if (t?.interval) clearInterval(t.interval);
        if (t?.timeout) clearTimeout(t.timeout);

        delete this.timers[roomId];
    }
}

export const gameStore = new GameStore();