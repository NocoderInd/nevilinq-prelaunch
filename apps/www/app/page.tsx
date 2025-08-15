'use client';

import React, { useState } from 'react';

export default function Page() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const LAUNCH_ISO = '2025-08-20T23:22:00+05:30';
  const formatted = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(new Date(LAUNCH_ISO)).replace(',', '') + ' IST';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (q.trim()) setOpen(true);
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <section style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
        <h1 style={{fontWeight:800,margin:0}}>NEVILINQ</h1>
        <form onSubmit={onSubmit} style={{display:'flex',gap:8}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search anything..."
                 style={{padding:'10px 14px',borderRadius:999,border:'1px solid #E6E9F1'}} />
          <button type="submit" style={{padding:'10px 16px',borderRadius:999,background:'#030027',color:'#fff',fontWeight:600}}>
            Search
          </button>
        </form>
      </section>

      {/* Modal */}
      {open && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)'}} onClick={()=>setOpen(false)}>
          <div style={{maxWidth:520,margin:'10vh auto',background:'#fff',borderRadius:24,padding:24}} onClick={e=>e.stopPropagation()}>
            <h2 style={{marginTop:0}}>We’re launching 🚀</h2>
            <p>Thanks for searching <b>{q}</b>.</p>
            <p><b>Launch date:</b> {formatted}</p>
            <button onClick={()=>setOpen(false)} style={{marginTop:8,padding:'8px 12px',border:'1px solid #e5e7eb',borderRadius:12}}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
