/**
 * 实习生专场 - 生成+发送
 * 用法: node send-intern.js <SMTP授权码>
 */
import nodemailer from 'nodemailer';

const AUTH = process.argv[2];
if (!AUTH) { console.log('用法: node send-intern.js <SMTP授权码>'); process.exit(1); }

const RESUME = 'c:/Users/王博/Desktop/王博.pdf';
const PORTFOLIO = 'c:/Users/王博/Desktop/作品集.pdf';

const jobs = [
  {
    company: '风变科技（深圳）有限公司',
    title: 'AI绘图实习生',
    salary: '面议',
    location: '深圳南山区科兴科学园A4栋',
    email: 'hr@forchange.cn',
    note: 'AI在线教育，B轮融资，1500万+用户'
  },
  {
    company: '风变科技（深圳）有限公司',
    title: 'UI/UX设计师（实习）',
    salary: '250-350元/天',
    location: '深圳南山区深圳湾科技生态园',
    email: 'talentattraction@linksome.com',
    note: '核心产品设计，Figma/Sketch，完整项目经验'
  },
  {
    company: '腾讯科技（深圳）有限公司',
    title: 'AI技术美术实习生（美术向）',
    salary: '面议',
    location: '深圳南山区',
    email: 'morefunzhaopin@tencent.com',
    note: '魔方工作室群，火影忍者/暗区突围等王牌产品'
  },
];

function buildMail(c) {
  const name = c.company.replace(/（.*）|\(.*\)/g, '');
  return {
    to: c.email,
    subject: `应聘${c.title} - 王博 - 广东培正学院2027届`,
    text: `尊敬的${name}招聘负责人：

您好！我是王博，广东培正学院环境艺术设计专业本科生（2027届），对贵司「${c.title}」岗位非常感兴趣，特此投递。

【关于我】
深耕AIGC图像生成领域，熟练掌握 Stable Diffusion、Midjourney、ComfyUI、可灵、即梦、Nano banana 等主流AI设计工具。具备从概念创意到商业级视觉资产交付的全链路能力，擅长将传统美术底层逻辑（透视、光影、色彩）转译为高精度结构化Prompt，实现精准的AI视觉输出。

【AIGC技能】
• 工具链：SD WebUI/ComfyUI + MJ + LoRA训练 + ControlNet + 可灵/即梦
• Prompt工程：精通结构化提示词，精准控制构图光影
• 后期：AI产物修复、局部重绘，100%商用交付
• 辅助工具：ChatGPT / Claude Code / Codex

【项目经验】
• 多个AIGC创意设计项目（品牌视觉、电商场景、电影感叙事）
• 独立搭建Prompt结构化模板体系
• VibeCoding构建响应式视觉展示平台（bobo666.netlify.app）
• AI Agent：企业差旅审批系统（Coze平台，准确率95%+）

【教育背景】
广东培正学院 | 环境艺术设计 | 本科 | 2027届

【作品集】
附件为我的作品集与简历，涵盖AI视觉设计全方向。

【联系方式】
📧 2252054794@qq.com | 📱 15599442549

期待有机会加入贵司实习，在实践中贡献AI创意能力！

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

  console.log('📧 实习生专场投递\n');
  await t.verify();
  console.log('✅ SMTP连接成功\n');

  let ok = 0;
  for (const j of jobs) {
    const m = buildMail(j);
    try {
      process.stdout.write(`📤 ${j.company.substring(0, 20)} - ${j.title.substring(0, 25)}... `);
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
