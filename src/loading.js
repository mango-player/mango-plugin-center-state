import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base.js';

/**
 * 播放器错误提示 配置
 */

const defaultOption = {
    tag: 'mango-center-state-loading',
    html: `
    <div class="loading-inner">
        <div class="loading-icon"></div>
    </div>
    `,
    defaultEvent: {
        click: 'click'
    }
};

export default class Loading extends Base {
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

    show(status) {
        if (status === false) {
          this.parent.$domWrap.removeClass('loading');
        } else {
          this.parent.$domWrap.addClass('correct loading');
        }
    }

    click(e) {

    }
}
