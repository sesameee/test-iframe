// Netlify Function for 302 redirect with CORS protection
const config = require('../../config');

// 检查 CORS 是否允许
function checkCORS(origin) {
  // 允许没有 origin 的请求（例如 Postman、curl 等）
  if (!origin) {
    return true;
  }
  
  // 检查 origin 是否在允许列表中
  return config.allowedOrigins.indexOf(origin) !== -1;
}

// 设置 CORS 响应头
function setCORSHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
  
  if (origin && checkCORS(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  
  return headers;
}

exports.handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.Origin;
  const method = event.httpMethod;
  
  console.log(`${new Date().toISOString()} - ${method} ${event.path} - Origin: ${origin || 'N/A'}`);
  
  // 处理 OPTIONS 预检请求
  if (method === 'OPTIONS') {
    if (!checkCORS(origin)) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          ...setCORSHeaders(origin)
        },
        body: JSON.stringify({
          error: 'CORS 错误',
          message: '您的网域不在允许列表中',
          allowedOrigins: config.allowedOrigins
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: setCORSHeaders(origin),
      body: ''
    };
  }
  
  // 检查 CORS
  if (!checkCORS(origin)) {
    return {
      statusCode: 403,
      headers: {
        'Content-Type': 'application/json',
        ...setCORSHeaders(origin)
      },
      body: JSON.stringify({
        error: 'CORS 错误',
        message: '您的网域不在允许列表中',
        allowedOrigins: config.allowedOrigins
      })
    };
  }
  
  // 处理 GET 和 POST 请求
  if (method === 'GET' || method === 'POST') {
    const redirectUrl = config.redirectUrl;
    
    // 验证重定向 URL 是否有效
    try {
      new URL(redirectUrl);
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          ...setCORSHeaders(origin)
        },
        body: JSON.stringify({
          error: '无效的重定向 URL 配置',
          message: error.message
        })
      };
    }
    
    // 返回 302 重定向
    return {
      statusCode: 302,
      headers: {
        'Location': redirectUrl,
        ...setCORSHeaders(origin)
      },
      body: ''
    };
  }
  
  // 不支持的方法
  return {
    statusCode: 405,
    headers: {
      'Content-Type': 'application/json',
      ...setCORSHeaders(origin)
    },
    body: JSON.stringify({
      error: '方法不允许',
      message: `不支持 ${method} 方法`
    })
  };
};

