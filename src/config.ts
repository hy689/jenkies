import { ITask } from './types'

export const taskQueue: ITask[] = [
    {
        project: 'deploy-olading-contract-front',
        environment: 'deploy',
        gitOptions: {
            env: '46',
            branch: 'master'
        }
    }
]

