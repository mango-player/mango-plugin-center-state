import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base';
import { params, getUnionId, cookieGet, render, getQrcode } from './utils';

const data_unid = getUnionId()  //会员数据上报

// 蓝光提示弹窗
const BLUE_DIALOG_TPL = `
    <div class="c-player-windowmask" node-type="c-player-windowmask"></div>
    <div class="c-player-1080p" node-type="hd-video-box" bosszone="tovip">
        <div class="c-player-1080p-wrapper">
            <div class="c-player-paytips-title">会员尊享蓝光极致清晰</div>
            <div class="c-player-paytips-content">
                <!-- 左侧 -->
                <div class="c-player-paytips-primary">
                    <a class="c-player-paytips-button open-vip-dialog" unid="{{data_unid}}" clocation="61001" 
                    ftype="10"  target="_blank" type="11"' 
                    href="//order.mgtv.com/pay/pc/index.html?unid={{data_unid}}&ftype=10&clocation=61001">
                        开通会员免费观看
                        <i class="price" style="display:{{show}}">{{buy_tips}}</i>
                    </a>
                    <p class="c-player-paytips-adds">开通后请<a class="u-reload" href="javascript:;">登录</a>并<a class="u-reload" href="javascript:;">刷新</a>页面观看</p>
                    <!-- 分割线 -->
                    <div class="c-player-paytips-divding"></div>
                    <!-- 特权 -->
                    <div class="c-player-paytips-welfare">
                        <h5 class="title">开通会员享特权</h5>
                        <ul class="list">
                            <li class="c-player-paytips-welfare-listitem">
                                <i class="welfare-1"></i><span>观影无广告</span>
                            </li>
                            <li class="c-player-paytips-welfare-listitem">
                                <i class="welfare-2"></i><span>专属片库</span>
                            </li>
                            <li class="c-player-paytips-welfare-listitem">
                                <i class="welfare-3"></i><span>移动端覆盖</span>
                                <p class="listitem-tips">打开芒果APP，抢海量会员大礼包！<a href="#">立即领取</a></p>
                            </li>
                            <li class="c-player-paytips-welfare-listitem">
                                <i class="welfare-4"></i><span>赠送观影券</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 右侧 -->
                <div class="c-player-paytips-sidebar">
                    <span class="u-paycode">
                        <span class="u-pic paycode-qrcode" node-type="paycode-qrcode"><img class="pay-qrcode-info" node-type="pay-qrcode-info" style="display:none" src="" alt="我是二维码"></span>
                        <i class="u-mask refresh-qrcode" node-type="refresh-qrcode" action-type="qrcode-u-mask"><i class="u-refresh"></i></i>
                    </span>
                    <p class="u-tips">扫一扫，开通会员</p>
                </div>
            </div>
            <div class="c-player-paytips-divding"></div>
            <div class="c-player-paytips-status" style="display:{{login}}">
                您还未登录，请<a href="#" action-type="hd-video-login">登录</a>
            </div>
        </div>
        <span class="c-player-paytips-close" action-type="hd-video-closed">关闭</span>
    </div>`

/**
* play 配置
*/
const defaultOption = {
    tag: 'mango-center-state-blue',
    html: ` `,
    defaultEvent: {
        click: 'click'
    }
};

export default class BlueTip extends Base {
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
        var data_ftype = 10; // TODO: 数据上报用到
        const html = render(BLUE_DIALOG_TPL, {
            show: tips == '' ? 'none' : 'block',
            islogin: cookieGet('HDCN') === '' ? 'block' : 'none',
            uvip: cookieGet('vipStatus') || 0
        })
        this.$domWrap.html(html);
        this.refreshCode();
    }

    // 刷新开通会员二维码
    refreshCode() {
        const $canvasImage = this.$domWrap.find('[node-type="pay-qrcode-info"]');
        const $refresh = this.$domWrap.find('[node-type="refresh-qrcode"]');

        $refresh.hide();
        qrcodeTimer && clearTimeout(qrcodeTimer);
        getQrcode($canvasImage, data_unid, data_ftype);
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

    click(e) {

    }
}
