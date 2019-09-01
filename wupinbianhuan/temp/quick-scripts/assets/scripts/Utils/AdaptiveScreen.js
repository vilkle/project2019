(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/AdaptiveScreen.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba00bud/zlDiY6tClWPdHIa', 'AdaptiveScreen', __filename);
// scripts/Utils/AdaptiveScreen.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/**
 * 自适应代码
 */
var AdaptiveScreen = /** @class */ (function (_super) {
    __extends(AdaptiveScreen, _super);
    function AdaptiveScreen() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
        * 全屏背景图片，用于自适应
        */
        _this.bgNode = null;
        /**舞台设计宽度 */
        _this.viewWidth = 640;
        /**舞台设计高度 */
        _this.viewHeight = 1136;
        return _this;
        // update (dt) {}
    }
    AdaptiveScreen.prototype.onLoad = function () {
        this.screenAdapter();
    };
    AdaptiveScreen.prototype.start = function () {
        this.viewUp();
    };
    /**
    * 自适应
    */
    AdaptiveScreen.prototype.screenAdapter = function () {
        if (cc.Canvas.instance) {
            this.stage = cc.Canvas.instance.node;
            var canvas = cc.Canvas.instance;
            var winSize = cc.view.getFrameSize();
            // console.log(cc.winSize);
            // console.log(cc.view.getCanvasSize());
            // console.log(cc.view.getFrameSize());
            // console.log(cc.view.getVisibleSize());
            if (winSize.width / winSize.height < canvas.designResolution.width / canvas.designResolution.height) {
                canvas.fitWidth = true;
                canvas.fitHeight = false;
            }
            else {
                canvas.fitHeight = true;
                canvas.fitWidth = false;
            }
        }
    };
    AdaptiveScreen.prototype.viewUp = function () {
        var winSize = cc.winSize;
        var scaleX = winSize.width / this.viewWidth;
        var scaleY = winSize.height / this.viewHeight;
        this.bgNode.scale = 1 * Math.max(scaleX, scaleY);
    };
    __decorate([
        property({
            type: cc.Node,
            tooltip: "全屏背景图片，用于自适应"
        })
    ], AdaptiveScreen.prototype, "bgNode", void 0);
    __decorate([
        property
    ], AdaptiveScreen.prototype, "viewWidth", void 0);
    __decorate([
        property
    ], AdaptiveScreen.prototype, "viewHeight", void 0);
    AdaptiveScreen = __decorate([
        ccclass
    ], AdaptiveScreen);
    return AdaptiveScreen;
}(cc.Component));
exports.default = AdaptiveScreen;

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
        //# sourceMappingURL=AdaptiveScreen.js.map
        