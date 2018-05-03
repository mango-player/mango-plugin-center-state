import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base.js';

/**
 * 播放器错误提示 配置
 */

const defaultOption = {
    tag: 'mango-center-state-finish',
    html: `
    <div class="hd">
        <div class="u-finish-share">
            <span class="t">分享视频</span>
            <div class="m-h5-share-list">
                <a class="sina" href="#">新浪微博</a>
                <a class="qzone" href="#">QQ空间</a>
                <a class="weixin" href="#">微信</a>
                <a class="qq" href="#">QQ</a>
                <a class="link" href="#">分享链接</a>
            </div>
        </div>
        <h2>相关推荐</h2>
    </div>
    `,
    defaultEvent: {
        click: 'click'
    }
};

export default class FinishTip extends Base {
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
