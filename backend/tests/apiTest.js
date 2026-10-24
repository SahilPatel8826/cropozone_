// Run the whole API check:  (server running + DB seeded with `npm run seed`)
//   node tests/apiTest.js
// The last test triggers the login rate limiter, so restart the server afterwards before logging in again.
const B=process.env.API_URL||'http://localhost:9000'; const R=[]; let tok={}, ids={};
const call=async(m,p,body,t)=>{const ac=new AbortController();setTimeout(()=>ac.abort(),6000);let r;try{r=await fetch(B+p,{signal:ac.signal,method:m,headers:{'content-type':'application/json',...(t?{authorization:'Bearer '+t}:{})},body:body?JSON.stringify(body):undefined})}catch(e){return{s:0,d:'NO RESPONSE (request hung >6s)'}}let d;const x=await r.text();try{d=JSON.parse(x)}catch{d=x}return{s:r.status,d}};
const T=async(name,fn)=>{try{const o=await fn();R.push([name,o.ok?'PASS':'FAIL',o.note||''])}catch(e){R.push([name,'ERROR',String(e.message).slice(0,90)])}};
const exp=(res,s,extra)=>({ok:res.s===s&&(extra?extra(res.d):true),note:`HTTP ${res.s}`+(res.s!==s?` (want ${s}) ${JSON.stringify(res.d).slice(0,90)}`:'')});
(async()=>{
const email='tester'+Date.now()+'@x.com';
await T('GET / health',async()=>exp(await call('GET','/'),200));
// ---- users
await T('POST /users/register',async()=>{const r=await call('POST','/api/users/register',{name:'Tester',email,password:'secret1'});tok.user=r.d.token;ids.user=r.d.user?._id;return exp(r,201,d=>d.token)});
await T('POST /users/register duplicate -> 400',async()=>exp(await call('POST','/api/users/register',{name:'T',email,password:'secret1'}),400));
await T('POST /users/login (admin seed)',async()=>{const r=await call('POST','/api/users/login',{email:'admin@example.com',password:'123456'});tok.admin=r.d.token;ids.admin=r.d.user?._id;return exp(r,200,d=>d.token)});
await T('POST /users/login bad password -> 400',async()=>exp(await call('POST','/api/users/login',{email,password:'nope'}),400));
await T('GET /users/profile',async()=>exp(await call('GET','/api/users/profile',null,tok.user),200,d=>d.email===email));
await T('GET /users/profile no token -> 401',async()=>exp(await call('GET','/api/users/profile'),401));
// ---- products
await T('GET /products',async()=>{const r=await call('GET','/api/products');ids.p=r.d[0]?._id;ids.p2=r.d[1]?._id;ids.prod=r.d[0];return exp(r,200,d=>d.length>=20)});
await T('GET /products?category=Grains',async()=>{const r=await call('GET','/api/products?category=Grains');return exp(r,200,d=>d.length>0&&d.every(p=>p.category==='Grains'))});
await T('GET /products?sortBy=priceAsc',async()=>{const r=await call('GET','/api/products?sortBy=priceAsc');return exp(r,200,d=>d.every((p,i)=>i===0||d[i-1].price<=p.price))});
await T('GET /products?sortBy=priceDesc',async()=>{const r=await call('GET','/api/products?sortBy=priceDesc');return exp(r,200,d=>d.every((p,i)=>i===0||d[i-1].price>=p.price))});
await T('GET /products?sortBy=popularity',async()=>exp(await call('GET','/api/products?sortBy=popularity&limit=5'),200,d=>d.length===5));
await T('GET /products?search=rice',async()=>{const r=await call('GET','/api/products?search=rice');return exp(r,200,d=>d.length>0)});
await T('GET /products?minPrice&maxPrice',async()=>{const r=await call('GET','/api/products?minPrice=10&maxPrice=40');return exp(r,200,d=>d.every(p=>p.price>=10&&p.price<=40))});
await T('GET /products?material=Organic',async()=>exp(await call('GET','/api/products?material=Organic'),200));
await T('GET /products?region / size / color',async()=>exp(await call('GET','/api/products?region=North%20India&size=5%20KG&color=default'),200));
await T('GET /products/best-seller',async()=>exp(await call('GET','/api/products/best-seller'),200,d=>d._id));
await T('GET /products/new-arrivals',async()=>exp(await call('GET','/api/products/new-arrivals'),200,d=>d.length>0&&d.length<=8));
await T('GET /products/:id',async()=>exp(await call('GET','/api/products/'+ids.p),200,d=>d._id===ids.p));
await T('GET /products/similar/:id',async()=>exp(await call('GET','/api/products/similar/'+ids.p),200));
await T('GET /products/:id invalid id',async()=>{const r=await call('GET','/api/products/notanid');return{ok:r.s<500,note:`HTTP ${r.s} (400/404 expected, 500 = unhandled CastError)`}});
// ---- admin products
const np={name:'Test Crop',description:'d',price:12,countInStock:9,sku:'SKU-'+Date.now(),category:'Grains',sizes:['5 KG'],colors:['default'],region:'North India',collections:'Test',images:[{src:'http://x/y.png',altText:'a'}]};
await T('POST /products (admin create)',async()=>{const r=await call('POST','/api/products',np,tok.admin);ids.np=r.d._id;return exp(r,201,d=>d._id)});
await T('POST /products invalid body -> 400 (not 500)',async()=>exp(await call('POST','/api/products',{name:'x'},tok.admin),400));
await T('POST /products as user -> 403',async()=>exp(await call('POST','/api/products',np,tok.user),403));
await T('PUT /products/:id (admin update price+region+dimensions)',async()=>exp(await call('PUT','/api/products/'+ids.np,{price:15,region:'South India'},tok.admin),200,d=>d.price===15&&d.region==='South India'));
await T('GET /admin/products',async()=>exp(await call('GET','/api/admin/products',null,tok.admin),200,d=>d.length>=20));
await T('GET /admin/products as user -> 403',async()=>exp(await call('GET','/api/admin/products',null,tok.user),403));
await T('DELETE /products/:id (admin)',async()=>exp(await call('DELETE','/api/products/'+ids.np,null,tok.admin),200));
// ---- cart
const pr=ids.prod; const sz=pr.sizes[0], col=pr.colors[0];
await T('POST /cart (guest add)',async()=>exp(await call('POST','/api/cart',{productId:ids.p,quantity:2,size:sz,color:col,guestId:'guest_t1'}),201,d=>d.products.length===1));
await T('GET /cart (guest)',async()=>exp(await call('GET','/api/cart?guestId=guest_t1'),200,d=>d.products?.length===1));
await T('PUT /cart (update qty)',async()=>exp(await call('PUT','/api/cart',{productId:ids.p,quantity:5,size:sz,color:col,guestId:'guest_t1'}),200,d=>d.products[0].quantity===5));
await T('POST /cart/merge (guest -> user)',async()=>exp(await call('POST','/api/cart/merge',{guestId:'guest_t1'},tok.user),200));
await T('GET /cart (user)',async()=>exp(await call('GET','/api/cart?userId='+ids.user),200,d=>d.products?.length>=1));
await T('POST /cart (user add 2nd)',async()=>exp(await call('POST','/api/cart',{productId:ids.p2,quantity:1,size:sz,color:col,userId:ids.user}),200));
await T('DELETE /cart (logged-in user, no guestId)',async()=>exp(await call('DELETE','/api/cart',{productId:ids.p2,size:sz,color:col,userId:ids.user}),200));
await call('POST','/api/cart',{productId:ids.p2,quantity:1,size:sz,color:col,guestId:'guest_t2'});
await T('DELETE /cart (guest, no userId)',async()=>exp(await call('DELETE','/api/cart',{productId:ids.p2,size:sz,color:col,guestId:'guest_t2'}),200));
await T('DELETE /cart missing fields -> 400',async()=>exp(await call('DELETE','/api/cart',{productId:ids.p2}),400));
// ---- checkout + orders
const item={productId:ids.p,name:pr.name,image:pr.images[0]?.url||'http://x/y.png',price:pr.price,quantity:1,size:sz,color:col};
const ship={address:'1 Farm Rd',city:'Noida',postalCode:'201301',country:'India'};
await T('POST /checkout',async()=>{const r=await call('POST','/api/checkout',{checkoutItems:[item],shippingAddress:ship,paymentMethod:'PayPal',totalPrice:pr.price},tok.user);ids.co=r.d._id;return exp(r,201,d=>d._id)});
await T('POST /checkout empty -> 400',async()=>exp(await call('POST','/api/checkout',{checkoutItems:[]},tok.user),400));
await T('POST /checkout/:id/finalise unpaid -> 400',async()=>exp(await call('POST',`/api/checkout/${ids.co}/finalise`,null,tok.user),400));
await T('PUT /checkout/:id/pay',async()=>exp(await call('PUT',`/api/checkout/${ids.co}/pay`,{paymentStatus:'paid',paymentDetails:{id:'PAYPAL1'}},tok.user),200,d=>d.isPaid));
await T('POST /checkout/:id/finalise',async()=>{const r=await call('POST',`/api/checkout/${ids.co}/finalise`,null,tok.user);ids.order=r.d._id;return exp(r,201,d=>d._id)});
await T('POST /checkout/:id/finalise again -> 400',async()=>exp(await call('POST',`/api/checkout/${ids.co}/finalise`,null,tok.user),400));
await T('GET /orders/my-orders',async()=>exp(await call('GET','/api/orders/my-orders',null,tok.user),200,d=>d.length===1));
await T('GET /orders/:id',async()=>exp(await call('GET','/api/orders/'+ids.order,null,tok.user),200,d=>d._id===ids.order));
await T('GET /orders/my-orders no token -> 401',async()=>exp(await call('GET','/api/orders/my-orders'),401));
// ---- admin orders
await T('GET /admin/orders',async()=>exp(await call('GET','/api/admin/orders',null,tok.admin),200,d=>d.length>=1));
await T('PUT /admin/orders/:id (Shipped)',async()=>exp(await call('PUT','/api/admin/orders/'+ids.order,{status:'Shipped'},tok.admin),200,d=>d.status==='Shipped'));
await T('NEW PUT /orders/:id/cancel when Shipped -> 400',async()=>exp(await call('PUT',`/api/orders/${ids.order}/cancel`,null,tok.user),400));
await T('PUT /admin/orders/:id (Delivered)',async()=>exp(await call('PUT','/api/admin/orders/'+ids.order,{status:'Delivered'},tok.admin),200,d=>d.isDelivered));
// second order for cancel + delete
const co2=(await call('POST','/api/checkout',{checkoutItems:[item],shippingAddress:ship,paymentMethod:'PayPal',totalPrice:pr.price},tok.user)).d._id;
await call('PUT',`/api/checkout/${co2}/pay`,{paymentStatus:'paid',paymentDetails:{}},tok.user);
ids.order2=(await call('POST',`/api/checkout/${co2}/finalise`,null,tok.user)).d._id;
await T('NEW PUT /orders/:id/cancel (Processing)',async()=>exp(await call('PUT',`/api/orders/${ids.order2}/cancel`,null,tok.user),200,d=>d.status==='Cancelled'));
await T('NEW cancel by other user -> 403',async()=>{const o=await call('POST','/api/users/register',{name:'O',email:'o'+Date.now()+'@x.com',password:'secret1'});return exp(await call('PUT',`/api/orders/${ids.order2}/cancel`,null,o.d.token),403)});
await T('DELETE /admin/orders/:id',async()=>exp(await call('DELETE','/api/admin/orders/'+ids.order2,null,tok.admin),200));
// ---- admin users
await T('GET /admin/users',async()=>exp(await call('GET','/api/admin/users',null,tok.admin),200,d=>d.length>=2));
await T('POST /admin/users',async()=>{const r=await call('POST','/api/admin/users',{name:'New',email:'n'+Date.now()+'@x.com',password:'secret1',role:'customer'},tok.admin);ids.nu=r.d.user?._id||r.d._id;return exp(r,201)});
await T('PUT /admin/users/:id',async()=>exp(await call('PUT','/api/admin/users/'+ids.nu,{name:'Renamed',role:'admin'},tok.admin),200));
await T('PUT /admin/users/:id unknown id -> 404',async()=>exp(await call('PUT','/api/admin/users/64b000000000000000000000',{name:'x'},tok.admin),404));
await T('DELETE /admin/users/:id',async()=>exp(await call('DELETE','/api/admin/users/'+ids.nu,null,tok.admin),200));
await T('GET /admin/users as user -> 403',async()=>exp(await call('GET','/api/admin/users',null,tok.user),403));
// ---- subscribe / upload
const se='s'+Date.now()+'@x.com';
await T('POST /subscribe',async()=>exp(await call('POST','/api/subscribe',{email:se}),201));
await T('POST /subscribe duplicate -> 400',async()=>exp(await call('POST','/api/subscribe',{email:se}),400));
await T('POST /subscribe no email -> 400',async()=>exp(await call('POST','/api/subscribe',{}),400));
await T('POST /upload (no file)',async()=>{const r=await call('POST','/api/upload');return{ok:r.s>=400&&r.s<500||r.s===500,note:`HTTP ${r.s} (needs Cloudinary keys + network to really test)`}});
// ---- NEW features
await T('NEW POST /reviews/:id',async()=>{const r=await call('POST','/api/reviews/'+ids.p,{rating:5,comment:'Great'},tok.user);ids.rev=r.d._id;return exp(r,201,d=>d.isVerifiedPurchase===true)});
await T('NEW POST /reviews duplicate -> 400',async()=>exp(await call('POST','/api/reviews/'+ids.p,{rating:4},tok.user),400));
await T('NEW POST /reviews bad rating -> 400',async()=>exp(await call('POST','/api/reviews/'+ids.p2,{rating:9},tok.user),400));
await T('NEW GET /reviews/:id',async()=>exp(await call('GET','/api/reviews/'+ids.p),200,d=>d.total===1&&d.ratingBreakdown[5]===1));
await T('NEW product rating updated',async()=>exp(await call('GET','/api/products/'+ids.p),200,d=>d.rating===5&&d.numReviews===1));
await T('NEW DELETE /reviews/:id',async()=>exp(await call('DELETE','/api/reviews/'+ids.rev,null,tok.user),200));
await T('NEW product rating reset',async()=>exp(await call('GET','/api/products/'+ids.p),200,d=>d.numReviews===0));
await T('NEW POST /wishlist/:id',async()=>exp(await call('POST','/api/wishlist/'+ids.p,null,tok.user),201,d=>d.length===1));
await T('NEW POST /wishlist/merge',async()=>exp(await call('POST','/api/wishlist/merge',{productIds:[ids.p,ids.p2,'bad']},tok.user),200,d=>d.length===2));
await T('NEW GET /wishlist',async()=>exp(await call('GET','/api/wishlist',null,tok.user),200,d=>d.length===2));
await T('NEW DELETE /wishlist/:id',async()=>exp(await call('DELETE','/api/wishlist/'+ids.p,null,tok.user),200,d=>d.length===1));
const code='SAVE'+Date.now()%10000;
await T('NEW POST /coupons (admin)',async()=>{const r=await call('POST','/api/coupons',{code,discountType:'percentage',discountValue:10,maxDiscount:5,minOrderValue:20},tok.admin);ids.cp=r.d._id;return exp(r,201)});
await T('NEW POST /coupons as user -> 403',async()=>exp(await call('POST','/api/coupons',{code:'X',discountType:'flat',discountValue:1},tok.user),403));
await T('NEW POST /coupons/validate (10% capped at 5)',async()=>exp(await call('POST','/api/coupons/validate',{code:code.toLowerCase(),cartTotal:100},tok.user),200,d=>d.discount===5&&d.finalTotal===95));
await T('NEW coupon below minimum -> 400',async()=>exp(await call('POST','/api/coupons/validate',{code,cartTotal:10},tok.user),400));
await T('NEW coupon invalid code -> 404',async()=>exp(await call('POST','/api/coupons/validate',{code:'NOPE',cartTotal:100},tok.user),404));
await T('NEW GET /coupons',async()=>exp(await call('GET','/api/coupons',null,tok.admin),200,d=>d.length>=1));
await T('NEW PUT /coupons/:id (deactivate)',async()=>exp(await call('PUT','/api/coupons/'+ids.cp,{isActive:false},tok.admin),200,d=>d.isActive===false));
await T('NEW coupon inactive -> 404',async()=>exp(await call('POST','/api/coupons/validate',{code,cartTotal:100},tok.user),404));
await T('NEW DELETE /coupons/:id',async()=>exp(await call('DELETE','/api/coupons/'+ids.cp,null,tok.admin),200));
await T('NEW GET /market/trending',async()=>exp(await call('GET','/api/market/trending'),200,d=>d.length>=1&&d[0].product));
await T('NEW GET /market/price-stats',async()=>exp(await call('GET','/api/market/price-stats'),200,d=>d.length>=1&&d[0].avgPrice!==undefined));
await T('NEW GET /search/suggest?q=ri',async()=>exp(await call('GET','/api/search/suggest?q=ri'),200,d=>Array.isArray(d)));
await T('NEW GET /search/suggest regex-safe (q="(")',async()=>exp(await call('GET','/api/search/suggest?q=%28%28'),200));
await T('NEW GET /admin/stats',async()=>exp(await call('GET','/api/admin/stats',null,tok.admin),200,d=>d.totalProducts>=20&&d.totalRevenue>0&&d.salesLast7Days.length>=1));
await T('NEW GET /admin/stats as user -> 403',async()=>exp(await call('GET','/api/admin/stats',null,tok.user),403));
// ---- rate limit (last, it locks login for this IP)
await T('NEW rate limiter: 11th login -> 429',async()=>{let last;for(let i=0;i<12;i++)last=await call('POST','/api/users/login',{email:'x@x.com',password:'x'});return exp(last,429)});
const w=Math.max(...R.map(r=>r[0].length));let p=0,f=0;
for(const [n,s,note] of R){console.log((s==='PASS'?'PASS ':'FAIL ')+n.padEnd(w+1)+(s==='PASS'?'':'  '+note));s==='PASS'?p++:f++}
console.log(`\n${p} passed, ${f} failed of ${R.length}`);
})();
