#!/bin/sh
set -e

echo "Starting Next.js Docker Entrypoint..."

# Ensure Prisma client is generated for the correct platform
echo "Generating Prisma Client..."
npx prisma@6 generate

# Apply migrations / push schema to the DB
echo "Pushing DB schema..."
npx prisma@6 db push --accept-data-loss

# Seed the database (it will upsert, so running it multiple times is safe)
echo "Seeding DB..."
npx prisma@6 db seed

echo "Starting the application..."
exec "$@"
