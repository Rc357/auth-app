const serverlessExpress = require('@vendia/serverless-express');
const app = require('./index.js'); // import the app you just exported

module.exports = (req, res) => {
  const handler = serverlessExpress({ app });
  return handler(req, res);
};
