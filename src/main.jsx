import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, BriefcaseBusiness, Check, Code2, GraduationCap, Layers, Menu, PenTool, TrendingUp, X } from 'lucide-react'
import '@fontsource/space-grotesk/latin-400.css'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-600.css'
import '@fontsource/space-grotesk/latin-700.css'
import { siteData as d } from './content'
import './styles.css'

const icons = { TrendingUp, Layers, PenTool }
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

function SectionTitle({ title, subtitle }) {
  return <div className="section-header"><h2>{title}</h2><p>{subtitle}</p></div>
}

async function saveResume() {
  const { resumeUrl, resumeFileName } = d.qualification
  return saveFile(resumeUrl, resumeFileName)
}

async function saveFile(fileUrl, fileName) {

  // Chromium 系浏览器支持弹出系统“另存为”，由用户选择保存路径。
  // 注意：showSaveFilePicker 必须在用户激活（点击）的瞬时窗口内调用，
  // 因此先弹窗拿到文件句柄，再去 fetch 文件内容写入，避免 await 让出栈导致激活过期。
  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: 'PDF 文档', accept: { 'application/pdf': ['.pdf'] } }],
      })
      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error('文件读取失败')
      const writable = await fileHandle.createWritable()
      if (response.body) await response.body.pipeTo(writable)
      else { await writable.write(await response.blob()); await writable.close() }
      return
    } catch (error) {
      // 用户主动取消保存时不触发第二次下载。
      if (error?.name === 'AbortError') return
    }
  }

  // Safari、Firefox 等浏览器使用标准下载，由浏览器下载设置决定保存位置。
  const link = document.createElement('a')
  link.href = fileUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function App() {
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [slide, setSlide] = useState(0)
  const [contactNotice, setContactNotice] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    const timer = setInterval(() => setSlide(v => (v + 1) % d.testimonials.length), 6500)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  const contactMe = async (event) => {
    event.preventDefault()
    try { await navigator.clipboard.writeText(d.contact.email) } catch { /* 保留 mailto 回退 */ }
    setContactNotice(true)
    window.setTimeout(() => setContactNotice(false), 3000)
    window.location.href = `mailto:${d.contact.email}`
  }

  return <>
    <header className={`header ${scrolled ? 'header-scroll' : ''}`}>
      <div className="container nav">
        <button className="brand" onClick={() => go('home')}><Code2/> {d.brand}</button>
        <nav className={menu ? 'nav-menu open' : 'nav-menu'}>
          <ul>{d.nav.map(([label, id]) => <li key={id}><button onClick={() => { go(id); setMenu(false) }}>{label}</button></li>)}</ul>
        </nav>
        <button className="nav-toggle" onClick={() => setMenu(!menu)} aria-label="切换菜单">{menu ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <main>
      <section id="home" className="hero section">
        <div className="container hero-grid reveal">
          <div className="hero-content">
            <h1>
              <span className="hero-line">{d.hero.greeting}<b>{d.hero.name}</b>，</span>
              <span className="hero-line">{d.hero.role}。</span>
            </h1>
            <p className="hero-desc">{d.hero.description}</p>
            <div className="hero-stats">{d.hero.stats.map(([num, label]) => <div key={label}><strong>{num}</strong><span>{label}</span></div>)}</div>
          </div>
          <div className="hero-image-wrap"><div className="hero-accent"/><img src={d.hero.image} alt={d.hero.imageAlt}/></div>
        </div>
      </section>

      <section id="about" className="section alt-section">
        <div className="container"><SectionTitle title="关于我" subtitle="我是谁"/>
          <div className="about-grid">
            <div className="about-copy"><h3>{d.about.title}</h3><p>{d.about.description}</p><a href="#qualification" className="btn primary">{d.about.button}</a></div>
            <div className="skills"><h3>{d.about.skillsTitle}</h3><div className="skill-grid">{d.about.skills.map(s => <article key={s.title}><h4>{s.title}</h4><ul>{s.items.map(i => <li key={i}><Check size={15}/>{i}</li>)}</ul></article>)}</div></div>
          </div>
        </div>
      </section>

      <section id="qualification" className="section">
        <div className="container"><SectionTitle title="个人经历" subtitle="工作与教育"/>
          <div className="qualification-grid">
            <Timeline icon={<BriefcaseBusiness/>} title="职业经历" items={d.qualification.experience}/>
            <Timeline icon={<GraduationCap/>} title="教育经历" items={d.qualification.education}/>
          </div>
          <div className="resume-row"><h3>查看我的完整简历</h3><button className="btn primary resume-download" type="button" onClick={saveResume}>个人简历</button></div>
        </div>
      </section>

      <section id="services" className="section alt-section">
        <div className="container"><SectionTitle title="个人能力" subtitle="我能做什么"/>
          <div className="services-grid">{d.services.map(service => { const Icon = icons[service.icon]; return <article key={service.title}><Icon/><h3>{service.title}</h3><ol className="service-points">{service.points.map(point => <li key={point}>{point}</li>)}</ol></article> })}</div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container"><SectionTitle title="精选项目" subtitle="近期工作"/>
          <div className="projects-grid">{d.projects.map(p => <article key={p.title}><img src={p.image} alt={p.title}/><h3>{p.title}</h3><p>{p.description}</p><a href={p.url} onClick={p.detail ? (event) => { event.preventDefault(); setSelectedProject(p) } : p.download ? (event) => { event.preventDefault(); saveFile(p.download.url, p.download.fileName) } : undefined}>{p.download?.label || '查看项目'} <ArrowRight size={16}/></a></article>)}</div>
        </div>
      </section>

      <section className="section alt-section testimonials">
        <div className="container"><SectionTitle title="合作评价" subtitle="每一段经历都带给了我巨大的成长，由衷的感谢它们"/>
          <div className="testimonial-window"><div className="testimonial-track" style={{transform:`translateX(-${slide * 100}%)`}}>{d.testimonials.map(t => <article key={t.name}><img src={t.avatar} alt={t.name}/><p>“{t.quote}”</p><h3>{t.name}</h3><span>{t.role}</span></article>)}</div></div>
          <div className="dots">{d.testimonials.map((_, i) => <button aria-label={`切换到评价 ${i+1}`} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} key={i}/>)}</div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container contact-row"><div><h2>{d.contact.title}</h2><p>{d.contact.description}</p></div><a className="btn primary" href={`mailto:${d.contact.email}`} onClick={contactMe}>联系我</a></div>
      </section>
    </main>

    <div className={`contact-notice ${contactNotice ? 'show' : ''}`} role="status">邮箱已复制：{d.contact.email}</div>
    {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)}/>} 

    <footer><div className="container footer-grid"><div><h3>GitHub</h3><div className="socials">{d.contact.socials.map(([n,u]) => <a className="footer-link" style={{fontSize:'inherit'}} href={u} target="_blank" rel="noreferrer" key={n}>{n}</a>)}</div></div><div><h3>发送邮件</h3><a className="footer-link" href={`mailto:${d.contact.email}`}>{d.contact.email}</a></div><div><h3>联系电话</h3><a className="footer-link" href={`tel:${d.contact.phone}`}>{d.contact.phone}</a></div></div><p className="copyright">© 2026 {d.brand}. All Rights Reserved</p></footer>
  </>
}

function Timeline({ icon, title, items }) {
  return <div className="timeline"><h3>{icon}{title}</h3>{items.map(item => <article key={item.title}>
    <h4>{item.title}</h4>
    <p>{item.description}</p>
    {item.note && <p className="timeline-note">{item.note}</p>}
    {item.date && <span>{item.date}</span>}
  </article>)}</div>
}

function ProjectDetail({ project, onClose }) {
  const detail = project.detail
  if (detail.layout === 'system') return <SystemProjectDetail project={project} onClose={onClose}/>
  return <div className="project-modal" role="dialog" aria-modal="true" aria-label={`${project.title}项目详情`}>
    <header className="project-modal-nav"><span>PROJECT / {project.title}</span><button type="button" onClick={onClose}><X size={20}/> 关闭</button></header>
    <div className="project-detail container">
      <section className="project-detail-hero"><p className="detail-eyebrow">{detail.eyebrow}</p><h2>{project.title}</h2><p className="detail-summary">{detail.summary}</p><div className="detail-meta">{detail.meta.map(([label,value]) => <div key={label}><span>{label}</span><strong>{Array.isArray(value) ? value.map(line => <span className="meta-line" key={line}>{line}</span>) : value}</strong></div>)}</div></section>
      <section className="detail-timeline"><div className="timeline-intro"><span>PROJECT PROCESS</span><h3>项目过程</h3><p>自上而下浏览完整项目推进过程</p></div>
        {detail.stages.map(stage => <article className={`detail-stage ${stage.imageSide ? 'with-side-image' : ''}`} key={stage.no}><div className="stage-marker"><span>{stage.no}</span></div><div className="stage-content"><p className="stage-tag">{stage.tag}</p><h3>{stage.title}</h3><p>{stage.text}</p>{stage.metrics && <div className="stage-metrics">{stage.metrics.map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>}</div>{(stage.image || stage.mediaSlots) && <div className="stage-media">{stage.image && <figure><img src={stage.image} alt={stage.title}/><figcaption>{stage.imageCaption}</figcaption></figure>}{stage.extraImages?.map(item => <figure key={item.image}><img src={item.image} alt={item.caption}/><figcaption>{item.caption}</figcaption></figure>)}{stage.mediaSlots?.map((slot,index) => <figure key={slot.image || slot.label}>{slot.image ? <img src={slot.image} alt={slot.label || `项目图片 ${index + 1}`}/> : <div className="media-placeholder"><span>IMAGE {String(index + 1).padStart(2, '0')}</span><strong>{slot.label}</strong></div>}{slot.label && <figcaption>{slot.label}</figcaption>}</figure>)}</div>}</article>)}
      </section>
      <div className="detail-end"><p>END OF PROJECT</p><h3>感谢浏览</h3><button className="btn primary" onClick={onClose}>返回作品集</button></div>
    </div>
  </div>
}

function SystemProjectDetail({ project, onClose }) {
  const detail = project.detail
  const flowGroups = [
    { label: 'INPUT', title: '理解问题', items: detail.flow.slice(0, 2) },
    { label: 'CONTEXT', title: '组织知识', items: detail.flow.slice(2, 4) },
    { label: 'ANSWER', title: 'SQL 闭环', items: detail.flow.slice(4) },
  ]
  return <div className="project-modal system-project" role="dialog" aria-modal="true" aria-label={`${project.title}项目详情`}>
    <header className="project-modal-nav"><span>PROJECT / {project.title}</span><button type="button" onClick={onClose}><X size={20}/> 关闭</button></header>
    <div className="project-detail container">
      <section className="project-detail-hero system-hero"><p className="detail-eyebrow">{detail.eyebrow}</p><h2>{project.title}</h2><p className="detail-summary">{detail.summary}</p><div className="detail-meta">{detail.meta.map(([label,value]) => <div key={label}><span>{label}</span><strong>{value?.links ? <span className="meta-links">{value.links.map(link => <a className="meta-link" href={link.url} target="_blank" rel="noreferrer" key={link.url}>{link.text} <ArrowRight size={15}/></a>)}</span> : value?.url ? <a className="meta-link" href={value.url} target="_blank" rel="noreferrer">{value.text} <ArrowRight size={15}/></a> : value}</strong></div>)}</div></section>
      <section className="system-problem"><div><p className="system-index">01 / PROBLEM</p><h3>{detail.problem.title}</h3></div><div><p>{detail.problem.text}</p><blockquote>{detail.insight}</blockquote></div></section>
      <section className="system-flow"><div className="system-section-head"><p>02 / SYSTEM LOGIC</p><h3>一条可控的问数链路</h3></div><div className="flow-groups">{flowGroups.map((group,index) => <article key={group.title}><div className="flow-group-head"><span>{group.label}</span><h4>{group.title}</h4></div><div className="flow-steps">{group.items.map(item => <div className="flow-step" key={item.title}><i/><div><strong>{item.title}</strong><p>{item.description}</p></div></div>)}</div>{index < flowGroups.length - 1 && <div className="flow-connector"><ArrowRight/></div>}</article>)}</div></section>
      <section className="system-foundation"><div className="system-section-head"><p>03 / KNOWLEDGE BASE</p><h3>五类能力，各自解决一个问题</h3></div><div className="foundation-grid">{detail.foundations.map(([name,text]) => <article key={name}><h4>{name}</h4><p>{text}</p></article>)}</div></section>
      <figure className="system-preview"><img src={detail.image} alt={detail.imageCaption}/><figcaption>{detail.imageCaption}</figcaption></figure>
      <section className="system-decisions"><div className="system-section-head"><p>04 / MY THINKING</p><h3>我对项目的四个关键理解</h3></div><div>{detail.decisions.map(([no,title,text]) => <article key={no}><span>{no}</span><h4>{title}</h4><p>{text}</p></article>)}</div></section>
      <section className="system-reflection"><p>05 / REFLECTION</p><h3>从“调用模型”到“设计系统”</h3><p>{detail.reflection}</p></section>
      <div className="detail-end"><p>END OF PROJECT</p><h3>感谢浏览</h3><button className="btn primary" onClick={onClose}>返回作品集</button></div>
    </div>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
