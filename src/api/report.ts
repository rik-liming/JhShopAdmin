import requestBase from './base';

// request report
export async function getReportList(adminLoginToken, queryParams) {
    const { startTime, endTime, type } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/report/list?startTime=${startTime}&endTime=${endTime}&type=${type}`;

    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request generate report
export async function generateTodayReport(adminLoginToken) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/report/daily`;

    const response = await requestBase.post(requestUrl, {}, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}