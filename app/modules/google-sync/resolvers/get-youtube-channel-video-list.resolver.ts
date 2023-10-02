import { QueryResolvers } from "../../../generated/graphql";
import { YouTubeClient } from "../../../lib/providers/google/youtube.client";

export const getYoutubeChannelVideoList: QueryResolvers["getYoutubeChannelVideoList"] = async (_, { channelId }) => {
    try {

        // TODO: make userID dynamic
        const client = new YouTubeClient('8503294d-0b1f-4c75-83a1-7998897d405e');
        await client.setUp();
        const data = await client.getVideoList(channelId);
        return {
            message: 'success',
            data,
        };
    } catch (error) {
        throw error;
    }
}
