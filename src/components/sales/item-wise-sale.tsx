"use client";

import { useState } from "react";
import { FiCalendar, FiChevronDown, FiRotateCcw, FiSearch } from "react-icons/fi";

const products = [
  { name: "iPhone 16 Pro Max", model: "A3296" },
  { name: "Samsung Galaxy S25 Ultra", model: "SM-S938B" },
  { name: "Google Pixel 10 Pro", model: "G5J7N" },
  { name: "OnePlus 13", model: "CPH2653" },
];

const demoSales = [
  { id:"1",date:"2026-10-04",voucher:"SL-1001",client:"Walk-in Customer",product:"iPhone 16 Pro Max",model:"A3296",qty:1,price:145000,discount:2000,total:143000,type:"Retail Sale" },
  { id:"2",date:"2026-10-03",voucher:"SL-1002",client:"Rahim Ahmed",product:"Samsung Galaxy S25 Ultra",model:"SM-S938B",qty:1,price:132000,discount:1000,total:131000,type:"Credit Sale" },
  { id:"3",date:"2026-10-02",voucher:"SL-1003",client:"Karim Hossain",product:"OnePlus 13",model:"CPH2653",qty:2,price:89000,discount:3000,total:175000,type:"Retail Sale" },
];

const input = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function ItemWiseSale() {
  const [product,setProduct]=useState("");
  const [model,setModel]=useState("");
  const [voucher,setVoucher]=useState("");
  const [type,setType]=useState("");
  const [from,setFrom]=useState("");
  const [to,setTo]=useState("");
  const [searched,setSearched]=useState(false);

  const rows = searched ? demoSales.filter(x =>
    (!product || x.product===product) &&
    (!model || x.model===model) &&
    (!voucher || x.voucher.toLowerCase().includes(voucher.toLowerCase())) &&
    (!type || x.type===type) &&
    (!from || x.date>=from) && (!to || x.date<=to)
  ) : [];

  const qty=rows.reduce((s,x)=>s+x.qty,0);
  const discount=rows.reduce((s,x)=>s+x.discount,0);
  const total=rows.reduce((s,x)=>s+x.total,0);

  const reset=()=>{setProduct("");setModel("");setVoucher("");setType("");setFrom("");setTo("");setSearched(false)};

  return <section className="w-full space-y-5">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
        <h1 className="text-lg font-bold text-slate-800">Search Item Wise</h1>
        <p className="mt-1 text-xs text-slate-500">Search sales by product, model, voucher and date range.</p>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select label="Product" value={product} set={v=>{setProduct(v);setModel(products.find(p=>p.name===v)?.model||"")}} placeholder="-- Select Product --" options={products.map(p=>p.name)}/>
          <Select label="Product Model" value={model} set={setModel} placeholder="-- Select Product Model --" options={products.map(p=>p.model)}/>
          <input aria-label="Voucher No" value={voucher} onChange={e=>setVoucher(e.target.value)} placeholder="Voucher No" className={input}/>
          <Select label="Sale Type" value={type} set={setType} placeholder="-- Select Sale Type --" options={["Retail Sale","Credit Sale","Credit Chalan"]}/>
          <Date value={from} set={setFrom} label="From"/>
          <Date value={to} set={setTo} label="To"/>
          <div className="flex gap-2 md:col-span-2">
            <button onClick={()=>setSearched(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-content"><FiSearch/>Show</button>
            <button onClick={reset} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800"><FiRotateCcw/>Reset</button>
          </div>
        </div>
      </div>
    </div>

    {searched && <><div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card label="Total Quantity" value={qty.toLocaleString()}/>
      <Card label="Total Discount" value={discount.toLocaleString()}/>
      <Card label="Total Amount" value={total.toLocaleString()}/>
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4"><h2 className="font-bold text-slate-800">Item Wise Sale List</h2></div>
      <div className="overflow-x-auto"><table className="min-w-[1050px] w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr>{["SL","Date","Voucher No.","Customer","Product Name","Model","QTY","Sale Price","Discount","Total","Sale Type"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length===0 ? <tr><td colSpan={11} className="px-4 py-12 text-center text-slate-500">No sale found for the selected filters.</td></tr> :
          rows.map((r,i)=><tr key={r.id} className="hover:bg-slate-50/70">
            <td className="px-4 py-3 text-slate-500">{i+1}</td><td className="px-4 py-3">{r.date}</td><td className="px-4 py-3 font-semibold">{r.voucher}</td><td className="px-4 py-3">{r.client}</td><td className="px-4 py-3 font-medium">{r.product}</td><td className="px-4 py-3">{r.model}</td><td className="px-4 py-3">{r.qty}</td><td className="px-4 py-3">{r.price.toLocaleString()}</td><td className="px-4 py-3">{r.discount.toLocaleString()}</td><td className="px-4 py-3 font-semibold">{r.total.toLocaleString()}</td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{r.type}</span></td>
          </tr>)}
        </tbody>
        {rows.length>0 && <tfoot className="border-t bg-slate-50"><tr><td colSpan={6} className="px-4 py-3 text-right font-bold">Total</td><td className="px-4 py-3 font-bold">{qty}</td><td></td><td className="px-4 py-3 font-bold">{discount.toLocaleString()}</td><td className="px-4 py-3 font-bold">{total.toLocaleString()}</td><td></td></tr></tfoot>}
      </table></div>
    </div></>}
  </section>;
}

function Select({label,value,set,placeholder,options}:{label:string;value:string;set:(v:string)=>void;placeholder:string;options:string[]}) {
  return <label className="relative block"><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={e=>set(e.target.value)} className={input+" appearance-none pr-9"}><option value="">{placeholder}</option>{options.map(o=><option key={o}>{o}</option>)}</select><FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></label>;
}
function Date({label,value,set}:{label:string;value:string;set:(v:string)=>void}) {
  return <label className="relative block"><span className="sr-only">{label}</span><input aria-label={label} type="date" value={value} onChange={e=>set(e.target.value)} className={input}/><FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></label>;
}
function Card({label,value}:{label:string;value:string}) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-800">{value}</p></div>;
}
