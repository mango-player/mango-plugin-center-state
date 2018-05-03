import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base.js';

/**
 * play 配置
 */

const defaultOption = {
    tag: 'mango-center-state-blue',
    html: ``,
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

    click(e) {

    }
}
