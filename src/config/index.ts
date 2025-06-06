import * as dotenv from 'dotenv';

dotenv.config();

function loadConfig() {
  const config = {
    app: {
      env: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '3000', 10),
    },
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      dbName: process.env.MYSQL_DB_NAME || 'u4s',
    },
    auth: {
      jwt: {
        secret: process.env.JWT_SECRET,
      },
      encryption: {
        key: process.env.ENCRYPTION_KEY,
      },
    },
    pinata: {
      pinataJwt: process.env.PINATA_JWT,
    },
    chain: {
      rpc_url: process.env.RPC_URL || '',
    },
    private_key: process.env.PRIVATE_KEY || '',
  };

  return config;
}

export const env = loadConfig();
