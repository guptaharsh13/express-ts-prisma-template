import { type Express, type Request, type Response } from 'express';
import client from 'prom-client';
import responseTime from 'response-time';

const setupPrometheus = (app: Express) => {
  const register = new client.Registry();
  client.collectDefaultMetrics({ register });

  const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 1, 5, 10, 25, 50, 100, 200, 500, 1000],
  });

  const httpRequestCounter = new client.Counter({
    name: 'http_request_count',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  register.registerMetric(httpRequestDuration);
  register.registerMetric(httpRequestCounter);

  app.use(
    responseTime(function (req: Request, res: Response, time: number) {
      httpRequestDuration
        .labels(req.method, req.path, res.statusCode.toString())
        .observe(time);
      httpRequestCounter
        .labels(req.method, req.path, res.statusCode.toString())
        .inc();
    }),
  );

  app.get('/metrics', async (_: Request, res: Response) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  });
};

export default setupPrometheus;
