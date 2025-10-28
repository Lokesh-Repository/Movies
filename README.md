# Movies-Rating

This is a full-stack application for rating movies. It consists of a React frontend and a Node.js backend.

## Project Structure

- `frontend/`: Contains the React frontend application.
- `backend/`: Contains the Node.js backend API.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Query

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma (ORM)
- Zod (Validation)

## Setup Instructions

### Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - Make sure you have a PostgreSQL database running.
   - Create a `.env` file in the `backend` directory and add the database URL:
     ```
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
     ```
   - Run the database migrations:
     ```bash
     npx prisma migrate dev
     ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will be running on `http://localhost:3000`.

### Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will be running on `http://localhost:5173`.

## Database

### Schema

The database schema is defined in `backend/prisma/schema.prisma`.

### Migrations

Prisma is used for database migrations. To create a new migration, run the following command in the `backend` directory:

```bash
npx prisma migrate dev --name <migration-name>
```

To apply migrations, run:

```bash
npx prisma migrate dev
```

### Prisma Studio

You can use Prisma Studio to view and manage your database:

```bash
npx prisma studio
```

## Available Scripts

### Backend

- `npm run dev`: Starts the development server with hot-reloading.
- `npm run build`: Compiles the TypeScript code.
- `npm start`: Starts the production server.
- `npm run lint`: Lints the code.

### Frontend

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Lints the code.
