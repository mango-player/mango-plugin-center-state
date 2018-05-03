import { deepAssign, isObject, addClassName, removeClassName, $, fetchJsonp, getUrlParam } from 'mango-helper';
import { params, getUnionId, cookieGet, render, getQrcode } from './utils';
import Base from './base';

window.VIDEOINFO = window.VIDEOINFO || {}

const baseUrl = '//i.mgtv.com';
const AUTH_RESULT = {
    UNSIGNED: 101,      // 未登录
    NOT_ALLOW: 102,     // 无播放权限(不是VIP或者未购买)
    VIP_EXPIRED: 103,   // VIP已过期
    MOVIE_EXPIRED: 104, // 单片购买已过期
    CAN_PLAY: 200       // 允许播放
};

// VIP 付费弹窗
const VIP_DAILOG_TPL = `
    <div class="c-player-paytips {{isshow}}">
        <div class="c-player-paytips-wrapper">
            <div class="c-player-paytips-title">
                <i class="warning"></i><span>{{tips}}</span>
            </div>
            <div class="c-player-paytips-content">
                <!-- 左侧 -->
                <div class="c-player-paytips-primary" bosszone="{{boss}}">
                    {{bottom}}
                    <p class="c-player-paytips-adds">
                        {{text}}
                    </p>
                    <!-- 分割线 -->
                    <div class="c-player-paytips-divding"></div>
                    <!-- 特权 -->
                    <div class="c-player-paytips-welfare">
                        <h5 class="title">开通会员享特权</h5>
                        <ul class="list">
                            <li class="c-player-paytips-welfare-listitem"><i class="welfare-1"></i><span>观影无广告</span></li>
                            <li class="c-player-paytips-welfare-listitem"><i class="welfare-2"></i><span>专属片库</span></li>
                            <li class="c-player-paytips-welfare-listitem"><i class="welfare-3"></i><span>移动端覆盖</span><p class="listitem-tips">
                                打开芒果APP，抢海量会员大礼包！<a href="#" node-type="guide-app" data-pos="8">立即领取</a>
                            </p></li>
                            <li class="c-player-paytips-welfare-listitem"><i class="welfare-4"></i><span>赠送观影券</span></li>
                        </ul>
                    </div>
                </div>
                <!-- 右侧 -->
                <div class="c-player-paytips-sidebar">
                    <span class="u-paycode">
                        <span class="u-pic paycode-qrcode" node-type="paycode-qrcode"><img class="pay-qrcode-info" node-type="pay-qrcode-info" style="display:none" src="" alt="我是二维码"></span>
                        <i class="u-mask refresh-qrcode" node-type="refresh-qrcode" action-type="qrcode-u-mask"><i class="u-refresh"></i></i>
                    </span>
                    <p class="u-tips">
                        扫一扫，开通会员
                    </p>
                </div>
            </div>
            <div class="c-player-paytips-reload">
                开通后请登录并刷新页面观看
            </div>
        </div>
    </div>
`

let video_type = VIDEOINFO.rid == 3 ? '本片' : '本节目'; //如果是电影频道就显示本片,其他节目显示本节目
const bottom = {
    isvip: '<em class="noad">全站畅享大片+无广告</em>',
    vip_tips: '开通会员可以免费观看' + video_type,
    vip_pay_tips: '该片为付费点播影片,您享有优惠特权',
    pay_tips: '该片为付费点播影片,开通会员享优惠',
    no_ticket: '你的观影券已经用完,续费会员可以获赠观影券免费看',
    is_ticket: '你可以使用观影券继续观看影片',
    vip_no_ticket: '续费会员用券免费看',
    allpay: '该片仅限付费点播，购买后可观看完整视频',
    play_button: '购买本片'
};

const text_a = '开通会员免费观看';
const text_b = '开通会员享半价优惠';
const text_c = '开通会员';
const nickname_a = '尊敬的会员';
const nickname_b = '尊敬的用户';

//动态拉取文案信息
let playTips = {
    play_tips: '应版权方要求该片付费播放',
    buy_title: '',
    play_link: '购买本片',
    play_tips2: '会员每月获取2个张观音券',
    preview_tips: '免费试看5分钟',
    play_button: '购买本片',
    vip_promotion: '开通会员'
}


/**
 * 播放器错误提示 配置
 */
const defaultOption = {
    tag: 'mango-center-state-payment',
    html: ` `,
    defaultEvent: {
        click: 'click'
    }
};

export default class PaymentTip extends Base {
    constructor(parent, option) {
        super(parent);
        this.option = deepAssign(defaultOption, isObject(option) ? option : {});
        this.animate = false;
        this.init();
    }

    init() {
        super.create();
        this.$dom = $(this.$dom);
    }

    show() {
        this.createHTMLFragment(data)
    }

    buildDialog(html){
        this.$domWrap.html(html);
        this.refreshCode();
    }

    createHTMLFragment(_data) {
        const self = this;
        let html = "", info = _data.info, user = _data.user, vip_info = ''; 
        let num = 0, isNum = false; //记录有多少张观影券; // 是否有观影券; 

        // 非会员价格 和 会员价格
        let novip_price = info.price_novip || 0;
        let vip_price = info.price_vip || 0;
        let price = user.isvip == 1 ? vip_price : novip_price;

        // 会员数据上报参数获取
        let data_unid = getUnionId(); 
        let data_page = encodeURIComponent(window.location.href);
        let data_ftype = 3;
        let data_clocation = 3;


        if (info && info.tips) {
            playTips = {
                play_tips: info.tips.play_tips,//尊敬的用户 提示文案
                buy_title: info.tips.buy_title,//
                play_link: info.tips.play_link,//多少钱购买 xx 电影
                play_tips2: info.tips.play_tips2,//会员每月获取2个张观音券
                preview_tips: info.tips.preview_tips,//免费试看5分钟
                play_button: info.tips.play_button,//购买按钮文案
                vip_promotion: info.tips.vip_promotion//活动促销文案
            }
            vip_info = info.tips.vip_promotion || vip_info;
        }

        let pay_type = 0; //判断目前在哪个状态下面
        let isShowPayTips = vip_info == '' ? 'none' : 'block';//判断文案是否为空
        bottom.vip_tips = playTips.play_tips;//获取动态文案
        bottom.play_button = playTips.play_button;

        //创建vip按钮
        let creatBottom = function (text, s) {
            let isvipBottom = '<a class="c-player-paytips-button open-vip-dialog" unid="' + data_unid + '"  clocation="60303" ftype="3" type="1" target="_blank"' +
                ' href="//order.mgtv.com/pay/pc/index.html?unid=' + data_unid + '&ftype=' + data_ftype + '&clocation=' + data_clocation + '">' + playTips.play_button +
                '   <i class="price" node-type="promotion-info" style="display: ' + isShowPayTips + '">' + vip_info + '</i> ' +
                '</a>'
            return isvipBottom;
        };

        //购买按钮
        let tickerInfo = function () {
            let ticketStr = '<em class="tickets">' + playTips.play_tips2 + '</em><a class="anotherway" type="2"' +
                ' target="_blank" href="//order.mgtv.com/pc/order?videoId=' + VIDEOINFO.vid + '&page=' + data_page + '&unid=' + data_unid + '&ftype=' + data_ftype + '&clocation=4">' + playTips.play_link + '</a>';

            return ticketStr;
        }

        //直播付费弹窗
        // ================== 1,无需付费，影片需要为vip才能播放 ===============================
        if (info.paymark == "live") {//VIP

            //没登录的情况
            if (user.purview !== AUTH_RESULT.UNSIGNED || user.purview != AUTH_RESULT.NOT_ALLOW) {

                data_unid = info.channelId || '';//获取机位id
                data_ftype = 4;
                data_clocation = 1;

                html = render(VIP_DAILOG_TPL, {
                    bottom: creatBottom(text_a, isShowPayTips),
                    text: VIDEOINFO.rid == 3 ? tickerInfo() : bottom.isvip,
                    tips: '开通会员免费观看本直播',
                    nickname: user.isvip == 1 ? nickname_a : nickname_b,
                    boss: 'tovip'
                })

                self.buildDialog(html);
            }

            pay_type = 10;
        }

        //paymark视频付费角标，0：免费，1：VIP，2：付费（即单点），3：用券
        // ================== 1,无需付费，影片需要为vip才能播放 ===============================
        if (info.paymark == "1") {//VIP

            //没登录的情况
            if (user.purview !== AUTH_RESULT.UNSIGNED || user.purview != AUTH_RESULT.NOT_ALLOW) {

                html = render(VIP_DAILOG_TPL, {
                    bottom: creatBottom(text_a, isShowPayTips),
                    text: VIDEOINFO.rid == 3 ? tickerInfo() : bottom.isvip,
                    tips: bottom.vip_tips,
                    nickname: user.isvip == 1 ? nickname_a : nickname_b,
                    boss: 'tovip'
                })

                self.buildDialog(html);
            }

            pay_type = 1;
        }

        // ================== 3.需付费，且付费类型为现金购买 UPGC购买增加isshow隐藏二维码扫描===============================
        if (info.paymark == "2") {//付费（即单点）
            let isVipPrice = vip_price == novip_price ? true : false; //判断是不是vip半价
            let ispayBottom = ['<a class="c-player-paytips-button"' +
                ' href="//order.mgtv.com/pc/order?videoId=' + VIDEOINFO.vid + '&page=' + data_page + '&unid=' + data_unid + '&ftype=' + data_ftype + '&clocation=4" target="_blank" type="5">' + bottom.play_button + '</a>'
            ].join("");
            let text = ['<em class="tickets">' + playTips.play_tips2 + '</em>'].join("");
            let vip_pay_tips = bottom.vip_tips//bottom.allpay;

            //如果是vip弹这个
            if (user.isvip == 1) {
                vip_pay_tips = bottom.vip_pay_tips;
            }

            //如果当前用户未登录
            if (user.purview == AUTH_RESULT.UNSIGNED || user.purview != AUTH_RESULT.CAN_PLAY) {

                html = render(VIP_DAILOG_TPL, {
                    bottom: ispayBottom,
                    price: price,
                    text: text,
                    tips: vip_pay_tips,//isVipPrice //bottom.allpay : vip_pay_tips,
                    nickname: user.isvip == 1 ? nickname_a : nickname_b,
                    boss: 'tovip',
                    isshow: 'c-player-paytips-nowxpay'
                });

                self.buildDialog(html);
            }

            pay_type = 5;
        }

        // ================== 4.需付费，且付费类型为观影券 ===============================
        if (info.paymark == '3') {//用券//观影券
            let ismBottom = ['<a class="c-player-paytips-button" type="3" action-type="determine">确认使用1张观影券</a>'].join(""); //有观影券
            let nosmBottom = ['<a class="c-player-paytips-button" type="4" target="_blank" href="//order.mgtv.com/pay/pc/index.html?unid=' + data_unid + '&ftype=' + data_ftype + '&clocation=3">续费会员用券免费看</a>'].join(""); //没有观影券
            let originalPrice = ['<em class="tickets">原价' + price + '元</em>'].join("");
            //影片为用券,没登录的情况下
            if (user.uuid == '') {
                html = render(VIP_DAILOG_TPL, {
                    bottom: creatBottom(text_a, isShowPayTips),
                    text: tickerInfo(),
                    tips: bottom.vip_tips,
                    nickname: user.isvip == 1 ? nickname_a : nickname_b,
                    boss: 'tovip'
                });

                self.buildDialog(html);

            } else {
                if (user.isvip == 1) {

                    function setVipLook(data) {
                        let len = data.data.count;
                        let isNum = len > 0 ? true : false;
                        let movieTicket = '<em class="tickets">您目前有<b>' + len + '张</b>观影券</em><em' + ' class="anotherway">48小时内随意观看</em>';

                        html = render(VIP_DAILOG_TPL, {
                            bottom: isNum ? ismBottom : nosmBottom,
                            text: isNum ? movieTicket : tickerInfo(),
                            tips: isNum ? bottom.is_ticket : bottom.no_ticket,
                            nickname: user.isvip == 1 ? nickname_a : nickname_b,
                            boss: 'tovip'
                        })

                        self.buildDialog(html);
                    }

                    // 获取用户观影券数量
                    getCoupons().then((len) => {
                        num = len
                        setVipLook()
                    });

                } else {

                    //非会员碰到观影券的电影在没有观影券的情况下的弹出情况
                    function setNovipLook(data) {

                        let len = data.data.count;
                        let isNum = len > 0 ? true : false;
                        let movieTicket = ['<em class="tickets">您目前有<b>' + len + '张</b>观影券</em><em' +
                            ' class="anotherway">48小时内随意观看</em>'
                        ].join("");

                        html = render(VIP_DAILOG_TPL, {
                            bottom: isNum ? ismBottom : creatBottom(text_a, isShowPayTips),
                            text: isNum ? movieTicket : tickerInfo(),
                            tips: isNum ? bottom.is_ticket : bottom.vip_tips,
                            nickname: user.isvip == 1 ? nickname_a : nickname_b,
                            boss: 'tovip'
                        });

                        self.buildDialog(html);
                    }
                    // 获取用户观影券数量
                    getCoupons().then((len) => {
                        num = len
                        setNovipLook()
                    });
                }

            }
            pay_type = 3;
        };
    }

    // 刷新开通会员二维码
    refreshCode() {
        const $canvasImage = this.$domWrap.find('[node-type="pay-qrcode-info"]');
        const $refresh = this.$domWrap.find('[node-type="refresh-qrcode"]');

        $refresh.hide();
        qrcodeTimer && clearTimeout(qrcodeTimer);
        getQrcode($canvasImage);
        this.qrcodeTimer = setTimeout(function () {
            $refresh.show();
        }, 1800000)
    }

    // 登录弹窗
    login() {
        if (window.H && H.loginDialog) {
            H.loginDialog()
        }
    }

    // 关闭弹窗
    close() {
        this.qrcodeTimer && clearTimeout(this.qrcodeTimer)
        this.$domWrap.html('');
    }

    // 使用优惠券进行兑换购买
    useCoupon() {
        const url = baseUrl + '/coupon/use?' + params({
            video_id: VIDEOINFO.vid,
            clip_id: VIDEOINFO.cid
        })
        return fetchJsonp(url)
            .then((response) => response.json())
            .then((json: any) => {
                if (json && json.err_code == 200) {
                    window.location.reload();
                } else {
                    alert('非常抱歉,数据出现异常,请重新尝试');
                }
            })
    }

    // 获取当前用户的优惠券数量
    getCoupons = function () {
        const url = baseUrl + '/coupon/count?' + params({})
        return fetchJsonp(url)
            .then((response) => response.json())
            .then((json: any) => {
                if (data && data.err_code == 200 && data.data.count >= 0) {
                    return data.data.count;
                } else {
                    return 0
                }
            })
    }


    click(e) {

    }
}
