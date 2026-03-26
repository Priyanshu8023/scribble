export type Player = {
    id: string;
    name: string;
    score: number;
    hasGuessed: boolean;
    isDrawer: boolean;
}

export type GameStatus = "LOBBY" | "CHOOSING_WORD" | "PLAYING" | "ROUND_END" | "GAME_OVER";

export type RoomState = {
    roomId: string;
    players: Player[];
    status: GameStatus;
    drawerIndex: number | null;
    currentWord: string | null;
    timer: number;
    round: number;
    maxRounds: number;
    timerInterval?: NodeJS.Timeout | null;
    timeoutId?: NodeJS.Timeout | null;
}

export class GameStore {
    private rooms: Record<string, RoomState> = {};

    createRoom(roomId: string) {
        if (!this.rooms[roomId]) {
            this.rooms[roomId] = {
                roomId,
                players: [],
                status: "LOBBY",
                round: 1,
                maxRounds: 3,
                drawerIndex: null,
                currentWord: null,
                timer: 0,
                timerInterval: null,
                timeoutId: null
            }
        }
    }

    addPlayer(roomId: string, player: Player) {
        this.createRoom(roomId);
        this.rooms[roomId].players.push(player);
    }

    removePlayer(roomId: string, socketId: string) {
        if (this.rooms[roomId]) {
            this.rooms[roomId].players = this.rooms[roomId].players.filter(p => p.id !== socketId);

            if (this.rooms[roomId].players.length === 0) {
                if (this.rooms[roomId].timerInterval) clearInterval(this.rooms[roomId].timerInterval);
                if (this.rooms[roomId].timeoutId) clearTimeout(this.rooms[roomId].timeoutId);
                delete this.rooms[roomId];
            }
        }
    }

    removePlayerFromAllRooms(socketId: string): string | null {
        for (const roomId of Object.keys(this.rooms)) {
            const room = this.rooms[roomId];
            if (room.players.find(p => p.id === socketId)) {
                this.removePlayer(roomId, socketId);
                return roomId; // Return the roomId they were removed from
            }
        }
        return null;
    }

    getRoom(roomId: string): RoomState | null {
        return this.rooms[roomId] || null;
    }

    checkGuess(roomId: string, socketId: string, guess: string): boolean {
        const room = this.rooms[roomId];
        if (!room || room.status !== "PLAYING" || !room.currentWord) return false;

        if (guess.toLowerCase() == room.currentWord.toLocaleLowerCase()) {
            const player = room.players.find(p => p.id === socketId);
            if (player && !player.hasGuessed && !player.isDrawer) {
                player.hasGuessed = true;
                player.score += 100;
                return true;
            }
        }
        return false;
    }


    startGame(roomId: string, io: any) {
        const room = this.rooms[roomId];
        if (!room || room.players.length < 2 || room.status !== "LOBBY") return;

        room.status = "CHOOSING_WORD";
        room.round = 1;
        room.drawerIndex = 0;

        room.players.forEach(p => p.score = 0);

        this.startRound(roomId, io);
    }

    startRound(roomId: string, io: any) {
        const room = this.rooms[roomId];
        if (!room) return;

        room.players.forEach(p => {
            p.hasGuessed = false;
            p.isDrawer = false;
        });

        const drawer = room.players[room.drawerIndex as number];
        if (drawer) drawer.isDrawer = true;

        const WORDS = ["apple", "dog", "house", "car", "javascript", "react", "guitar", "sunflower"];
        room.currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];

        room.status = "PLAYING";
        room.timer = 60;

        io.to(roomId).emit("room_updated", room);

        if (room.timerInterval) clearInterval(room.timerInterval);
        if (room.timeoutId) clearTimeout(room.timeoutId);

        room.timerInterval = setInterval(() => {
            room.timer -= 1;
            io.to(roomId).emit("timer_tick", room.timer);

            if (room.timer <= 0) {
                this.endRound(roomId, io);
            }
        }, 1000);
    }

    endRound(roomId: string, io: any) {
        const room = this.rooms[roomId];
        if (!room) return;

        if (room.timerInterval) clearInterval(room.timerInterval);

        room.status = "ROUND_END";
        io.to(roomId).emit("room_updated", room);
        // Let players see the result for 5 seconds before next round
        io.to(roomId).emit("system_message", { type: "ROUND_END", word: room.currentWord });

        room.timeoutId = setTimeout(() => {
            // Move to next player
            room.drawerIndex = (room.drawerIndex as number) + 1;

            // If we've gone through all players, the round is over
            if (room.drawerIndex >= room.players.length) {
                room.drawerIndex = 0;
                room.round += 1;
            }

            // Check if game is completely over
            if (room.round > room.maxRounds) {
                room.status = "GAME_OVER";
                io.to(roomId).emit("room_updated", room);
            } else {
                this.startRound(roomId, io);
            }
        }, 5000);
    }
}

export const gameStore = new GameStore();

