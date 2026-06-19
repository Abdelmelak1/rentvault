import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    findOrCreateOAuthUser(profile: {
        provider: 'google' | 'github';
        providerId: string;
        email: string;
        fullName?: string;
        avatarUrl?: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    getMe(userId: string): Promise<{
        email: string;
        fullName: string;
        id: string;
        avatarUrl: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        provider: import(".prisma/client").$Enums.Provider;
        createdAt: Date;
    }>;
    private signToken;
}
