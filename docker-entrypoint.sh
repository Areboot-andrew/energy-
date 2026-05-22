#!/bin/sh
set -e

echo "Starting Next.js Docker Entrypoint..."

# Ensure Prisma client is generated for the correct platform
echo "Generating Prisma Client..."
npx prisma generate

# Apply migrations / push schema to the DB
echo "Pushing DB schema..."
npx prisma db push --accept-data-loss

# Seed the database (it will upsert, so running it multiple times is safe)
echo "Seeding DB..."
npx prisma db seed

echo "Starting the application..."
exec "$@"
