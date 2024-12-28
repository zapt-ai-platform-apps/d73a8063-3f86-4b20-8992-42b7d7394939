# Document Archive

**Document Archive** is an application that allows users to upload and manage Word, PDF, Excel, and PowerPoint documents, classified by date.

## User Journeys

1. [Sign In](docs/journeys/sign-in.md) - Authenticate and access the application using your ZAPT account.
2. [Upload Document](docs/journeys/upload-document.md) - Upload a document to your archive.
3. [View Documents](docs/journeys/view-documents.md) - View and download your uploaded documents.

## Environment Variables

The following environment variables are required for the application to function correctly:

- **VITE_PUBLIC_SENTRY_DSN**: Your Sentry DSN for error logging.
- **VITE_PUBLIC_APP_ENV**: The application environment (e.g., 'production', 'development').
- **VITE_PUBLIC_APP_ID**: The application ID from ZAPT.
- **VITE_PUBLIC_UMAMI_WEBSITE_ID**: The Umami Analytics website ID.
- **COCKROACH_DB_URL**: The connection URL for the CockroachDB database.
- **CLOUDINARY_CLOUD_NAME**: Your Cloudinary cloud name.
- **CLOUDINARY_API_KEY**: Your Cloudinary API key.
- **CLOUDINARY_API_SECRET**: Your Cloudinary API secret.

Please create a `.env` file at the root of the project and add these variables.

Do not commit the `.env` file to version control.