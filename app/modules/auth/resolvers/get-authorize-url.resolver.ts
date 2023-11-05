import { GoogleClientProvider } from './../../../lib/providers/google/client.google.provider';
import { QueryResolvers } from "../../../generated/graphql";
import { EProviders } from "../../../lib/providers";

export const getAuthzUrl: QueryResolvers["getAuthzUrl"] = async (_, { provider }) => {
    try {
        if (provider.toLowerCase() !== EProviders.GOOGLE) {
            throw new Error('Invalid provider');
        }
        const providerClient = await new GoogleClientProvider().getGoogleAuthUrl();
        return {
            message: "success",
            status: '200',
            url: providerClient
        };
    } catch (error) {
        throw error;
    }
}
