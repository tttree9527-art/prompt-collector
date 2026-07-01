/**
 * 第三轮邮件：生成+发送 一步完成
 * 用法: node send3.js <SMTP授权码>
 */
import nodemailer from 'nodemailer';
import fs from 'fs';

const AUTH = process.argv[2];
if (!AUTH) { console.log('用法: node send3.js <SMTP授权码>'); process.exit(1); }

const RESUME = 'c:/Users/王博/Desktop/王博.pdf';
const PORTFOLIO = 'c:/Users/王博/Desktop/作品集.pdf';

const jobs = [
  {
    company: '万兴科技（A股上市300624）',
    title: '视频设计师/视觉设计师(AIGC方向)',
    salary: '30W-60W/年',
    location: '深圳南山区软件产业基地',
    email: 'campus@wondershare.cn',
  },
  {
    company: '深圳市时创意电子股份有限公司',
    title: 'AIGC视觉设计师',
    salary: '12K-15K/月',
    location: '深圳宝安区新桥街道',
    email: 'hr@shichuangyi.com',
  },
  {
    company: '深圳市吉祥腾达科技有限公司（Tenda）',
    title: '电商视觉设计师(AIGC方向)',
    salary: '13K-15K/月',
    location: '深圳南山区腾达科技大厦',
    email: 'campus@tenda.cn',
  },
  {
    company: '深圳市沃特沃德股份有限公司',
    title: 'AIGC视觉设计师',
    salary: '13K-16K/月',
    location: '深圳南山区创盛路',
    email: 'zhaopin-hr@waterworld.com.cn',
  },
];

function mail(c) {
  const name = c.company.replace(/（.*）|\(.*\)/g, '');
  return {
    to: c.email,
    subject: `应聘${c.title} - 王博 - 作品集附内`,
    text: `尊敬的${name}招聘负责人：

您好！我是王博，广东培正学院环境艺术设计专业本科生（2027届），现居深圳。对贵司「${c.title}」岗位非常感兴趣，特此投递。

【关于我】
深耕AIGC图像生成领域，熟练掌握 Stable Diffusion、Midjourney、ComfyUI、可灵、即梦、Nano banana 等主流AI设计工具。具备从概念创意到商业级视觉资产交付的全链路能力，擅长将传统美术底层逻辑（透视、光影、色彩）转译为高精度结构化Prompt，实现精准的AI视觉输出。

【核心竞争力】
• AIGC全栈工具：SD WebUI/ComfyUI + Midjourney + LoRA训练 + ControlNet + 可灵/即梦
• Prompt工程：精通结构化提示词，精准控制构图、光影调性、景深布光
• 后期品控：AI产物结构畸变定位与修复，局部重绘，100%商业交付
• 审美体系：电影级色彩与光影把控，平面到视频全媒介视觉统筹
• 效率工具：ChatGPT / Claude Code / Codex / Coze工作流编排

【项目经验】
• AI视觉设计：多个AIGC创意项目，含品牌视觉、电商场景、电影感叙事
• Prompt架构：将传统美术法则转译为可复用结构化Prompt模板
• Web开发：基于VibeCoding构建响应式视觉展示平台（bobo666.netlify.app）
• AI Agent：独立设计企业差旅审批AI Agent（Coze平台，准确率95%+）

【作品集】
附件为我的作品集（PDF），涵盖电影感视觉、品牌创意、AI设计等多方向项目。

【联系方式】
📧 2252054794@qq.com | 📱 15599442549

期待有机会加入贵司，用AI技术驱动创意设计！

此致
王博
2026/6/30`
  };
}

async function main() {
  const t = nodemailer.createTransport({
    host: 'smtp.qq.com', port: 465, secure: true,
    auth: { user: '2252054794@qq.com', pass: AUTH }
  });

  console.log('📧 第三轮投递\n');
  await t.verify();
  console.log('✅ SMTP连接成功\n');

  let ok = 0;
  for (const j of jobs) {
    const m = mail(j);
    try {
      process.stdout.write(`📤 ${j.company.substring(0, 25)}... `);
      await t.sendMail({
        from: '"王博" <2252054794@qq.com>',
        to: m.to, subject: m.subject, text: m.text,
        attachments: [
          { filename: '王博-简历.pdf', path: RESUME },
          { filename: '王博-作品集.pdf', path: PORTFOLIO }
        ]
      });
      console.log(`✅ → ${m.to}`);
      ok++;
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }
  }

  console.log(`\n🎉 完成! ${ok}/${jobs.length} 发送成功`);
  await t.close();
}

main().catch(console.error);
