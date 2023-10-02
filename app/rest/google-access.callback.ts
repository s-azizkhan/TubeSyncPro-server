import { Request, Response } from "express";
import { EProviders } from "../lib/providers";
import { GoogleClientProvider } from "../lib/providers/google/client.google.provider";
import AccessToken from "../schema/models/AccessToken.model";
import User from "../schema/models/User.model";
import { IGoogleCallbackQuery } from "./rest.router";

export const googleAccessCallback = async (req: Request, res: Response) => {
    try {
        const callbackData = req.query as unknown as IGoogleCallbackQuery;
        const clientProvider = new GoogleClientProvider();
        const tokenResponse = await clientProvider.getTokenFromUrlCode(callbackData.code);
        // create user from token

        const existUser = await User.findOne({ where: { email: 'sakatazizkhan8@gmail.com' } });
        if (existUser) {
            await AccessToken.create({
                userId: existUser.id,
                accessToken: tokenResponse.tokens.access_token,
                refreshToken: tokenResponse.tokens.refresh_token,
                provider: EProviders.GOOGLE,
                expiredAt: new Date(),
                data: JSON.stringify({
                    tokenInfo: tokenResponse.tokens,
                    type: 'GOOGLE_CLIENT_TOKEN'
                })
            })
            res.send(existUser);
            return;
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        res.end();
    }
}