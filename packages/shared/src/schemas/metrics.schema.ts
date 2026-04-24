import { z } from "zod";

export const metricsRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const metricsSeriesPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const metricsResponseSchema = z.object({
  version: z.literal(1),
  meta: z.record(z.string(), z.unknown()),
  series: z.array(metricsSeriesPointSchema),
});

export type MetricsRangeInput = z.infer<typeof metricsRangeSchema>;
export type MetricsResponse = z.infer<typeof metricsResponseSchema>;
