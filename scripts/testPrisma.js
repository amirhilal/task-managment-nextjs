const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Available Prisma models:', Object.keys(prisma));

    // Attempt to access the projectColumns model
    if (prisma.Project_Columns) {
      const columns = await prisma.Project_Columns.findMany();
      console.log('Columns', columns);
    } else {
      console.log('projectColumns model is not available');
    }

    // Try to access other models
    if (prisma.Project_Tasks) {
      const tasks = await prisma.Project_Tasks.findMany();
      console.log('Tasks:', tasks);
    } else {
      console.log('Project_Tasks model is not available');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
