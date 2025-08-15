'use client';
import React, { useState } from 'react';

export default function Page() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  // IST launch: Aug 20, 2025 11:22 PM
  const LAUNCH_ISO = '2025-08-20T23:22:00+05:30';
  const formatted = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
  }).format(new Date(LAUNCH_ISO)).replace(',', '') + ' IST';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (q.trim()) setOpen(true);
  }

  return (
    <main style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <header style={{padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontWeight:800, color:'#030027'}}>NEVILINQ</div>
        <div style={{background:'#C16E70', color:'#fff', padding:'8px 12px', borderRadius:999, fontWeight:600}}>List here boss</div>
      </header>

      <section style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, textAlign:'center', padding:'16px'}}>
        <h1 style={{margin:0, fontWeight:800, color:'#030027'}}>Find businesses & communities that match your world</h1>
        <form onSubmit={onSubmit} style={{display:'flex', gap:8}}>
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Search anything…"
            style={{padding:'10px 14px', borderRadius:999, border:'1px solid #E6E9F1', minWidth:280}}
          />
          <button type="submit" style={{padding:'10px 16px', borderRadius:999, background:'#030027', color:'#fff', fontWeight:600}}>
            Search
          </button>
        </form>
      </section>

      <footer style={{textAlign:'center', padding:'12px', borderTop:'1px solid #E6E9F1', color:'#666'}}>
        © {new Date().getFullYear()} NEVILINQ • Privacy • Terms • Refunds
      </footer>

      {open && (
        <div onClick={()=>setOpen(false)} style={{position:'fixed', inset:0, background:'rgba(0,0,0,.4)'}}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:520, margin:'10vh auto', background:'#fff', borderRadius:24, padding:24}}>
            <h2 style={{marginTop:0}}>We’re launching 🚀</h2>
            <p>Thanks for searching <b>{q}</b>.</p>
            <p><b>Launch date:</b> {formatted}</p>
            <button onClick={()=>setOpen(false)} style={{marginTop:8, padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:12}}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
