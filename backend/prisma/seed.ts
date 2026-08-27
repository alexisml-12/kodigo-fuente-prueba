import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log('Ya existen productos, se omite el seed.');
    return;
  }

  await prisma.product.createMany({
    data: [
      { name: 'Gaseosa 1.5L', category: 'Bebidas' },
      { name: 'Agua sin gas 600ml', category: 'Bebidas' },
      { name: 'Papas fritas 150g', category: 'Snacks' },
      { name: 'Chocolatina', category: 'Snacks' },
      { name: 'Detergente 1kg', category: 'Aseo' },
      { name: 'Jabón de baño', category: 'Aseo' }
    ]
  });

  console.log('Seed de productos completado.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
