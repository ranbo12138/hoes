export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export interface GirlStaticData {
  race: string;       
  rarity: Rarity;
  features: string[]; 
  traits: string[];
  measurements: string; 
  description: string; 
  avatar?: string;
}

export interface GirlDynamicData {
  // 生理
  energy: {
    current: number;
    max: number;
  };
  // 心理
  sanity: {
    current: number;
    max: number;
    status: '正常' | '恍惚' | '崩溃' | '疯狂';
  };
  obedience: number;  // 0-100
  depravity: number;  // 0-100
  
  // 经营
  location: string;    
  currentActivity: string; 
  dailyIncome: number; 
  attire: string;      
  
  // 技能等级 (S/A/B/C/D)
  skills: {
    service: string; // 侍奉
    technique: string; // 技巧
    endurance: string; // 耐力
  }
}

export interface Girl {
  id: string;
  name: string;
  static: GirlStaticData;
  dynamic: GirlDynamicData;
}

// 更新指令接口
export interface GirlStatusUpdate {
  sanity?: number;    // 增量
  energy?: number;    // 增量
  obedience?: number; // 增量
  depravity?: number; // 增量
  attire?: string;    // 替换
  location?: string;  // 替换
  currentActivity?: string; // 替换
}
