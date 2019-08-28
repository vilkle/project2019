"use strict";
cc._RF.push(module, '2fe78Vyt/NInb1oC42+tpUk', 'FadeUIPlugin');
// scripts/Utils/FadeUIPlugin.ts

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
var FadeUIPlugin = /** @class */ (function (_super) {
    __extends(FadeUIPlugin, _super);
    function FadeUIPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delay = 0;
        return _this;
    }
    FadeUIPlugin.prototype.onLoad = function () {
        var action0 = cc.delayTime(this.delay);
        var action1 = cc.scaleTo(0.5, 2, 2); // - 72 * index);
        var action2 = cc.scaleTo(0.5, 0, 0); // - 72 * index);
        var action3 = cc.scaleTo(0.5, 1, 1); // - 72 * index);
        //let action4 = cc.fadeOut(0.5);
        var action = cc.sequence(action0, action1, action2, action3);
        this.node.runAction(action);
    };
    __decorate([
        property
    ], FadeUIPlugin.prototype, "delay", void 0);
    FadeUIPlugin = __decorate([
        ccclass
    ], FadeUIPlugin);
    return FadeUIPlugin;
}(cc.Component));
exports.FadeUIPlugin = FadeUIPlugin;

cc._RF.pop();