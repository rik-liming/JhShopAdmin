import requestBase from './base';

export async function getReddot(adminLoginToken) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/reddot`;
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}
