const snowflake = require('snowflake-sdk');

export const createConnection = () =>
  snowflake.createConnection({
    account: process.env['SNOWFLAKE_ACCOUNT'],
    username: process.env['SNOWFLAKE_USER'],
    password: process.env['SNOWFLAKE_PSWD'],
    region: process.env['SNOWFLAKE_REGION']
  });
