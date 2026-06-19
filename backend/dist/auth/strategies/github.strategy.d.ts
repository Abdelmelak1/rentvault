import { Strategy, Profile } from 'passport-github2';
import { AuthService } from '../auth.service';
declare const GithubStrategy_base: new (...args: any[]) => Strategy;
export declare class GithubStrategy extends GithubStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
}
export {};
