import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

export async function getRoleRules(adminLoginToken, role) {

    // 构建请求的基础 URL
    let requestUrl = `/api/roles/${role}/rules`;
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

export async function updateRoleRules(adminLoginToken, role, data) {

    // 构建请求的基础 URL
    let requestUrl = `/api/roles/${role}/rules`;
    const response = await requestBase.post(requestUrl, data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}