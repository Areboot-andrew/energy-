#!/bin/sh
set -e

echo "Starting Next.js Docker Entrypoint..."

# (Prisma Client is already generated during the Docker build stage)
# Apply migrations / push schema to the DB
echo "Pushing DB schema..."
npx prisma@6 db push --accept-data-loss

# Seed the database (it will upsert, so running it multiple times is safe)
echo "Seeding DB..."
npx prisma@6 db seed

echo "Starting the application..."
exec "$@"
