import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private service;
    constructor(service: CategoriesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        createdAt: Date;
    }[]>;
}
