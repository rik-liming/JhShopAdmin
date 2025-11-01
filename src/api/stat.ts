import requestBase from './base';

// request dashboard summary
export async function getDashboardSummary(adminLoginToken) {
    const response = await requestBase.get('/api/admin/stat/dashboard', {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}
