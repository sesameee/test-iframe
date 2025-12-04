// Netlify Function for health check
const config = require('../../config');

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      redirectUrl: config.redirectUrl,
      allowedOrigins: config.allowedOrigins
    })
  };
};

