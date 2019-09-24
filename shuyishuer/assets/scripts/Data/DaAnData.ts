export class DaAnData{
    private static instance: DaAnData
    public type: number = null
    public judgeNum: number = null
    public num: number = null
    public numArr: number[] = []
    public submitEnable = false
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DaAnData
        }
        return this.instance
    }
}