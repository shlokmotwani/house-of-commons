const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      bio: "Software Developer",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "hashedpassword",
      bio: "Product Manager",
    },
  });

  // Create sample posts
  await prisma.post.create({
    data: {
      content: "Hello, world!",
      authorId: user1.id,
    },
  });

  await prisma.post.create({
    data: {
      content: "Excited to join this platform!",
      authorId: user2.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
