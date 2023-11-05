export interface IGoogleProviderConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    redirectAccessUri: string;
    projectId: string;
    clientScopes: string[];
    authScope: string;
}

interface IProviderConfig {
    google: IGoogleProviderConfig;
}

export class ProviderConfigService {
    providerConfig: IProviderConfig;
    constructor() {
        this.providerConfig = {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
                redirectAccessUri: process.env.GOOGLE_ACCESS_REDIRECT_URI || "",
                projectId: process.env.GOOGLE_PROJECT_ID || "",
                authScope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                clientScopes: [
                    // Create a new read-write token for YouTube and read-only token for Google Drive.
                    "https://www.googleapis.com/auth/youtube",
                    "https://www.googleapis.com/auth/drive",
                    "https://www.googleapis.com/auth/userinfo.email",
                ]
            }
        };

    }

    getGoogleConfig() {
        return this.providerConfig.google;
    }

}