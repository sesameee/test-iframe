# test-iframe

iframe 測試工具與 Express 重定向服務

## 功能

1. **iframe 測試頁面** (`index.html`) - 用於測試 URL 是否可以在 iframe 中正常載入
2. **Express 重定向服務** - 提供 302 重定向 API，並限制特定网域訪問

## Express 服務使用說明

### 安裝依賴

```bash
npm install
```

### 配置

編輯 `config.js` 文件或使用環境變數：

- `REDIRECT_URL`: 重定向目標網址（預設: `https://www.example.com`）
- `ALLOWED_ORIGINS`: 允許訪問的网域列表，用逗號分隔（預設包含 localhost）
- `PORT`: 服務器端口（預設: `3000`）

### 使用環境變數

```bash
# 設置重定向目標
export REDIRECT_URL=https://www.google.com

# 設置允許的网域（多個用逗號分隔）
export ALLOWED_ORIGINS=http://localhost:3000,https://example.com

# 設置端口
export PORT=3000

# 啟動服務
npm start
```

### 啟動服務

```bash
npm start
```

### API 端點

#### 1. 重定向 API
- **GET** `/api/redirect` - 返回 302 重定向到配置的網址
- **POST** `/api/redirect` - 返回 302 重定向到配置的網址

#### 2. 健康檢查
- **GET** `/health` - 檢查服務狀態和配置

#### 3. 配置查詢
- **GET** `/api/config` - 查看當前配置（僅用於調試）

### CORS 保護

服務只允許 `config.js` 中配置的网域訪問。如果從未授權的网域訪問，將返回 403 錯誤。

### 範例使用

```javascript
// 從允許的网域發起請求
fetch('http://localhost:3000/api/redirect')
  .then(response => {
    // 瀏覽器會自動跟隨 302 重定向
    console.log('重定向到:', response.url);
  });
```

### 測試

在瀏覽器中打開允許的网域頁面，然後訪問：
- `http://localhost:3000/api/redirect` - 會自動重定向到配置的網址
- `http://localhost:3000/health` - 查看服務狀態

---

## Netlify 部署說明

### 部署到 Netlify

此專案已配置為可在 Netlify 上運行，使用 Netlify Functions（serverless functions）。

#### 方法一：通過 Netlify Dashboard

1. **登入 Netlify**
   - 前往 [netlify.com](https://www.netlify.com) 並登入

2. **連接 Git 倉庫**
   - 點擊 "Add new site" → "Import an existing project"
   - 選擇你的 Git 提供商（GitHub、GitLab 等）
   - 選擇此專案的倉庫

3. **設置環境變數**
   - 在 Site settings → Environment variables 中添加：
     - `REDIRECT_URL`: 你的重定向目標網址（例如：`https://www.google.com`）
     - `ALLOWED_ORIGINS`: 允許訪問的网域，用逗號分隔（例如：`https://yourdomain.com,https://anotherdomain.com`）

4. **部署**
   - Netlify 會自動檢測 `netlify.toml` 配置
   - 點擊 "Deploy site" 開始部署

#### 方法二：使用 Netlify CLI

1. **安裝 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登入 Netlify**
   ```bash
   netlify login
   ```

3. **初始化專案**
   ```bash
   netlify init
   ```

4. **設置環境變數**
   ```bash
   # 設置重定向目標
   netlify env:set REDIRECT_URL "https://www.google.com"
   
   # 設置允許的网域
   netlify env:set ALLOWED_ORIGINS "https://yourdomain.com,https://anotherdomain.com"
   ```

5. **部署**
   ```bash
   netlify deploy --prod
   ```

### Netlify Functions 端點

部署後，API 端點會自動映射：

- `https://your-site.netlify.app/api/redirect` → Netlify Function
- `https://your-site.netlify.app/health` → Netlify Function
- `https://your-site.netlify.app/api/config` → Netlify Function

### 本地測試 Netlify Functions

使用 Netlify CLI 在本地測試：

```bash
# 安裝 Netlify CLI（如果還沒安裝）
npm install -g netlify-cli

# 啟動本地開發服務器
npm run netlify:dev
# 或
netlify dev
```

這會啟動本地服務器（通常是 `http://localhost:8888`），可以測試 Netlify Functions。

### 重要注意事項

1. **環境變數設置**
   - 必須在 Netlify Dashboard 中設置 `REDIRECT_URL` 和 `ALLOWED_ORIGINS`
   - 如果不設置，會使用 `config.js` 中的預設值

2. **CORS 配置**
   - 部署後，記得在 `ALLOWED_ORIGINS` 中包含你的 Netlify 網站網域
   - 例如：`https://your-site.netlify.app`

3. **Functions 目錄**
   - Netlify Functions 位於 `netlify/functions/` 目錄
   - 每個函數對應一個文件

4. **重定向規則**
   - `netlify.toml` 中已配置重定向規則，將 `/api/*` 路由到對應的 Function

### 文件結構

```
.
├── netlify/
│   └── functions/
│       ├── redirect.js    # 重定向 API
│       ├── health.js      # 健康檢查
│       └── config.js      # 配置查詢
├── netlify.toml           # Netlify 配置文件
├── config.js              # 共享配置文件
├── server.js              # Express 服務器（本地開發用）
└── package.json
```
