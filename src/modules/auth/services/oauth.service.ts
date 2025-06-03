import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OAuthService {
  async validateGoogleToken(accessToken: string): Promise<{ email: string }> {
    try {
      const response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
      );
      return { email: response.data.email };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google access token');
    }
  }

  async validateFacebookToken(accessToken: string): Promise<{ email: string }> {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=email&access_token=${accessToken}`,
      );
      return { email: response.data.email };
    } catch (error) {
      throw new UnauthorizedException('Invalid Facebook access token');
    }
  }
}
