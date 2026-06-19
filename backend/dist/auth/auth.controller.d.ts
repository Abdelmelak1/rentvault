import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    getMe(req: any): Promise<{
        email: string;
        fullName: string;
        id: string;
        avatarUrl: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        provider: import(".prisma/client").$Enums.Provider;
        createdAt: Date;
    }>;
    googleAuth(): void;
    googleCallback(req: any, res: Response): void;
    githubAuth(): void;
    githubCallback(req: any, res: Response): void;
}
