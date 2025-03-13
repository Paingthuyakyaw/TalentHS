import { $Enums, PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'kyawna2265@gmail.com';

  const permissionNames = [
    'VIEW',
    'CREATE',
    'DELETE',
    'UPDATE',
    'MANAGE_USERS',
    'MANAGE_COMPANY',
  ];

  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('❌ ADMIN_PASSWORD environment variable is not set.');
  }

  const adminPassword = await hash(process.env.ADMIN_PASSWORD, 10);

  try {
    const permissions = await Promise.all(
      permissionNames.map(async (perm: $Enums.PermissionEnum) => {
        return prisma.permission.upsert({
          where: { permissions: perm },
          update: {},
          create: { permissions: perm },
        });
      }),
    );

    console.log('permissions created');

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

      let superAdminRole = await prisma.role.findUnique({
        where: { name: 'SUPER_ADMIN' },
      });

      const allPermissions = await prisma.permission.findMany();
      const permissionData = allPermissions.map((per) => ({
        permissionId: per.id,
      }));

      if (!superAdminRole) {
        superAdminRole = await prisma.role.create({
          data: {
            name: 'SUPER_ADMIN',
            permissions: {
              createMany: {
                data: permissionData,
              },
            },
          },
        });
      }

      console.log(permissionData, 'permission');

      await prisma.rolePermission.createMany({
        data: allPermissions.map((per) => ({
          roleId: superAdminRole.id,
          permissionId: per.id,
        })),
        skipDuplicates: true,
      });

      await prisma.user.create({
        data: {
          email: adminEmail,
          password: adminPassword,
          name: 'Paing Thura Kyaw',
          roleId: superAdminRole.id,
          status: 'APPROVED',
          companyId: company.id,
          permissions: {
            create: permissionData,
          },
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
