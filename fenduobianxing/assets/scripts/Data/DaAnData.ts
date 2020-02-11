export class DaAnData {
    private static instance: DaAnData;
    public checkpointsNum = 0; //关卡数目
    public figureType: number = null;
    public figureLevel: number[] = null;
    public submitEnable: boolean = false;
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}