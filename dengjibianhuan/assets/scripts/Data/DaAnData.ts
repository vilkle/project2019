export class DaAnData {
    private static instance: DaAnData;
    public type: number = 0;
    public qType: number = 0;
    public submitEnable = false;
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}