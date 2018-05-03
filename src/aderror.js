import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base.js';

/**
 * play 配置
 */

const defaultOption = {
    tag: 'mango-center-state-ad-error',
    html: `
    <p class="aderror-p aderror-ts">
        <i class="ico">
            <svg class="icon group"><path d="M0 0h2v8H0V0zm0 10h2v2H0v-2z"></path></svg>
            <svg class="icon arrow-down"><path d="M5.1 5.9h.7l5-5a.5.5 0 0 0-.7-.7L5.5 4.8.9.1a.5.5 0 0 0-.8.8z"></path></svg>
        </i>广告被插件误伤啦，视频将在<em></em>秒后播放
    </p>
    <p class="aderror-p aderror-help">
    <span class="help-t1">
        <a href="//www.mgtv.com/v/2018/rhgbcj/" target="_blank" class="closea">如何关闭插件</a>
        <span>关闭后仍无法播放广告?</span>
        <a href="//www.mgtv.com/feedback/" target="_blank">立即反馈</a>
    </span>
    <span class="help-t2">观看广告，让小芒果能更好的为您服务</span>
    </p>
    <p class="aderror-p aderror-button"><a href="" target="_blank">开通会员</a></p>
    <p class="aderror-p aderror-txt">开通会员不仅可以免广告，更有蓝光大片任您看。</p>
    `,
    defaultEvent: {
        click: 'click'
    }
};

export default class AdErrorTip extends Base {
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

    click(e) {

    }
}
