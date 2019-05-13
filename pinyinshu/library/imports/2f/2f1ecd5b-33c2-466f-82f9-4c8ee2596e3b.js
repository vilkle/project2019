"use strict";
cc._RF.push(module, '2f1ec1bM8JGb4L5TI7iWW47', 'DaAnData');
// scripts/Data/DaAnData.ts

Object.defineProperty(exports, "__esModule", { value: true });
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.checkpointsNum = 0; //关卡数目
        this.number = 0; //被分解质因数
    }
    DaAnData.getInstance = function () {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    };
    return DaAnData;
}());
exports.DaAnData = DaAnData;

cc._RF.pop();