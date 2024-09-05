import { ITask } from './types'

export const taskQueue: ITask[] = [
    //  {
    //     project: 'deploy-lanmaoly-cloud-hro-salary-front',
    //     environment: 'deploy'
    // },
    // {
    //     project: 'deploy-olading-hrsaas-control-front',
    //     environment: 'deploy',
    //     gitOptions: {
    //         env: '46',
    //         branch:'master'
    //     }
    // }, 
    // {
    //     project: 'qa-sso-olading-front',
    //     environment: 'qa'
    // },
    // {
    //     project: 'deploy-lanmaoly-cloud-sso-olading-front',
    //     environment: 'deploy',
    //     gitOptions: {
    //         env: '114',
    //         branch:'cgb/2.34'
    //     }
    // },  
    // {
    //     project: 'qa-salary-front',
    //     environment: 'qa'
    // },
    // {
    //     project: 'deploy-lanmaoly-cloud-salary-front',
    //     environment: 'deploy'
    // },


    {
        project: 'deploy-olading-contract-front',
        environment: 'deploy',
        gitOptions: {
            env: '46',
            branch: 'master'
        }
    }
]

