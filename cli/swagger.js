import swaggerJsdoc from 'swagger-jsdoc';
import {promises as fs} from 'fs';
import path from 'path';

(async() => {
  const spec = await swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Ian Card',
        version: '1.1.0'
      },
      servers: [
        {
          url: "/api",
          description: "API path"
        }
      ]
    },
    apis: [path.resolve('..','server', 'api.js')]
  });

  await fs.writeFile(path.resolve('..','swagger.json'), JSON.stringify(spec, null, 2));
})();