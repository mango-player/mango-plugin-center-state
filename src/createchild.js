import Splash from './splash.js';
import Loading from './loading.js';
import Status from './status.js';
import ErrorTip from './error.js';
import AdError from './aderror.js';
import BlueTip from './blue.js';
import PaymentTip from './payment.js';
import FinishTip from './finish.js';

function hundleChildren (plugin) {
  let childConfig = {};
  if(!plugin.$config.children) {
    childConfig = {
      splash: true,  // splash界面
      loading: true, // 缓冲loading提示
      status: true,  // 播放状态提示
      error: true,   // 通用错误提示界面
      aderror: true, // 广告拦截提示
      blue: true,    // 蓝光付费弹窗
      payment: true, // VIP付费提示弹窗
      finish: true,  // 播放完成结束界面
    };
  }else{
    childConfig = plugin.$config.children;
  }
  return childConfig;
}

/**
 * 1. 将所有的 ui component 输出到 html 结构中
 * 2. 为这些 component 绑定响应的事件
 * @param {*} dom 所有 ui 节点的子容器
 * @param {*} config 关于 ui 的一些列设置
 * @return {Array} 所有子节点
 */

export function createChild (plugin) {
  const childConfig = plugin.config.children = hundleChildren(plugin);
  const children = {};
  Object.keys(childConfig).forEach(item => {
    switch(item) {
      case 'splash':
        if(childConfig.splash) {
          children.splash = new Splash(plugin, childConfig.splash);
        }
        break;
      case 'loading':
        if(childConfig.loading) {
          children.loading = new Loading(plugin, childConfig.loading);
        }
        break;
      case 'status':
        if(childConfig.status) {
          children.status = new Status(plugin, childConfig.status);
        }
        break;
      case 'error':
        children.error = new ErrorTip(plugin, childConfig.error);
        break;
      case 'aderror':
        if(childConfig.aderror) {
          children.aderror = new AdError(plugin, childConfig.aderror);
        }
        break;
      case 'blue':
        if(childConfig.blue) {
          children.blue = new BlueTip(plugin, childConfig.blue);
        }
        break;
      case 'payment':
        if(childConfig.payment) {
          children.payment = new PaymentTip(plugin, childConfig.payment);
        }
        break;
      case 'finish':
        if(childConfig.finish) {
          children.finish = new FinishTip(plugin, childConfig.finish);
        }
        break;
      default:
        break;
    }
  });

  return children;
}
