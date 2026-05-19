import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(cfg: ConfigService) {
    super({
      clientID: cfg.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${cfg.get<string>('API_URL', 'http://31.220.53.87:8080/api')}/auth/google/callback`,
      scope: ['email', 'profile'],
    })
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return {
      email: profile.emails?.[0]?.value ?? '',
      name: profile.displayName ?? '',
      googleId: profile.id,
    }
  }
}
