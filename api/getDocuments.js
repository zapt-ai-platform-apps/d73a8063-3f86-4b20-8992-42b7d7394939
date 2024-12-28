import * as Sentry from "@sentry/node";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { documents } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { eq, desc } from 'drizzle-orm';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    const sql = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(sql);

    const userDocuments = await db.select()
      .from(documents)
      .where(eq(documents.userId, user.id))
      .orderBy(desc(documents.uploadDate));

    res.status(200).json(userDocuments);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}