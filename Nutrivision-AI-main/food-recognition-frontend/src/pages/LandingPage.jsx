import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, ArrowRight, Upload, Zap, Camera, Brain,
  UtensilsCrossed, Activity, Shield, Star,
  TrendingUp, CheckCircle, Sparkles,
} from 'lucide-react';

/* ─── Inject global styles once ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --g: #10b981;
    --g2: #34d399;
    --glow: rgba(16,185,129,.15);
    --bg: #0b0f14;
    --bg2: #111923;
    --bg3: #161e2b;
    --card: rgba(255,255,255,.04);
    --cb: rgba(255,255,255,.08);
    --gcb: rgba(16,185,129,.18);
    --muted: #7a8a9e;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .nv { background: var(--bg); color: #e8edf3; font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; }
  .nv h1, .nv h2, .nv h3 { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fu { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scanline { 0%{top:0%;opacity:1} 85%{opacity:.5} 100%{top:100%;opacity:0} }
  @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes pulse  { 0%,100%{box-shadow:0 0 0 0 var(--glow)} 60%{box-shadow:0 0 0 14px transparent} }
  @keyframes dash   { to{stroke-dashoffset:-60} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.25} }
  @keyframes gshift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  .fu  { opacity:0; animation: fu .55s ease forwards; }
  .fu1 { animation-delay:.1s; }
  .fu2 { animation-delay:.2s; }
  .fu3 { animation-delay:.3s; }
  .fu4 { animation-delay:.45s; }

  .gt {
    background: linear-gradient(135deg,var(--g2),var(--g),#047857);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gshift 4s ease infinite;
  }

  .badge {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 13px; border-radius:50px;
    border:1px solid var(--gcb); background:rgba(16,185,129,.07);
    font-size:.7rem; font-weight:700; letter-spacing:.1em;
    text-transform:uppercase; color:var(--g);
  }

  .gc {
    background:var(--card); border:1px solid var(--cb);
    border-radius:20px; backdrop-filter:blur(14px);
    transition:border-color .25s, transform .25s, box-shadow .25s;
  }
  .gc:hover {
    border-color:var(--gcb);
    transform:translateY(-3px);
    box-shadow:0 18px 50px rgba(0,0,0,.35), 0 0 0 1px var(--gcb);
  }
  .gcg { background:rgba(16,185,129,.06); border:1px solid var(--gcb); border-radius:20px; }

  .btn-p {
    background:linear-gradient(135deg,var(--g),#059669);
    border:none; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700;
    font-size:.9rem; padding:13px 28px; border-radius:50px; cursor:pointer;
    display:inline-flex; align-items:center; gap:8px;
    animation:pulse 2.4s cubic-bezier(.4,0,.6,1) infinite;
    transition:filter .2s, transform .15s;
    text-decoration:none;
  }
  .btn-p:hover { filter:brightness(1.1); transform:scale(1.03); }

  .btn-o {
    background:transparent; border:1px solid var(--cb);
    color:#e8edf3; font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
    font-size:.9rem; padding:13px 28px; border-radius:50px; cursor:pointer;
    display:inline-flex; align-items:center; gap:8px;
    transition:border-color .2s, background .2s; text-decoration:none;
  }
  .btn-o:hover { border-color:var(--g); background:var(--glow); }

  .nav-link { color:var(--muted); text-decoration:none; font-size:.88rem; font-weight:500; transition:color .2s; }
  .nav-link:hover { color:#e8edf3; }

  .scan-wrap { position:relative; overflow:hidden; }
  .scanline {
    position:absolute; left:0; right:0; height:3px;
    background:linear-gradient(90deg,transparent,var(--g),transparent);
    animation:scanline 2.2s ease-in-out infinite; pointer-events:none;
  }

  .fw  { animation:float 3.5s ease-in-out infinite; }
  .fw2 { animation:float2 4.2s ease-in-out infinite .8s; }

  .dot-live { width:8px; height:8px; background:var(--g); border-radius:50%; animation:blink 1.4s ease-in-out infinite; }

  .sn {
    font-family:'Plus Jakarta Sans',sans-serif; font-size:2.2rem; font-weight:800;
    background:linear-gradient(135deg,#fff,var(--g2));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }

  .fdash  { stroke-dasharray:8 5; animation:dash 1.2s linear infinite; }
  .fdash2 { stroke-dasharray:8 5; animation:dash 1.2s linear infinite .4s; }

  .dv { height:1px; background:linear-gradient(90deg,transparent,var(--cb),transparent); max-width:600px; margin:0 auto; }

  .sib {
    width:38px; height:38px; border-radius:10px;
    background:rgba(16,185,129,.08); border:1px solid var(--gcb);
    display:flex; align-items:center; justify-content:center; color:var(--g); flex-shrink:0;
  }
  .snum {
    width:34px; height:34px; border-radius:50%;
    background:rgba(16,185,129,.08); border:1px solid var(--gcb);
    display:flex; align-items:center; justify-content:center;
    font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; font-size:.85rem; color:var(--g); flex-shrink:0;
  }

  .dropzone {
    min-height:240px; border-radius:16px;
    border:2px dashed rgba(16,185,129,.25);
    display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:14px; padding:36px; cursor:pointer;
    transition:border-color .2s;
  }
  .dropzone:hover { border-color:rgba(16,185,129,.55); }

  .blob1 {
    position:fixed; top:-20vh; left:10vw;
    width:60vw; height:60vw; border-radius:50%;
    background:radial-gradient(circle,rgba(16,185,129,.06) 0%,transparent 65%);
    pointer-events:none; z-index:0;
  }
  .blob2 {
    position:fixed; bottom:5vh; right:-5vw;
    width:45vw; height:45vw; border-radius:50%;
    background:radial-gradient(circle,rgba(4,120,87,.05) 0%,transparent 65%);
    pointer-events:none; z-index:0;
  }

  .hero-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:56px; align-items:center; }
  .step-grid  { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:18px; }
  .stat-grid  { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:14px; }
  .cta-row    { display:flex; gap:12px; flex-wrap:wrap; }
  .trust-row  { display:flex; align-items:center; gap:18px; flex-wrap:wrap; margin-top:30px; }
  .macro-bar  { height:6px; border-radius:3px; background:rgba(255,255,255,.07); margin-top:4px; }
  .macro-fill { height:100%; border-radius:3px; }
`;

function useStyleInject() {
  useEffect(() => {
    if (document.getElementById('nv-css')) return;
    const s = document.createElement('style');
    s.id = 'nv-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }, []);
}

function FlowDiagram() {
  return (
    <svg width="100%" viewBox="0 0 680 200" role="img" style={{ overflow: 'visible' }}>
      <title>NutriVision data flow diagram</title>
      <defs>
        <marker id="nva" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* Node 1 */}
      <rect x="20" y="50" width="160" height="100" rx="14" fill="rgba(16,185,129,.07)" stroke="rgba(16,185,129,.35)" strokeWidth="1" />
      <circle cx="100" cy="85" r="20" fill="rgba(16,185,129,.12)" stroke="rgba(16,185,129,.4)" strokeWidth="1" />
      <path d="M100 78v14M94 83l6-6 6 6" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="93" y="93" width="14" height="2.5" rx="1.2" fill="rgba(16,185,129,.6)" />
      <text x="100" y="122" textAnchor="middle" fill="#10b981" fontSize="13" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">Upload</text>
      <text x="100" y="138" textAnchor="middle" fill="#7a8a9e" fontSize="11" fontFamily="'Plus Jakarta Sans',sans-serif">Photo or file</text>

      <line x1="182" y1="100" x2="230" y2="100" stroke="#10b981" strokeWidth="1.5" className="fdash" markerEnd="url(#nva)" />
      <text x="206" y="93" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="'Plus Jakarta Sans',sans-serif" letterSpacing=".07em" opacity=".8">BASE64</text>

      {/* Node 2 */}
      <rect x="236" y="34" width="208" height="132" rx="16" fill="rgba(16,185,129,.1)" stroke="rgba(16,185,129,.55)" strokeWidth="1.5" />
      <circle cx="340" cy="82" r="24" fill="rgba(16,185,129,.08)" stroke="rgba(16,185,129,.25)" strokeWidth="1" />
      <circle cx="340" cy="82" r="16" fill="rgba(16,185,129,.14)" stroke="rgba(16,185,129,.45)" strokeWidth="1" />
      <path d="M334 79q0-5 6-5t6 5q3 0 3 4t-3 4h-12q-3 0-3-4t3-4z" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="340" y1="74" x2="340" y2="70" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="334" y1="87" x2="332" y2="91" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="346" y1="87" x2="348" y2="91" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" />
      <text x="340" y="116" textAnchor="middle" fill="rgba(255,255,255,.95)" fontSize="13" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">AI Analysis</text>
      <text x="340" y="131" textAnchor="middle" fill="#7a8a9e" fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif">/api/v1/predict</text>
      <text x="340" y="147" textAnchor="middle" fill="#7a8a9e" fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif">Vision + NLP model</text>

      <line x1="446" y1="100" x2="494" y2="100" stroke="#10b981" strokeWidth="1.5" className="fdash2" markerEnd="url(#nva)" />
      <text x="470" y="93" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="'Plus Jakarta Sans',sans-serif" letterSpacing=".07em" opacity=".8">JSON</text>

      {/* Node 3 */}
      <rect x="500" y="50" width="160" height="100" rx="14" fill="rgba(16,185,129,.07)" stroke="rgba(16,185,129,.35)" strokeWidth="1" />
      <circle cx="580" cy="85" r="20" fill="rgba(16,185,129,.12)" stroke="rgba(16,185,129,.4)" strokeWidth="1" />
      <rect x="570" y="82" width="4" height="8" rx="1.2" fill="#10b981" opacity=".9" />
      <rect x="576" y="77" width="4" height="13" rx="1.2" fill="#10b981" />
      <rect x="582" y="80" width="4" height="10" rx="1.2" fill="#10b981" opacity=".75" />
      <line x1="567" y1="91" x2="589" y2="91" stroke="#10b981" strokeWidth="1" strokeLinecap="round" opacity=".5" />
      <text x="580" y="122" textAnchor="middle" fill="#10b981" fontSize="12" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700">Insights</text>
      <text x="580" y="138" textAnchor="middle" fill="#7a8a9e" fontSize="11" fontFamily="'Plus Jakarta Sans',sans-serif">Macros &amp; recipes</text>

      <rect x="236" y="178" width="208" height="4" rx="2" fill="rgba(16,185,129,.1)" />
      <rect x="236" y="178" width="203" height="4" rx="2" fill="rgba(16,185,129,.55)" />
      <text x="340" y="196" textAnchor="middle" fill="#7a8a9e" fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif">Model accuracy 97%</text>
    </svg>
  );
}

function NutritionPreview() {
  const macros = [
    { label: 'Protein', val: 42, max: 60, color: '#10b981' },
    { label: 'Carbs', val: 38, max: 60, color: '#60a5fa' },
    { label: 'Fat', val: 18, max: 60, color: '#fbbf24' },
  ];
  return (
    <div className="gcg" style={{ padding: 24, maxWidth: 320, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '.95rem' }}>Grilled Salmon Bowl</span>
        <span style={{ background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 50, padding: '3px 9px', fontSize: '.7rem', fontWeight: 700, color: '#10b981' }}>97%</span>
      </div>
      <div style={{ textAlign: 'center', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,.08)', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 14 }}>
        <div className="sn" style={{ fontSize: '2.6rem' }}>487</div>
        <div style={{ fontSize: '.75rem', color: '#7a8a9e' }}>kcal per serving</div>
      </div>
      {macros.map(({ label, val, max, color }) => (
        <div key={label} style={{ marginBottom: 9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.77rem', marginBottom: 4 }}>
            <span style={{ color: '#7a8a9e' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{val}g</span>
          </div>
          <div className="macro-bar">
            <div className="macro-fill" style={{ width: `${(val / max) * 100}%`, background: color, opacity: .85 }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: 10, borderRadius: 10, border: '1px dashed rgba(16,185,129,.25)', textAlign: 'center', fontSize: '.75rem', color: '#7a8a9e' }}>
        {'<NutritionCard /> mounts here'}
      </div>
    </div>
  );
}

export default function LandingPage() {
  useStyleInject();

  return (
    <div className="nv">
      <div className="blob1" aria-hidden />
      <div className="blob2" aria-hidden />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* NAV */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', maxWidth: 1200, margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#10b981,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.1rem' }}>NutriVision</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="dot-live" />
            <span style={{ fontSize: '.77rem', color: '#7a8a9e' }}>Model online</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/signup" className="btn-p" style={{ padding: '10px 20px', fontSize: '.83rem' }}>
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 40px 56px' }}>
          <div className="hero-grid">
            <div>
              <div className="badge fu" style={{ marginBottom: 26 }}><Zap size={11} /> AI-Powered Food Intelligence</div>
              <h1 className="fu fu1" style={{ fontSize: 'clamp(2.2rem,5vw,3.4rem)', fontWeight: 800, lineHeight: 1.09, letterSpacing: '-.03em', marginBottom: 22 }}>
                Turn Any Meal Into <span className="gt">Smart Nutrition</span> Data
              </h1>
              <p className="fu fu2" style={{ fontSize: '1rem', color: '#7a8a9e', lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                Snap a photo of any meal and instantly get recipe predictions, calorie counts, macro breakdowns, and personalized health recommendations — powered by computer vision.
              </p>
              <div className="cta-row fu fu3">
                <Link to="/signup" className="btn-p">
                  <Camera size={17} /> Get Started Free <ArrowRight size={15} />
                </Link>
                <Link to="/login" className="btn-o">Log In</Link>
              </div>
              <div className="trust-row fu fu4">
                {[[CheckCircle, 'No credit card required'], [Shield, 'Data stays private'], [Zap, '< 2s response time']].map(([Icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.79rem', color: '#7a8a9e' }}>
                    <Icon size={13} color="#10b981" /> {text}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="scan-wrap" style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 40px 90px rgba(0,0,0,.5)' }}>
                <div className="scanline" />
                <img
                  src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=800"
                  alt="Healthy bowl"
                  style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 22 }}
                />
                {[
                  { top: 12, left: 12, borderTop: '2px solid #10b981', borderLeft: '2px solid #10b981', borderRadius: '4px 0 0 0' },
                  { top: 12, right: 12, borderTop: '2px solid #10b981', borderRight: '2px solid #10b981', borderRadius: '0 4px 0 0' },
                  { bottom: 12, left: 12, borderBottom: '2px solid #10b981', borderLeft: '2px solid #10b981', borderRadius: '0 0 0 4px' },
                  { bottom: 12, right: 12, borderBottom: '2px solid #10b981', borderRight: '2px solid #10b981', borderRadius: '0 0 4px 0' },
                ].map((s, i) => <div key={i} aria-hidden style={{ position: 'absolute', width: 18, height: 18, ...s }} />)}
              </div>
              <div className="fw" style={{ position: 'absolute', top: 18, right: -14, background: 'rgba(11,15,20,.9)', border: '1px solid rgba(16,185,129,.18)', borderRadius: 14, padding: '11px 15px', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><Zap size={16} /></div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '.88rem' }}>97% Match</div>
                  <div style={{ fontSize: '.72rem', color: '#7a8a9e' }}>Grilled Salmon</div>
                </div>
              </div>
              <div className="fw2" style={{ position: 'absolute', bottom: 22, left: -14, background: 'rgba(11,15,20,.9)', border: '1px solid rgba(16,185,129,.18)', borderRadius: 14, padding: '11px 15px', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><Activity size={16} /></div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '.88rem' }}>487 kcal</div>
                  <div style={{ fontSize: '.72rem', color: '#7a8a9e' }}>42g protein</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 60px' }}>
          <div className="stat-grid">
            {[[UtensilsCrossed, '500K+', 'Meals analysed'], [TrendingUp, '97%', 'Model accuracy'], [Zap, '< 2s', 'Analysis time'], [Star, '12K+', 'Active users']].map(([Icon, num, label]) => (
              <div key={label} className="gc" style={{ padding: '22px 20px', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.18)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#10b981' }}>
                  <Icon size={18} />
                </div>
                <div className="sn">{num}</div>
                <div style={{ fontSize: '.78rem', color: '#7a8a9e', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dv" />

        {/* HOW IT WORKS */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 14 }}><Brain size={11} /> The Process</div>
            <h2 style={{ fontSize: 'clamp(1.7rem,3.5vw,2.5rem)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 12 }}>
              From Plate to <span className="gt">Insight</span> in Seconds
            </h2>
            <p style={{ color: '#7a8a9e', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
              Advanced computer vision meets nutritional science — here's exactly how your image becomes actionable health data.
            </p>
          </div>
          <div className="gc" style={{ padding: '32px 24px', marginBottom: 32 }}>
            <FlowDiagram />
          </div>
          <div className="step-grid">
            {[
              { n: '01', Icon: Camera, title: 'Snap or Upload', body: 'Take a photo or upload a file. JPG, PNG, and HEIF supported. Your image is base64-encoded and sent directly to the Vision API.' },
              { n: '02', Icon: Brain, title: 'AI Analysis', body: 'The model identifies ingredients, estimates portions, and calculates nutritional values via /api/v1/predict in under 2 seconds.' },
              { n: '03', Icon: Activity, title: 'Nutritional Insights', body: 'Receive calorie counts, full macro breakdowns, glycaemic estimates, and personalised recipe suggestions tailored to your goals.' },
            ].map(({ n, Icon, title, body }) => (
              <div key={n} className="gc" style={{ padding: '28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div className="snum">{n}</div>
                  <div className="sib"><Icon size={17} /></div>
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.05rem', fontWeight: 700, marginBottom: 9 }}>{title}</h3>
                <p style={{ fontSize: '.88rem', color: '#7a8a9e', lineHeight: 1.65 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="dv" />

        {/* NUTRITION CARD */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 40px' }}>
          <div className="hero-grid">
            <div>
              <div className="badge" style={{ marginBottom: 18 }}><Sparkles size={11} /> Nutrition Card</div>
              <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 14 }}>
                Rich Nutritional <span className="gt">Breakdowns</span>
              </h2>
              <p style={{ color: '#7a8a9e', lineHeight: 1.7, marginBottom: 24, maxWidth: 420 }}>
                Every scan produces a detailed NutritionCard with calories, all three macros, fibre, key micronutrients, and a health score — visualised so you understand your meal at a glance.
              </p>
              {['Calories & macronutrients (P / C / F)', 'Glycaemic index estimate', 'Recipe reconstruction suggestions', 'Saved to your history (signed-in users)'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9, fontSize: '.86rem', color: '#7a8a9e' }}>
                  <CheckCircle size={14} color="#10b981" /> {item}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <NutritionPreview />
            </div>
          </div>
        </section>

        <div className="dv" />

        {/* FOOTER CTA */}
        <section style={{ textAlign: 'center', padding: '56px 40px 72px', borderTop: '1px solid rgba(255,255,255,.04)' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.6rem,3.5vw,2.3rem)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 14 }}>
            Ready to <span className="gt">eat smarter?</span>
          </h2>
          <p style={{ color: '#7a8a9e', maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.65 }}>
            Join thousands of users turning every meal into personalised nutrition insights.
          </p>
          <Link to="/signup" className="btn-p" style={{ fontSize: '1rem', padding: '14px 34px' }}>
            Start Free Today <ArrowRight size={17} />
          </Link>
          <p style={{ marginTop: 18, fontSize: '.76rem', color: '#7a8a9e' }}>
            No credit card required · Free forever plan available
          </p>
        </section>

      </div>
    </div>
  );
}