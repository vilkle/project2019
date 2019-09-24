"use strict";
cc._RF.push(module, '6d2b7iUWbpMH7du/JYLzjR9', 'DaAnData');
// scripts/Data/DaAnData.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.type = null;
        this.judgeNum = null;
        this.num = null;
        this.numArr = [];
        this.submitEnable = false;
    }
    DaAnData.getInstance = function () {
        if (this.instance == null) {
            this.instance = new DaAnData;
        }
        return this.instance;
    };
    return DaAnData;
}());
exports.DaAnData = DaAnData;

cc._RF.pop();