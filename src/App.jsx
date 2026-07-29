import { useEffect, useRef, useState } from "react";
import DotField from "./DotField";
import BorderGlow from "./BorderGlow";

const metrics = [
  ["100%", "数据交付率"],
  ["20+", "产品优化需求"],
  ["30%", "媒介人效提升"],
  ["40%", "筛选通过率提升"],
];

const strengths = [
  {
    code: "01",
    title: "产品设计与落地",
    text: "从业务痛点、需求调研到原型、PRD、测试与迭代，能够将模糊问题转化为可执行的产品方案。",
    tags: ["墨刀", "PRD", "业务 SOP"],
  },
  {
    code: "02",
    title: "AI 产品实践",
    text: "深度参与 AI 媒介产品迭代，熟悉提示词、AI 工作流与 Vibe Coding，善于探索 AI 对业务流程的重构。",
    tags: ["AI Workflow", "Cursor", "Codex"],
  },
  {
    code: "03",
    title: "数据分析能力",
    text: "熟练使用 SQL、Python 与 Tableau，能够独立完成 ETL、数据建模、多维分析及可视化表达。",
    tags: ["SQL", "Python", "Tableau"],
  },
  {
    code: "04",
    title: "协同与推进",
    text: "擅长收集一线反馈、联动产研推进需求落地，并通过标准化文档降低团队沟通与执行成本。",
    tags: ["跨团队协作", "需求管理", "流程沉淀"],
  },
];

const quickQuestions = [
  { icon: "01", label: "候选人概览", question: "请用面试开场的方式介绍一下你自己" },
  { icon: "02", label: "核心项目复盘", question: "达人智能筛选项目解决了什么问题，怎么做的，结果如何？" },
  { icon: "03", label: "岗位匹配分析", question: "结合经历分析你与 AI 产品岗位的匹配点" },
  { icon: "04", label: "数据能力证明", question: "哪些经历可以证明你的数据分析能力？" },
];

const welcomeMessage = {
  role: "assistant",
  content: "你好，我是李谨的个人 AI 助手。\n我已阅读她的工作、项目、教育与技能信息，可以帮你快速完成候选人初筛。你可以直接提问，也可以从下方选择一个分析方向。",
};

function ProjectVisual({ type }) {
  if (type === "talent") {
    return (
      <div className="visual talent-visual" aria-label="达人智能筛选产品概念图">
        <div className="visual-grid" />
        <div className="radar">
          <span className="radar-ring r1" />
          <span className="radar-ring r2" />
          <span className="radar-ring r3" />
          <span className="radar-sweep" />
          <i className="dot d1" /><i className="dot d2" /><i className="dot d3" />
        </div>
        <div className="score-panel">
          <span>CREATOR MATCH</span>
          <strong>92.6</strong>
          <div><i style={{ width: "92%" }} /></div>
          <small>AUDIENCE · CONTENT · RISK</small>
        </div>
      </div>
    );
  }
  return (
    <div className="visual data-visual" aria-label="电商用户分析数据看板概念图">
      <div className="visual-grid" />
      <div className="data-kicker">USER BEHAVIOR / 50K+ EVENTS</div>
      <div className="chart">
        {[38, 51, 44, 69, 57, 81, 73, 94].map((height, index) => (
          <i key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="funnel"><span>VISIT</span><span>INTEREST</span><span>CONVERT</span></div>
    </div>
  );
}

function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("portfolio_chat")) || [welcomeMessage];
    } catch {
      return [welcomeMessage];
    }
  });
  const scrollRef = useRef(null);
  const messageCountRef = useRef(messages.length);

  useEffect(() => {
    localStorage.setItem("portfolio_chat", JSON.stringify(messages));
    if (messages.length === 1) scrollRef.current?.scrollTo({ top: 0 });
    else if (messages.length > messageCountRef.current) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
    messageCountRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 1) {
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
    }
  }, [open, messages.length]);

  const localFallback = (question, history) => {
    const previousTopic = [...history].reverse().find((item) => item.role === "user")?.content || "";
    const query = /^(具体|详细|为什么|怎么做|还有|然后|结果呢|难点呢)/.test(question) ? `${previousTopic} ${question}` : question;
    const answers = [];
    if (/介绍|自己|候选人|概览/.test(query)) answers.push("我是李谨，目标岗位是 AI 产品经理或产品助理。本科就读于大数据工程技术专业，具备数据分析与产品实践的复合背景。目前的核心经历包括媒介数据产品搭建、AI 媒介助手迭代，以及达人智能筛选项目。");
    if (/达人|筛选|核心项目|项目复盘|难点/.test(query)) answers.push("达人智能筛选项目针对“筛选依赖媒介主观经验、缺少统一量化标准”的问题。我参与设计粉丝画像解析、品牌人群重合度、内容赛道与风险识别能力，并用行业提示词模板固化筛选规则。经 AB 测试，媒介人效提升 30%，筛选通过率提升 40%。");
    if (/数据|SQL|Python|Tableau/.test(query)) answers.push("数据能力主要体现在两类实践：一是从零参与媒介一体化数据管理系统，统一统计口径与双层校验机制，实现周/月报及底层数据 100% 交付；二是使用 Python、SQL 清洗分析 5 万+用户日志，并通过 Tableau 展示转化漏斗与流失节点。");
    if (/匹配|AI 产品|产品岗位|优势|为什么适合/.test(query)) answers.push("与 AI 产品岗位的匹配点有三项：能从一线业务痛点拆解需求；能用墨刀、PRD、SOP 将方案转成可交付产品；同时具备 SQL、Python、Tableau 数据能力，可参与效果验证。已有经历还包括 20+ 项 AI 工具优化需求与缺陷反馈。");
    if (/工作|实习|公司|经历/.test(query)) answers.push("2025 年 11 月至 2026 年 7 月，我在杭州灵感时代数字科技有限公司担任产品数据分析师/产品助理，主要负责媒介数据产品搭建、AI 媒介助手测试调研、需求输出、原型设计和标准化 SOP 沉淀。");
    if (/技能|工具|技术栈/.test(query)) answers.push("产品侧可使用墨刀及 Agent 工具绘制原型，并独立输出 PRD、业务 SOP、需求清单和排障手册；数据侧熟练 SQL、Python（Pandas/NumPy）与 Tableau，熟悉 MySQL、Hive；AI 工具包括 Hermes、Cursor、ChatGPT 与 Codex。");
    if (/教育|学校|专业|证书|荣誉/.test(query)) answers.push("我本科就读于南昌职业大学大数据工程技术专业，并担任团支部书记。证书包括英语四级、计算机二级 WPS、人工智能训练师中级、数据库工程师等；曾获优秀共青团员干部、三好学生和校级一等奖学金。");
    if (/薪资/.test(query)) answers.push("简历中的期望薪资为面议。");
    if (/离职|职业规划|反问|缺点|性格|家庭/.test(query)) return "该内容未在简历中记录，你可以查看页面中的完整经历与项目板块。";
    return answers.length ? [...new Set(answers)].join("\n\n") : "该内容未在简历中记录，你可以查看页面中的完整经历与项目板块。";
  };

  const clearMessages = () => {
    setMessages([welcomeMessage]);
    localStorage.removeItem("portfolio_chat");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const ask = async (value = input) => {
    const question = value.trim();
    if (!question || loading) return;
    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-16) }),
      });
      if (!response.ok) throw new Error("offline");
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: localFallback(question, next.slice(0, -1)) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={`ai-trigger ${open ? "active" : ""}`} onClick={() => setOpen(!open)} aria-label="打开个人 AI 助手">
        <span className="pulse" /> <b>AI</b><em>{open ? "正在对话" : "和李谨的 AI 对话"}</em><span className="ai-trigger-arrow">↗</span>
      </button>
      <aside
        className={`ai-panel ${open ? "open" : ""}`}
        aria-hidden={!open}
        onTransitionEnd={() => {
          if (open && messages.length === 1) scrollRef.current?.scrollTo({ top: 0 });
        }}
      >
        <header className="ai-header">
          <div className="ai-logo"><span>LJ</span></div>
          <div className="ai-heading"><small>PERSONAL INTELLIGENCE</small><strong>李谨的 AI 面试助手</strong><p><i /> 已载入完整简历知识库</p></div>
          <div className="ai-header-actions">
            <button onClick={clearMessages}>清空</button>
            <button onClick={() => setOpen(false)} aria-label="关闭助手">×</button>
          </div>
        </header>
        <div className="ai-context-bar"><span>知识范围</span><b>工作经历</b><b>精选项目</b><b>专业技能</b><b>教育证书</b></div>
        <div className="ai-messages" ref={scrollRef}>
          {messages.length === 1 && (
            <div className="ai-welcome">
              <small>AI RESUME COPILOT</small>
              <h3>从一份简历，<br />快速了解一位候选人。</h3>
              <p>回答严格基于李谨的真实简历信息，不虚构未记录的经历与能力。</p>
              <div className="ai-question-grid">
                {quickQuestions.map((item) => (
                  <button key={item.label} onClick={() => ask(item.question)}>
                    <span>{item.icon}</span><strong>{item.label}</strong><small>{item.question}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
          {(messages.length === 1 ? [] : messages).map((message, index) => (
            <div className={`ai-turn ${message.role}`} key={`${message.role}-${index}`}>
              <div className="ai-avatar">{message.role === "assistant" ? "AI" : "HR"}</div>
              <div><small>{message.role === "assistant" ? "李谨 · AI" : "你的提问"}</small><div className="ai-message">{message.content}</div></div>
            </div>
          ))}
          {loading && <div className="ai-turn assistant"><div className="ai-avatar">AI</div><div><small>正在分析简历</small><div className="ai-message typing"><i /><i /><i /></div></div></div>}
        </div>
        <div className="ai-followups">
          <span>继续追问</span>
          {["展开项目难点", "总结量化成果", "分析岗位匹配度"].map((question) => <button key={question} onClick={() => ask(question)}>{question}</button>)}
        </div>
        <div className="ai-input">
          <div><textarea value={input} maxLength={500} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(); }
          }} placeholder="例如：她在达人筛选项目中具体负责了什么？" /><small>ENTER 发送 · SHIFT + ENTER 换行</small></div>
          <button onClick={() => ask()} disabled={loading || !input.trim()} aria-label="发送问题">↗</button>
        </div>
      </aside>
    </>
  );
}

function ContactChooser({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div className={`contact-modal ${open ? "open" : ""}`} aria-hidden={!open} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="contact-dialog" role="dialog" aria-modal="true" aria-label="选择联系方式">
        <div className="contact-dialog-head">
          <div><small>CONTACT CHANNEL</small><h3>选择一种联系方式</h3></div>
          <button onClick={onClose} aria-label="关闭联系方式">×</button>
        </div>
        <p>欢迎通过电话或邮件与我联系，我会尽快回复。</p>
        <div className="contact-options">
          <a href="tel:18079299867" onClick={onClose}>
            <span>01 / PHONE</span><strong>18079299867</strong><small>点击拨打电话</small><b>↗</b>
          </a>
          <a href="mailto:18079299867@163.com" onClick={onClose}>
            <span>02 / EMAIL</span><strong>18079299867@163.com</strong><small>使用邮箱联系</small><b>↗</b>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const siteRef = useRef(null);
  const heroVideoRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    let previous = window.scrollY > 40;
    setScrolled(previous);
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 40;
        if (next !== previous) {
          previous = next;
          setScrolled(next);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return undefined;
    const loadVideo = () => {
      video.src = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
      video.load();
      video.play().catch(() => {});
    };
    const idleId = "requestIdleCallback" in window
      ? window.requestIdleCallback(loadVideo, { timeout: 1200 })
      : window.setTimeout(loadVideo, 700);
    return () => {
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    let context;
    let disposed = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (disposed) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      const desktopMotion = window.matchMedia("(min-width: 901px) and (pointer: fine)").matches;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
      const opening = gsap.timeline({ defaults: { ease: "power4.inOut" } });
      opening
        .set(".site", { visibility: "visible" })
        .fromTo(".opening-panel", { yPercent: 0 }, { yPercent: -105, duration: .95, stagger: .06 })
        .fromTo(".nav", { y: -110, opacity: 0 }, { y: 0, opacity: 1, duration: .75 }, "-=.48")
        .fromTo(".hero-meta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, "-=.65")
        .fromTo(".hero h1", { y: 150, scaleX: .78, clipPath: "inset(100% 0 0 0)" }, { y: 0, scaleX: 1, clipPath: "inset(0% 0 0 0)", duration: 1.05 }, "-=.48")
        .fromTo(".hero-content>p,.hero-actions", { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1 }, "-=.46")
        .to(".opening", { autoAlpha: 0, duration: .12, pointerEvents: "none" })
        .call(() => ScrollTrigger.refresh());

      gsap.utils.toArray(".content-field section").forEach((section) => {
        const label = section.querySelector(".section-label");
        const title = section.querySelector(".section-head h2, .about-copy h2");
        const supporting = section.querySelector(".section-head p, .intro");
        const cards = section.querySelectorAll(".metrics>div,.experience-card,.project-card,.strength-grid>article");
        if (label) gsap.from(label, { scrollTrigger: { trigger: section, start: "top 78%", once: true }, y: 70, opacity: 0, duration: 1.15, ease: "power4.out" });
        if (title) gsap.from(title, { scrollTrigger: { trigger: section, start: "top 72%", once: true }, y: 130, scaleY: .72, clipPath: "inset(100% 0 0 0)", transformOrigin: "bottom", duration: 1.45, ease: "power4.out" });
        if (supporting) gsap.from(supporting, { scrollTrigger: { trigger: section, start: "top 68%", once: true }, y: 45, opacity: 0, duration: 1.05, ease: "power3.out" });
        if (cards.length) gsap.from(cards, {
          scrollTrigger: { trigger: cards[0], start: "top 84%", once: true },
          y: 100, scale: .96, duration: 1.25, stagger: .16, ease: "power4.out",
        });
      });

      gsap.fromTo(".portrait img", { scale: 1.18, clipPath: "inset(0 0 100% 0)" }, {
        scale: 1, clipPath: "inset(0 0 0% 0)", duration: 1.6, ease: "power4.out",
        scrollTrigger: { trigger: ".portrait", start: "top 78%", once: true },
      });
      if (desktopMotion) {
        gsap.to(".portrait img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".portrait", start: "top bottom", end: "bottom top", scrub: 1.2 } });
      }
      gsap.utils.toArray(".project-card .visual").forEach((visual) => {
        gsap.fromTo(visual, { clipPath: "inset(0 100% 0 0)", scale: 1.08 }, {
          clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.55, ease: "power4.out",
          scrollTrigger: { trigger: visual, start: "top 82%", once: true },
        });
        if (desktopMotion) {
          gsap.to(visual, { yPercent: -4, ease: "none", scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: 1.3 } });
        }
      });
      gsap.from(".contact-content>*", {
        scrollTrigger: { trigger: ".contact", start: "top 65%", once: true },
        y: 100, opacity: 0, duration: 1.35, stagger: .14, ease: "power4.out",
      });
      }, siteRef);
    }).catch(() => {
      document.querySelector(".opening")?.setAttribute("hidden", "");
    });
    return () => {
      disposed = true;
      context?.revert();
    };
  }, []);

  return (
    <div className="site" ref={siteRef}>
      <div className="opening" aria-hidden="true">
        <span className="opening-panel" /><span className="opening-panel" /><span className="opening-panel" />
        <b>LI JIN · PORTFOLIO</b>
      </div>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a className="logo" href="#top"><span>LJ</span><b>LI JIN</b></a>
        <div className="nav-links">
          <a href="#about">关于</a><a href="#experience">经历</a><a href="#projects">项目</a><a href="#strengths">优势</a>
        </div>
        <button className="nav-contact" onClick={() => setContactOpen(true)}>联系我 <span>↗</span></button>
      </nav>

      <main>
        <section className="hero" id="top">
          <video ref={heroVideoRef} autoPlay muted loop playsInline preload="none" aria-hidden="true" />
          <div className="hero-shade" />
          <div className="hero-grid" />
          <div className="hero-content">
            <div className="hero-meta"><span>AI PRODUCT · DATA STRATEGY</span><i /><span>HANGZHOU · 2026</span></div>
            <h1>用产品思维<br />连接<span> AI 与业务</span></h1>
            <p>你好，我是李谨。<br />一名专注于 AI 产品与数据策略的产品实践者。</p>
            <div className="hero-actions">
              <a href="#projects">查看精选项目 <span>↓</span></a>
              <button onClick={() => setContactOpen(true)}>与我联系 <span>↗</span></button>
            </div>
          </div>
          <div className="scroll-note"><span>SCROLL TO EXPLORE</span><i /></div>
        </section>

        <div className="content-field">
          <DotField
            dotRadius={1.5}
            dotSpacing={20}
            cursorRadius={460}
            bulgeStrength={58}
            glowRadius={230}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="rgba(102, 221, 255, 0.28)"
            gradientTo="rgba(135, 119, 255, 0.22)"
            glowColor="rgba(24, 78, 105, 0.72)"
          />
        <section className="about wrap" id="about">
          <div className="section-label"><span>01</span> PROFILE</div>
          <div className="about-grid">
            <div className="portrait">
              <img src="/profile.png" alt="李谨" width="209" height="278" loading="lazy" decoding="async" />
              <div className="portrait-tag"><span>AI PRODUCT</span><span>DATA ANALYSIS</span></div>
            </div>
            <div className="about-copy">
              <p className="eyebrow">ABOUT ME</p>
              <h2>从业务问题出发，<br />把复杂系统变成<span>清晰产品。</span></h2>
              <p className="intro">具备数据产品双赛道实战经验，全程参与 AI 媒介产品迭代。擅长挖掘业务痛点、联动产研推进需求落地，并通过原型、数据与标准化流程沉淀可复用的产品能力。</p>
              <div className="details">
                <div><small>目标岗位</small><strong>AI 产品经理 / 产品助理</strong></div>
                <div><small>所在地</small><strong>杭州</strong></div>
                <div><small>邮箱</small><strong>18079299867@163.com</strong></div>
                <div><small>电话</small><strong>18079299867</strong></div>
                <div><small>教育</small><strong>大数据工程技术 · 本科</strong></div>
              </div>
            </div>
          </div>
          <div className="metrics">{metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </section>

        <section className="experience wrap" id="experience">
          <div className="section-label"><span>02</span> EXPERIENCE</div>
          <div className="section-head"><h2>个人经历</h2><p>连接产品、AI 与数据，把一线业务问题沉淀为可交付的系统能力。</p></div>
          <div className="experience-cards">
            <BorderGlow className="experience-card" animated glowColor="190 95 70" backgroundColor="#0d1117" borderRadius={22} glowRadius={34} coneSpread={22}>
              <div className="experience-row">
                <div className="experience-date"><span>WORK / 01</span>2025.11 — 2026.07</div>
                <div className="experience-main">
                  <div><h3>杭州灵感时代数字科技有限公司</h3><p>产品数据分析师 / 产品助理</p></div>
                  <ul>
                    <li>从零参与搭建媒介一体化数据管理系统，统一数据口径与双层校验机制，实现周/月度报表和底层数据 100% 交付。</li>
                    <li>参与 AI 媒介助手全流程测试与需求调研，输出 20+ 功能优化需求和缺陷反馈，推动工具上线投产。</li>
                  </ul>
                </div>
              </div>
            </BorderGlow>
            <BorderGlow className="experience-card" glowColor="258 90 72" backgroundColor="#0d1117" borderRadius={22} glowRadius={34} coneSpread={22}>
              <div className="experience-row education-row">
                <div className="experience-date"><span>EDU / 02</span>2022.09 — 2026.07</div>
                <div className="experience-main">
                  <div><h3>南昌职业大学</h3><p>大数据工程技术 · 本科 · 团支部书记</p></div>
                  <ul><li>学习数据分析、机器学习、分布式计算、数据开发、Web 前端及 Java 等相关课程。</li></ul>
                </div>
              </div>
            </BorderGlow>
          </div>
        </section>

        <section className="projects wrap" id="projects">
          <div className="section-label"><span>03</span> SELECTED WORK</div>
          <div className="section-head"><h2>精选项目</h2><p>从业务痛点、产品设计到数据验证的完整实践。</p></div>
          <article className="project-card">
            <ProjectVisual type="talent" />
            <div className="project-info">
              <div className="project-index">PROJECT / 01</div>
              <h3>达人智能筛选</h3>
              <p>将依赖媒介经验的主观筛选流程，重构为由粉丝画像解析、适配评分与行业提示词模板组成的 AI 标准化筛选系统。</p>
              <div className="project-result"><span>30%<small>人效提升</small></span><span>40%<small>通过率提升</small></span></div>
              <div className="project-tags"><span>AI 产品</span><span>需求分析</span><span>产品原型</span><span>AB 测试</span></div>
            </div>
          </article>
          <article className="project-card reverse">
            <ProjectVisual type="data" />
            <div className="project-info">
              <div className="project-index">PROJECT / 02</div>
              <h3>电商用户行为分析</h3>
              <p>清洗与整合超过 5 万条用户行为日志，构建用户标签体系，并以交互式看板呈现转化漏斗、行为路径与关键流失节点。</p>
              <div className="project-result"><span>50K+<small>行为日志</small></span><span>3<small>核心工具</small></span></div>
              <div className="project-tags"><span>Python</span><span>SQL</span><span>Tableau</span><span>数据建模</span></div>
            </div>
          </article>
        </section>

        <section className="strengths wrap" id="strengths">
          <div className="section-label"><span>04</span> CAPABILITIES</div>
          <div className="section-head"><h2>个人优势</h2><p>不是工具清单，而是完成产品工作的组合能力。</p></div>
          <div className="strength-grid">
            {strengths.map((item) => (
              <article key={item.code}>
                <span className="strength-code">{item.code}</span>
                <h3>{item.title}</h3><p>{item.text}</p>
                <div>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </section>
        </div>

        <section className="contact" id="contact">
          <div className="contact-orbit"><i /><i /><i /></div>
          <div className="contact-content">
            <p>LET'S BUILD SOMETHING MEANINGFUL</p>
            <h2>期待与你一起，<br />让好想法<span>真正发生。</span></h2>
            <div className="contact-links">
              <a href="mailto:18079299867@163.com">18079299867@163.com <b>↗</b></a>
              <a href="tel:18079299867">18079299867 <b>↗</b></a>
            </div>
            <div><span>HANGZHOU · CHINA</span><span>AI PRODUCT / DATA STRATEGY</span><span>© 2026 LI JIN</span></div>
          </div>
        </section>
      </main>
      <AiAssistant />
      <ContactChooser open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
