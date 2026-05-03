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
    paths: {
      "/api/auth": {
        "post": {
          "summary": "Авторизация",
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "username": { "type": "string" },
                    "password": { "type": "string" }
                  }
                }
              }
            }
          },
          "responses": { "200": { "description": "Успешный вход" } }
        }
      },
      "/api/articles": {
        "get": {
          "summary": "Получить все статьи",
          "responses": { "200": { "description": "Список статей" } }
        },
        "post": {
          "summary": "Создать статью",
          "responses": { "201": { "description": "Создано" } }
        }
      },
      "/api/races": {
        "get": {
          "summary": "Получить все расы",
          "responses": { "200": { "description": "Список рас" } }
        },
        "post": {
          "summary": "Создать расу",
          "responses": { "201": { "description": "Создано" } }
        }
      },
      "/api/classes": {
        "get": {
          "summary": "Получить все классы",
          "responses": { "200": { "description": "Список классов" } }
        }
      },
      "/api/items": {
        "get": {
          "summary": "Получить все предметы",
          "responses": { "200": { "description": "Список предметов" } }
        }
      }
    }
  },
  apis: [], // Мы прописали пути вручную для надежности
};

const spec = swaggerJsdoc(options);

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Fallout DND API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            spec: ${JSON.stringify(spec)},
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `;
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
