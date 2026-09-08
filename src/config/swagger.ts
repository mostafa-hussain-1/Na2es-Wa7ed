import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Team Matching API',
      version: '1.0.0',
      description: 'API documentation for the team matching platform',
    },
    servers: [
      {
        url: `https://${process.env.VERCEL_URL || 'localhost:' + (process.env.PORT || 3000)}`,
        description: 'Server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(process.cwd(), 'src/routes/**/*.ts'),
    path.join(process.cwd(), 'src/controllers/**/*.ts'),
    path.join(process.cwd(), 'dist/routes/**/*.js'),
    path.join(process.cwd(), 'dist/controllers/**/*.js')
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css',
  customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.js'
  ],
  customSiteTitle: "Team Matching API Docs"
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
};