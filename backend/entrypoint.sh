#!/bin/sh
set -e

echo "Waiting for MongoDB to be ready..."
# A simple sleep; adjust as needed or use a more robust wait-for-it script
sleep 10

echo "Seeding the database with test data..."
node seed.js

echo "Starting the backend server..."
exec npm run dev