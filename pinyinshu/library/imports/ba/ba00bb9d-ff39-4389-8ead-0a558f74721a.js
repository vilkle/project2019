"use strict";
cc._RF.push(module, 'ba00bud/zlDiY6tClWPdHIa', 'AdaptiveScreen');
// scripts/Utils/AdaptiveScreen.ts

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
        _this.viewWidth = 960; //640
        /**舞台设计高度 */
        _this.viewHeight = 1994; //1136
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