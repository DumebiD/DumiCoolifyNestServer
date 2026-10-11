import { Body, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./user.service.js";
import { User } from "./user.entity.js";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
    constructor(private readonly userService: UsersService) { }

    @Get(':email')
    async getUser(@Param('email') email: string): Promise<User> {
        console.log('email', email)
        return await this.userService.findByEmail(email);
    }
}