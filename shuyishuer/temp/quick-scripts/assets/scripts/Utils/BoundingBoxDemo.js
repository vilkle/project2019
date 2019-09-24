(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/BoundingBoxDemo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd5f9dT/06tF45iF1u1hFPMw', 'BoundingBoxDemo', __filename);
// scripts/Utils/BoundingBoxDemo.ts

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
var BoundingBoxHelp_1 = require("./BoundingBoxHelp");
/**
 * Author: kouyaqi
 * Email: kouyaqi@100tal.com
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/**
 * BoundingBoxHelp 的使用例子
 */
var BoundingboxDemo = /** @class */ (function (_super) {
    __extends(BoundingboxDemo, _super);
    function BoundingboxDemo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bbh = null;
        _this.grs = null;
        return _this;
    }
    BoundingboxDemo.prototype.update = function (dt) {
        this.grs.clear();
        //把边界框绘制出来
        var postions = this.bbh.getBoundingBoxWorldPositions('boundingBox');
        this.polygon(this.grs, postions);
        this.grs.stroke();
    };
    /**
     * 绘制多边形路径，至少3条边
     * @param poss
     */
    BoundingboxDemo.prototype.polygon = function (graphics, poss) {
        if (poss.length < 3)
            return;
        graphics.moveTo(poss[0].x, poss[0].y);
        for (var i = 1; i < poss.length; i++) {
            graphics.lineTo(poss[i].x, poss[i].y);
        }
        graphics.lineTo(poss[0].x, poss[0].y);
    };
    __decorate([
        property(BoundingBoxHelp_1.default)
    ], BoundingboxDemo.prototype, "bbh", void 0);
    __decorate([
        property(cc.Graphics)
    ], BoundingboxDemo.prototype, "grs", void 0);
    BoundingboxDemo = __decorate([
        ccclass
    ], BoundingboxDemo);
    return BoundingboxDemo;
}(cc.Component));

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
        //# sourceMappingURL=BoundingBoxDemo.js.map
        