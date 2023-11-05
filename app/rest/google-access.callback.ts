import { IGoogleUser } from './../lib/providers/google/client.google.provider';
import { Request, Response } from "express";
import { EProviders } from "../lib/providers";
import { GoogleClientProvider, IGoogleTokenResponse } from "../lib/providers/google/client.google.provider";
import AccessToken from "../schema/models/AccessToken.model";
import User  from "../schema/models/User.model";
import { IGoogleCallbackQuery } from "./rest.router";

export const googleAccessCallback = async (req: Request, res: Response) => {
    try {
        const callbackData = req.query as unknown as IGoogleCallbackQuery;
        const clientProvider = new GoogleClientProvider();
        const tokenResponse = await clientProvider.getTokenFromUrlCode(callbackData.code);
        const tokens: IGoogleTokenResponse = tokenResponse.tokens;
        const googleUser: IGoogleUser = await clientProvider.authClient.getTokenInfo(tokens.access_token);

        const existUser = await User.findOne({ where: { email: googleUser.email } });
        if (existUser) {
            await AccessToken.create({
                userId: existUser.id,
                accessToken: tokenResponse.tokens?.access_token,
                refreshToken: tokenResponse.tokens?.refresh_token || "",
                expiredAt: new Date(tokenResponse.tokens.expiry_date),
                provider: EProviders.GOOGLE,
                data: JSON.stringify({
                    tokenInfo: tokenResponse.tokens,
                    type: 'GOOGLE_CLIENT_TOKEN'
                })
            })
            res.send(existUser);
            return;
        }

        // create user & access token
        const newUser = await User.create({
            email: googleUser.email,
            // create name form email
            name: googleUser.email.split('@', 1)[0],
            password: 'xxxxxxxxx',
        });

        const userAccessToken = await AccessToken.create({
            userId: newUser.id,
            accessToken: tokenResponse.tokens?.access_token,
            refreshToken: tokenResponse.tokens?.refresh_token || "",
            provider: EProviders.GOOGLE,
            expiredAt: new Date(tokenResponse.tokens.expiry_date),
            data: JSON.stringify({
                tokenInfo: tokenResponse.tokens,
                type: 'GOOGLE_CLIENT_TOKEN'
            })
        })

        return res.send(userAccessToken);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        res.end();
    }
}