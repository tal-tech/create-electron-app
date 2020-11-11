export type CMDType = 'git' | 'npm' | 'yarn' | 'robocopy' | 'cp' | 'cd' | 'rm'

// 定义运行命令的参数
export interface IRunParams {
  /**
   * 参数
   */
  args: string[]

  /**
   * 命令
   */
  cmd: CMDType

  /**
   * 路径
   */
  cwd?: string

  /**
   * 是否要将相应的 stdio 流传给父进程或从父进程传入
   */
  isStdio?: boolean
}
