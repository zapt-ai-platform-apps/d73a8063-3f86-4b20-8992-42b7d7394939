CREATE TABLE "documents" (
  "id" SERIAL PRIMARY KEY,
  "filename" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "upload_date" TIMESTAMP DEFAULT NOW(),
  "user_id" UUID NOT NULL
);