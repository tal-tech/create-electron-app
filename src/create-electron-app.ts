import { Command } from 'commander'
import { checkUpdate, createApp, pkg } from './utils'

const program = new Command(pkg.name)

/**
 * 初始化命令
 */
export const initCommand = (): void => {
  // 创建应用命令
  program
    .arguments('<appName>')
    .description('创建一个开箱即用的electron项目')
    .option('-t, --template <path>', '模版地址，支持 git 地址和本地路径')
    .action((appName, cmd) => {
      checkUpdate()
      createApp(appName, cmd.template)
    })

  program.on('--help', () => {
    console.log('\n运行 create-electron-app -h | --help 查看命令使用。\n')
  })

  program
    .version(`${pkg.name} ${pkg.version}`, '-v, --version', '查看版本信息')
    .helpOption('-h, --help', '查看帮助信息')
    .usage('[应用名]')

  // 没有输入参数，默认在终端输出帮助信息
  if (!process.argv.slice(2).length) {
    checkUpdate()
    program.outputHelp()
    return
  }

  try {
    program.parse(process.argv)
  } catch (error) {
    program.outputHelp()
  }
}
