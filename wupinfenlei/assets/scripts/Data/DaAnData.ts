export class DaAnData {
    private static instance: DaAnData;
    public types = 1;//给定分类1 自动归纳分类2
    public checkpointsNum = 0; //关卡数目
   

   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}