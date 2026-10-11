import { Module } from "@nestjs/common";
import { UsersService } from "./user.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity.js";
import { UserController } from "./user.controller.js";
import { QueueModule } from "../queue/queue.module.js";

@Module({
    imports:[TypeOrmModule.forFeature([User]), QueueModule],
    controllers: [UserController],
    providers:[UsersService],
    exports: [UsersService]
})

export class UserModule{}