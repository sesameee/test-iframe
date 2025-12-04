// Netlify Function for config info (debug only)
const config = require('../../config');

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      redirectUrl: config.redirectUrl,
      allowedOrigins: config.allowedOrigins
    })
  };
};

