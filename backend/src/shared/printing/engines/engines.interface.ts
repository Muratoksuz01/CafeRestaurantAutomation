export interface IEngines{
    printData(printerIp:string,data:object): Promise<boolean>
    printTest(printerIp:string): Promise<boolean>
}