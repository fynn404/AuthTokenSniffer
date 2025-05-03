/**
 * Auth Token Sniffer - Popup Script
 * 这个脚本负责处理弹出窗口的交互逻辑，显示捕获的 token 信息
 */

// 等待 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    /**
     * 从本地存储获取 token 数据并显示
     */
    chrome.storage.local.get(['tokens'], function (result) {
        // 获取存储的 token 数组，如果没有则使用空数组
        const tokens = result.tokens || [];
        // 获取显示 token 的容器元素
        const tokensContainer = document.getElementById('tokens');

        // 如果没有捕获到任何 token
        if (tokens.length === 0) {
            // 显示提示信息
            tokensContainer.innerHTML = '<p>No tokens captured yet.</p>';
            return;
        }

        /**
         * 遍历所有 token 并创建显示元素
         */
        tokens.forEach(tokenInfo => {
            // 创建 token 条目容器
            const tokenElement = document.createElement('div');
            tokenElement.className = 'token-item';

            // 设置 token 条目的 HTML 内容
            tokenElement.innerHTML = `
        <div>
          <!-- 显示 HTTP 方法和 URL -->
          <span class="method">${tokenInfo.method}</span>
          <span class="url">${tokenInfo.url}</span>
        </div>
        <!-- 显示 token 内容 -->
        <div class="token">${tokenInfo.token}</div>
        <!-- 显示捕获时间 -->
        <div class="timestamp">Captured at: ${new Date(tokenInfo.timestamp).toLocaleString()}</div>
      `;

            // 将 token 条目添加到容器中
            tokensContainer.appendChild(tokenElement);
        });
    });
}); 