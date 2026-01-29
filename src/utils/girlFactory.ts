import type { Girl, GirlStaticData, GirlDynamicData, Rarity } from '@/stores/girls';

// --- 配置数据 ---

const RACES = ['人类', '精灵', '猫娘', '魅魔', '龙人', '狐妖', '天使', '堕天使'];
const NAMES_PREFIX = ['艾', '米', '莉', '娜', '莎', '菲', '露', '卡', '希', '薇'];
const NAMES_SUFFIX = ['雅', '拉', '丝', '娜', '儿', '亚', '琳', '奈', '蒂', '依'];

const FEATURES = [
  '高冷', '爆乳', '贫乳', '长发', '短发', '异色瞳', '纹身', '黑皮', '白皮', 
  '眼镜', '兽耳', '尾巴', '丰满', '纤细', '健美'
];

const TRAITS = [
  '敏感', '高傲', '洁癖', '受虐', '施虐', '还有', '贪财', '忠诚', '好色', 
  '性冷淡', '魔法亲和', '怪力', '烹饪', '歌唱', '舞蹈'
];

const DESCRIPTIONS_TEMPLATE = [
  '来自远方的{race}少女，因为{reason}来到这里。',
  '曾经是{identity}，现在只想{wish}。',
  '流落街头的{race}，眼神中透着{emotion}。'
];

const REASONS = ['战乱', '欠债', '寻找亲人', '迷路', '被骗', '自愿体验生活'];
const IDENTITIES = ['贵族大小姐', '村姑', '冒险者', '修女', '魔法学徒', '战士'];
const WISHES = ['赚钱赎身', '寻找真爱', '活下去', '复仇', '享受快乐'];
const EMOTIONS = ['恐惧', '坚定', '迷茫', '渴望', '冷漠'];

// --- 辅助函数 ---

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomPick<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  const pool = [...arr];
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    const idx = randomInt(0, pool.length - 1);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

function generateName(): string {
  return randomItem(NAMES_PREFIX) + randomItem(NAMES_SUFFIX);
}

function generateMeasurements(): string {
  const bust = randomInt(70, 100);
  const waist = randomInt(50, 70);
  const hip = randomInt(80, 100);
  const cup = ['A', 'B', 'C', 'D', 'E', 'F', 'G'][Math.floor((bust - 70) / 5)] || 'H';
  return `${bust}${cup}-${waist}-${hip}`;
}

function generateSkills(rarity: Rarity) {
  const levels = ['D', 'C', 'B', 'A', 'S'];
  let baseIdx = 0;
  if (rarity === 'R') baseIdx = 1;
  if (rarity === 'SR') baseIdx = 2;
  if (rarity === 'SSR') baseIdx = 3;

  return {
    service: levels[Math.min(4, Math.max(0, baseIdx + randomInt(-1, 1)))],
    technique: levels[Math.min(4, Math.max(0, baseIdx + randomInt(-1, 1)))],
    endurance: levels[Math.min(4, Math.max(0, baseIdx+ randomInt(-1, 1)))]
  };
}

// --- 核心工厂 ---

export function generateRandomGirl(forceRarity?: Rarity): Girl {
  // 1. 决定稀有度
  let rarity: Rarity = 'N';
  if (forceRarity) {
    rarity = forceRarity;
  } else {
    const roll = Math.random();
    if (roll < 0.05) rarity = 'SSR';
    else if (roll < 0.20) rarity = 'SR';
    else if (roll < 0.50) rarity = 'R';
    else rarity = 'N';
  }

  // 2. 基础属性
  const race = randomItem(RACES);
  const name = generateName();
  
  // 3. 特质数量
  let traitCount = 1;
  if (rarity === 'R') traitCount = 2;
  if (rarity === 'SR') traitCount = 3;
  if (rarity === 'SSR') traitCount = 4;

  const traits = randomPick(TRAITS, traitCount);
  const features = randomPick(FEATURES, 2);

  // 4. 生成描述
  const template = randomItem(DESCRIPTIONS_TEMPLATE);
  const description = template
    .replace('{race}', race)
    .replace('{reason}', randomItem(REASONS))
    .replace('{identity}', randomItem(IDENTITIES))
    .replace('{wish}', randomItem(WISHES))
    .replace('{emotion}', randomItem(EMOTIONS));

  // 5. 构造静态数据
  const staticData: GirlStaticData = {
    race,
    rarity,
    features,
    traits,
    measurements: generateMeasurements(),
    description,
    avatar: `npc_${randomInt(1, 5)}` // 假设有 npc_1 到 npc_5 的占位符
  };

  // 6. 构造动态数据
  const maxEnergy = randomInt(80, 150);
  const maxSanity = randomInt(80, 120); // SSR 可能心理素质更好?

  const dynamicData: GirlDynamicData = {
    energy: { current: maxEnergy, max: maxEnergy },
    sanity: { current: maxSanity, max: maxSanity, status: '正常' },
    obedience: randomInt(10, 50),
    depravity: randomInt(0, 20),
    location: '大厅',
    currentActivity: '待机',
    dailyIncome: 0,
    attire: '粗布衣',
    skills: generateSkills(rarity)
  };

  return {
    id: `g${Date.now()}_${randomInt(100, 999)}`,
    name,
    static: staticData,
    dynamic: dynamicData
  };
}
