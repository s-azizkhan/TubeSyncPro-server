/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { google } from 'googleapis';
import { IGoogleProviderConfig, ProviderConfigService } from '../config/config.provider';

export interface IGoogleTokenResponse{
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  scopes: string;
  expiry_date: number;
}

export interface IGoogleUser {
  expiry_date: number;
  scopes: string[];
  azp: string;
  aud: string;
  sub: string;
  exp: string;
  email: string;
  email_verified: string;
  access_type: string;
}
/**

* Class representing a Google Client Provider.
*/
export class GoogleClientProvider {
  readonly authClient: any;
  private config: IGoogleProviderConfig;
  private ytClient: any;
  private driveClient: any;
  /**
   * Constructor function for creating an instance of the class.
   *
   */
  constructor() {
    this.config = new ProviderConfigService().getGoogleConfig();
    // Create an OAuth2 client.
    this.authClient = new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri,
    );
  }

  /**
   * Sets the scopes for the client.
   *
   * @param {Array} scopes - The scopes to be set for the client.
   */
  setScopes(scopes: string[]) {
    this.config.clientScopes = scopes;
  }

  /**
   * Generates the Google authorization URL for the app.
   *
   * @return {string} The generated authorization URL.
   */
  getGoogleAuthUrl(forAuth: boolean = true) {
    // Generate URL for user to authorize the app.
    const authUrl = this.authClient.generateAuthUrl({
      access_type: 'offline',
      scope: forAuth ? this.config.authScope : this.config.clientScopes,
      //redirect_uri: forAuth ? this.config.redirectUri : this.config.redirectAccessUri
    });

    return authUrl;
  }

  /**
   * Retrieves a token from a URL code.
   *
   * @param {string} code - The URL code to decode and retrieve the token from.
   * @return {Promise<object>} The retrieved token.
   */
  async getTokenFromUrlCode(code: string) {
    try {
      // decode the URL code and retrieve the token.
      code = decodeURIComponent(code);
      const response = await this.authClient.getToken(code);
      // Set the credentials for the YouTube API and Google Drive API.
      this.authClient.setCredentials(response);
      return response;
    } catch (error) {
      console.error('Error from getTokenFromUrlCode: ', error);
      throw error;
    }
  }

  /**
   * Returns a Google Chat API client.
   *
   * @param {string} accessToken - The access token for authenticating the client.
   * @return {Object} The Google Chat API client.
   */
  getGoogleYtClient() {
    return this.ytClient;
  }
  async setGoogleChatClient(accessToken: string, refreshToken?: string) {
    // Set the credentials to google OAuth client.
    this.authClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

    // Set up the Chat API client
    this.ytClient = await google.youtube({ version: 'v3', auth: this.authClient });
  }

  async getUserInfoFromToken(accessToken: string) {
    // prepare axios client
    const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`);

    return response.data
  }

}