import fs from 'fs';
import nodemailer from 'nodemailer';
import ResumeParser from './resume-parser.js';
import path from 'path';

const AUTH_CODE = process.argv[2];
if (!AUTH_CODE) { console.log('用法: node src/gen-send-round3.js <授权码>'); process.exit(1); }

const parser = new ResumeParser('c:/Users/王博/Desktop/王博.pdf');
const resume = await parser.parse();

const companies = [
  {
    company: '万兴科技（A股上市 300624）',
    title: '视频设计师/视觉设计师(AIGC方向)',
    salary: '30W-60W/年',
    location: '深圳南山区软件产业基地',
    email: 'campus@wondershare.cn',
    note: 'A股上市公司，全球20亿用户，AIGC漫剧赛道'
  },
  {
    company: '深圳市时创意电子股份有限公司',
    title: 'AIGC视觉设计师',
    salary: '12K-15K/月',
    location: '深圳宝安区新桥街道',
    email: 'hr@shichuangyi.com',
    note: '宝安区！国家级高新企业，500-1000人，薪资不错'
  },
  {
    company: '深圳市吉祥腾达科技有限公司（Tenda）',
    title: '电商视觉设计师（需AIGC）',
    salary: '13K-15K/月',
    location: '深圳南山区腾达科技大厦',
    email: 'campus@tenda.cn',
    note: '知名网络通信企业，1000-5000人，6大研发基地'
  },
  {
    company: '深圳市沃特沃德股份有限公司',
    title: 'AIGC视觉设计师',
    salary: '13K-16K/月',
    location: '深圳南山区创盛路',
    email: 'zhaopin-hr@waterworld.com.cn',
    note: '智能终端方案商，1200+研发人员'
  }
];

const EMAIL_DIR = path.join(process.cwd(), 'data', 'emails-round3');
if (!fs.existsSync(EMAIL_DIR)) fs.mkdirSync(EMAIL_DIR, { recursive: true });

// Generate emails
for (const c of companies) {
  const body = [
    '收件人: ' + c.email,
    '主题: 应聘' + c.title + ' - 王博 - 作品集附内',
    '',
    '--- 邮件正文 ---',
    '',
    '尊敬的' + c.company.replace(/（.*）|\(.*\)/g, '') + '招聘负责人：',
    '',
    '您好！我是王博，广东培正学院环境艺术设计专业本科生（2027届），现居深圳。对贵司「' + c.title + '」岗位非常感兴趣，特此投递。',
    '',
    '【关于我】',
    '深耕AIGC图像生成领域，熟练掌握 Stable Diffusion、Midjourney、ComfyUI、可灵、即梦、Nano banana 等主流AI设计工具。具备从概念创意到商业级视觉资产交付的全链路能力，擅长将传统美术底层逻辑（透视、光影、色彩）转译为高精度结构化Prompt。',
    '',
    '【核心竞争力】',
    '• AIGC全栈工具：SD WebUI/ComfyUI + Midjourney + LoRA训练 + ControlNet + 可灵/即梦',
    '• Prompt工程：精通结构化提示词，精准控制构图、光影调性、景深布光',
    '• 后期品控：AI产物结构畸变定位与修复，局部重绘，100%商业交付',
    '• 审美体系：电影级色彩与光影把控，平面到视频全媒介视觉统筹',
    '• 效率工具：ChatGPT / Claude Code / Codex / Coze工作流编排',
    '',
    '【项目经验】',
    '• AI视觉设计：多个AIGC创意项目，含品牌视觉、电商场景、电影感叙事',
    '• Prompt架构：将传统美术法则转译为可复用结构化Prompt模板',
    '• Web开发：基于VibeCoding构建响应式视觉展示平台（bobo666.netlify.app）',
    '• AI Agent：独立设计企业差旅审批AI Agent（Coze平台，准确率95%+）',
    '',
    '【作品集】',
    '附上作品集（PDF），涵盖电影感视觉、品牌创意、AI设计等多方向项目。',
    '',
    '【联系方式】',
    '📧 2252054794@qq.com | 📱 15599442549',
    '',
    '期待有机会加入贵司，用AI技术驱动创意设计！',
    '',
    '此致',
    '王博',
    '2026/6/30',
    '',
    '--- 附件: 王博.pdf (简历) + 作品集.pdf ---'
  ].join('\n');

  const filename = c.company.replace(/[/\\:*?"<>|]/g, '-') + '.txt';
  fs.writeFileSync(path.join(EMAIL_DIR, filename), body);
}

// Now send
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', port: 465, secure: true,
  auth: { user: '2252054794@qq.com', pass: AUTH_CODE }
});

console.log('📧 第三轮：生成+发送\n');
await transporter.verify();
console.log('✅ SMTP连接成功\n');

const RESUME = 'c:/Users/王博/Desktop/王博.pdf';
const PORTFOLIO = 'c:/Users/王博/Desktop/作品集.pdf';
const files = fs.readdirSync(EMAIL_DIR).filter(f => f.endsWith('.txt'));
console.log(`📋 ${files.length} 封待发送\n`);

for (const file of files) {
  const content = fs.readFileSync(path.join(EMAIL_DIR, file), 'utf-8');
  const to = content.match(/收件人:\s*(.+)/)[1].trim();
  const subject = content.match(/主题:\s*(.+)/)[1].trim();
  const bs = content.indexOf('--- 邮件正文 ---') + 17;
  const be = content.indexOf('--- 附件:');
  const body = content.substring(bs, be).trim();

  try {
    console.log(`📤 ${subject.substring(0, 50)}...`);
    await transporter.sendMail({
      from: '"王博" <2252054794@qq.com>',
      to, subject, text: body,
      attachments: [
        { filename: '王博-简历.pdf', path: RESUME },
        { filename: '王博-作品集.pdf', path: PORTFOLIO }
      ]
    });
    console.log(`  ✅ → ${to}\n`);
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.log(`  ❌ ${err.message}\n`);
  }
}

console.log('🎉 第三轮发送完成！');
await transporter.close();
