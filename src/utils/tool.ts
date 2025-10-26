export function formatIdDisplay(id) {
    if (!id) {
        return ''
    }
    return `JH${id.toString().padStart(4, '0')}`;
}

export function exactIdFromDisplay(displayId) {
    const match = displayId.match(/^JH(\d+)$/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return 0;
}

export function formatRole(role) {
    const roleMap = {
        'agent': '代理',
        'seller': '商家',
        'buyer': '买家',
        'default': '默认用户'
    }
    return roleMap[role]
}

export function formatPaymentMethod(payment_method) {
    const paymentMethodMap = {
        'alipay': '支付宝',
        'wechat': '微信',
        'bank': '银行卡',
    }
    return paymentMethodMap[payment_method]
}

export function formatOrderIdDisplay(id, created_at) {
    // 创建一个 Date 对象
    const date = new Date(created_at);
    
    // 获取年月日
    const year = date.getFullYear();  // 获取年
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // 获取月，注意月份是从 0 开始的，所以加 1
    const day = date.getDate().toString().padStart(2, '0');  // 获取日
    
    // 格式化订单 ID
    const orderId = id.toString().padStart(4, '0');  // 确保 ID 是 4 位

    // 返回格式化后的订单 ID
    return `${year}${month}${day}_${orderId}`;
}

export function formatImageUrl(imagePath) {
    return `${import.meta.env.VITE_CDN_ENDPOINT}${imagePath}`
}

export function getAdjustWidth(baseWidth) {
  const { body } = document;
  const rect = body.getBoundingClientRect();
  
  return baseWidth / 430 * rect.width;
}