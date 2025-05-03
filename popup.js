// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取存储的 token
    chrome.storage.local.get(['tokens'], function (result) {
        const tokens = result.tokens || [];
        const tokensContainer = document.getElementById('tokens');

        if (tokens.length === 0) {
            tokensContainer.innerHTML = '<p>No tokens captured yet.</p>';
            return;
        }

        // 显示所有捕获的 token
        tokens.forEach(tokenInfo => {
            const tokenElement = document.createElement('div');
            tokenElement.className = 'token-item';

            tokenElement.innerHTML = `
        <div>
          <span class="method">${tokenInfo.method}</span>
          <span class="url">${tokenInfo.url}</span>
        </div>
        <div class="token">${tokenInfo.token}</div>
        <div class="timestamp">Captured at: ${new Date(tokenInfo.timestamp).toLocaleString()}</div>
      `;

            tokensContainer.appendChild(tokenElement);
        });
    });
}); 