export type TimeSlot = 'morning' | 'afternoon' | 'night';

export type ActivityType = 'serve' | 'train' | 'rest' | 'idle';

export interface TaskConfig {
  id: string;
  name: string;
  type: ActivityType;
  description: string;
  costEnergy: number; // 消耗精力
  costSanity: number; // 消耗理智
  baseIncome?: number; // 基础收入 (接客用)
  expService?: number; // 增加侍奉经验
  expTechnique?: number; // 增加技巧经验
}

// 每日的日程表
export interface DaySchedule {
  day: number;
  assignments: Record<string, Record<TimeSlot, string>>; // girlId -> { morning: 'taskId', ... }
}

// 结算结果
export interface TaskResult {
  girlId: string;
  slot: TimeSlot;
  taskId: string;
  success: boolean;
  income: number;
  changes: {
    energy: number;
    sanity: number;
    obedience: number;
    depravity: number;
    exp: Record<string, number>;
  };
  log: string; // 简短的结算日志
}
