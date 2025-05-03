// 存储捕获到的 token
let capturedTokens = [];

// 监听所有网络请求
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        // 获取请求头
        const headers = details.requestHeaders;

        // 查找 Authorization 头
        const authHeader = headers.find(header =>
            header.name.toLowerCase() === 'authorization'
        );

        if (authHeader) {
            // 提取 token
            const token = authHeader.value;

            // 创建 token 信息对象
            const tokenInfo = {
                url: details.url,
                token: token,
                timestamp: new Date().toISOString(),
                method: details.method
            };

            // 添加到存储
            capturedTokens.push(tokenInfo);

            // 更新存储
            chrome.storage.local.set({ tokens: capturedTokens }, function () {
                console.log('Token captured and stored:', tokenInfo);
            });
        }

        return { requestHeaders: headers };
    },
    {
        urls: ["<all_urls>"]
    },
    ["requestHeaders", "blocking"]
);

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTokens") {
        // 返回所有捕获的 token
        sendResponse({ tokens: capturedTokens });
    }
    return true;
}); 