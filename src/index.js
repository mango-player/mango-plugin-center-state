import { deepAssign, isObject } from 'mango-helper';

import './centerstate.css';
import popupFactory from 'mango-plugin-popup';
import {createChild} from './createchild.js';

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
    this.src && this.children.loading.show(true);
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
    videoPause() {
      this.children.status.showTip('pause');
      this.children.loading.show(false);
    },
    videoResume() {
      this.children.status.showTip('play');
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
      this.children.loading.show(false);
      this.clearTimeout();
    }
  },
  methods: {
    playing() {
      this.clearTimeout();
      this.children.splash.show(false);
      this.children.loading.show(false);
    },
    waiting() {
      this.clearTimeout();
      // 加载超过20秒则超时显示异常
      this._timeout = setTimeout(() => this.showError(), 3e4);
      !this.paused && this.children.loading.show(true);
    },
    clearTimeout() {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }
  }
});

export default mangoCenterState;
