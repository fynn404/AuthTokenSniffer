/**
 * Auth Token Sniffer - Background Script
 * 这个脚本作为扩展的后台服务运行，负责监听和捕获网络请求中的 Authorization token
 */

// 用于存储捕获到的 token 的数组
let capturedTokens = [];

/**
 * 监听所有网络请求的发送前事件
 * 这个监听器会在请求发送前被触发，允许我们检查请求头
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
    /**
     * 处理请求的回调函数
     * @param {Object} details - 请求的详细信息
     * @returns {Object} - 修改后的请求头
     */
    function (details) {
        // 获取请求的所有头信息
        const headers = details.requestHeaders;

        // 在请求头中查找 Authorization 头
        const authHeader = headers.find(header =>
            header.name.toLowerCase() === 'authorization'
        );

        // 如果找到 Authorization 头
        if (authHeader) {
            // 提取 token 值
            const token = authHeader.value;

            // 创建包含完整信息的 token 对象
            const tokenInfo = {
                url: details.url,              // 请求的 URL
                token: token,                  // Authorization token
                timestamp: new Date().toISOString(), // 捕获时间
                method: details.method         // HTTP 请求方法
            };

            // 将新的 token 信息添加到数组
            capturedTokens.push(tokenInfo);

            // 将更新后的 token 数组保存到本地存储
            chrome.storage.local.set({ tokens: capturedTokens }, function () {
                console.log('Token captured and stored:', tokenInfo);
            });
        }

        // 返回修改后的请求头（这里没有修改，原样返回）
        return { requestHeaders: headers };
    },
    // 监听器配置
    {
        urls: ["<all_urls>"]  // 监听所有 URL 的请求
    },
    // 需要的权限
    ["requestHeaders", "blocking"]
);

/**
 * 监听来自 popup 页面的消息
 * 用于响应 popup 页面获取 token 列表的请求
 */
chrome.runtime.onMessage.addListener(
    /**
     * 处理消息的回调函数
     * @param {Object} request - 请求信息
     * @param {Object} sender - 发送者信息
     * @param {Function} sendResponse - 发送响应的函数
     * @returns {boolean} - 是否保持消息通道开放
     */
    (request, sender, sendResponse) => {
        // 如果请求是获取 token 列表
        if (request.action === "getTokens") {
            // 返回所有捕获的 token
            sendResponse({ tokens: capturedTokens });
        }
        return true; // 保持消息通道开放，允许异步响应
    }
); 