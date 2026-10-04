"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiEye, FiFilter, FiRotateCcw, FiSearch, FiTrash2, FiX } from "react-icons/fi";

type ReturnRecord={id:string;date:string;showroom:string;client:string;invoice:string;reason:string;items:{name:string;model:string;price:number;quantity:number;total:number}[];totalQuantity:number;totalAmount:number};

const demo:ReturnRecord[]=[
{id:"demo-1",date:"2026-10-04",showroom:"Phone Store (53, New Market)",client:"Rahim Ahmed",invoice:"SL-1002",reason:"Display issue",items:[{name:"Samsung Galaxy S25 Ultra",model:"SM-S938B",price:132000,quantity:1,total:132000}],totalQuantity:1,totalAmount:132000},
{id:"demo-2",date:"2026-10-02",showroom:"Main Showroom",client:"Karim Hossain",invoice:"SL-1003",reason:"Customer changed model",items:[{name:"OnePlus 13",model:"CPH2653",price:89000,quantity:1,total:89000}],totalQuantity:1,totalAmount:89000},
];

const input="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function AllSaleReturn(){
 const [rows,setRows]=useState<ReturnRecord[]>(demo),[search,setSearch]=useState(""),[from,setFrom]=useState(""),[to,setTo]=useState(""),[client,setClient]=useState(""),[showFilters,setShowFilters]=useState(false),[selected,setSelected]=useState<ReturnRecord|null>(null);

 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("phone-store-sale-returns")||"[]");if(Array.isArray(saved)&&saved.length)setRows(saved)}catch{}},[]);

 const clients=[...new Set(rows.map(x=>x.client))];
 const filtered=useMemo(()=>rows.filter(x=>
  (!search||[x.invoice,x.client,x.reason].join(" ").toLowerCase().includes(search.toLowerCase()))&&
  (!client||x.client===client)&&(!from||x.date>=from)&&(!to||x.date<=to)
 ),[rows,search,client,from,to]);

 const totalQty=filtered.reduce((s,x)=>s+x.totalQuantity,0);
 const totalAmount=filtered.reduce((s,x)=>s+x.totalAmount,0);

 function reset(){setSearch("");setClient("");setFrom("");setTo("")}
 function remove(id:string){if(!confirm("Delete this sale return record?"))return;const next=rows.filter(x=>x.id!==id);setRows(next);try{localStorage.setItem("phone-store-sale-returns",JSON.stringify(next))}catch{}}

 return <section className="w-full space-y-5">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
   <div><h1 className="text-xl font-bold text-slate-800">All Sale Return</h1><p className="mt-1 text-sm text-slate-500">View, search and manage all returned sales.</p></div>
   <button onClick={()=>setShowFilters(v=>!v)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800"><FiFilter/>Filters</button>
  </div>

  {showFilters&&<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
   <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
    <div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="Search returns" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invoice, client..." className={input+" pl-9"}/></div>
    <select aria-label="Client" value={client} onChange={e=>setClient(e.target.value)} className={input}><option value="">All Clients</option>{clients.map(c=><option key={c}>{c}</option>)}</select>
    <div className="relative"><FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="From date" type="date" value={from} onChange={e=>setFrom(e.target.value)} className={input}/></div>
    <div className="relative"><FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="To date" type="date" value={to} onChange={e=>setTo(e.target.value)} className={input}/></div>
   </div>
   <button onClick={reset} className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800"><FiRotateCcw/>Reset</button>
  </div>}

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
   <Card label="Total Returns" value={filtered.length.toLocaleString()}/><Card label="Total Quantity" value={totalQty.toLocaleString()}/><Card label="Total Return Amount" value={totalAmount.toLocaleString()}/>
  </div>

  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
   <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5"><div><h2 className="font-bold text-slate-800">Sale Return List</h2><p className="mt-1 text-xs text-slate-500">{filtered.length} record{filtered.length===1?"":"s"} found</p></div></div>
   <div className="overflow-x-auto"><table className="min-w-[1050px] w-full text-left text-sm">
    <thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr>{["SL","Date","Return No.","Invoice","Client","Showroom","Qty","Return Amount","Reason","Action"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
    <tbody className="divide-y divide-slate-100">{filtered.length===0?<tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">No sale return found.</td></tr>:filtered.map((r,i)=><tr key={r.id} className="hover:bg-slate-50/70">
     <td className="px-4 py-3 text-slate-500">{i+1}</td><td className="px-4 py-3">{r.date}</td><td className="px-4 py-3 font-semibold">SR-{String(i+1).padStart(4,"0")}</td><td className="px-4 py-3">{r.invoice||"—"}</td><td className="px-4 py-3 font-medium">{r.client}</td><td className="px-4 py-3">{r.showroom}</td><td className="px-4 py-3">{r.totalQuantity}</td><td className="px-4 py-3 font-semibold">{r.totalAmount.toLocaleString()}</td><td className="max-w-[180px] truncate px-4 py-3 text-slate-600">{r.reason||"—"}</td>
     <td className="px-4 py-3"><div className="flex gap-2"><button onClick={()=>setSelected(r)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" aria-label="View return"><FiEye/></button><button onClick={()=>remove(r.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50" aria-label="Delete return"><FiTrash2/></button></div></td>
    </tr>)}</tbody>
    {filtered.length>0&&<tfoot className="border-t bg-slate-50"><tr><td colSpan={6} className="px-4 py-3 text-right font-bold">Total</td><td className="px-4 py-3 font-bold">{totalQty}</td><td className="px-4 py-3 font-bold">{totalAmount.toLocaleString()}</td><td colSpan={2}/></tr></tfoot>}
   </table></div>
  </div>

  {selected&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={()=>setSelected(null)}>
   <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e=>e.stopPropagation()}>
    <div className="flex items-center justify-between border-b px-5 py-4"><div><h3 className="font-bold text-slate-800">Sale Return Details</h3><p className="text-xs text-slate-500">{selected.date} · {selected.client}</p></div><button onClick={()=>setSelected(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-gray-800"><FiX/></button></div>
    <div className="max-h-[70vh] overflow-y-auto p-5"><div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4"><Info label="Invoice" value={selected.invoice||"—"}/><Info label="Client" value={selected.client}/><Info label="Quantity" value={String(selected.totalQuantity)}/><Info label="Amount" value={selected.totalAmount.toLocaleString()}/></div>
     <div className="mt-5 overflow-x-auto rounded-xl border"><table className="min-w-[600px] w-full text-sm"><thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left">Product</th><th className="px-4 py-3 text-left">Model</th><th className="px-4 py-3 text-left">Qty</th><th className="px-4 py-3 text-left">Total</th></tr></thead><tbody className="divide-y">{selected.items.map(x=><tr key={x.model}><td className="px-4 py-3">{x.name}</td><td className="px-4 py-3">{x.model}</td><td className="px-4 py-3">{x.quantity}</td><td className="px-4 py-3 font-semibold">{x.total.toLocaleString()}</td></tr>)}</tbody></table></div>
     <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm"><b className="text-slate-700">Reason:</b> <span className="text-slate-600">{selected.reason||"No reason provided."}</span></div>
    </div>
   </div>
  </div>}
 </section>
}
function Card({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-800">{value}</p></div>}
function Info({label,value}:{label:string;value:string}){return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-800">{value}</p></div>}
