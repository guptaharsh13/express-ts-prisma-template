import dotenv from 'dotenv';

dotenv.config();

interface IConstants {
  NODE_ENV: string;
  DATABASE_URL: string;
  PORT: number;
}

const requiredEnvVars = ['DATABASE_URL'];

const configure = () => {
  const unsetEnvVars = requiredEnvVars.filter((envVar) => {
    const envValue = process.env[envVar];
    return !(envValue != null && envValue.length > 0);
  });
  if (unsetEnvVars.length > 0) {
    console.error(
      `Required environment variables not set: ${unsetEnvVars.join(', ')}`,
    );
    process.exit(1);
  }

  const constants = {} as IConstants;

  constants.PORT = Number(process.env.PORT) ?? 3000;
  constants.NODE_ENV = process.env.NODE_ENV ?? 'development';
  constants.DATABASE_URL = process.env.DATABASE_URL!;

  return constants;
};

export default configure();
