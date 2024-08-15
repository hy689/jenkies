
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

// 修改git文件的镜像文本
export const modifyGitFile = (text: string, images: string): string => {
   
    return text.replace(/image: [^\n]+/, `image: ${images}`)
}

// 获取本地要修改的文件夹地址
export const getLocalFileFolderPath = (env: string): string => {
    if (env === '46') {
        return 'C:\\front\\olading\\cluster-46\\deploy\\release\\';
    }

    if (env === '114') {
        return 'C:\\front\\olading\\application\\apps\\';
    }

    return '';
}


// 根据配置名称 获取本地文件名  据观察 文件的名称就是配置名称去掉deploy-
export const getLocalFileName = (project: string):string => {

    if(project.includes('deploy-')){
        return project.replace('deploy-', '') + '.yml'
    }

    return ''
}