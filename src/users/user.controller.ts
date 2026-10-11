import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./user.service.js";
import { User } from "./user.entity.js";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    async addUser(@Body() { name, email }: { name: string, email: string }): Promise<User> {
        return await this.userService.saveUser(name,email);
    }

    @Get(':email')
    async getUser(@Param('email') email: string): Promise<User> {
        return await this.userService.findByEmail(email);
    }
}