import { deepAssign, isObject, addClassName, removeClassName, $ } from 'mango-helper';
import Base from './base.js';

const clss = 'correct tip play pause back forward volume-high volume-low replay';
const actionTips = {
    'play': '播放',
    'pause': '暂停',
    'replay': '重播',
    'back': '后退',
    'forward': '前进',
    'volume-high': '音量高',
    'volume-low': '音量低'
}
/**
 * 播放器错误提示 配置
 */

const defaultOption = {
    tag: 'mango-center-state-status',
    html: `
    <mango-center-state-tip>
        <span></span>
    </mango-center-state-tip>
    <mango-center-state-tip-text></mango-center-state-tip-text>
    `,
    defaultEvent: {
        click: 'click'
    }
};

export default class Status extends Base {
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

    showTip(cls) {
        this.parent.$domWrap.removeClass(clss).addClass('correct tip ' + cls);
        this.$domWrap.find('mango-center-state-tip-text').html(actionTips[cls] || '');
        setTimeout(() => {
          this.parent.$domWrap.removeClass('tip ' + cls);
        }, 500);
    }

    click(e) {

    }
}
