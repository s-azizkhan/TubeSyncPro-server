import { getYoutubeChannelVideoList } from './resolvers/get-youtube-channel-video-list.resolver';
import { Resolvers } from '../../generated/graphql';
import { getYoutubeChannelList } from './resolvers/get-youtube-channel-list.resolver';

export const resolvers: Resolvers = {
    Query: {
        getYoutubeChannelList,
        getYoutubeChannelVideoList,
    },
};
