/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable prettier/prettier */
import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';

const SECRET = "supersecret"

export interface JWTPayload {
    sub: string;
    email: string;
    type: 'access' | 'refresh';
    iat: number;
    exp: number;
}

function now(): number {
    return Math.floor(Date.now() / 1000);
}

function base64(json: Object): string {
    return Buffer.from(JSON.stringify(json)).toString("base64url")
}

function hmac(data: string): string {
    return createHmac('sha256', SECRET).update(data).digest('base64url');
}

export function sign(
    payload: Omit<JWTPayload, 'iat' | 'exp'>,
    ttlSeconds: number,
) {
    const header = base64({ alg: "HS265", type: "JWT" })
    const body = base64({ ...payload, iat: now(), exp: now() + ttlSeconds })
    const sign = hmac(`${header}.${body}`)
    return `${header}.${body}.${sign}`;
}

export function verify(token: string): JWTPayload | null {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) {
        return null;
    }
    if (hmac(`${header}.${body}`) !== signature) {
        return null;
    }
    const payload = JSON.parse(
        Buffer.from(body, 'base64url').toString(),
    ) as JWTPayload;
    if (payload.exp < now()) {
        return null;
    }
    return payload;
}

