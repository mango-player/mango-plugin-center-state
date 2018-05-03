import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base.js';

/**
 * 播放器错误提示 配置
 */

const defaultOption = {
    tag: 'mango-center-state-error',
    html: `
    <a href="javascript:;" action-type="video-error-box" class="close"></a>
    <p class="t1">视频流加载失败</p>
    <p class="t2">[ 错误码: <em>2010040</em> ]</p>
    <p class="t2"><a href="//www.mgtv.com/feedback/" target="_blank">立即反馈 </a> 
    <a href="javascript:void(0);"> 刷新</a></p>
    <div class="hbtn">
        <a href="//www.mgtv.com" target="_blank">点击观看其他精彩节目</a>
    </div>
    `,
    defaultEvent: {
        click: 'click'
    }
};

export default class ErrorTip extends Base {
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
