import { ITask } from "./types"

export const getProjectName = (task: ITask) => {
    if (task.project === 'contract' && task.environment === 'dev') {
        return 'olading-contract-front'
    }

    if (task.project === 'contract' && task.environment === 'qa') {
        return 'qa-olading-contract-front'
    }

    return 'deploy-olading-contract-front'
}

// 正则截取日志的镜像版本
export const getLogVersion = (log: string):string => {
    const str = log

    const regex = /镜像名称: (.*?)\n/;
    const match = str.match(regex);

    if (match && match[1]) {
        return match[1]
    } else {
        return ''
    }
}