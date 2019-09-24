(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/BoundingBoxHelp.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd28fa0BmSFGwY3HLHVIrT8f', 'BoundingBoxHelp', __filename);
// scripts/Utils/BoundingBoxHelp.ts

"use strict";
/**
 * Author: kouyaqi
 * Email: kouyaqi@100tal.com
 */
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
 * 处理sp.Skeleton的边界框的方法；
 * 将此脚本挂载到含有spine资源的节点；
 * 资源顶点越多，贴合越好，性能越低。
 * */
var BoundingBoxHelp = /** @class */ (function (_super) {
    __extends(BoundingBoxHelp, _super);
    function BoundingBoxHelp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skeleton = null;
        /**插槽的顶点数据 */
        _this.vertices = [];
        /**转换得到的坐标 */
        _this.positions = [];
        return _this;
    }
    BoundingBoxHelp.prototype.getSkeleton = function () {
        if (this.skeleton == null) {
            this.skeleton = this.node.getComponent(sp.Skeleton);
        }
        return this.skeleton;
    };
    /**
     * 获取插槽所绑定的边界框的世界坐标
     * @param slotName 插槽名称
     */
    BoundingBoxHelp.prototype.getBoundingBoxWorldPositions = function (slotName) {
        var skeleton = this.getSkeleton();
        if (skeleton == null) {
            console.warn('没有Spine资源！');
            return this.positions;
        }
        var boundingBoxSlot = skeleton.findSlot(slotName);
        if (!boundingBoxSlot) {
            console.warn("\u6CA1\u6709\u627E\u5230\u63D2\u69FD\uFF1A " + slotName);
            return this.positions;
        }
        var attachment = boundingBoxSlot.attachment;
        /** http://zh.esotericsoftware.com/spine-api-reference#BoundingBoxAttachment
         * Transforms the attachment's local vertices to world coordinates. If the slot has attachmentVertices, they are used to deform the vertices.
         *   See World transforms in the Spine Runtimes Guide.
         */
        attachment.computeWorldVertices(boundingBoxSlot, 0, attachment.worldVerticesLength, this.vertices, 0, 2);
        for (var i = 0; i < this.vertices.length; i += 2) {
            if (!this.positions[i / 2]) {
                this.positions[i / 2] = cc.Vec2.ZERO;
            }
            this.positions[i / 2].x = this.vertices[i];
            this.positions[i / 2].y = this.vertices[i + 1];
        }
        //此时的世界坐标是Spine内部的世界坐标，需要转换为Cocos里的世界坐标
        for (var i = 0; i < this.positions.length; i++) {
            this.positions[i] = this.node.convertToWorldSpaceAR(this.positions[i]);
        }
        return this.positions;
    };
    /**
     * 获取插槽所绑定的边界框相对于节点的坐标
     * @param slotName 插槽名称
     * @param node 相对节点
     */
    BoundingBoxHelp.prototype.getBoundingBoxRelativePositions = function (slotName, node) {
        var positions = this.getBoundingBoxWorldPositions(slotName);
        for (var i = 0; i < positions.length; i++) {
            positions[i] = node.convertToNodeSpaceAR(positions[i]);
        }
        return positions;
    };
    BoundingBoxHelp = __decorate([
        ccclass
    ], BoundingBoxHelp);
    return BoundingBoxHelp;
}(cc.Component));
exports.default = BoundingBoxHelp;

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
        //# sourceMappingURL=BoundingBoxHelp.js.map
        