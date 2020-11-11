import fs from 'fs'
import { spawnSync } from 'child_process'
import updateNotifier from 'update-notifier'
import inquirer from 'inquirer'
import chalk from 'chalk'

import { CMDType, IRunParams } from './interface'
import pkg from '../package.json'

// 命令提示配置
const prompts = [
  {
    type: 'confirm',
    name: 'git',
    message: '是否初始化 git？',
    default: false
  },
  {
    type: 'list',
    name: 'selectInstall',
    message: '选择安装依赖方式',
    default: 'yarn',
    choices: [
      {
        name: '使用 Yarn',
        value: 'yarn'
      },
      {
        name: '使用 Npm',
        value: 'npm'
      }
    ]
  }
]

/**
 * 检查路径是否存在
 * @param p - 路径
 */
export const isExistPath = (p: string): boolean => fs.existsSync(p)

/**
 * 执行命令
 * @param args - 参数
 * @param cmd - 命令
 * @param cwd - 路径
 */
export const run = ({
  args,
  cmd = 'npm',
  cwd = process.cwd(),
  isStdio = true
}: IRunParams): void => {
  spawnSync(cmd, args, {
    cwd,
    stdio: isStdio ? 'inherit' : undefined,
    shell: true
  })
}

/**
 * 下载模板
 * @param name - 应用名
 * @param template - 模版地址
 */
const downloadTemplate = (
  name: string,
  template = 'git@github.com:tal-tech/create-electron-app-template.git'
): void => {
  const isGitTemplate = /\.git/.test(template)
  const currentPath = process.cwd()
  let runParams: IRunParams = {
    cmd: 'git',
    args: ['clone', template, name]
  }

  // 本地路径，采用复制的方式
  if (!isGitTemplate) {
    let cmd: CMDType = 'cp'
    let args = [template, currentPath, '/e', '/xd', 'node_modules']

    if (process.platform === 'win32') {
      cmd = 'robocopy'
      args = [template, currentPath]
    }

    runParams = {
      cmd,
      args
    }
  }

  console.log('\n下载模版...')
  run({
    ...runParams,
    isStdio: false
  })
  console.log('模板下载完成。\n')

  // 移除现有 git 记录
  run({ cmd: 'rm', args: ['-rf', '.git'], cwd: `${currentPath}/${name}` })
}

/**
 * 安装依赖
 * @param cmd - 执行命令
 * @param path - 路径
 */
const installDependencie = (cmd: CMDType, path: string = process.cwd()) => {
  run({ cmd, args: ['install'], cwd: path })
}

/**
 * 初始化 git
 * @param path - 路径。默认当前位置
 */
const initGit = (path: string = process.cwd()) => {
  run({ cmd: 'git', args: ['init'], cwd: path, isStdio: false })
  run({ cmd: 'git', args: ['add', '.'], cwd: path, isStdio: false })
  run({
    cmd: 'git',
    args: ['commit', '-m', '"init commit"'],
    cwd: path,
    isStdio: false
  })
}

/**
 * 初始化完成
 */
const initComplate = () => {
  console.log('\n✅ 项目初始化完成。\n')
}

/**
 * 初始化命令提示
 */
const initPrompt = (name: string, template: string) => {
  inquirer.prompt(prompts).then(({ git, selectInstall }) => {
    const fullPath = `${process.cwd()}/${name}`

    downloadTemplate(name, template)
    installDependencie(selectInstall, fullPath)

    if (git) {
      initGit(fullPath)
    }

    initComplate()
  })
}

/**
 * 检查 Node
 */
export const checkNodeVersion = (): void => {
  const currentVersion = process.versions.node
  const major = Number(currentVersion.split('.')[0])

  if (major < 10) {
    console.log(`你使用的 Node 版本：\n\n\t${currentVersion}\n
${chalk.red(
  '创建 Electron 应用需要 Node 10 或者更高版本，请升级你的 Node 版本。'
)}`)
    process.exit(1)
  }
}

/**
 * 检查更新
 */
export const checkUpdate = (): void => {
  updateNotifier({ pkg }).notify()
}

/**
 * 创建新应用
 * @param name - 应用名
 * @param template - 模版地址。git 或本地路径
 */
export const createApp = (name: string, template: string): void => {
  const fullPath = `${process.cwd()}/${name}`

  if (isExistPath(fullPath)) {
    console.log(`${chalk.cyan(name)} 在当前目录已经存在。`)
    return
  }

  console.clear() // 清空控制台
  process.stdout.write(
    chalk.bold.cyan(`${pkg.name} v${pkg.version}\n`),
    'utf-8'
  )
  initPrompt(name, template)
}

export { pkg }
