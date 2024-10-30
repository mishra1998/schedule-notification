const { version, name } = require('../package.json');

module.exports = {
  VERSION: process.env.VERSION || version,
  NAME: process.env.NAME || name,
  DOMAIN: process.env.DOMAIN || 'http://localhost:3000',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  DATABASE: {
    development: {
      name: process.env.DB_NAME_DEV || 'schedule-notification',
      username: process.env.DB_USER_NAME_DEV || 'postgres',
      password: process.env.DB_PASSWORD_DEV || 'Mishra@1998',
      options: {
        host: process.env.DB_HOST_DEV || '127.0.0.1',
        port: process.env.DB_PORT_DEV || 5432,
        dialect: 'postgres',
        freezeTableName: true,
        define: {
          timestamps: false,
          charset: 'utf8',
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        dialectOptions: {
          decimalNumbers: true,
          charset: 'utf8',
        },
        logging: false,
        schema: 'public',
      },
    },
  },
};
