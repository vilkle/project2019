(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UIComm/Tools.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8c9926FhnVH2Z4Gs2ZXOlDV', 'Tools', __filename);
// scripts/UIComm/Tools.ts

"use strict";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**美术提供的位移动画参数 */
var ArtMoveParam = /** @class */ (function () {
    /**
     * @param t 时刻，ms
     * @param p 位置
     */
    function ArtMoveParam(t, p) {
        /**时刻，ms */
        this.time = 0;
        /**位置 */
        this.pos = cc.Vec2.ZERO;
        this.time = t;
        this.pos = p;
    }
    return ArtMoveParam;
}());
exports.ArtMoveParam = ArtMoveParam;
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
        // sp_Skeleton.premultipliedAlpha=false;//这样设置在cocos creator中才能有半透明效果
        if (callback === void 0) { callback = null; }
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
    /**
     * 使节点直接运行美术提供的位移动画参数，
     * (节点当前位置对应美术参数列表最后一个参数位置，
     * 函数内部会做相对位置的处理)
     * @param node
     * @param params
     * @param endCbk
     */
    Tools.runArtMoveSequence = function (node, params, endCbk) {
        if (endCbk === void 0) { endCbk = null; }
        var nodeOriPos = node.getPosition();
        //节点实际坐标与美术参数坐标的差
        var gapPos = nodeOriPos.sub(params[params.length - 1].pos);
        function transArtPosToNodePos(artPos) {
            return artPos.add(gapPos);
        }
        node.setPosition(transArtPosToNodePos(params[0].pos));
        if (params.length <= 1) {
            if (endCbk)
                endCbk();
            return;
        }
        var actArray = [];
        for (var i = 1; i < params.length - 1; i++) {
            var duration = (params[i].time - params[i - 1].time) * 0.001;
            actArray.push(cc.moveTo(duration, transArtPosToNodePos(params[i].pos)));
        }
        if (endCbk) {
            actArray.push(cc.callFunc(endCbk));
        }
        node.runAction(cc.sequence(actArray));
    };
    /**获取当前时间戳，毫秒 */
    Tools.getNowTimeMS = function () {
        return (new Date()).getTime();
    };
    /**获取当前时间戳，秒 */
    Tools.getNowTimeS = function () {
        return Math.floor((new Date()).getTime() * 0.001);
    };
    /**
     * 格式化时间， eg: 100 ->  '01:40'
     * @param time 时长，秒
     */
    Tools.getFormatTime = function (time) {
        var min = Math.floor(time / 60);
        if (min < 10) {
            min = '0' + min;
        }
        var sec = time % 60;
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec;
    };
    Tools = __decorate([
        ccclass
    ], Tools);
    return Tools;
}());
exports.Tools = Tools;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Tools.js.map
        