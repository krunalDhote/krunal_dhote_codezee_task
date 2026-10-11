export interface EnvironmentVariables {
  PORT: string;
  MONGODB_URI: string;
  BASE_URL: string;
}

const requiredVariables = ['PORT', 'MONGODB_URI', 'BASE_URL'] as const;

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

  try {
    new URL(String(config.BASE_URL));
  } catch {
    throw new Error('Environment variable BASE_URL must be a valid URL.');
  }

  return {
    PORT: String(config.PORT),
    MONGODB_URI: String(config.MONGODB_URI),
    BASE_URL: String(config.BASE_URL),
  };
}
