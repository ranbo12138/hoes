// Prompt 类型枚举
export enum PromptType {
  MAIN = 'main',
  SCENARIO = 'scenario',
  CHARACTER = 'character',
  JAILBREAK = 'jailbreak'
}

// 单个 Prompt 配置
export interface PromptConfig {
  type: PromptType
  name: string
  content: string
  enabled: boolean
  priority: number
  variables?: string[]
}

// Prompt 模板管理
export interface PromptTemplate {
  id: string
  name: string
  description?: string
  prompts: PromptConfig[]
}

// 默认 Prompt 模板
export const DEFAULT_PROMPT_TEMPLATE: PromptTemplate = {
  id: 'template_default',
  name: '默认模板',
  prompts: [
    {
      type: PromptType.MAIN,
      name: '主提示词',
      content: `You are the Game Master (GM) of a dark fantasy brothel management RPG called "Otherworld Brothel Simulator".
Your goal is to narrate the story, act as the NPCs (especially the girls), and drive the game state changes.

### Output Format
You MUST respond with two parts:
1. **Narrative**: The story text for the player to read. Keep it immersive, slightly dark, and erotic if the situation fits.
2. **Commands**: A JSON block at the end to update game state.

### JSON Command Protocol
Use the following JSON structure inside a \`\`\`json ... \`\`\` block at the end of your response:
[
  {
    "type": "UPDATE_GIRL",
    "id": "g001",
    "data": {
      "sanity": -5,
      "energy": -10,
      "depravity": 2,
      "attire": "...",
      "location": "..."
    }
  },
  {
    "type": "ADD_GOLD",
    "amount": 100
  },
  {
    "type": "SYSTEM_NOTICE",
    "text": "System message to show"
  }
]

### Context
Current Game State will be provided in the user prompt.
Always stay in character.`,
      enabled: true,
      priority: 1,
      variables: ['player_name', 'gold', 'day']
    }
  ]
}

// Prompt 组合器
export class PromptComposer {
  /**
   * 组合所有启用的 Prompt 为完整 System Prompt
   */
  static composeSystemPrompt(
    template: PromptTemplate,
    variables: Record<string, string>
  ): string {
    // 按优先级排序
    const sortedPrompts = [...template.prompts]
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority)

    // 组合 Prompt
    const promptParts = sortedPrompts.map(p => {
      let content = p.content
      // 替换变量
      content = this.replaceVariables(content, variables)
      return content
    })

    return promptParts.join('\n\n')
  }

  /**
   * 替换模板变量
   */
  private static replaceVariables(
    text: string,
    variables: Record<string, string>
  ): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match
    })
  }

  /**
   * 验证 Prompt 中使用的变量是否都已定义
   */
  static validateVariables(
    template: PromptTemplate,
    availableVars: string[]
  ): string[] {
    const missingVars: string[] = []

    template.prompts.forEach(prompt => {
      const matches = prompt.content.matchAll(/\{\{(\w+)\}\}/g)
      for (const match of matches) {
        const varName = match[1]
        if (!availableVars.includes(varName)) {
          missingVars.push(varName)
        }
      }
    })

    return [...new Set(missingVars)]
  }

  /**
   * 提取文本中使用的所有变量
   */
  static extractVariables(text: string): string[] {
    const matches = text.matchAll(/\{\{(\w+)\}\}/g)
    return [...new Set(Array.from(matches, m => m[1]))]
  }
}
