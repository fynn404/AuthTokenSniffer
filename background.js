console.log('Background script loaded!');
/**
 * 只存储所有 JS 请求的 url、method、timestamp
 */

let allRequests = [];

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'REQUEST_URL') {
        console.log('[收到请求]:', {
            url: request.url,
            method: request.method
        });
        const reqInfo = {
            url: request.url,
            method: request.method,
            timestamp: request.timestamp
        };
        allRequests.push(reqInfo);
        chrome.storage.local.set({ allRequests }, () => {
            console.log('[请求已保存]');
        });
    }

    // 处理来自 popup 的获取所有请求请求
    if (request.action === "getAllRequests") {
        sendResponse({ allRequests });
        return true;
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    if (tab && tab.url) {
        try {
            // 在当前标签页中执行复制操作
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (url) => {
                    const textarea = document.createElement('textarea');
                    textarea.value = url;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                },
                args: [tab.url]
            });

            // 显示成功通知
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon48.png',
                title: '已复制',
                message: '当前标签页 URL 已复制到剪贴板！'
            });
            console.log('URL copied successfully:', tab.url);
        } catch (e) {
            console.error('Failed to copy URL:', e);
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon48.png',
                title: '复制失败',
                message: '无法复制当前标签页 URL，请重试！'
            });
        }
    }
}); 