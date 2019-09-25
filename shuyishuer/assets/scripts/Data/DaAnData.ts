export class DaAnData{
    private static instance: DaAnData
    public type: number = null
    public norm: string = null
    public count: number = null
    public question: string[] = []
    public submitEnable = false
    static getInstance(){
        if(this.instance == null) {
            this.instance = new DaAnData
        }
        return this.instance
    }
}