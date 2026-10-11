export interface EnvironmentVariables {
  PORT: string;
  MONGODB_URI: string;
  BASE_URL: string;
  THROTTLE_TTL_SECONDS: string;
  THROTTLE_LIMIT: string;
}

const requiredVariables = [
  'PORT',
  'MONGODB_URI',
  'BASE_URL',
  'THROTTLE_TTL_SECONDS',
  'THROTTLE_LIMIT',
] as const;

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  for (const variable of requiredVariables) {
    if (typeof config[variable] !== 'string' || config[variable].trim().length === 0) {
      throw new Error(`Environment variable ${variable} is required.`);
    }
  }

  const port = Number(config.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('Environment variable PORT must be a valid port number.');
  }

  if (!/^mongodb(\+srv)?:\/\//.test(String(config.MONGODB_URI))) {
    throw new Error('Environment variable MONGODB_URI must be a valid MongoDB connection URI.');
  }

  for (const variable of ['THROTTLE_TTL_SECONDS', 'THROTTLE_LIMIT'] as const) {
    const value = Number(config[variable]);
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`Environment variable ${variable} must be a positive integer.`);
    }
  }

  try {
    new URL(String(config.BASE_URL));
  } catch {
    throw new Error('Environment variable BASE_URL must be a valid URL.');
  }

  return {
    PORT: String(config.PORT),
    MONGODB_URI: String(config.MONGODB_URI),
    BASE_URL: String(config.BASE_URL),
    THROTTLE_TTL_SECONDS: String(config.THROTTLE_TTL_SECONDS),
    THROTTLE_LIMIT: String(config.THROTTLE_LIMIT),
  };
}
