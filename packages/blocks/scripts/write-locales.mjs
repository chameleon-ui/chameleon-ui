import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const LOCALES = [
  'zh-CN',
  'zh-HK',
  'ja',
  'ko',
  'ru',
  'hi',
  'en',
  'de',
  'ar',
  'ug',
  'sw',
  'ha',
  'am',
  'es',
  'fr',
  'pt',
  'bn',
  'id',
  'ur',
  'fa',
  'vi',
]

const AUTHORED = new Set(['en', 'zh-CN'])

const authored = {
  login: {
    en: {
      login: {
        title: 'Sign in',
        subtitle: 'Welcome back. Continue with your email and password.',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        submit: 'Sign in',
        registerPrompt: 'Need an account?',
        registerAction: 'Create one',
        errorRequired: 'Email and password are required.',
        errorInvalid: 'Enter a valid email address.',
        rememberLabel: 'Keep me signed in',
        sessionCount:
          '{count, plural, =0 {No saved sessions} one {# saved session} other {# saved sessions}}',
      },
    },
    'zh-CN': {
      login: {
        title: '登录',
        subtitle: '欢迎回来。请使用电子邮箱和密码继续。',
        emailLabel: '电子邮箱',
        passwordLabel: '密码',
        showPassword: '显示密码',
        hidePassword: '隐藏密码',
        submit: '登录',
        registerPrompt: '还没有账户？',
        registerAction: '创建一个',
        errorRequired: '电子邮箱和密码为必填项。',
        errorInvalid: '请输入有效的电子邮箱地址。',
        rememberLabel: '保持登录状态',
        sessionCount: '{count, plural, =0 {没有已保存的会话} other {已保存 # 个会话}}',
      },
    },
  },
  'crud-page': {
    en: {
      crud: {
        title: 'Records',
        subtitle: 'Create, review, and update rows in this workspace.',
        create: 'New record',
        dialogTitle: 'Create record',
        dialogDescription: 'Add a name to insert a row.',
        close: 'Close',
        nameLabel: 'Name',
        submit: 'Save',
        emptyTitle: 'No records yet',
        emptyDescription: 'Create the first row to populate this table.',
        gridLabel: 'Records',
        emptyLabel: 'No data',
        colName: 'Name',
        colStatus: 'Status',
        statusActive: 'Active',
        errorRequired: 'Name is required.',
        itemCount: '{count, plural, =0 {No records} one {# record} other {# records}}',
      },
    },
    'zh-CN': {
      crud: {
        title: '记录',
        subtitle: '在此工作区中创建、查看和更新行。',
        create: '新建记录',
        dialogTitle: '创建记录',
        dialogDescription: '填写名称以插入一行。',
        close: '关闭',
        nameLabel: '名称',
        submit: '保存',
        emptyTitle: '还没有记录',
        emptyDescription: '创建第一行以填充此表。',
        gridLabel: '记录',
        emptyLabel: '暂无数据',
        colName: '名称',
        colStatus: '状态',
        statusActive: '启用',
        errorRequired: '名称为必填项。',
        itemCount: '{count, plural, =0 {没有记录} other {# 条记录}}',
      },
    },
  },
  'marketing-site': {
    en: {
      marketing: {
        heroTitle: 'Ship interfaces that adapt',
        heroBody: 'Compose tokens, components, and scenes without a second styling language.',
        heroCta: 'Start building',
        pricingTitle: 'Pricing',
        planFree: 'Starter',
        planPro: 'Pro',
        planTeam: 'Team',
        priceFree: '$0',
        pricePro: '$24',
        priceTeam: '$72',
        planFreeBody: 'Core components for a first product slice.',
        planProBody: 'Themes, blocks, and extra density rungs.',
        planTeamBody: 'Shared tokens and review workflows for a product team.',
        ctaStart: 'Choose plan',
        faqTitle: 'Frequently asked questions',
        faq1Title: 'Do blocks install like components?',
        faq1Body: 'Yes. Block writes go through the same install-core kernel.',
        faq2Title: 'Are all 21 locales authored?',
        faq2Body: 'English and Simplified Chinese are authored. Other locales ship ICU skeletons.',
        faq3Title: 'Can I restyle a block with raw CSS?',
        faq3Body: 'No. Blocks consume --cu-* tokens and logical properties only.',
        planCount: '{count, plural, =0 {No plans} one {# plan} other {# plans}}',
      },
    },
    'zh-CN': {
      marketing: {
        heroTitle: '交付会适应的界面',
        heroBody: '用 Token、组件和场景组合界面，不必再写第二套样式语言。',
        heroCta: '开始构建',
        pricingTitle: '定价',
        planFree: '入门',
        planPro: '专业',
        planTeam: '团队',
        priceFree: '$0',
        pricePro: '$24',
        priceTeam: '$72',
        planFreeBody: '覆盖首个产品切片的核心组件。',
        planProBody: '主题、Blocks 与额外密度档位。',
        planTeamBody: '供产品团队共享的 Token 与评审流程。',
        ctaStart: '选择方案',
        faqTitle: '常见问题',
        faq1Title: 'Block 的安装方式和组件一样吗？',
        faq1Body: '是。Block 写盘同样只走 install-core 内核。',
        faq2Title: '21 种语言都已撰稿了吗？',
        faq2Body: '英文和简体中文已撰稿。其余 Locale 提供 ICU 骨架。',
        faq3Title: '可以用裸 CSS 重写 Block 样式吗？',
        faq3Body: '不可以。Block 只消费 --cu-* Token 与逻辑属性。',
        planCount: '{count, plural, =0 {没有方案} other {# 个方案}}',
      },
    },
  },
  register: {
    en: {
      register: {
        title: 'Create an account',
        subtitle: 'Enter your details to join this workspace.',
        nameLabel: 'Name',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        confirmLabel: 'Confirm password',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        termsLabel: 'I agree to the terms',
        submit: 'Create account',
        loginPrompt: 'Already have an account?',
        loginAction: 'Sign in',
        errorRequired: 'Name, email, and password are required.',
        errorInvalid: 'Enter a valid email address.',
        errorMismatch: 'Passwords do not match.',
        errorTerms: 'Agree to the terms to continue.',
        accountCount:
          '{count, plural, =0 {No accounts created} one {# account created} other {# accounts created}}',
      },
    },
    'zh-CN': {
      register: {
        title: '创建账户',
        subtitle: '填写信息以加入此工作区。',
        nameLabel: '姓名',
        emailLabel: '电子邮箱',
        passwordLabel: '密码',
        confirmLabel: '确认密码',
        showPassword: '显示密码',
        hidePassword: '隐藏密码',
        termsLabel: '我同意条款',
        submit: '创建账户',
        loginPrompt: '已有账户？',
        loginAction: '登录',
        errorRequired: '姓名、电子邮箱和密码为必填项。',
        errorInvalid: '请输入有效的电子邮箱地址。',
        errorMismatch: '两次输入的密码不一致。',
        errorTerms: '请同意条款后再继续。',
        accountCount: '{count, plural, =0 {尚未创建账户} other {已创建 # 个账户}}',
      },
    },
  },
  kanban: {
    en: {
      kanban: {
        title: 'Board',
        subtitle: 'Move work across columns with the keyboard. Pointer drag is not included.',
        colTodo: 'To do',
        colDoing: 'In progress',
        colDone: 'Done',
        emptyTitle: 'No cards',
        emptyDescription: 'This column has no cards yet.',
        moveForward: 'Move {name} forward',
        moveBack: 'Move {name} back',
        priorityHigh: 'High',
        priorityMedium: 'Medium',
        priorityLow: 'Low',
        cardCount: '{count, plural, =0 {No cards} one {# card} other {# cards}}',
      },
    },
    'zh-CN': {
      kanban: {
        title: '看板',
        subtitle: '用键盘在列之间移动工作项。本 Block 不提供指针拖拽。',
        colTodo: '待办',
        colDoing: '进行中',
        colDone: '已完成',
        emptyTitle: '没有卡片',
        emptyDescription: '此列暂无卡片。',
        moveForward: '将 {name} 前移',
        moveBack: '将 {name} 后移',
        priorityHigh: '高',
        priorityMedium: '中',
        priorityLow: '低',
        cardCount: '{count, plural, =0 {没有卡片} other {# 张卡片}}',
      },
    },
  },
  gantt: {
    en: {
      gantt: {
        title: 'Schedule',
        subtitle: 'Bars are sized from start and end dates. This is not a drawing engine.',
        scaleLabel: 'Date scale',
        rangeLabel: 'Scale {start} to {end}',
        emptyTitle: 'No tasks',
        emptyDescription: 'Add a task to plot the schedule.',
        emptyTimeline: 'No milestones yet',
        statusOnTrack: 'On track',
        statusAtRisk: 'At risk',
        barLabel: '{name} from {start} to {end}',
        taskCount: '{count, plural, =0 {No tasks} one {# task} other {# tasks}}',
      },
    },
    'zh-CN': {
      gantt: {
        title: '进度计划',
        subtitle: '条形按起止日期计算宽度。这不是绘制引擎。',
        scaleLabel: '日期刻度',
        rangeLabel: '刻度从 {start} 到 {end}',
        emptyTitle: '没有任务',
        emptyDescription: '添加任务以绘制计划。',
        emptyTimeline: '还没有里程碑',
        statusOnTrack: '正常',
        statusAtRisk: '有风险',
        barLabel: '{name} 从 {start} 到 {end}',
        taskCount: '{count, plural, =0 {没有任务} other {# 项任务}}',
      },
    },
  },
  'ticket-flow': {
    en: {
      ticket: {
        title: 'Ticket',
        subtitle: 'Advance a request through triage and keep notes on the timeline.',
        stepsLabel: 'Ticket stages',
        stepOpen: 'Open',
        stepTriage: 'Triage',
        stepProgress: 'In progress',
        stepResolved: 'Resolved',
        noteLabel: 'Add a note',
        submit: 'Add note',
        advance: 'Advance stage',
        emptyTitle: 'No notes yet',
        emptyDescription: 'Add the first note to start this request.',
        emptyTimeline: 'No events yet',
        errorRequired: 'A note is required.',
        eventAdvanced: 'Moved to {stage}',
        noteCount: '{count, plural, =0 {No notes} one {# note} other {# notes}}',
      },
    },
    'zh-CN': {
      ticket: {
        title: '工单',
        subtitle: '按分诊步骤推进请求，并在时间线上记录备注。',
        stepsLabel: '工单阶段',
        stepOpen: '待处理',
        stepTriage: '分诊',
        stepProgress: '进行中',
        stepResolved: '已解决',
        noteLabel: '添加备注',
        submit: '添加备注',
        advance: '推进一步',
        emptyTitle: '还没有备注',
        emptyDescription: '添加第一条备注以开始此请求。',
        emptyTimeline: '还没有事件',
        errorRequired: '备注为必填项。',
        eventAdvanced: '已移至 {stage}',
        noteCount: '{count, plural, =0 {没有备注} other {# 条备注}}',
      },
    },
  },
  'approval-flow': {
    en: {
      approval: {
        title: 'Approval request',
        subtitle: 'Review the request, then approve or reject with a comment.',
        subject: 'Hardware refresh · Q3',
        stepsLabel: 'Approval steps',
        stepSubmit: 'Submitted',
        stepSubmitHint: 'Request entered the queue.',
        stepReview: 'Review',
        stepReviewHint: 'Decide with a written comment.',
        stepDone: 'Complete',
        stepDoneHint: 'The decision is recorded.',
        decisionLabel: 'Decision',
        approve: 'Approve',
        reject: 'Reject',
        commentLabel: 'Comment',
        submit: 'Submit decision',
        errorRequired: 'Choose a decision and add a comment.',
        successTitle: 'Request approved',
        successBody: 'The requester will be notified.',
        rejectedTitle: 'Request rejected',
        rejectedBody: 'The requester will be notified with your comment.',
        requestCount:
          '{count, plural, =0 {No open requests} one {# open request} other {# open requests}}',
      },
    },
    'zh-CN': {
      approval: {
        title: '审批请求',
        subtitle: '审阅请求后，用备注批准或驳回。',
        subject: '硬件更新 · 第三季度',
        stepsLabel: '审批步骤',
        stepSubmit: '已提交',
        stepSubmitHint: '请求已进入队列。',
        stepReview: '审阅',
        stepReviewHint: '用书面备注做出决定。',
        stepDone: '完成',
        stepDoneHint: '决定已记录。',
        decisionLabel: '决定',
        approve: '批准',
        reject: '驳回',
        commentLabel: '备注',
        submit: '提交决定',
        errorRequired: '请选择决定并填写备注。',
        successTitle: '请求已批准',
        successBody: '将通知申请人。',
        rejectedTitle: '请求已驳回',
        rejectedBody: '将把备注通知申请人。',
        requestCount: '{count, plural, =0 {没有待处理请求} other {# 个待处理请求}}',
      },
    },
  },
  'im-chat': {
    en: {
      im: {
        title: 'Inbox',
        subtitle: 'Conversations with markdown replies and a rich-text composer.',
        roomsLabel: 'Rooms',
        roomSupport: 'Support',
        roomDesign: 'Design',
        roomOps: 'Ops',
        threadLabel: 'Thread',
        composerLabel: 'Message composer',
        placeholder: 'Write a reply',
        bold: 'Bold',
        italic: 'Italic',
        send: 'Send',
        userLabel: 'You',
        assistantLabel: 'Assistant',
        sentLabel: 'Sent',
        errorRequired: 'Write a message before sending.',
        emptyTitle: 'No messages yet',
        emptyDescription: 'Send the first reply to start this thread.',
        assistantReply: '**Received.** I logged this in the queue.',
        seedUser: 'Can you summarize the queue?',
        seedAssistant: '## Queue\nThe queue is **healthy**.\n- Two open tickets\n- SLA on track',
        messageCount: '{count, plural, =0 {No messages} one {# message} other {# messages}}',
      },
    },
    'zh-CN': {
      im: {
        title: '收件箱',
        subtitle: '带 Markdown 回复和富文本输入的会话。',
        roomsLabel: '房间',
        roomSupport: '支持',
        roomDesign: '设计',
        roomOps: '运维',
        threadLabel: '会话',
        composerLabel: '消息编辑器',
        placeholder: '写一条回复',
        bold: '加粗',
        italic: '斜体',
        send: '发送',
        userLabel: '你',
        assistantLabel: '助手',
        sentLabel: '已发送',
        errorRequired: '发送前请先填写消息。',
        emptyTitle: '还没有消息',
        emptyDescription: '发送第一条回复以开始此会话。',
        assistantReply: '**已收到。** 我已把此事记入队列。',
        seedUser: '能总结一下队列吗？',
        seedAssistant: '## 队列\n队列状态 **正常**。\n- 两张未关工单\n- SLA 正常',
        messageCount: '{count, plural, =0 {没有消息} other {# 条消息}}',
      },
    },
  },
  'data-screen': {
    en: {
      screen: {
        title: 'Operations screen',
        subtitle: 'KPIs and charts on a canvas that scales to the parent.',
        kpiLabel: 'Key metrics',
        kpiSessions: 'Sessions',
        kpiSessionsValue: '18.4k',
        kpiConversion: 'Conversion',
        kpiConversionValue: '3.2%',
        kpiLatency: 'Latency',
        kpiLatencyValue: '124ms',
        kpiErrors: 'Errors',
        kpiErrorsValue: '0.4%',
        trafficLabel: 'Traffic',
        trafficSeries: 'Sessions',
        conversionLabel: 'Conversion',
        conversionSeries: 'Sign-ups',
        emptyLabel: 'No data',
        panelCount: '{count, plural, =0 {No panels} one {# panel} other {# panels}}',
      },
    },
    'zh-CN': {
      screen: {
        title: '运营大屏',
        subtitle: 'KPI 与图表放在按父级缩放的画布上。',
        kpiLabel: '关键指标',
        kpiSessions: '会话',
        kpiSessionsValue: '18.4k',
        kpiConversion: '转化',
        kpiConversionValue: '3.2%',
        kpiLatency: '延迟',
        kpiLatencyValue: '124ms',
        kpiErrors: '错误',
        kpiErrorsValue: '0.4%',
        trafficLabel: '流量',
        trafficSeries: '会话',
        conversionLabel: '转化',
        conversionSeries: '注册',
        emptyLabel: '暂无数据',
        panelCount: '{count, plural, =0 {没有面板} other {# 个面板}}',
      },
    },
  },
  'trading-terminal': {
    en: {
      trade: {
        title: 'Trading terminal',
        subtitle: 'Watch the tape, chart a symbol, and inspect working orders.',
        tickerLabel: 'Markets',
        chartNamed: 'Price · {symbol}',
        priceSeries: 'Last',
        gridLabel: 'Orders',
        emptyLabel: 'No orders',
        colSymbol: 'Symbol',
        colSide: 'Side',
        colSize: 'Size',
        colPrice: 'Price',
        sideBuy: 'Buy',
        sideSell: 'Sell',
        selectSymbol: 'Select {symbol}',
        orderCount: '{count, plural, =0 {No working orders} one {# working order} other {# working orders}}',
      },
    },
    'zh-CN': {
      trade: {
        title: '交易终端',
        subtitle: '查看行情、绘制标的，并检查未完成订单。',
        tickerLabel: '行情',
        chartNamed: '价格 · {symbol}',
        priceSeries: '最新',
        gridLabel: '订单',
        emptyLabel: '没有订单',
        colSymbol: '标的',
        colSide: '方向',
        colSize: '数量',
        colPrice: '价格',
        sideBuy: '买入',
        sideSell: '卖出',
        selectSymbol: '选择 {symbol}',
        orderCount: '{count, plural, =0 {没有未完成订单} other {# 笔未完成订单}}',
      },
    },
  },
  'iot-panel': {
    en: {
      iot: {
        title: 'Device panel',
        subtitle: 'Gauges and trends for connected equipment.',
        statusOnline: 'Online',
        statusOffline: 'Offline',
        statusAlert: 'Alert',
        gaugeLabel: 'Load {name}',
        chartLabel: 'Trend {name}',
        acknowledge: 'Acknowledge {name}',
        emptyTitle: 'No devices',
        emptyDescription: 'Connect a device to populate this panel.',
        emptyChart: 'No data',
        seedAlpha: 'Chiller A',
        seedBravo: 'Pump B',
        seedCharlie: 'Sensor C',
        deviceCount: '{count, plural, =0 {No devices} one {# device} other {# devices}}',
      },
    },
    'zh-CN': {
      iot: {
        title: '设备面板',
        subtitle: '已连接设备的仪表与趋势。',
        statusOnline: '在线',
        statusOffline: '离线',
        statusAlert: '告警',
        gaugeLabel: '{name} 负载',
        chartLabel: '{name} 趋势',
        acknowledge: '确认 {name}',
        emptyTitle: '没有设备',
        emptyDescription: '连接设备以填充此面板。',
        emptyChart: '暂无数据',
        seedAlpha: '冷机 A',
        seedBravo: '泵 B',
        seedCharlie: '传感器 C',
        deviceCount: '{count, plural, =0 {没有设备} other {# 台设备}}',
      },
    },
  },
}

function importId(locale) {
  return locale.replace(/-([A-Za-z])/g, (_, letter) => letter.toUpperCase())
}

function stringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

const skeletonLocales = LOCALES.filter((locale) => !AUTHORED.has(locale))

await writeFile(
  path.join(root, 'locale-gap-table.json'),
  stringify({
    authored: ['en', 'zh-CN'],
    skeleton: skeletonLocales,
    eta: 'pending',
    owner: 'pending',
    note: 'Block copy is authored for en and zh-CN. Other locales ship English ICU skeletons (_cuSkeleton). This is not a completed 21-language Blocks pack.',
  }),
)

const only = process.env.WRITE_LOCALES_ONLY
  ? process.env.WRITE_LOCALES_ONLY.split(',').map((slug) => slug.trim()).filter(Boolean)
  : null

const written = []
for (const [slug, copies] of Object.entries(authored)) {
  if (only && !only.includes(slug)) continue
  written.push(slug)
  const localeDir = path.join(root, 'src', slug, 'locales')
  await mkdir(localeDir, { recursive: true })
  const english = copies.en

  for (const locale of LOCALES) {
    const body = AUTHORED.has(locale) ? copies[locale] : { _cuSkeleton: true, ...english }
    await writeFile(path.join(localeDir, `${locale}.json`), stringify(body))
  }

  const imports = LOCALES.map((locale) => {
    const id = importId(locale)
    return `import ${id} from './locales/${locale}.json'`
  }).join('\n')

  const mapEntries = LOCALES.map((locale) => {
    const id = importId(locale)
    return locale.includes('-') ? `  '${locale}': ${id},` : `  ${locale}: ${id},`
  }).join('\n')

  const exportName = `${importId(slug)}LocaleTrees`
  const file = `${imports}

export const ${exportName} = {
${mapEntries}
} as const
`

  await writeFile(path.join(root, 'src', slug, 'locale-map.ts'), file)
}

console.log(`wrote locales for ${written.join(', ')}`)
