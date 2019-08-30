"use strict";
cc._RF.push(module, '693216rj8NLOIe3GAHatvPC', 'DaAnData');
// scripts/Data/DaAnData.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DaAnData = /** @class */ (function () {
    function DaAnData() {
        this.type = 0; //1树形2单一型
        this.figure = 0; //1三角形2六边形3八角星
        this.ruleDataArr = [];
        this.subjectDataArr = [];
        this.answerDataArr = [];
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