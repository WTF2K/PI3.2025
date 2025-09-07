module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "PI3_25",
  PORT: process.env.DB_PORT || 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.DB_SSL === 'false' ? false : { require: true, rejectUnauthorized: false }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
