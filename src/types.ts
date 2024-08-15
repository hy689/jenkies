export interface ITask {
    project: string;
    environment:string;
    gitOptions?:Ioptions;
}

interface Ioptions {
    branch?: string;
    env: string;
}