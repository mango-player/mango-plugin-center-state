import { deepAssign, isObject } from 'mango-helper';

import './centerstate.css';
import popupFactory from 'mango-plugin-popup';
import {createChild} from './createchild.js';

const clss = 'correct tip play pause back forward volume-high volume-low';

const defaultConfig = {
  errorTips: '加载失败，请刷新重试'
};

const mangoCenterState = popupFactory({
  name: 'mangoCenterState',
  tagName: 'mango-center-state',
  html: ` `,
  offset: '50%',
  hide: false,
  create() { },
  init() {
    this.config = isObject(this.$config) ? deepAssign(defaultConfig, this.$config) : defaultConfig;
    this.children = createChild(this);
  },
  inited() {
    this.src && this.showLoading(true);
    // 调用子组件的初始化方法
    for(const i in this.children) {
      this.children[i].inited && this.children[i].inited();
    }
  },
  penetrate: true,
  operable: false,
  destroy() {
    this.clearTimeout();
  },
  events: {
    pause() {
      this.showTip('pause');
      this.showLoading(false);
    },
    play() {
      this.showTip('play');
    },
    canplay() {
      this.playing();
    },
    playing() {
      this.playing();
    },
    loadstart() {
      // 开始加载视频流
      this.waiting();
    },
    waiting() {
      this.waiting();
    },
    timeupdate() {
      this.showLoading(false);
      this.clearTimeout();
    }
  },
  methods: {
    playing() {
      this.clearTimeout();
      this.showSplash(false);
      this.showLoading(false);
      this.showError(false);
    },
    waiting() {
      this.clearTimeout();
      // 加载超过20秒则超时显示异常
      this._timeout = setTimeout(() => this.showError(), 3e4);
      !this.paused && this.showLoading(true);
    },
    clearTimeout() {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    },
    showTip(cls) {
      this.$domWrap.removeClass(clss).addClass('correct tip ' + cls);
      setTimeout(() => {
        this.$domWrap.removeClass('tip ' + cls);
      }, 500);
    },
    showSplash(status) {
      if (status === false) {
        this.$domWrap.find('mango-center-state-splash').css('display', 'none');
      } else {
        this.$domWrap.find('mango-center-state-splash').css('display', 'block');
      }
    },
    showLoading(status) {
      if (status === false) {
        this.$domWrap.removeClass('loading');
      } else {
        this.$domWrap.addClass('correct loading');
      }
    },
    showError(status) {
      if (status === false) {
        this.$domWrap.removeClass('error');
      } else {
        this.$domWrap[0].className = '';
        this.$domWrap.addClass('error');
      }
    }
  }
});

export default mangoCenterState;
