export enum skinStrEnum{
    'ballb_01' = 1,
    'ballb_02' = 2,
    'ballb_03' = 3,
    'ballb_04' = 5,
    'ballb_05' = 7,
    'ballb_06' = 11,
    'ballb_07' = 13,
    'ballb_08' = 8,
    'ballb_09' = 9,
}

export class DaAnData {
    private static instance: DaAnData;
    public checkpointsNum = 0; //关卡数目
    public numberArr : Array<number> = new Array<number>();//被分解质因数
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}