import jwt from 'jsonwebtoken';
import { configData } from '../config/config';
import { User as UserModel } from '../schema/models/User.model';
import UserInterface from '../interfaces/user.interface';

interface IJwtPayload {
    id: string;
    email: string;
}

interface IJwtDecoded extends IJwtPayload {
    id: string;
    email: string;
    exp: number;
    iat: number;
}
export function createJwtToken(user: UserInterface): string {
    const payload: IJwtPayload = {
        id: user.id,
        email: user.email
    }
    return jwt.sign(payload, configData.JWT_SECRET, {
        expiresIn: configData.JWT_EXPIRATION
    })
}

export async function decodeJwtToken(token: string) {
    try {
        const decoded = jwt.verify(token, configData.JWT_SECRET) as IJwtDecoded;
        return decoded;
    } catch (error) {
        return null; // Invalid token or token has expired.
    }
}

export async function getUserFromToken(token?: string) {
    if (!token) return null;

    const decoded = await decodeJwtToken(token);
    if (!decoded) return null;

    // check expiration
    if (decoded.exp < Date.now() / 1000) {
        return null;
    }

    // get the user by id
    const user = await UserModel.findByPk(decoded.id);

    return user;

}