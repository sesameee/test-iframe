const express = require('express');
const cors = require('cors');
const config = require('./config');

const app = express();

// CORS 配置 - 只允许特定网域访问
const corsOptions = {
  origin: function (origin, callback) {
    // 允许没有 origin 的请求（例如 Postman、curl 等）
    if (!origin) {
      return callback(null, true);
    }
    
    // 检查 origin 是否在允许列表中
    if (config.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('不允许的 CORS 来源'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 应用 CORS 中间件
app.use(cors(corsOptions));

// 解析 JSON 请求体
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'N/A'}`);
  next();
});

// 302 重定向 API 端点
app.get('/api/redirect', (req, res) => {
  const redirectUrl = config.redirectUrl;
  
  // 验证重定向 URL 是否有效
  try {
    new URL(redirectUrl);
  } catch (error) {
    return res.status(500).json({
      error: '无效的重定向 URL 配置',
      message: error.message
    });
  }
  
  // 返回 302 重定向
  res.status(302).redirect(redirectUrl);
});

// POST 方法也支持（如果需要）
app.post('/api/redirect', (req, res) => {
  const redirectUrl = config.redirectUrl;
  
  try {
    new URL(redirectUrl);
  } catch (error) {
    return res.status(500).json({
      error: '无效的重定向 URL 配置',
      message: error.message
    });
  }
  
  res.status(302).redirect(redirectUrl);
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    redirectUrl: config.redirectUrl,
    allowedOrigins: config.allowedOrigins
  });
});

// 获取配置信息（仅用于调试）
app.get('/api/config', (req, res) => {
  res.json({
    redirectUrl: config.redirectUrl,
    allowedOrigins: config.allowedOrigins,
    port: config.port
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  if (err.message === '不允许的 CORS 来源') {
    return res.status(403).json({
      error: 'CORS 错误',
      message: '您的网域不在允许列表中',
      allowedOrigins: config.allowedOrigins
    });
  }
  
  console.error('错误:', err);
  res.status(500).json({
    error: '服务器错误',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到',
    message: `路径 ${req.path} 不存在`
  });
});

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n服务器已启动！`);
  console.log(`端口: ${PORT}`);
  console.log(`重定向目标: ${config.redirectUrl}`);
  console.log(`允许的网域: ${config.allowedOrigins.join(', ')}`);
  console.log(`\nAPI 端点:`);
  console.log(`  GET  http://localhost:${PORT}/api/redirect  - 302 重定向`);
  console.log(`  POST http://localhost:${PORT}/api/redirect  - 302 重定向`);
  console.log(`  GET  http://localhost:${PORT}/health        - 健康检查`);
  console.log(`  GET  http://localhost:${PORT}/api/config    - 查看配置\n`);
});

