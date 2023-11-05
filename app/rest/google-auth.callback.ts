import { Request, Response } from "express";
import { EProviders } from "../lib/providers";
import { GoogleClientProvider } from "../lib/providers/google/client.google.provider";
import AccessToken from "../schema/models/AccessToken.model";
import User from "../schema/models/User.model";
import { IGoogleCallbackQuery, IGoogleUserInfo } from "./rest.router";

export const googleAuthCallback =  async (req: Request, res: Response) => {
    try {
        const callbackData = req.query as unknown as IGoogleCallbackQuery;
        const clientProvider = new GoogleClientProvider();
        const tokenResponse = await clientProvider.getTokenFromUrlCode(callbackData.code);
        // create user from token
        const googleUser: IGoogleUserInfo | undefined = await clientProvider.getUserInfoFromToken(tokenResponse.tokens.access_token);

        if (!googleUser) {
            res.sendStatus(500);
            res.end();
            return;
        }

        const existUser = await User.findOne({ where: { email: googleUser.email } });
        if (existUser) {
            await AccessToken.create({
                userId: existUser.id,
                accessToken: tokenResponse.tokens.access_token,
                refreshToken: tokenResponse.tokens.refresh_token,
                provider: EProviders.GOOGLE,
                expiredAt: new Date(),
                data: JSON.stringify({
                    tokenInfo: tokenResponse.tokens,
                    userInfo: googleUser
                })
            })
            res.send(existUser);
            return;
        }

        const user = await User.create({
            email: googleUser.email,
            name: googleUser.name,
            password: Math.random().toString(36).substring(2)
        });

        // create access token
        const accessToken = await AccessToken.create({
            userId: user.id,
            accessToken: tokenResponse.tokens.access_token,
            refreshToken: tokenResponse.tokens.refresh_token,
            provider: EProviders.GOOGLE,
            expiredAt: new Date(),
            data: JSON.stringify({
                tokenInfo: tokenResponse.tokens,
                userInfo: googleUser
            })
        })

        res.send(accessToken);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        res.end();
    }
}