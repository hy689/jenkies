import { Injectable } from '@nestjs/common';
import { taskQueue } from './config'
import { ITask } from './types';
import { JenkinsService } from './service/jenkies.service';
import { getLocalFileFolderPath, getLocalFileName, getLogVersion, modifyGitFile } from './utils';
import { promises as fs } from 'fs'
import { execSync } from 'child_process'

@Injectable()
export class AppService {
  constructor(private readonly jenkinService: JenkinsService) {

  }
  async test(): Promise<void> {
    
    const fileFolder = getLocalFileFolderPath('46')
    const fileName = getLocalFileName('deploy-lanmaoly-cloud-salary-front')
    const ymlText = await fs.readFile(fileFolder + fileName, 'utf-8')
    const newYmlText = ymlText.replace(/image: (.*)/g, `image: dafsdjfsdkf`)
    await fs.writeFile(fileFolder + fileName, newYmlText)
    // try {
    //   process.chdir(fileFolder);
    //   console.log(`process.chdir(${fileFolder}); 命令执行成功`);

    //   execSync('git fetch');
    //   console.log('git fetch 命令执行成功');

    //   execSync(`'git checkout ${branch}'`);
    //   console.log(`git checkout ${branch} 命令执行成功`);

    //   execSync('git pull');
    //   console.log('git pull 命令执行成功');


    // } catch (error) {
    //   console.error(`执行命令时出错: ${error.message}`);
    // }
  }
  async start(): Promise<void> {

    const tasks: ITask[] = JSON.parse(JSON.stringify(taskQueue))
    while (tasks.length > 0) {

      const { project, environment, gitOptions } = tasks.shift() as ITask

      const build = await this.jenkinService.triggerBuild(project, environment) as { status: number, statusText: string }
      if (build.status !== 201 || build.statusText !== 'Created') {
        throw new Error(`${project}项目在${environment}启动构建失败`)
      }
      console.log(`${project}项目在${environment}启动构建`)
      const runTaskRes = await this.jenkinService.getLastBuildId(project, environment)

      if (!runTaskRes.data) {
        throw new Error(`无可执行的任务`)
      }

      const runTaskId = runTaskRes.data

      //轮询调用 getRunTaskStatus 接口 2秒一次 阻塞下面代码轮询不完成不继续执行
      while (true) {
      
        const runTaskStatus = await this.jenkinService.getRunTaskStatus(project, environment, runTaskId)
        if (runTaskStatus.data.building) {
          console.log(`${project}项目在${environment}构建中 ${runTaskId}`)
          await new Promise(resolve => setTimeout(resolve, 8000))
          continue
        }

        if (runTaskStatus.data.result === 'SUCCESS') {
          console.log(`${project}项目在${environment}构建成功 ${runTaskId}`)
          break
        }

        throw new Error(`${project}项目在${environment}构建失败 ${runTaskId} 请去网页查看原因`)
      }

      if (environment === 'deploy') {
        console.log(`${project}准备获取镜像版本 请耐心等待！`)
        const buildLog = await this.jenkinService.getBuildLog(project, environment, runTaskId)
        const image = getLogVersion(buildLog.data)
        if (image.length <= 0) {
          throw new Error(`${project}项目在${environment}构建日志没有获取到镜像版本`)
        }

        console.log(`${project}项目在${environment}构建日志获取到镜像版本 ${image}`)

        // 修改git镜像版本
        if (gitOptions) {

          const fileFolder = getLocalFileFolderPath(gitOptions.env)
          const fileName = getLocalFileName(project)
          const branch  = gitOptions.branch || 'master'
          try {
            process.chdir(fileFolder);
            console.log(`process.chdir(${fileFolder}); 命令执行成功`);

            execSync(`git checkout ${branch}`, { stdio: 'inherit' });
            console.log(`git checkout ${branch} 命令执行成功`);

            execSync('git pull', { stdio: 'inherit' });
            console.log('git pull 命令执行成功');

          } catch (error) {
            console.error(`执行命令时出错: ${error.message}`);
            throw new Error(`${error} \n 执行命令时出错: ${error.message}`)
          }

          const ymlText = await fs.readFile(fileFolder + fileName, 'utf-8')
          const newYmlText = ymlText.replace(/image: (.*)/g, `image: ${image}`)

          if (newYmlText !== ymlText) {
            try {
              await fs.writeFile(fileFolder + fileName, newYmlText)
              console.log(`${project}项目在${environment}修改镜像版本成功`)
            } catch (error) {
              throw new Error(`${error} \n ${project}项目在${environment}修改镜像版本失败`)
            }
          }else{
            throw new Error(`${project}项目在${environment} 镜像号一致`)
          }

          try {
            execSync(`git add ${fileName}`, { stdio: 'inherit' });
            console.log(`git add ${fileName} 命令执行成功`);

            execSync(`git commit -m ${image}镜像版本`, { stdio: 'inherit' });
            console.log(`git commit -m ${image}镜像版本 命令执行成功`);

            execSync(`git push`, { stdio: 'inherit' });
            console.log('git push 命令执行成功');
          } catch (error) {
            console.error(`执行命令时出错: ${error.message}`);
            throw new Error(`${error} \n 执行命令时出错: ${error.message}`)
          }

        }
      }
    }

    console.log('----------------全部构建完成------------------')
  }
}
