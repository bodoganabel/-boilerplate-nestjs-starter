export enum EDatabaseType {
  NOSQL = 'NOSQL',
  SQL = 'SQL',
}

export const appConfig = {
  databaseType: EDatabaseType.SQL,
  PORT: process.env.PORT || 3000,
};

export const authConfig = {
  accessToxenExpiration: process.env.STAGE === 'development' ? '15s' : '15s', //jwt expiration string
  autoLogoutPeriodMs: /* 'development' ? 20 * 1000 : */ 20 * 60 * 1000,
  cleanExpiredTokensPeriodMs: 60 * 60 * 1000,
  saltRounds: 10, // Used to generate sand on registration
};

export function getMongodbConnectionString() {
  const connectionString =
    process.env.MONGODB_CONNECTION_STRING !== 'null'
      ? process.env.MONGODB_CONNECTION_STRING
      : `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
  console.log('MONGODB connection string:');
  console.log(connectionString);

  return connectionString;
}

export enum EConstants {
  VAT_HU = 1.27,
  DEPOSIT_MULTIPLIER = 0.5,
  mm2_TO_m2 = 0.000001,
}
