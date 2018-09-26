export const config = {
  user: process.env.POSTGRES_USER || 'postgres', // for db pool config
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  dialect: 'postgres'
}
