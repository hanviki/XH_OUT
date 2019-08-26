'use strict';

module.exports.APPLICATION_STAGE = {
  STAGE_0: 0, // 表示未提交
  STAGE_1: 1, // 表示科室审核
  STAGE_2: 2, // 表示科研处审核
  STAGE_3: 3, // 表示部门审核
  STAGE_4: 4, // 表示人才领导小组审核
  STAGE_5: 5, // 审核成功
};

module.exports.APPLICATION_STATE = {
  UNSUBMIT: 1,
  REVIEWING: 2,
  RE_SUBMIT: 3,
  RE_REVIEWING: 4,
  REVIEW_PASSED: 5,
  PASSED: 6,
};

module.exports.APPLICATION_LEVEL = {
  LEVEL1: 1,
  LEVEL2: 2,
  LEVEL3: 3,
};

module.exports.USER_ROLE = {
  NORMAL: 0,
  OWNER: [10],
  REVIEWER: [ 10, 21, 22, 23, 24, 25, 27, 30, 31, 32 ],
  DECIDER: 50,
};

module.exports.VIEWER_ROLE = {
  1: [32, 21, 22, 23, 24, 25, 27, 30],
  2: [30, 21, 22, 23, 24, 25, 27],
  3: [31, 21, 22, 23, 24, 25, 27, 30],
}

module.exports.SECOND_VIEWER_ROLE = {
  1: [32],
  2: [30],
  3: [31],
}

module.exports.THIRD_VIEWER_ROLE = {
  1: [21, 22, 23, 24, 25, 27, 30 ],
  2: [21, 22, 23, 24, 25, 27 ],
  3: [21, 22, 23, 24, 25, 27, 30 ],
}

module.exports.REVIEW_STATE = {
  UNREVIEW: 0,
  REJECT: 1,
  PASSED: 2,
};

module.exports.ATTACHMENT_TYPE_MAP = {
  jianli: 1,
  idcard: 2,
  acd: 3,
  lunwen: 4,
  keti: 5,
  zhuanli: 6,
  daoshi: 7,
  xuexiao: 8,
  yaoqing: 9,
  huojiang: 10,
  waiyu: 11,
  xuehui: 12,
};

module.exports.APPLICATION_SUBMIT_VALIDATE_ERROR_MAP = {
  deptName: '候选人科室填写有误',
  declarationYear: '申报年度填写有误',
  applyTime: '填表时间填写有误',
  major: '主要专业领域及研究方向填写有误',
  intro: '个人代表性成就简介填写有误',
  isNationalTechnologyPrizeWinner: '是否国家科技成果奖二等奖及以上的第一完成人填写有误',
  ishousandPlanFinalists: '是否中组部千人计划入选者填写有误',
  isChangjiangxuezheProfessorLevel1: '第一层次是否教育部长江学者特聘教授填写有误',
  isChangjiangxuezheProfessorLevel2: '第二层次是否教育部长江学者特聘教授填写有误',
  isOutstandingYouthFundWinnerLevel1: '第一层次是否国家杰出青年基金获得者填写有误',
  isOutstandingYouthFundWinnerLevel2: '第二层次是否国家杰出青年基金获得者填写有误',
  isChineseMedicalAssociationLeader: '是否中华医学会相应专业一级分会副主任委员及以上职务或全国学科声誉排名处于前10名学科带头人，且获得省部级科技成果奖励一等奖第一名填写有误',
  isNationalTectPlanProjectLeader: '是否国家科技计划（含国家重大专项、国家重点研发，下同）项目牵头人填写有误',
  isNationalTectPlanSubjectLeader: '是否国家科技计划课题负责人填写有误',
  isNationalFundMainProjectLeader: '是否国家基金委重点、重大项目负责人填写有误',
  isInnovationGroupLeader: '是否教育部创新群体负责人填写有误',
  isThousandPlanProjectOwner: '是否中组部千人计划青年项目获得者填写有误',
  isChangjiangxuezheProjectOwner: '是否教育部长江学者青年项目获得者填写有误',
  isThousandPlanTalent: '是否中组部万人计划青年拔尖人才填写有误',
  isNationalExcellentYouthFundWinner: '是否国家优秀青年基金获得者填写有误',
  willReportingAcademician: '是否申报院士填写有误',
  notReportingAcademicianReason: '不申报院士理由填写有误',
  willPublishIF10PapperAnd200Funding: '是否以通讯作者在IF≥10的SCI收录杂志发表论文≥1篇；且主持获得200万以上纵向项目经费填写有误',
  notPublishIF10PapperAnd200FundingReason: '不以通讯作者在IF≥10的SCI收录杂志发表论文≥1篇；且主持获得200万以上纵向项目经费理由填写有误',
  willPublishIF10Papper: '是否以通讯作者在IF≥10的SCI收录杂志发表论文≥1篇填写有误',
  notPublishIF10PapperReason: '不以通讯作者在IF≥10的SCI收录杂志发表论文≥1篇理由填写有误',
  other3YeasAimsLevel1: '第一层次其它入选满3年目标填写有误',
  other3YeasAimsLevel2: '第二层次其它入选满3年目标填写有误',
  other3YeasAimsLevel3: '第三层次其它入选满3年目标填写有误',
  willBecomeAcademicianCandidate: '是否成为院士有效候选人填写有误',
  notBecomeAcademicianCandidateReason: '不成为院士有效候选人理由填写有误',
  willPublishIF20PapperAnd500Funding: '是否以通讯作者在IF≥20的SCI收录杂志发表论文≥1篇或以通讯作者在IF≥10的SCI收录杂志发表论文≥3篇；且2.获得主持国家科技计划（含国家重大专项、国家重点研发，下同）项目、或国家科技计划课题（单项到账经费500万以上）、或国家基金委重点、重大项目、或国家基金委创新群体项目或教育部创新群体项目填写有误',
  notPublishIF20PapperAnd500FundingReason: '不以通讯作者在IF≥20的SCI收录杂志发表论文≥1篇或以通讯作者在IF≥10的SCI收录杂志发表论文≥3篇；且2.获得主持国家科技计划（含国家重大专项、国家重点研发，下同）项目、或国家科技计划课题（单项到账经费500万以上）、或国家基金委重点、重大项目、或国家基金委创新群体项目或教育部创新群体项目理由填写有误',
  willBecomeOutstandingYouth: '是否成为“长江学者”或“杰青”填写有误',
  notBecomeOutstandingYouthReason: '不成为“长江学者”或“杰青”理由填写有误',
  other5YeasAimsLevel1: '第一层次其它入选满5年目标填写有误',
  other5YeasAimsLevel2: '第二层次其它入选满5年目标填写有误',
  other5YeasAimsLevel3: '第三层次其它入选满5年目标填写有误',
};

module.exports.DECIDERS_MAP = {//hsc 这里需要配置对应用户的ID
  '研究生管理办公室': 3,
  '宣传部': 5,
  '纪委办公室': 6,
  '第一临床学院': 7,
  '党委办公室': 9,
  '政治审查': 2758,
    '科研处': 35512,
    '组织部': 35511,
};

module.exports.DECIDERS_ORDER = {
  1: ['党委办公室', '第一临床学院', '研究生管理办公室', '纪委办公室', '科研处', '宣传部',  '组织部' ],
  2: ['党委办公室', '第一临床学院', '研究生管理办公室', '纪委办公室', '宣传部',  '组织部' ],
  3: ['党委办公室', '第一临床学院', '研究生管理办公室', '纪委办公室', '科研处', '宣传部',  '组织部' ]
}


