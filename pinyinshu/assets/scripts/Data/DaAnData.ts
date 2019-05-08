
export class DaAnData {
    private static instance: DaAnData;
    public checkpointsNum = 0; //关卡数目
    public number = 0; //被分解质因数
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}