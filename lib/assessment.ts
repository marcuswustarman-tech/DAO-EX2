// 心理测评问题库
export interface AssessmentQuestion {
  id: number;
  dimension: '风险承受力' | '纪律性' | '情绪稳定性' | '耐心与专注力' | '学习动机';
  question: string;
  options: {
    label: string;
    score: number; // 0-100
    isRedFlag?: boolean; // 是否为红旗答案（直接淘汰）
  }[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // 风险承受力 (4题)
  {
    id: 1,
    dimension: '风险承受力',
    question: '如果您在一周内连续5天都出现亏损，您会如何应对？',
    options: [
      { label: '严格复盘每笔交易，找出问题所在', score: 100 },
      { label: '暂停交易，冷静思考后再继续', score: 80 },
      { label: '继续按照原计划执行，亏损是正常的', score: 60 },
      { label: '加大仓位，尽快把亏损赚回来', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 2,
    dimension: '风险承受力',
    question: '您能够接受的最大单日回撤是多少？',
    options: [
      { label: '5%以内，我需要严格控制风险', score: 100 },
      { label: '10%以内，可以接受一定波动', score: 80 },
      { label: '20%以内，只要最终能盈利', score: 40 },
      { label: '没有上限，只要能赚大钱', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 3,
    dimension: '风险承受力',
    question: '您如何看待交易中的亏损？',
    options: [
      { label: '亏损是交易的一部分，关键是控制在可接受范围内', score: 100 },
      { label: '亏损让我不舒服，但我理解这是必然的', score: 70 },
      { label: '每次亏损都让我感到沮丧', score: 40 },
      { label: '亏损是不可接受的，我要避免一切亏损', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 4,
    dimension: '风险承受力',
    question: '如果您的账户在一个月内增长了50%，您会如何处理？',
    options: [
      { label: '保持当前策略，不改变仓位和风险管理', score: 100 },
      { label: '适度增加仓位，但仍严格控制风险', score: 80 },
      { label: '明显增加仓位，趁势扩大盈利', score: 30 },
      { label: '大幅加仓，抓住这个赚钱的好机会', score: 0, isRedFlag: true },
    ],
  },

  // 纪律性 (4题)
  {
    id: 5,
    dimension: '纪律性',
    question: '当您制定了交易计划后，实际执行时发现市场情况与预期不符，您会？',
    options: [
      { label: '严格按照计划执行，止损就止损', score: 100 },
      { label: '在止损位附近稍作观察，但不会拖延太久', score: 70 },
      { label: '根据实时情况调整计划', score: 40 },
      { label: '移动止损位，给交易更多空间', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 6,
    dimension: '纪律性',
    question: '您如何看待"移动止损"这一行为？',
    options: [
      { label: '绝对不能移动止损，这是交易大忌', score: 100 },
      { label: '除非有特殊技术信号，否则不移动', score: 60 },
      { label: '根据市场变化，可以灵活调整', score: 20 },
      { label: '经常移动止损，给交易更多机会', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 7,
    dimension: '纪律性',
    question: '如果错过了一个您认为的"绝佳入场机会"，您会？',
    options: [
      { label: '接受错过，等待下一个符合规则的机会', score: 100 },
      { label: '感到遗憾，但不会追单', score: 80 },
      { label: '尝试在次优位置入场', score: 30 },
      { label: '立即追单，不能错过赚钱机会', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 8,
    dimension: '纪律性',
    question: '您每天能够严格按照交易计划执行的频率是？',
    options: [
      { label: '每次都严格执行，从不违背', score: 100 },
      { label: '大部分时候能执行，偶尔会偏离', score: 70 },
      { label: '经常根据感觉调整计划', score: 30 },
      { label: '计划只是参考，实际操作靠盘感', score: 0, isRedFlag: true },
    ],
  },

  // 情绪稳定性 (4题)
  {
    id: 9,
    dimension: '情绪稳定性',
    question: '在经历一次大额盈利后，您的情绪状态是？',
    options: [
      { label: '保持平静，这只是策略执行的结果', score: 100 },
      { label: '感到高兴，但很快恢复正常', score: 80 },
      { label: '非常兴奋，想要继续交易', score: 40 },
      { label: '极度兴奋，觉得自己找到了赚钱的秘诀', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 10,
    dimension: '情绪稳定性',
    question: '如果您在交易时出现连续的小额亏损，您的心态如何？',
    options: [
      { label: '保持冷静，按照策略继续执行', score: 100 },
      { label: '有些烦躁，但能控制情绪', score: 70 },
      { label: '感到焦虑，开始怀疑策略', score: 40 },
      { label: '非常烦躁，想要立即翻本', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 11,
    dimension: '情绪稳定性',
    question: '您如何处理交易中的压力？',
    options: [
      { label: '通过严格的风险管理，几乎没有压力', score: 100 },
      { label: '有压力时会暂停交易，调整心态', score: 80 },
      { label: '能够承受一定压力，但会影响表现', score: 50 },
      { label: '压力很大，经常感到焦虑', score: 20 },
    ],
  },
  {
    id: 12,
    dimension: '情绪稳定性',
    question: '当市场走势与您的判断完全相反时，您的反应是？',
    options: [
      { label: '接受现实，执行止损，不带情绪', score: 100 },
      { label: '感到失望，但能理性处理', score: 80 },
      { label: '感到沮丧，需要一段时间恢复', score: 40 },
      { label: '无法接受，想要立即扳回', score: 0, isRedFlag: true },
    ],
  },

  // 耐心与专注力 (4题)
  {
    id: 13,
    dimension: '耐心与专注力',
    question: '您能够连续盯盘不交易（等待入场信号）的最长时间是？',
    options: [
      { label: '可以连续数天不交易，直到出现完美信号', score: 100 },
      { label: '可以等待一整天', score: 80 },
      { label: '最多几个小时，就会想要交易', score: 40 },
      { label: '很难忍受不交易的状态', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 14,
    dimension: '耐心与专注力',
    question: '您如何看待"频繁交易"？',
    options: [
      { label: '应该避免，只在最佳时机出手', score: 100 },
      { label: '适度交易，不过度频繁', score: 70 },
      { label: '保持一定频率，才能抓住机会', score: 30 },
      { label: '多交易才能多赚钱', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 15,
    dimension: '耐心与专注力',
    question: '对于等待一个交易机会出现，您的态度是？',
    options: [
      { label: '愿意耐心等待，不符合条件绝不出手', score: 100 },
      { label: '能够等待，但需要自我提醒', score: 70 },
      { label: '等待让我焦虑，会降低标准', score: 30 },
      { label: '不愿等待，宁愿尝试次优机会', score: 0 },
    ],
  },
  {
    id: 16,
    dimension: '耐心与专注力',
    question: '在独立不被打扰的环境中连续工作8小时，您的感受是？',
    options: [
      { label: '完全没问题，这是我理想的工作状态', score: 100 },
      { label: '可以做到，但需要适度休息', score: 80 },
      { label: '比较困难，容易感到疲惫', score: 40 },
      { label: '无法做到，需要经常与人交流', score: 0 },
    ],
  },

  // 学习动机 (4题)
  {
    id: 17,
    dimension: '学习动机',
    question: '您期望通过交易员培训达到什么目标？',
    options: [
      { label: '成为一名专业的、稳定盈利的职业交易员', score: 100 },
      { label: '掌握系统化的交易技能，实现财务自由', score: 80 },
      { label: '快速赚钱，改善生活', score: 20 },
      { label: '短期暴富', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 18,
    dimension: '学习动机',
    question: '您期望多久能够实现稳定盈利？',
    options: [
      { label: '1年以上，我理解交易需要长期修炼', score: 100 },
      { label: '6个月到1年', score: 80 },
      { label: '3-6个月', score: 50 },
      { label: '1个月内', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 19,
    dimension: '学习动机',
    question: '如果在培训期间被劝退，您会如何看待？',
    options: [
      { label: '接受结果，说明我不适合这条路', score: 100 },
      { label: '会失望，但尊重专业判断', score: 80 },
      { label: '难以接受，会要求再给机会', score: 30 },
      { label: '无法接受，认为是平台的问题', score: 0, isRedFlag: true },
    ],
  },
  {
    id: 20,
    dimension: '学习动机',
    question: '您对"交易是一门需要终身学习的技艺"这句话的认同程度？',
    options: [
      { label: '完全认同，我准备好长期学习和进步', score: 100 },
      { label: '基本认同，会持续学习', score: 80 },
      { label: '部分认同，掌握基本技能就够了', score: 40 },
      { label: '不认同，学会了就可以一直用', score: 0 },
    ],
  },
];

// 计算每个维度的得分
export function calculateDimensionScores(answers: Record<number, number>): Record<string, number> {
  const dimensionScores: Record<string, { total: number; count: number }> = {
    '风险承受力': { total: 0, count: 0 },
    '纪律性': { total: 0, count: 0 },
    '情绪稳定性': { total: 0, count: 0 },
    '耐心与专注力': { total: 0, count: 0 },
    '学习动机': { total: 0, count: 0 },
  };

  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const question = assessmentQuestions.find(q => q.id === parseInt(questionId));
    if (question && question.options[optionIndex]) {
      const score = question.options[optionIndex].score;
      dimensionScores[question.dimension].total += score;
      dimensionScores[question.dimension].count += 1;
    }
  });

  const result: Record<string, number> = {};
  Object.entries(dimensionScores).forEach(([dimension, { total, count }]) => {
    result[dimension] = count > 0 ? Math.round(total / count) : 0;
  });

  return result;
}

// 检查是否有红旗答案
export function hasRedFlagAnswers(answers: Record<number, number>): boolean {
  return Object.entries(answers).some(([questionId, optionIndex]) => {
    const question = assessmentQuestions.find(q => q.id === parseInt(questionId));
    return question?.options[optionIndex]?.isRedFlag === true;
  });
}

// 判断是否通过测评
export function isPassed(dimensionScores: Record<string, number>, hasRedFlag: boolean): boolean {
  if (hasRedFlag) return false;

  // 所有维度必须≥70分
  const allDimensionsPass = Object.values(dimensionScores).every(score => score >= 70);

  // 没有任何维度低于50分
  const noLowScores = Object.values(dimensionScores).every(score => score >= 50);

  return allDimensionsPass && noLowScores;
}
