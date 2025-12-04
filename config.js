// 配置文件
module.exports = {
  // 重定向目标网址
  redirectUrl: process.env.REDIRECT_URL || 'https://www.example.com',
  
  // 允许访问的网域列表（支持多个网域）
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8080'
      ],
  
  // 服务器端口
  port: process.env.PORT || 3000
};

