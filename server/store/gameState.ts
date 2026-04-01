import { redis } from "@/lib/redisClient";

export type Player = {
    id: string;
    socketId: string | null,
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

        const existing = room.players.find(p => p.id === player.id);

        if (existing) {
            existing.socketId = player.socketId;
        } else {
            room.players.push(player)
        }

        await this.saveRoom(room);
    }

    async markDisconnected(roomId: string, socketId: string) {
        const room = await this.getRoom(roomId);
        if (!room) return;

        const player = room.players.find(p => p.socketId === socketId);
        if (!player) return;

        player.socketId = null;

        await this.saveRoom(room);
    }

    async removePlayer(roomId: string, playerId: string) {
        setTimeout(async () => {
            const room = await this.getRoom(roomId);
            if (!room) return;

            const player = room.players.find(p => p.id === playerId);

            if (player && player.socketId === null) {
                room.players = room.players.filter(p => p.id !== playerId);

                await this.saveRoom(room);
            }
        }, 30000);  
    }

    async removePlayerFromAllRooms(socketId: string): Promise<string | null> {
        const keys = await redis.keys("room:*");
        for (const key of keys) {
            const data = await redis.get(key);
            if (!data) continue;
            const room: RoomState = JSON.parse(data);
            const player = room.players.find(p => p.socketId === socketId);
            if (player) {
                player.socketId = null;
                await this.saveRoom(room);
                this.removePlayer(room.roomId, player.id);
                return room.roomId;
            }
        }
        return null;
    }

    async checkGuess(
        roomId: string,
        playerId: string,
        guess: string,
        io: any
    ): Promise<boolean> {
        const room = await this.getRoom(roomId);
        if (!room || room.status !== "PLAYING" || !room.currentWord) return false;

        const player = room.players.find(p => p.id === playerId);
        if (!player || player.hasGuessed || room.drawerId === playerId) return false;

        if (guess.toLowerCase() === room.currentWord.toLowerCase()) {
            player.hasGuessed = true;
            
            const timeRatio = room.timer / 60;
            const points = Math.max(10, Math.floor(100 * timeRatio));
            player.score += points;
            
            const drawer = room.players.find(p => p.id === room.drawerId);
            if (drawer) {
                drawer.score += Math.floor(points / 2);
            }

            await this.saveRoom(room);

            const allGuessed = room.players.every(p => p.id === room.drawerId || p.hasGuessed);
            if (allGuessed) {
                this.clearTimers(roomId);
                this.endRound(roomId, io);
            }

            return true;
        }

        return false;
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