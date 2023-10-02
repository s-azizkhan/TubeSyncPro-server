import { Router } from "express";
import { googleAccessCallback } from "./google-access.callback";
import { googleAuthCallback } from "./google-auth.callback";

const restRouter = Router();

export interface IGoogleCallbackQuery {
    code: string;
    scope: string | string[];
}

export interface IGoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
    local: string;
}
restRouter.get("/authz/google/callback", googleAuthCallback)
//restRouter.get("/authz/google/callback", googleAccessCallback)

restRouter.get("/google/cb", googleAccessCallback)

export default restRouter;
