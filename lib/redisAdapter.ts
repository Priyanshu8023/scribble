import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { Server } from "socket.io";

export async function setupRedisAdapter(io: Server) {
    const url = process.env.REDIS_URL || "redis://localhost:6379";

    const pubClient = createClient({ url });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));
    console.log("Redis adapter configured");
}