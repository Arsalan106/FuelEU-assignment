import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear
  await prisma.pool_members.deleteMany();
  await prisma.pools.deleteMany();
  await prisma.bank_entries.deleteMany();
  await prisma.ship_compliance.deleteMany();
  await prisma.routes.deleteMany();

  // Seed five routes; one baseline
  const routes = [
    { route_id: "R1", year: 2025, ghg_intensity: 92.1, is_baseline: true },
    { route_id: "R2", year: 2025, ghg_intensity: 88.5, is_baseline: false },
    { route_id: "R3", year: 2025, ghg_intensity: 95.4, is_baseline: false },
    { route_id: "R4", year: 2025, ghg_intensity: 86.0, is_baseline: false },
    { route_id: "R5", year: 2025, ghg_intensity: 91.0, is_baseline: false }
  ];

  await prisma.routes.createMany({ data: routes });
  console.log("Seeded routes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
