"use strict";
cc._RF.push(module, '9a06b1CbqFBYb5+vTxq7BHO', 'DaAnData');
// scripts/Data/DaAnData.ts

Object.defineProperty(exports, "__esModule", { value: true });
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.types = 1; //给定分类1 自动归纳分类2
        this.typetype = []; //饼干1图形2
        this.checkpointsNum = 0; //关卡数目
        this.typeDataArr = [];
        this.submitEnable = false;
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