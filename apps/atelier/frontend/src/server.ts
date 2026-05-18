import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { paths } from '@atelier/contracts';
import express, { type Express } from 'express';
import { join } from 'node:path';
import createClient from 'openapi-fetch';
import 'dotenv/config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const client = createClient<paths>({ baseUrl: process.env["BACKEND_URL"] });

app.use(express.json())

app.get('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await client.GET('/inventory/categories/{id}', {
    params: { path: { id } }
  })
  if (error) {
    return res.json(error).status(error.statusCode);
  }
  return res.json(data)
})

app.patch('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await client.PATCH('/inventory/categories/{id}', {
    params: {
      path: { id }
    },
    body: req.body
  })

  if (error) {
    console.log(error)
    return res.status(error.statusCode).json(error);
  }
  return res.json(data);
})

app.get('/categories', async (_, res) => {
  const { data, error } = await client.GET('/inventory/categories');
  if (error) {
    console.log(error);
    return res.status(error.statusCode).json(error);
  }
  return res.json(data.categories);
})

app.post('/categories', async (req, res) => {
  const { data, error } = await client.POST('/inventory/categories', {
    body: req.body,
  })
  if (error) {
    console.log('Error:', error);
  }
  return res.json(data);
})

app.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await client.DELETE('/inventory/categories/{id}', {
    params: {
      path: { id }
    }
  })
  if (error) {
    if (error.statusCode ==- 409) {
      return res.status(error.statusCode).json(error);
    }
    console.log(error);
  }
  return res.json(data);
})

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler: Express = createNodeRequestHandler(app);
