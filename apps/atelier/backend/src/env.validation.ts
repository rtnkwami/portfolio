import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().min(0).max(65535).optional(),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  ISSUER_BASE_URL: z.url({ protocol: /^https$/ }),
  REDIS_ENDPOINT: z.url({ protocol: /^redis$/ }),
  AUDIENCE: z.string().nonempty(),
});

export function envValidate(envVariables: Record<string, unknown>) {
  const result = envSchema.safeParse(envVariables);

  if (result.error) {
    const errors = z.flattenError(result.error);
    throw new Error(JSON.stringify(errors.fieldErrors, null, 2));
  }
  return result.data;
}
