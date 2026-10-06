/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { AuthController } from "./auth.controller";
import { UserService } from "./user.service";
import { UsersRepository } from "./user.repository";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [UserService, UsersRepository, AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule { }