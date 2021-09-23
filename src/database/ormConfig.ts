export = {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + process.env.ENTITIES_LOCATION],
  synchronize: Boolean(process.env.DB_NAME),
};
