export class DaAnData {
    private static instance: DaAnData;
    public type = 0; //1树形2单一型
    public figure = 0; //1三角形2六边形3八角星
    public submitEnable = true;
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}