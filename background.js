/**
 * background.js - Chrome扩展的后台脚本
 * 功能：监听扩展图标点击事件，复制当前标签页URL并显示通知
 */

// 扩展加载时的日志
console.log('Background script loaded!');

/**
 * 监听扩展图标的点击事件
 * 使用 chrome.action.onClicked API 来监听用户点击扩展图标的动作
 * @param {chrome.tabs.Tab} tab - 当前标签页的信息对象
 */
chrome.action.onClicked.addListener(async (tab) => {
    // 确保标签页对象存在且有URL
    if (tab && tab.url) {
        try {
            /**
             * 在当前标签页中执行复制操作
             * 使用 chrome.scripting.executeScript 在目标标签页中注入并执行脚本
             * 这是必要的，因为 Service Worker 上下文中无法直接访问剪贴板
             */
            await chrome.scripting.executeScript({
                // 指定在哪个标签页中执行脚本
                target: { tabId: tab.id },
                // 定义要执行的函数
                func: (url) => {
                    // 创建临时文本区域元素
                    const textarea = document.createElement('textarea');
                    // 设置要复制的URL
                    textarea.value = url;
                    // 将文本区域添加到页面
                    document.body.appendChild(textarea);
                    // 选中文本
                    textarea.select();
                    // 执行复制命令
                    document.execCommand('copy');
                    // 清理：移除临时文本区域
                    document.body.removeChild(textarea);
                },
                // 传递给函数的参数
                args: [tab.url]
            });

            // 复制成功后显示通知
            chrome.notifications.create({
                type: 'basic',                // 基本通知类型
                iconUrl: 'images/icon48.png', // 通知图标
                title: '已复制',              // 通知标题
                message: '当前标签页 URL 已复制到剪贴板！' // 通知内容
            });
            // 在控制台记录成功信息
            console.log('URL copied successfully:', tab.url);
        } catch (e) {
            // 错误处理：记录错误并显示通知
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