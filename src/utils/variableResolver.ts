// 变量类型
export enum VariableType {
  SYSTEM = 'system',
  GAME = 'game',
  CUSTOM = 'custom'
}

// 变量元数据
export interface VariableMetadata {
  name: string
  type: VariableType
  description: string
  defaultValue?: string
  example?: string
}

// 内置变量定义
export const BUILTIN_VARIABLES: VariableMetadata[] = [
  {
    name: 'player_name',
    type: VariableType.SYSTEM,
    description: '玩家名称',
    defaultValue: '店主',
    example: '店主'
  },
  {
    name: 'gold',
    type: VariableType.GAME,
    description: '当前金币数',
    example: '1000'
  },
  {
    name: 'day',
    type: VariableType.GAME,
    description: '游戏天数',
    example: '5'
  },
  {
    name: 'energy',
    type: VariableType.GAME,
    description: '玩家精力',
    example: '80'
  },
  {
    name: 'girl_name',
    type: VariableType.GAME,
    description: '当前交互的 NPC 名称',
    example: '艾琳娜'
  },
  {
    name: 'girl_race',
    type: VariableType.GAME,
    description: '当前交互的 NPC 种族',
    example: '精灵'
  },
  {
    name: 'location',
    type: VariableType.GAME,
    description: '当前位置',
    example: '二楼'
  }
]

// 变量解析器
export class VariableResolver {
  /**
   * 解析并替换变量
   */
  static resolve(
    text: string,
    context: {
      game?: any
      custom?: Record<string, string>
      extra?: Record<string, string>
    }
  ): string {
    let result = text

    // 替换系统变量
    result = this.replaceSystemVariables(result, context.extra)

    // 替换游戏变量
    if (context.game) {
      result = this.replaceGameVariables(result, context.game)
    }

    // 替换自定义变量
    if (context.custom) {
      result = this.replaceCustomVariables(result, context.custom)
    }

    return result
  }

  private static replaceSystemVariables(
    text: string,
    extra?: Record<string, string>
  ): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (extra && extra[key] !== undefined) {
        return extra[key]
      }
      // 返回默认值或原样
      return this.getVariableDefaultValue(key) || match
    })
  }

  private static replaceGameVariables(
    text: string,
    gameState: any
  ): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (gameState[key] !== undefined) {
        return String(gameState[key])
      }
      return match
    })
  }

  private static replaceCustomVariables(
    text: string,
    customVars: Record<string, string>
  ): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (customVars[key] !== undefined) {
        return customVars[key]
      }
      return match
    })
  }

  private static getVariableDefaultValue(name: string): string | undefined {
    const meta = BUILTIN_VARIABLES.find(v => v.name === name)
    return meta?.defaultValue
  }

  /**
   * 提取文本中使用的所有变量
   */
  static extractVariables(text: string): string[] {
    const matches = text.matchAll(/\{\{(\w+)\}\}/g)
    return [...new Set(Array.from(matches, m => m[1]))]
  }

  /**
   * 获取变量元数据
   */
  static getVariableMetadata(name: string): VariableMetadata | undefined {
    return BUILTIN_VARIABLES.find(v => v.name === name)
  }

  /**
   * 获取所有内置变量
   */
  static getAllBuiltinVariables(): VariableMetadata[] {
    return [...BUILTIN_VARIABLES]
  }
}