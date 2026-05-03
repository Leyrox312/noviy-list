import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fallout DND API',
      version: '1.0.0',
      description: 'API for Fallout DND project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to the API routes
};

const spec = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(spec);
}
