import * as Sentry from "@sentry/node";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { documents } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err || !files.file) {
        return res.status(400).json({ error: 'File upload error' });
      }

      const file = files.file;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.filepath, {
        resource_type: 'auto',
        folder: 'documents',
      });

      // Save file metadata to database
      const sql = postgres(process.env.COCKROACH_DB_URL);
      const db = drizzle(sql);

      await db.insert(documents).values({
        filename: file.originalFilename,
        fileUrl: result.secure_url,
        userId: user.id
      });

      res.status(200).json({ message: 'File uploaded successfully' });
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}