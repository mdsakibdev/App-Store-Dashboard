"use client";

import { useMemo, useState } from "react";
import { FiChevronDown, FiPackage, FiPlus, FiRotateCcw, FiSave, FiTrash2 } from "react-icons/fi";

type Product={name:string;model:string;price:number;stock:number};
type Item=Product & {quantity:number;total:number};

const products:Product[]=[
 {name:"iPhone 16 Pro Max",model:"A3296",price:145000,stock:4},
 {name:"Samsung Galaxy S25 Ultra",model:"SM-S938B",price:132000,stock:6},
 {name:"Google Pixel 10 Pro",model:"G5J7N",price:118000,stock:3},
 {name:"OnePlus 13",model:"CPH2653",price:89000,stock:8},
];
const clients=["Walk-in Customer","Rahim Ahmed","Karim Hossain","Nusrat Jahan"];
const showrooms=["Phone Store (53, New Market)","Main Showroom","Uttara Showroom"];
const input="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function SaleReturnForm(){
 const [date,setDate]=useState(new Date().toISOString().slice(0,10));
 const [showroom,setShowroom]=useState(showrooms[0]),[client,setClient]=useState("");
 const [invoice,setInvoice]=useState(""),[product,setProduct]=useState(""),[reason,setReason]=useState("");
 const [items,setItems]=useState<Item[]>([]),[saved,setSaved]=useState(false);
 const selected=products.find(p=>p.name===product);
 const qty=useMemo(()=>items.reduce((s,x)=>s+x.quantity,0),[items]);
 const total=useMemo(()=>items.reduce((s,x)=>s+x.total,0),[items]);

 function add(){if(!selected)return;setItems(cur=>{const old=cur.find(x=>x.model===selected.model);if(old)return cur.map(x=>x.model===selected.model?{...x,quantity:Math.min(x.quantity+1,x.stock),total:Math.min(x.quantity+1,x.stock)*x.price}:x);return[...cur,{...selected,quantity:1,total:selected.price}]});setProduct("")}
 function update(model:string,value:number){setItems(cur=>cur.map(x=>x.model===model?{...x,quantity:Math.max(1,Math.min(value||1,x.stock)),total:Math.max(1,Math.min(value||1,x.stock))*x.price}:x))}
 function reset(){setDate(new Date().toISOString().slice(0,10));setShowroom(showrooms[0]);setClient("");setInvoice("");setProduct("");setReason("");setItems([]);setSaved(false)}
 function save(){if(!client||!items.length)return;const record={id:crypto.randomUUID(),date,showroom,client,invoice,reason,items,totalQuantity:qty,totalAmount:total};const old=JSON.parse(localStorage.getItem("phone-store-sale-returns")||"[]");localStorage.setItem("phone-store-sale-returns",JSON.stringify([record,...old]));setSaved(true)}

 return <section className="w-full space-y-5">
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
   <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5"><h1 className="text-lg font-bold text-slate-800">Add Sale Return</h1><p className="mt-1 text-xs text-slate-500">Return sold products to stock with a clear return record.</p></div>
   <div className="p-4 sm:p-5">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
     <input aria-label="Return date" type="date" value={date} onChange={e=>setDate(e.target.value)} className={input}/>
     <Select label="Showroom" value={showroom} set={setShowroom} placeholder="-- Select Showroom --" options={showrooms}/>
     <Select label="Client" value={client} set={setClient} placeholder="-- Select Client --" options={clients}/>
     <input aria-label="Invoice number" value={invoice} onChange={e=>setInvoice(e.target.value)} placeholder="Invoice / Voucher No." className={input}/>
    </div>

    <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:flex-row">
     <div className="relative min-w-0 flex-1"><select aria-label="Select product" value={product} onChange={e=>setProduct(e.target.value)} className={input+" appearance-none pr-9"}><option value="">Select Product to Return</option>{products.map(p=><option key={p.model}>{p.name}</option>)}</select><FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></div>
     <button type="button" onClick={add} disabled={!selected} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-content disabled:opacity-50"><FiPlus/>Add Product</button>
    </div>

    <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
     <table className="min-w-[850px] w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr>{["SL","Product Name","Model","Sale Price","Return Qty","Total","Action"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-slate-100">{!items.length?<tr><td colSpan={7} className="px-4 py-12 text-center"><FiPackage className="mx-auto h-6 w-6 text-slate-400"/><p className="mt-2 font-semibold text-slate-700">No product added</p><p className="text-xs text-slate-500">Select a sold product above and add it to the return.</p></td></tr>:items.map((x,i)=><tr key={x.model}>
       <td className="px-4 py-3 text-slate-500">{i+1}</td><td className="px-4 py-3 font-medium text-slate-800">{x.name}</td><td className="px-4 py-3">{x.model}</td><td className="px-4 py-3">{x.price.toLocaleString()}</td>
       <td className="px-4 py-3"><input type="number" min={1} max={x.stock} value={x.quantity} onChange={e=>update(x.model,Number(e.target.value))} className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-center text-gray-800"/></td>
       <td className="px-4 py-3 font-semibold">{x.total.toLocaleString()}</td><td className="px-4 py-3 text-center"><button type="button" onClick={()=>setItems(cur=>cur.filter(i=>i.model!==x.model))} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600"><FiTrash2/></button></td>
      </tr>)}</tbody>
     </table>
    </div>

    <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
     <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">Return Reason</label><textarea value={reason} onChange={e=>setReason(e.target.value)} rows={4} placeholder="Enter return reason..." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary"/></div>
     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="space-y-3"><Row label="Total Quantity" value={qty.toLocaleString()}/><Row label="Total Amount" value={total.toLocaleString()}/><div className="border-t pt-3 flex justify-between"><b className="text-slate-800">Return Total</b><b className="text-xl text-slate-900">{total.toLocaleString()}</b></div></div></div>
    </div>

    {saved&&<div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Sale return saved successfully.</div>}
    <div className="mt-5 flex flex-col-reverse justify-end gap-2 border-t pt-5 sm:flex-row">
     <button type="button" onClick={reset} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-gray-800"><FiRotateCcw/>Reset</button>
     <button type="button" onClick={save} disabled={!client||!items.length} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-content disabled:opacity-50"><FiSave/>Save Return</button>
    </div>
   </div>
  </div>
 </section>
}
function Select({label,value,set,placeholder,options}:{label:string;value:string;set:(v:string)=>void;placeholder:string;options:string[]}){return <label className="relative block"><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={e=>set(e.target.value)} className={input+" appearance-none pr-9"}><option value="">{placeholder}</option>{options.map(o=><option key={o}>{o}</option>)}</select><FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></label>}
function Row({label,value}:{label:string;value:string}){return <div className="flex justify-between gap-4"><span className="text-sm text-slate-600">{label}</span><span className="font-semibold text-slate-800">{value}</span></div>}
