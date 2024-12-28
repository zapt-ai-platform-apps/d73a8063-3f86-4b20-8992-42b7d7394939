import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  fileUrl: text('file_url').notNull(),
  uploadDate: timestamp('upload_date').defaultNow(),
  userId: uuid('user_id').notNull(),
});