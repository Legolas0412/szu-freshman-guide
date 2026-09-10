'use client';

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Clock3, Coffee, ExternalLink, Eye, Flag, Gamepad2, Heart, Home, Map, Maximize2, Search, ShieldCheck, TrainFront, UsersRound, Wifi, X } from 'lucide-react';
import { categories, campusMaps, type GuideItem } from './data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const iconMap = { Flag, Map, BookOpen, Wifi, TrainFront, Coffee, UsersRound, ShieldCheck, Gamepad2 };
const quickTags = ['报到', '宿舍', '校园地图', '选课', '校园网'];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [showVisitCount, setShowVisitCount] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);
  const [isClosingGuide, setIsClosingGuide] = useState(false);
  const [guideExit, setGuideExit] = useState({ x: 0, y: 0, scale: .18 });
  const [selectedMap, setSelectedMap] = useState<(typeof campusMaps)[number] | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const mainCategories = useMemo(() => categories.filter((category) => category.id !== 'side-quests'), []);
  const sideQuestCategory = useMemo(() => categories.find((category) => category.id === 'side-quests'), []);
  const allItems = useMemo(() => categories.flatMap((category) => category.items.map((item) => ({ ...item, category: category.title }))), []);
  const results = useMemo(() => {
    const key = query.trim().toLowerCase();
    return key ? allItems.filter((item) => [item.title, item.summary, item.category, ...item.tags].join(' ').toLowerCase().includes(key)) : [];
  }, [allItems, query]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const readIds = (key: string) => {
      try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
      } catch { return []; }
    };
    setFavorites(readIds('szu-guide-favorites'));
    setRecent(readIds('szu-guide-recent'));
  }, []);

  useEffect(() => {
    const value = document.getElementById('busuanzi_site_pv');
    if (!value) return;
    const applyStartingCount = () => {
      const raw = value.textContent?.trim() || '';
      if (!/^\d+$/.test(raw) || value.dataset.adjustedFor === raw) return;
      const adjusted = String(Number(raw) + 188);
      value.dataset.adjustedFor = adjusted;
      value.textContent = adjusted;
    };
    const observer = new MutationObserver(applyStartingCount);
    observer.observe(value, { childList: true, characterData: true, subtree: true });
    applyStartingCount();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-scroll-animation]'));
    let frame = 0;

    const updateVisibility = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const enterLine = viewportHeight * .9;
      const leaveLine = viewportHeight * .08;
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        element.classList.toggle('is-visible', rect.top < enterLine && rect.bottom > leaveLine);
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('touchmove', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('touchmove', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const storeIds = (key: string, ids: string[]) => {
    try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* The feature still works for this visit when storage is unavailable. */ }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
      storeIds('szu-guide-favorites', next);
      return next;
    });
  };

  const openGuide = (item: GuideItem, source?: HTMLElement) => {
    if (source) {
      const rect = source.getBoundingClientRect();
      setGuideExit({
        x: rect.left + rect.width / 2 - window.innerWidth / 2,
        y: rect.top + rect.height / 2 - window.innerHeight / 2,
        scale: Math.max(.12, Math.min(.28, rect.width / Math.min(760, window.innerWidth - 32))),
      });
    }
    setIsClosingGuide(false);
    setRecent((current) => {
      const next = [item.id, ...current.filter((id) => id !== item.id)].slice(0, 6);
      storeIds('szu-guide-recent', next);
      return next;
    });
    setSelectedGuide(item);
  };

  const closeGuide = () => {
    if (!selectedGuide || isClosingGuide) return;
    setIsClosingGuide(true);
    window.setTimeout(() => {
      setSelectedGuide(null);
      setIsClosingGuide(false);
    }, 330);
  };

  return (
    <main>
      <button className={`visit-counter${showVisitCount ? ' is-expanded' : ''}`} type="button" aria-label={showVisitCount ? '隐藏网站访问次数' : '显示网站访问次数'} aria-expanded={showVisitCount} onClick={() => setShowVisitCount((shown) => !shown)}>
        <Eye size={12} aria-hidden="true" />
        <span id="busuanzi_site_pv" className="visit-counter-value">—</span>
      </button>
      <header className="site-header">
        <div className="shell nav-shell">
          <button className="brand" onClick={() => scrollTo('home')} aria-label="返回首页">
            <span className="brand-mark" aria-hidden="true" />
            <span><strong>深圳大学</strong><small>SHENZHEN UNIVERSITY</small></span>
          </button>
          <nav aria-label="主导航">
            <button onClick={() => scrollTo('guides')}>新生攻略</button>
            <button onClick={() => scrollTo('campus-maps')}>校园地图</button>
            <button onClick={() => scrollTo('saved')}>收藏 <i>{favorites.length}</i></button>
          </nav>
          <span className="nav-note">2026 · COMMUNITY GUIDE</span>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="shell hero-shell">
          <div className="hero-copy">
            <p className="hero-overline" data-scroll-animation>写给每一位即将走进荔园的新同学</p>
            <h1 data-scroll-animation>从陌生，<br />到喜欢上这里。</h1>
            <p className="hero-lead" data-scroll-animation>一份简洁、可靠、持续更新的深圳大学新生指南。先从你现在最需要知道的事开始。</p>
            <div className="search-wrap" data-scroll-animation>
              <div className="search-box">
                <Search size={20} aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索报到、宿舍、选课…" aria-label="搜索新生攻略" />
                {query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={18} /></button>}
              </div>
              {query && <div className="search-results" aria-live="polite">
                <span>{results.length ? `找到 ${results.length} 项` : '暂时没有匹配内容'}</span>
                {results.slice(0, 6).map((item) => <button key={item.id} onClick={() => { openGuide(item); setQuery(''); }}><span><strong>{item.title}</strong><small>{item.category} · {item.summary}</small></span><ArrowRight size={16} /></button>)}
              </div>}
            </div>
            <div className="quick-tags" data-scroll-animation>{quickTags.map((tag) => <button key={tag} onClick={() => setQuery(tag)}>{tag}</button>)}</div>
          </div>

          <div className="hero-emblem" aria-label="深圳大学与校训">
            <div className="university-wordmark">
              <strong data-scroll-animation>SZU</strong>
              <span data-scroll-animation>深圳大学</span>
              <small data-scroll-animation>SHENZHEN UNIVERSITY</small>
            </div>
            <div className="motto-block" data-scroll-animation><span>校训</span><strong>自立 · 自律 · 自强</strong><small>INDEPENDENCE · SELF-DISCIPLINE · SELF-IMPROVEMENT</small></div>
          </div>
          <button className="scroll-cue" onClick={() => scrollTo('guides')}>开始探索 <ArrowDown size={17} /></button>
        </div>
      </section>

      <section className="guide-section shell" id="guides">
        <div className="section-heading" data-reveal><h2>大学生活，<br />从这八件事展开。</h2><p>依据深圳大学 2026 级入学须知与校内职能部门公开信息整理。打开任一主题即可查看步骤与官方来源。</p></div>
        <div className="guide-index">
          {mainCategories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            return <article key={category.id} id={category.title} className="guide-row" data-reveal>
              <div className="guide-title"><Icon size={22} strokeWidth={1.7} /><div><span>{category.english}</span><h3>{category.title}</h3></div></div>
              <p>{category.description}</p>
              <div className="topic-list">{category.items.map((item) => <div className="topic-entry" key={item.id}>
                <button className="topic-open" onClick={(event) => openGuide(item, event.currentTarget)}><span><strong>{item.title}</strong><small>{item.summary}</small></span><ArrowRight size={16} /></button>
                <button className={`favorite-button ${favorites.includes(item.id) ? 'is-saved' : ''}`} onClick={() => toggleFavorite(item.id)} aria-pressed={favorites.includes(item.id)} aria-label={`${favorites.includes(item.id) ? '取消收藏' : '收藏'}${item.title}`}>
                  {favorites.includes(item.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                </button>
              </div>)}</div>
            </article>;
          })}
        </div>
      </section>

      {sideQuestCategory && <section className="side-quest-section" id="side-quests">
        <div className="shell side-quest-shell">
          <div className="side-quest-heading" data-reveal>
            <div><span><Gamepad2 size={18} /> SIDE QUESTS</span><h2>新的可能</h2></div>
            <p>绩点是基础，大学也远不止绩点。选择一条感兴趣的支线，从科研、竞赛与长期发展中积累属于自己的能力和作品。</p>
          </div>
          <div className="side-quest-grid">
            {sideQuestCategory.items.map((item, index) => <article className="side-quest-card" data-reveal key={item.id}>
              <div className="side-quest-card-head"><span>{String(index + 1).padStart(2, '0')}</span><button className={`side-quest-favorite ${favorites.includes(item.id) ? 'is-saved' : ''}`} onClick={() => toggleFavorite(item.id)} aria-pressed={favorites.includes(item.id)} aria-label={`${favorites.includes(item.id) ? '取消收藏' : '收藏'}${item.title}`}>{favorites.includes(item.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></div>
              <button className="side-quest-open" onClick={(event) => openGuide(item, event.currentTarget)}>
                <div><h3>{item.title}</h3><p>{item.summary}</p></div>
                <div className="side-quest-card-foot"><span>{item.tags.slice(0, 3).join(' · ')}</span><ArrowRight size={18} /></div>
              </button>
            </article>)}
          </div>
        </div>
      </section>}

      <section className="saved-section" id="saved">
        <div className="shell">
          <div className="saved-heading" data-reveal><h2>留住重要的，<br />接着上次继续。</h2><p>收藏会保存在当前浏览器；打开过的攻略自动进入最近浏览，最多保留六项。</p></div>
          <div className="saved-grid">
            <SavedPanel title="我的收藏" icon={<Heart size={19} />} ids={favorites} items={allItems} empty="还没有收藏。点击攻略右侧的书签，把重要内容留在这里。" openGuide={openGuide} />
            <SavedPanel title="最近浏览" icon={<Clock3 size={19} />} ids={recent} items={allItems} empty="你打开过的攻略会自动记录在这里。" openGuide={openGuide} />
          </div>
        </div>
      </section>

      <section className="map-section" id="campus-maps">
        <div className="shell">
          <div className="map-heading" data-reveal><h2>两个校区，<br />先找到你的方向。</h2><p>官方平面地图已经标注教学楼、宿舍、食堂、校门、小巴站与公共服务设施。点击地图可查看高清原图。</p></div>
          <div className="map-grid">{campusMaps.map((campus) => <article className="campus-map" data-reveal key={campus.id}>
            <button type="button" onClick={() => setSelectedMap(campus)} className="map-image" aria-label={`查看${campus.title}高清地图`}><img src={campus.image} alt={`${campus.title}官方平面地图`} /><span><Maximize2 size={16} /> 查看高清地图</span></button>
            <div className="map-info"><div><span>{campus.address}</span><h3>{campus.title}</h3><p>{campus.detail}</p></div><ul>{campus.landmarks.map((place) => <li key={place}>{place}</li>)}</ul></div>
          </article>)}</div>
        </div>
      </section>

      <footer id="about">
        <div className="shell footer-grid">
          <div><span className="footer-mark" aria-hidden="true" /><strong>深圳大学新生攻略</strong><p>非官方学生社区项目 · 内容仅供参考</p></div>
          <blockquote>“自立，自律，自强。”<small>愿你在荔园，写下自己的答案。</small></blockquote>
          <div className="campuses"><span>粤海校区</span><p>深圳市南山区南海大道 3688 号</p><span>丽湖校区</span><p>深圳市南山区学苑大道 1066 号</p></div>
        </div>
        <div className="footer-bottom shell"><span>SZU FRESHMAN GUIDE</span><span>MADE FOR NEW BEGINNINGS</span></div>
      </footer>

      <Dialog open={Boolean(selectedGuide)} onOpenChange={(open) => !open && closeGuide()}>
        <DialogContent className={`guide-dialog ${isClosingGuide ? 'is-closing' : ''}`} style={{ '--exit-x': `${guideExit.x}px`, '--exit-y': `${guideExit.y}px`, '--exit-scale': guideExit.scale } as CSSProperties}>
          {selectedGuide && <>
            <DialogHeader className="guide-dialog-head">
              <DialogTitle>{selectedGuide.title}</DialogTitle>
              <DialogDescription>{selectedGuide.summary}</DialogDescription>
              <button className={`dialog-favorite ${favorites.includes(selectedGuide.id) ? 'is-saved' : ''}`} onClick={() => toggleFavorite(selectedGuide.id)} aria-pressed={favorites.includes(selectedGuide.id)}>
                {favorites.includes(selectedGuide.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}{favorites.includes(selectedGuide.id) ? '已收藏' : '收藏攻略'}
              </button>
            </DialogHeader>
            <div className="guide-detail">
              <ol>{selectedGuide.steps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, '0')}</b><p>{step}</p></li>)}</ol>
              {selectedGuide.note && !/(面向 2026 级普通本科新生|每学期的具体选课时间与规则会变化)/.test(selectedGuide.note) && <aside><strong>请注意</strong><p>{selectedGuide.note}</p></aside>}
              {selectedGuide.contact && <div className="contact-row"><span>咨询方式</span><strong>{selectedGuide.contact}</strong></div>}
              {selectedGuide.networkRequired && <div className="network-notice"><Wifi size={16} /><span><strong>校内入口</strong> 若无法打开，请连接校园网或学校提供的远程访问环境。</span></div>}
              {sideQuestCategory?.items.some((item) => item.id === selectedGuide.id)
                ? <div className="more-info"><p>想了解更多信息？点击下方按钮即可查看完整攻略与相关资源。</p><a href={selectedGuide.href} target="_blank" rel="noopener noreferrer" className="source-link"><span><strong>查看更多信息</strong><small>{selectedGuide.sourceLabel}</small></span><ExternalLink size={15} /></a></div>
                : <a href={selectedGuide.href} target="_blank" rel="noopener noreferrer" className="source-link source-link-compact">{selectedGuide.sourceLabel}<ExternalLink size={15} /></a>}
            </div>
          </>}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedMap)} onOpenChange={(open) => !open && setSelectedMap(null)}>
        <DialogContent className="map-dialog" showCloseButton={false}>
          {selectedMap && <>
            <DialogTitle className="sr-only">{selectedMap.title}高清地图</DialogTitle>
            <button type="button" className="map-back" onClick={() => setSelectedMap(null)}><ArrowLeft size={17} />返回攻略</button>
            <div className="map-dialog-image"><img src={selectedMap.image} alt={`${selectedMap.title}官方高清平面地图`} /></div>
          </>}
        </DialogContent>
      </Dialog>

      <nav className="mobile-nav" aria-label="移动端导航">
        <button onClick={() => scrollTo('home')}><Home size={18} />首页</button>
        <button onClick={() => scrollTo('guides')}><BookOpen size={18} />攻略</button>
        <button onClick={() => scrollTo('side-quests')}><Gamepad2 size={18} />副本</button>
        <button onClick={() => scrollTo('saved')}><Heart size={18} />收藏{favorites.length ? <i>{favorites.length}</i> : null}</button>
        <button onClick={() => scrollTo('campus-maps')}><Map size={18} />地图</button>
      </nav>
    </main>
  );
}

type SavedItem = GuideItem & { category: string };

function SavedPanel({ title, icon, ids, items, empty, openGuide }: { title: string; icon: ReactNode; ids: string[]; items: SavedItem[]; empty: string; openGuide: (item: GuideItem) => void }) {
  const visible = ids.map((id) => items.find((item) => item.id === id)).filter(Boolean) as SavedItem[];
  return <section className="saved-panel">
    <div className="saved-panel-head"><span>{icon}{title}</span><b>{String(visible.length).padStart(2, '0')}</b></div>
    {visible.length ? <div className="saved-items">{visible.map((item) => <button key={item.id} onClick={() => openGuide(item)}><span><strong>{item.title}</strong><small>{item.category} · {item.summary}</small></span><ArrowRight size={16} /></button>)}</div> : <div className="saved-empty"><Bookmark size={23} /><p>{empty}</p></div>}
  </section>;
}
