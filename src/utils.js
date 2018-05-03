import { isString, isObject } from 'mango-helper';

export function params(obj) {
    return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k] === undefined ? '' : obj[k])).join('&')
}

export function getUnionId() {
    const data_unid = '';
    window.VIDEOINFO = window.VIDEOINFO || {};
    if (VIDEOINFO.bdid && (VIDEOINFO.bdid !== '' || VIDEOINFO.bdid !== 0)) {
        data_unid = '0_' + (VIDEOINFO.bdid || '') + '_' + (VIDEOINFO.vid || '');//会员数据上报
    } else {
        data_unid = (VIDEOINFO.cid || '') + '_' + (VIDEOINFO.vid || '');//会员数据上报
    }
    return data_unid
}

export function cookieGet(name) {
    var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
    var m = document.cookie.match(r);
    return (!m ? "" : m[1]);
}

/**
 * 简单模板渲染函数
 * @param {string} tpl 
 * @param {object} context 
 */
export function render(tpl, context) {
    if (!isString(tpl) || !isObject(context)) return '';
    return tpl.replace(/{{@(\w+)}}/g, function ($all, $1) {
        return context[$1] === 0 ? 0 : (context[$1] || '');
    })
}

/**
 * 获取会员购买二维码图片
 */
export function getQrcode($canvasImage) {
    var ipad = (/iPad/i).test(navigator.userAgent);
    var bid = ipad ? '4.1.11' : '1.1.11';
    

    var cookie = cookieGet('__STKUUID');
    var _data = {
        invoker: 'pcweb',
        version: '1',
        unid: data_unid,
        ftype: data_ftype,
        ticket: cookieGet('HDCN') == '' ? '' : cookieGet('HDCN').match(/\b\w+\b/g)[0],
        c: 7,
        bid: bid,
        sessionid: cookieGet('sessionid') || '',
        uuid: cookieGet('uuid') || '',
        cookie: cookie,
        sign: + new Date(),
        uvip: cookieGet('vipStatus') || '',
        isscan: 1
    };

    var Qurl = '//as.mgtv.com/play_qrcode?data={"bid":"' + _data.bid + '","ftype":"' + _data.ftype
        + '","clocation":"' + _data.c + '","uvip":"' + _data.uvip + '","isscan":"1","unid":"' + _data.unid
        + '","cookie":"' + _data.cookie + '","sessionid":"' + _data.sessionid + '","ticket":"' + _data.ticket
        + '"}&version=11&sign=11&invoker=pcweb';

    $canvasImage.attr('src', Qurl).show();
    
}