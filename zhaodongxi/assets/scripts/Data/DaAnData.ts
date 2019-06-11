

export enum picType {
    animal = 1,
    food = 2,
    figure = 3,
    dailyuse = 4,
    number = 5,
    stationery = 6,
    clothes = 7,
    letter = 8
}

export enum scopeRange {
    "4 * 4" = 1,
    "4 * 5" = 2,
    "4 * 6" = 3,
    "4 * 7" = 4,
    "4 * 8" = 5,
    "5 * 4" = 6,
    "5 * 5" = 7,
    "5 * 6" = 8,
    "5 * 7" = 9,
    "5 * 8" = 10
}

export class DaAnData {
    public submitEnable : boolean = false;
    private static instance: DaAnData;
    public types = 1;//单个1 组合2
    public checkpointsNum = 0; //关卡数目
    public picArr: Array<picType> = new Array<picType>(); //图片种类
    public dirSFArr: Array<number> = new Array<number>();
    public answerSFArr: Array<number> = new Array<number>();
    public answerPosArr : Array<number> = new Array<number>();
    public answerOneNum : Array<number> = new Array<number>();
    public range = 0;//选择区范围
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}