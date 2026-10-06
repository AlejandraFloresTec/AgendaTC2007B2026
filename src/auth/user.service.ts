/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersRepository } from './user.repository';
import { LoginDto } from './dto/login.dto';
import { sign, verify } from './jwt';
import { RefreshDto } from './dto/refreshToken.dto';
import { createHash } from 'node:crypto';

const ACCESS_TTL = 15 * 60; // 15 minutos
const REFRESH_TTL = 7 * 24 * 60 * 60; // 7 días

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UsersRepository) { }

    async login(dto: LoginDto) {
        if (!dto.email || !dto.password) return null;
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException("El usuario no existe");
        }
        if (user.passwordHash !== hash(dto.password)) {
            throw new UnauthorizedException("El password es incorrecto");
        }
        const claims = { sub: user.id!, email: user.email! };
        const accessToken = sign({
            ...claims, type: "access"
        }, ACCESS_TTL)
        const refreshToken = sign({
            ...claims, type: "refresh"
        }, REFRESH_TTL)
        console.log('Login de ' + user.email + ': ' + accessToken);
        return { accessToken, refreshToken };
    }

    async register(dto: RegisterDto) {
        if (await this.userRepository.findByEmail(dto.email!)) {
            throw new ConflictException("Ya hay un usuario con este correo");
        }

        const user = await this.userRepository.save(dto.email!, hash(dto.password!));
        return { id: user.id, email: user.email };

    }

    refresh(dto: RefreshDto) {
        const payload = verify(dto.refreshToken!);
        if (!payload || payload.type !== 'refresh') {
            throw new UnauthorizedException('Refresh token inválido');
        }
        const accessToken = sign(
            { sub: payload.sub, email: payload.email, type: 'access' },
            ACCESS_TTL,
        );
        return { accessToken };
    }

}

function hash(password: string): string {
    return createHash('sha256').update(password).digest('hex');
}
