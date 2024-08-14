import { Injectable } from '@nestjs/common';
import { taskQueue } from './config'
import { ITask } from './types';
import { JenkinsService } from './service/jenkies.service';
import { getLogVersion } from './utils';


@Injectable()
export class AppService {
  constructor(private readonly jenkinService: JenkinsService) {

  }
  async start(): Promise<void> {

    const tasks: ITask[] = JSON.parse(JSON.stringify(taskQueue))
    while (tasks.length > 0) {

      const { project, environment } = tasks.shift() as ITask

      const build = await this.jenkinService.triggerBuild(project, environment) as { status: number, statusText: string }
      if (build.status !== 201 || build.statusText !== 'Created') {
        throw new Error(`${project}项目在${environment}启动构建失败`)
      }
      console.log(`${project}项目在${environment}启动构建`)

      const runTaskRes = await this.jenkinService.getQueueInfo(project, environment)
      const runTask = runTaskRes.data as { id: string }[]
      if (runTask.length <= 0) {
        throw new Error(`无可执行的任务`)
      }

      const runTaskId = runTask[0].id

      //轮询调用 getRunTaskStatus 接口 2秒一次 阻塞下面代码轮询不完成不继续执行
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 4000))

        const runTaskStatus = await this.jenkinService.getRunTaskStatus(project, environment, runTaskId)
        if (runTaskStatus.data.status === 'IN_PROGRESS') {
          console.log(`${project}项目在${environment}构建中 ${runTaskId}`)
        }

        if (runTaskStatus.data.status === 'SUCCESS') {
          console.log(`${project}项目在${environment}构建成功 ${runTaskId}`)
          break
        }

        if (runTaskStatus.data.status === 'FAILED') {
          throw new Error(`${project}项目在${environment}构建失败 ${runTaskId} 请去网页查看原因`)
        }
        
      }

      if(environment === 'deploy'){
        console.log(`${project}准备获取镜像版本 请耐心等待！`)
        await new Promise(resolve => setTimeout(resolve, 10000))
        const buildLog = await this.jenkinService.getBuildLog(project, environment, runTaskId)
        const images = getLogVersion(buildLog.data)
        if(images.length <= 0){
          throw new Error(`${project}项目在${environment}构建日志没有获取到镜像版本`)
        }

        console.log(`${project}项目在${environment}构建日志获取到镜像版本 ${images}`)
      }
    }

    console.log('----------------全部构建完成------------------')
  }
}
