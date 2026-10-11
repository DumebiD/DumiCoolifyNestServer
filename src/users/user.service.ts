import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity.js";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { QueueService } from "../queue/queue.service.js";

@Injectable()
export class UsersService {
    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache,
        @InjectRepository(User) private readonly repo: Repository<User>,
        private readonly queue: QueueService
    ) { }

    async findByEmail(email: string) {
        const cacheKey = `user:${email}`;

        // Check cache first
        const cached = await this.cache.get<User>(cacheKey);
        if (cached) {
            return cached;
        }

        // if not found in cache, check db
        const user = await this.repo.findOne({ where: { email } })

        if (user) {
            // Store in cache for 5 minutes
            await this.cache.set(cacheKey, user, 300000);
        }
        if (!user) throw new NotFoundException(`User with email ${email} not found`);
        // fire-and-forget; sendMessage catches its own errors
        void this.queue.sendMessage(JSON.stringify({ event: 'user.fetched', userId: user.id }));
        return user
    }
}