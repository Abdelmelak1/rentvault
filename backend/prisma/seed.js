"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const categories = [
    { name: 'Vehicles', slug: 'vehicles', description: 'Cars, trucks, motorcycles, and other vehicles', icon: 'Car' },
    { name: 'Real Estate', slug: 'real-estate', description: 'Houses, apartments, and commercial spaces', icon: 'Building' },
    { name: 'Equipment', slug: 'equipment', description: 'Construction, industrial, and professional equipment', icon: 'Wrench' },
    { name: 'Electronics', slug: 'electronics', description: 'Cameras, laptops, audio gear, and more', icon: 'Monitor' },
    { name: 'Events', slug: 'events', description: 'Party supplies, furniture, and event equipment', icon: 'PartyPopper' },
    { name: 'Outdoor', slug: 'outdoor', description: 'Camping, boating, and adventure gear', icon: 'Tent' },
    { name: 'Tools', slug: 'tools', description: 'Power tools, hand tools, and specialty instruments', icon: 'Hammer' },
    { name: 'Fashion', slug: 'fashion', description: 'Designer clothing, accessories, and formal wear', icon: 'Shirt' },
];
async function main() {
    console.log('Seeding categories...');
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log('Seed complete.');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map