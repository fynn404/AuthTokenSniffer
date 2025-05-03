# Tab URL Copier

一个简单的 Chrome 扩展，点击扩展图标即可复制当前标签页的 URL。

## 功能说明

当你点击扩展图标时，扩展会：
1. 自动获取当前标签页的 URL
2. 将 URL 复制到剪贴板
3. 显示一个系统通知，提示复制成功或失败

## 技术实现

### 核心文件

1. **manifest.json**
   ```json
   {
     "manifest_version": 3,
     "permissions": ["activeTab", "notifications"]
   }
   ```
   - `activeTab`: 获取当前标签页信息的权限
   - `notifications`: 显示系统通知的权限

2. **background.js**
   ```javascript
   chrome.action.onClicked.addListener(async (tab) => {
     if (tab && tab.url) {
       try {
         await navigator.clipboard.writeText(tab.url);
         // 显示成功通知
       } catch (e) {
         // 显示错误通知
       }
     }
   });
   ```

### 工作原理

1. 用户点击扩展图标
2. 扩展获取当前标签页信息
3. 复制 URL 到剪贴板
4. 显示操作结果通知

## 安装方法

1. 下载本仓库代码
2. 打开 Chrome 扩展管理页面 (`chrome://extensions/`)
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本扩展的目录

## 目录结构

```
├── manifest.json     # 扩展配置文件
├── background.js     # 后台脚本
└── images/          # 图标文件目录
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 调试方法

如果复制功能不正常，可以：
1. 打开 Chrome 开发者工具
2. 在扩展管理页面找到本扩展
3. 点击"检查视图"查看错误信息