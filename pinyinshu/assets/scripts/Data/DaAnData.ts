
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