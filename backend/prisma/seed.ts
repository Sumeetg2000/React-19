import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { blogsPart1 } from './data/blogs-part1';
import { blogsPart2 } from './data/blogs-part2';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run the seed script.');
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

const seedAuthor = {
  name: 'React Expert',
  email: 'expert@reactblog.dev',
  password: 'ReactBlog#2026',
};

async function seed(): Promise<void> {
  const passwordHash = await bcrypt.hash(seedAuthor.password, 10);

  const author = await prisma.user.upsert({
    where: { email: seedAuthor.email },
    update: {
      name: seedAuthor.name,
      password: passwordHash,
    },
    create: {
      name: seedAuthor.name,
      email: seedAuthor.email,
      password: passwordHash,
    },
  });

  await prisma.blog.deleteMany({
    where: {
      authorId: author.id,
    },
  });

  const allBlogs = [...blogsPart1, ...blogsPart2];

  for (let index = 0; index < allBlogs.length; index += 1) {
    const blog = allBlogs[index];
    console.log(`Seeding blog ${index + 1}/${allBlogs.length}: ${blog.title}`);

    await prisma.blog.create({
      data: {
        title: blog.title,
        content: blog.content,
        authorId: author.id,
      },
    });
  }

  console.log(`Seed complete. Inserted ${allBlogs.length} blogs for ${seedAuthor.email}.`);
}

seed()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
