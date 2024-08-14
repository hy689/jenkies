import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JenkinsService {
    constructor(private readonly httpService: HttpService) { }

    async triggerBuild(project: string, env: string): Promise<any> {
        return await this.request(`http://172.19.60.75:8080/job/${env}/job/${project}/build?delay=0sec`);
    }

    // 查看队列状态
    async getQueueInfo(project: string, env: string): Promise<any> {
        return await this.request(`http://172.19.60.75:8080/job/${env}/job/${project}/wfapi/runs?since=%23110&fullStages=true&_=1723615697719`);
    }

    // 查看构建状态
    async getRunTaskStatus(project: string, env: string, buildId: string): Promise<any> {
        return await this.request(`http://172.19.60.75:8080/job/${env}/job/${project}/${buildId}/execution/node/8/wfapi/describe?_=${new Date().getTime()}`);
    }

    // 查看构建日志
    async getBuildLog(project: string, env: string, buildId: string): Promise<any> {
        return await this.request(`http://172.19.60.75:8080/job/${env}/job/${project}/${buildId}/console`, 'get');
    }

    private async request(url: string, method?: 'get' | 'post'): Promise<any> {

        url = url
            .replace('dev', '%E9%98%BF%E6%8B%89%E9%92%89/job/dev')
            .replace('qa', '%E6%99%BA%E5%AD%98%E7%A7%91%E6%8A%80/job/qa')
            .replace('deploy', '%E6%99%BA%E5%AD%98%E7%A7%91%E6%8A%80/job/deploy')


        let res
        try {

            if (method === 'get') {
                res = await firstValueFrom(this.httpService.get(url, {
                    headers: {
                        cookie: 'screenResolution=1707x960; screenResolution=1707x960; jenkins-timestamper-offset=-28800000; screenResolution=1707x960; ACEGI_SECURITY_HASHED_REMEMBER_ME_COOKIE=ZHVob25neXU6MTcyNDgxNTc0MzI2NzplNWUwMTg3ZTViOTY0MGIyYjNkYjQ3MTI3ZDQwYzMyODZkNWEzZGJhY2NhMzI3MDA4MWI3MDM0NWVmMGFkYmFh; JSESSIONID.922e6f7f=node08s4tukg8l0lt4aidsniyr7c51502.node0'
                    }
                }))
            } else {
                res = await firstValueFrom(this.httpService.post(url, {}, {
                    headers: {
                        cookie: 'screenResolution=1707x960; screenResolution=1707x960; jenkins-timestamper-offset=-28800000; screenResolution=1707x960; ACEGI_SECURITY_HASHED_REMEMBER_ME_COOKIE=ZHVob25neXU6MTcyNDgxNTc0MzI2NzplNWUwMTg3ZTViOTY0MGIyYjNkYjQ3MTI3ZDQwYzMyODZkNWEzZGJhY2NhMzI3MDA4MWI3MDM0NWVmMGFkYmFh; JSESSIONID.922e6f7f=node08s4tukg8l0lt4aidsniyr7c51502.node0'
                    }
                }))
            }

        } catch (error) {

            console.log(error)
            throw new Error(error)
        }

        return res
    }
}
