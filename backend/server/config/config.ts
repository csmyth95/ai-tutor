import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  dbName: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  llmHost: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbName: process.env.POSTGRES_DB || 'ai_tutor_db_dev',
  dbPort: Number(process.env.POSTGRES_PORT) || 5432,
  dbUser: process.env.POSTGRES_USER || 'db_user',
  dbPassword: process.env.POSTGRES_PASSWORD || 'muinteoir_db_admin',
  dbHost: process.env.POSTGRES_HOST || 'postgres',
  llmHost: process.env.LLM_HOST || 'http://llm:11434',
};

export { config };
export default config;
