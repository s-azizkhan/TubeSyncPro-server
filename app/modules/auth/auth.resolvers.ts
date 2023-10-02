import { getGoogleAccessUrl } from './resolvers/get-google-access-url.resolver';
import { getAuthzUrl } from './resolvers/get-authorize-url.resolver';
import { Resolvers } from '../../generated/graphql';
export const resolvers: Resolvers = {
    Query: {
        getAuthzUrl,
        getGoogleAccessUrl,
    },
};
