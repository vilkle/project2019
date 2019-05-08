"use strict";
cc._RF.push(module, '8c9926FhnVH2Z4Gs2ZXOlDV', 'Tools');
// scripts/UIComm/Tools.ts

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Tools = /** @class */ (function () {
    function Tools() {
    }
    /**
      * 播放spine动画
      * @param {*} sp_Skeleton 动画文件
      * @param {*} animName 动作名称
      * @param {*} loop 是否循环
      * @param {*} callback 播放完毕回调
      */
    Tools.playSpine = function (sp_Skeleton, animName, loop, callback) {
        if (callback === void 0) { callback = null; }
        sp_Skeleton.premultipliedAlpha = false; //这样设置在cocos creator中才能有半透明效果
        // let spine = this.node.getComponent(sp.Skeleton);
        var track = sp_Skeleton.setAnimation(0, animName, loop);
        if (track) {
            // 注册动画的结束回调
            sp_Skeleton.setCompleteListener(function (trackEntry, loopCount) {
                var name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === animName && callback && callback != null) {
                    // console.log("动画回调");
                    callback(); // 动画结束后执行自己的逻辑
                }
            });
        }
    };
    //参数获取
    Tools.getQueryVariable = function (variable) {
        var query = window.location.href;
        var vars = query.split("?");
        if (vars.length < 2)
            return false;
        var vars = vars[1].split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    };
    Tools = __decorate([
        ccclass
    ], Tools);
    return Tools;
}());
exports.Tools = Tools;

cc._RF.pop();