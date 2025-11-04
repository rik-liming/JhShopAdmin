import requestBase from './base';

// request my message list
export async function getMessageList(adminToken) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/message/list`;

    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminToken}`,
        }
    })
    return response
}

// request my message unread count
export async function getMessageUnreadCount(adminToken) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/message/unread`;

    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminToken}`,
        }
    })
    return response
}

// request mark message as read
export async function markAsRead(adminToken, id) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/message/markread`;

    const response = await requestBase.post(requestUrl, {
        id
    }, {
        headers: {
            Authorization: `Bearer ${adminToken}`,
        }
    })
    return response
}
