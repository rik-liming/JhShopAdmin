import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

export async function getPrivilegesTree(adminLoginToken) {

    // 构建请求的基础 URL
    let requestUrl = `/api/privileges/tree`;
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}
