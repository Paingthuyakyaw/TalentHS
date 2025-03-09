import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'kyawna2265@gmail.com';
  const adminPassword = await hash(process.env.ADMIN_PASSWORD, 15);
  try {
    const exitAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!exitAdmin) {
      let company = await prisma.company.findUnique({
        where: { email: adminEmail },
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: 'Grumman Holdings',
            industry: 'Software Company',
            email: adminEmail,
            phone: '09662766003',
            status: 'APPROVED',
          },
        });
      }

      await prisma.user.create({
        data: {
          email: adminEmail,
          password: adminPassword,
          name: 'Paing Thura Kyaw',
          role: 'SUPER_ADMIN',
          status: 'APPROVED',
          companyId: company.id,
        },
      });
    }
    console.log('Super Admin Created Successfully');
  } catch (err) {
    console.log('Super Admin already exits');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
