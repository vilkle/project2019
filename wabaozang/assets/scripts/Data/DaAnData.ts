export class DaAnData {
    private static instance: DaAnData;
    public type: number = 0;
    public itemArr: number[] = [];
    public xArr: number[] = [];
    public yArr: number[] = [];
    public rotationArr: number[] = [];
    public submitEnable = false;
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}