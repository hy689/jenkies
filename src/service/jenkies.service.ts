import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JenkinsService {
    constructor(private readonly httpService: HttpService) { }

    async triggerBuild(project: string, env: string): Promise<any> {
        return await this.request(`https://jenkins.olading.com/job/${env}/job/${project}/build?delay=0sec`);
    }

    // 查看最新id
    async getLastBuildId(project: string, env: string): Promise<any> {
        return await this.request(`https://jenkins.olading.com/job/${env}/job/${project}/lastBuild/buildNumber?pretty=true`);
    }

    // 查看构建状态
    async getRunTaskStatus(project: string, env: string, buildId: string): Promise<any> {
        return await this.request(`https://jenkins.olading.com/job/${env}/job/${project}/${buildId}/api/json?pretty=true`);
    }

    // 查看构建日志
    async getBuildLog(project: string, env: string, buildId: string): Promise<any> {
        return await this.request(`https://jenkins.olading.com/job/${env}/job/${project}/${buildId}/logText/progressiveText?pretty=true`);
    }

    private async request(url: string, method?: 'get' | 'post'): Promise<any> {

        url = url
            .replace('dev', '%E9%98%BF%E6%8B%89%E9%92%89/job/dev')
            .replace('qa', '%E6%99%BA%E5%AD%98%E7%A7%91%E6%8A%80/job/qa')
            .replace('deploy', '%E6%99%BA%E5%AD%98%E7%A7%91%E6%8A%80/job/deploy')


        let res
        try {
            res = await firstValueFrom(this.httpService.post(url, {}, {
                headers: {
                    cookie: 'jenkins-timestamper-offset=-28800000; JSESSIONID.35973b47=node07rdlucvcvtvl1o7o0dgyvfrup660.node0; remember-me=ZHVob25neXU6MTcyNjcyNjYyMDk5OTplNDc2ZjIxMzlmOWJhZGE4YTM3Y2ZmNWMxYTA1Y2IzNGJjYWI4ZGNkNTM2MzkzZGQxOTA3YjFiNGUwYmIwYTc3; screenResolution=1707x960',
                    'jenkins-crumb':'07ffb3ff95fc350cf8f915c23b78d370691b72e5bfbfc3c915b7d81b4586b776'

                }
            }))
        } catch (error) {

            console.log(error)
            throw new Error(error)
        }
        return res
    }
}
