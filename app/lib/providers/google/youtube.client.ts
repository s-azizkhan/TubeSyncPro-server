/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";
import { EProviders } from "..";
import AccessToken from "../../../schema/models/AccessToken.model";
import User from "../../../schema/models/User.model";
import { GoogleClientProvider } from "./client.google.provider";

export class YouTubeClient extends GoogleClientProvider {
    userId: string;
    authUser?: User | null;
    youtubeClient?: any;
    constructor(userId: string) {
        if (!userId) {
            throw new Error('userId is required');
        }
        super();
        this.userId = userId;
    }

    async setUp() {
        const authUser = await User.findByPk(this.userId, {
            attributes: ['id', 'email'],
            include: [
                {
                    model: AccessToken,
                    where: { provider: EProviders.GOOGLE },
                    required: true
                }
            ]
        });

        if (!authUser) {
            throw new Error('Invalid user');
        }

        this.authUser = authUser;


        this.authClient.setCredentials({ access_token: authUser.accessTokens[0].accessToken, refresh_token: authUser.accessTokens[0].refreshToken });
        this.youtubeClient = await google.youtube({ version: 'v3', auth: this.authClient });
        
        return this;
    }

    async getChannelList() {
        try {
            const response = await this.youtubeClient?.channels.list({
              part: ["snippet,contentDetails,statistics"],
              mine: true,
            });

            return response?.data?.items || [];
          } catch (error) {
            console.error("Error in getChannelList :>> ", error);
            return [];
          }
    }

    async getVideoList (channelId: string) {
        try {
         
            if(!channelId) {
                return false;
            }
          const part = "snippet";
      
          const response = await this.youtubeClient?.search.list({
            part,
            type: "video",
            channelId,
            // myRating: 'like',
            //mine: true,
            managedByMe: true,
            // forUsername: username
          });
      
          const videos = response?.data?.items;
          if (!videos || !videos.length) {
            return [];
          }
          console.log("Videos in the channel:");
          videos.forEach((video: any) => {
            console.log({ video });
            console.log(`${video.snippet.title} (${video.id.videoId})`);
          });
          return videos;
        } catch (error) {
          console.log("Error in getVideoList :>> ", error);
          return [];
        }
      };
}