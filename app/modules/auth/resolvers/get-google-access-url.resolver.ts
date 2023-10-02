import { GoogleClientProvider } from '../../../lib/providers/google/client.google.provider';
import { QueryResolvers } from "../../../generated/graphql";

/**
 * Retrieves the authorization URL for the given provider.
 *
 * @param {string} provider - The provider for which to retrieve the authorization URL.
 * @return {Promise<{message: string, status: string, data: {url: string}}>} A promise that resolves to an object containing the authorization URL.
 * @throws {Error} Throws an error if the provider is invalid.
 */
export const getGoogleAccessUrl: QueryResolvers["getGoogleAccessUrl"] = async () => {
    try {
        const providerClient = new GoogleClientProvider().getGoogleAuthUrl(false);
        return {
            message: "success",
            status: '200',
            data: {
                url: providerClient
            }
        };
    } catch (error) {
        throw error;
    }
}
