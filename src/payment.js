import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base.js';

/**
 * 播放器错误提示 配置
 */

const defaultOption = {
    tag: 'mango-center-state-payment',
    html: `
    
    `,
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

    click(e) {

    }
}
