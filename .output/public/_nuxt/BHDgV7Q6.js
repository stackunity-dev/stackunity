import{e as Ve,u as Ne,m as C,J as Y,$ as G,ae as Re,bJ as Me,f as g,w as l,l as he,H as xe,o as i,b as a,d as u,i as m,K as S,h as x,z as U,a as o,j as J,g as _,B as P,C as Ue,V as W,c as f,F as N,r as M,t as v,q as Le,s as we,v as Ke,L as De,k as ke,n as qe}from"./DtsUMP2e.js";import{H as Pe}from"./DM3UtKzw.js";import{S as Qe}from"./CUa34QTp.js";import{u as He}from"./CPnhT7FR.js";import{V as je}from"./C5Ss7TXw.js";import{V as Oe}from"./BOX8XsnA.js";import{V as Be,a as Z}from"./C3uWg8kB.js";import{V as B,a as Q}from"./D8zy3xw9.js";import{V as Fe,a as ee}from"./BsiWO06u.js";import{V as H}from"./CyBAYIx4.js";import{V as L}from"./15sUQrlC.js";import{V as le,a as ae,c as te,b as $e}from"./CEFez-Ov.js";import{V as R}from"./Bhqwf9Hm.js";import{V as ne}from"./CNOxbMZu.js";import{V as ze}from"./K_STLUKo.js";import"./DuugJca3.js";const re={blog:{name:"Blog System",description:"A template for a basic blog with users, posts, categories, and comments",tables:[{name:"users",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"username",type:"VARCHAR(50)",nullable:!1,unique:!0},{name:"email",type:"VARCHAR(100)",nullable:!1,unique:!0},{name:"password",type:"VARCHAR(255)",nullable:!1},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"},{name:"updated_at",type:"TIMESTAMP",nullable:!0}],primaryKey:"id",indices:[{name:"idx_users_email",columns:["email"],unique:!0}]},{name:"categories",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"name",type:"VARCHAR(50)",nullable:!1},{name:"slug",type:"VARCHAR(50)",nullable:!1,unique:!0},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"}],primaryKey:"id"},{name:"posts",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"user_id",type:"INT",nullable:!1},{name:"category_id",type:"INT",nullable:!1},{name:"title",type:"VARCHAR(100)",nullable:!1},{name:"slug",type:"VARCHAR(100)",nullable:!1,unique:!0},{name:"content",type:"TEXT",nullable:!1},{name:"status",type:'ENUM("draft", "published")',nullable:!1,default:'"draft"'},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"},{name:"updated_at",type:"TIMESTAMP",nullable:!0}],primaryKey:"id",foreignKeys:[{columns:["user_id"],referenceTable:"users",referenceColumns:["id"],onDelete:"CASCADE"},{columns:["category_id"],referenceTable:"categories",referenceColumns:["id"],onDelete:"CASCADE"}],indices:[{name:"idx_posts_slug",columns:["slug"],unique:!0}]},{name:"comments",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"post_id",type:"INT",nullable:!1},{name:"user_id",type:"INT",nullable:!1},{name:"content",type:"TEXT",nullable:!1},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"}],primaryKey:"id",foreignKeys:[{columns:["post_id"],referenceTable:"posts",referenceColumns:["id"],onDelete:"CASCADE"},{columns:["user_id"],referenceTable:"users",referenceColumns:["id"],onDelete:"CASCADE"}]}]},ecommerce:{name:"E-commerce Store",description:"A template for an online store with products, categories, orders, and customers",tables:[{name:"customers",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"email",type:"VARCHAR(100)",nullable:!1,unique:!0},{name:"password",type:"VARCHAR(255)",nullable:!1},{name:"first_name",type:"VARCHAR(50)",nullable:!1},{name:"last_name",type:"VARCHAR(50)",nullable:!1},{name:"phone",type:"VARCHAR(20)",nullable:!0},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"}],primaryKey:"id"},{name:"categories",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"name",type:"VARCHAR(50)",nullable:!1},{name:"slug",type:"VARCHAR(50)",nullable:!1,unique:!0},{name:"parent_id",type:"INT",nullable:!0}],primaryKey:"id",foreignKeys:[{columns:["parent_id"],referenceTable:"categories",referenceColumns:["id"],onDelete:"SET NULL"}]},{name:"products",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"category_id",type:"INT",nullable:!1},{name:"name",type:"VARCHAR(100)",nullable:!1},{name:"slug",type:"VARCHAR(100)",nullable:!1,unique:!0},{name:"description",type:"TEXT",nullable:!0},{name:"price",type:"DECIMAL(10,2)",nullable:!1},{name:"stock",type:"INT",nullable:!1,default:"0"},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"},{name:"updated_at",type:"TIMESTAMP",nullable:!0}],primaryKey:"id",foreignKeys:[{columns:["category_id"],referenceTable:"categories",referenceColumns:["id"],onDelete:"CASCADE"}]},{name:"orders",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"customer_id",type:"INT",nullable:!1},{name:"status",type:'ENUM("pending", "processing", "shipped", "delivered", "cancelled")',nullable:!1,default:'"pending"'},{name:"total_amount",type:"DECIMAL(10,2)",nullable:!1},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"},{name:"updated_at",type:"TIMESTAMP",nullable:!0}],primaryKey:"id",foreignKeys:[{columns:["customer_id"],referenceTable:"customers",referenceColumns:["id"],onDelete:"CASCADE"}]},{name:"order_items",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"order_id",type:"INT",nullable:!1},{name:"product_id",type:"INT",nullable:!1},{name:"quantity",type:"INT",nullable:!1},{name:"price",type:"DECIMAL(10,2)",nullable:!1}],primaryKey:"id",foreignKeys:[{columns:["order_id"],referenceTable:"orders",referenceColumns:["id"],onDelete:"CASCADE"},{columns:["product_id"],referenceTable:"products",referenceColumns:["id"],onDelete:"CASCADE"}]}]},project_management:{name:"Project Management",description:"A template for managing projects, tasks, and team members",tables:[{name:"users",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"username",type:"VARCHAR(50)",nullable:!1,unique:!0},{name:"email",type:"VARCHAR(100)",nullable:!1,unique:!0},{name:"password",type:"VARCHAR(255)",nullable:!1},{name:"name",type:"VARCHAR(100)",nullable:!1},{name:"role",type:'ENUM("admin", "manager", "member")',nullable:!1,default:'"member"'},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"}],primaryKey:"id"},{name:"projects",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"name",type:"VARCHAR(100)",nullable:!1},{name:"description",type:"TEXT",nullable:!0},{name:"start_date",type:"DATE",nullable:!1},{name:"end_date",type:"DATE",nullable:!0},{name:"status",type:'ENUM("planning", "active", "completed", "on_hold")',nullable:!1,default:'"planning"'},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"},{name:"updated_at",type:"TIMESTAMP",nullable:!0}],primaryKey:"id"},{name:"project_members",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"project_id",type:"INT",nullable:!1},{name:"user_id",type:"INT",nullable:!1},{name:"role",type:'ENUM("owner", "member")',nullable:!1,default:'"member"'},{name:"joined_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"}],primaryKey:"id",foreignKeys:[{columns:["project_id"],referenceTable:"projects",referenceColumns:["id"],onDelete:"CASCADE"},{columns:["user_id"],referenceTable:"users",referenceColumns:["id"],onDelete:"CASCADE"}],indices:[{name:"idx_project_members_unique",columns:["project_id","user_id"],unique:!0}]},{name:"tasks",columns:[{name:"id",type:"INT",nullable:!1,autoIncrement:!0},{name:"project_id",type:"INT",nullable:!1},{name:"assigned_to",type:"INT",nullable:!0},{name:"title",type:"VARCHAR(100)",nullable:!1},{name:"description",type:"TEXT",nullable:!0},{name:"priority",type:'ENUM("low", "medium", "high", "urgent")',nullable:!1,default:'"medium"'},{name:"status",type:'ENUM("todo", "in_progress", "review", "done")',nullable:!1,default:'"todo"'},{name:"due_date",type:"DATE",nullable:!0},{name:"created_at",type:"TIMESTAMP",nullable:!1,default:"CURRENT_TIMESTAMP"},{name:"updated_at",type:"TIMESTAMP",nullable:!0}],primaryKey:"id",foreignKeys:[{columns:["project_id"],referenceTable:"projects",referenceColumns:["id"],onDelete:"CASCADE"},{columns:["assigned_to"],referenceTable:"users",referenceColumns:["id"],onDelete:"SET NULL"}]}]}};function Xe(D){return re[D]||null}function Ye(){return Object.entries(re).map(([D,A])=>({value:D,title:A.name,description:A.description}))}const Ge={class:"text-h6 mb-2 d-flex align-center"},Je={class:"d-flex flex-wrap"},We={class:"d-flex align-center"},Ze={class:"bg-grey-darken-4 rounded-b-lg",style:{"max-height":"500px","overflow-y":"auto"}},el={class:"pa-4 ma-0 overflow-x-auto"},ll=["innerHTML"],al={key:0,class:"text-center pa-8"},tl={class:"d-flex align-center"},nl={class:"text-subtitle-1"},rl={class:"d-flex justify-space-between align-center mb-3"},sl={class:"text-subtitle-1 font-weight-bold d-flex align-center"},ul={key:0,class:"text-center pa-4 bg-grey-lighten-4 rounded-lg mb-4"},ol={class:"d-flex flex-wrap align-center"},il={key:0,class:"d-flex flex-wrap align-center bg-orange-lighten-5 rounded-lg pa-3 mt-3"},dl={key:0,class:"d-flex flex-wrap align-center bg-blue-lighten-5 rounded-lg pa-3 mt-3"},ml={class:"d-flex justify-end mt-3"},fl={key:0,class:"text-center pa-8"},pl={key:1},cl={class:"d-flex align-center mb-4"},yl={class:"text-body-2"},bl={class:"text-h6 mb-2 d-flex align-center"},vl={class:"d-flex align-center"},Tl={class:"d-flex align-center"},gl={key:0,class:"text-grey"},Al={key:1,class:"text-blue-darken-1"},El={key:2,class:"text-orange-darken-2"},Cl={class:"d-flex flex-wrap"},Sl={key:0,class:"mt-4"},_l={key:1,class:"mt-3"},Il={class:"text-body-2"},jl=Ve({__name:"sql-generator",setup(D){He({title:"SQL Designer",meta:[{name:"description",content:"Visual database design tool for SQL"},{name:"author",content:"DevUnity"},{name:"robots",content:"noindex, nofollow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"SQL Designer"},{name:"og:description",content:"Visual database design tool for SQL"}]});const A=Ne(),w=C("config"),E=C("my_database"),T=C([]),h=C(null),k=C([]),I=C(""),V=C(null),K=C(!0),p=C(!1),y=C(""),b=C(""),j=Me(),F=xe(),se=Y(()=>Ye()),ue=[{title:"PRIMARY KEY",value:"primaryKey"},{title:"FOREIGN KEY",value:"foreignKey"},{title:"NOT NULL",value:"notNull"},{title:"UNIQUE",value:"unique"},{title:"AUTO_INCREMENT",value:"autoIncrement"},{title:"DEFAULT",value:"default"}],oe=[{title:"NULL",value:"NULL"},{title:"CURRENT_TIMESTAMP",value:"CURRENT_TIMESTAMP"},{title:"Custom",value:"custom"}],ie=["INT","VARCHAR(255)","TEXT","MEDIUMTEXT","LONGTEXT","JSON","DATE","DATETIME","TIMESTAMP","BOOLEAN","DECIMAL","FLOAT","ENUM"],de=Y(()=>I.value?Pe.highlight(I.value,{language:"sql",ignoreIllegals:!0}).value:""),me=async()=>{try{K.value=!0,await A.loadSQLSchemas(),console.log("Schemas loaded:",A.sqlSchemas),A.sqlSchemas&&A.sqlSchemas.length>0?(k.value=A.sqlSchemas.map(r=>({title:r.database_name,value:r.id})),k.value.unshift({title:"Create new schema",value:null})):(console.warn("No SQL schemas found or schemas array is empty"),k.value=[{title:"Create new schema",value:null}])}catch(r){console.error("Error loading schema names:",r),y.value="Erreur lors du chargement des schémas",b.value="error",p.value=!0}finally{K.value=!1}};G(T,r=>{console.log("Tables updated:",r)},{deep:!0});const $=()=>{T.value.push({id:Math.random().toString(36).substring(2,15),name:"",columns:[],foreignKeys:[],defaultOptions:[]})},fe=r=>{T.value.splice(r,1)},pe=(r,e)=>{e.primaryKey=r.includes("primaryKey"),e.foreignKey=r.includes("foreignKey"),e.notNull=r.includes("notNull"),e.unique=r.includes("unique"),e.autoIncrement=r.includes("autoIncrement"),r.includes("default")?e.defaultType||(e.defaultType="custom",e.default=""):(e.defaultType=void 0,e.default=void 0),e.foreignKey||(e.referencedTable="",e.referencedColumn="")},ce=(r,e)=>{r.defaultType=e,e==="NULL"?r.default="NULL":e==="CURRENT_TIMESTAMP"?r.default="CURRENT_TIMESTAMP":e==="custom"&&(r.default="")},ye=r=>{r.columns.push({name:"",type:"VARCHAR(255)",nullable:!1,primaryKey:!1,foreignKey:!1,notNull:!1,unique:!1,autoIncrement:!1,referencedTable:"",referencedColumn:"",constraints:[]})},be=(r,e)=>{r.columns.splice(e,1)},ve=r=>{const e=T.value.find(s=>s.name===r);return(e==null?void 0:e.columns.map(s=>s.name))||[]},Te=r=>{if(r.primaryKey)return"yellow-lighten-4";if(r.foreignKey)return"blue-lighten-4"},q=()=>{let r=`CREATE DATABASE IF NOT EXISTS ${E.value};
`;r+=`USE ${E.value};

`,T.value.forEach(e=>{r+=`CREATE TABLE ${e.name} (
`;const s=e.columns.map(n=>{var c;let t=`  ${n.name} ${n.type}`;return n.notNull&&(t+=" NOT NULL"),n.autoIncrement&&(t+=" AUTO_INCREMENT"),n.primaryKey&&(t+=" PRIMARY KEY"),n.unique&&(t+=" UNIQUE"),(c=n.constraints)!=null&&c.includes("default")&&(n.defaultType==="NULL"?t+=" DEFAULT NULL":n.defaultType==="CURRENT_TIMESTAMP"?t+=" DEFAULT CURRENT_TIMESTAMP":n.default&&(t+=` DEFAULT ${n.default}`)),t});r+=s.join(`,
`),e.columns.forEach(n=>{n.foreignKey&&n.referencedTable&&n.referencedColumn&&(r+=`,
  FOREIGN KEY (${n.name}) REFERENCES ${n.referencedTable}(${n.referencedColumn}) ON DELETE CASCADE`)}),r+=`
);

`}),I.value=r},ge=async()=>{try{await navigator.clipboard.writeText(I.value),y.value="SQL copied to clipboard",b.value="success",p.value=!0}catch(r){console.error("Failed to copy SQL:",r),y.value="Error copying SQL",b.value="error",p.value=!0}},Ae=async()=>{if(!E.value.trim()){y.value="Database name is required",b.value="error",p.value=!0;return}if(!T.value.length){y.value="Add at least one table",b.value="error",p.value=!0;return}if(T.value.filter(s=>!s.name.trim()||!s.columns.length).length){y.value="All tables must have a name and at least one column",b.value="error",p.value=!0;return}if(T.value.some(s=>s.columns.some(n=>!n.name.trim()||n.name&&!O(n.name)))){y.value="All columns must have a valid name without emoji",b.value="error",p.value=!0;return}try{await A.saveSQLSchema(E.value,T.value),await A.loadSQLSchemas(),y.value="SQL schema saved successfully",b.value="success",p.value=!0}catch(s){console.error("Error saving SQL schema:",s),y.value="Error saving schema",b.value="error",p.value=!0}},Ee=async()=>{if(!h.value){y.value="Select a schema to delete",b.value="error",p.value=!0;return}try{await A.deleteSQLSchema(h.value),await A.loadSQLSchemas(),y.value="SQL schema deleted successfully",b.value="success",p.value=!0,E.value="",T.value=[],h.value=null,I.value=""}catch(r){console.error("Error deleting SQL schema:",r),y.value="Error deleting schema",b.value="error",p.value=!0}},Ce=r=>{V.value=Xe(r)},Se=()=>{if(!V.value)return;const r=[];V.value.tables.forEach(e=>{const s={id:Math.random().toString(36).substring(2,15),name:e.name,columns:[],foreignKeys:[],defaultOptions:[]};e.columns.forEach(n=>{const t=e.primaryKey===n.name,c=[];t&&c.push("primaryKey"),n.nullable||c.push("notNull"),n.unique&&c.push("unique"),n.autoIncrement&&c.push("autoIncrement"),s.columns.push({name:n.name,type:n.type,nullable:n.nullable,default:n.default||"",primaryKey:t,autoIncrement:n.autoIncrement||!1,unique:n.unique||!1,foreignKey:!1,notNull:!n.nullable,constraints:c})}),e.foreignKeys&&e.foreignKeys.forEach(n=>{if(n.columns.length>0){s.foreignKeys.push({id:Math.random().toString(36).substring(2,15),columnName:n.columns[0],referenceTable:n.referenceTable,referenceColumn:n.referenceColumns[0],onDelete:n.onDelete||"CASCADE",onUpdate:n.onUpdate||"NO ACTION"});const t=s.columns.findIndex(c=>c.name===n.columns[0]);t!==-1&&(s.columns[t].foreignKey=!0,s.columns[t].referencedTable=n.referenceTable,s.columns[t].referencedColumn=n.referenceColumns[0],s.columns[t].constraints?s.columns[t].constraints.push("foreignKey"):s.columns[t].constraints=["foreignKey"])}}),r.push(s)}),E.value||(E.value=V.value.name.toLowerCase().replace(/\s+/g,"_")),T.value=r,w.value="config",q()},O=r=>r?!/[\p{Emoji}]/u.test(r):!0,_e=r=>{r?F.push({path:"/sql-generator",query:{id:r.toString()}}):(F.push({path:"/sql-generator",query:{}}),E.value="",T.value=[],I.value="")},z=async r=>{try{A.sqlSchemas.length===0&&await A.loadSQLSchemas();const e=A.sqlSchemas.find(s=>s.id===r);e?(Ie(e),y.value="Schéma chargé avec succès",b.value="success",p.value=!0):(y.value="Schéma non trouvé",b.value="error",p.value=!0)}catch(e){console.error("Erreur lors du chargement du schéma:",e),y.value="Erreur lors du chargement du schéma",b.value="error",p.value=!0}},Ie=r=>{E.value=r.database_name,h.value=r.id;const e=typeof r.schema_data=="string"?JSON.parse(r.schema_data):r.schema_data,s=(Array.isArray(e.tables)?e.tables:[]).map(n=>({id:Math.random().toString(36).substring(2,15),name:n.name||"",columns:(n.columns||[]).map(t=>{let c;return t.default==="NULL"?c="NULL":t.default==="CURRENT_TIMESTAMP"?c="CURRENT_TIMESTAMP":t.default&&(c="custom"),{name:t.name||"",type:t.type||"VARCHAR(255)",nullable:!!t.nullable,default:t.default||"",defaultType:c,primaryKey:!!t.primaryKey,foreignKey:!!t.foreignKey,notNull:!!t.notNull,unique:!!t.unique,autoIncrement:!!t.autoIncrement,referencedTable:t.referencedTable||"",referencedColumn:t.referencedColumn||"",constraints:[...t.primaryKey?["primaryKey"]:[],...t.foreignKey?["foreignKey"]:[],...t.notNull?["notNull"]:[],...t.unique?["unique"]:[],...t.autoIncrement?["autoIncrement"]:[],...t.default?["default"]:[]]}}),foreignKeys:[]}));T.value=s,q()};return Re(async()=>{try{K.value=!0,await me();const r=j.query.id?parseInt(j.query.id,10):null;r&&await z(r)}catch(r){console.error("Error in onMounted:",r),y.value="Erreur lors du chargement initial",b.value="error",p.value=!0}finally{K.value=!1}}),G(()=>j.query.id,async r=>{if(r){const e=parseInt(r,10);await z(e)}}),(r,e)=>(i(),g(he,null,{default:l(()=>[a(je,null,{default:l(()=>[a(Oe,{fluid:"",class:"pa-6"},{default:l(()=>[a(Be,{modelValue:w.value,"onUpdate:modelValue":e[0]||(e[0]=s=>w.value=s),color:"primary","align-tabs":"center"},{default:l(()=>[a(Z,{value:"config",class:"text-subtitle-1"},{default:l(()=>[a(m,{start:""},{default:l(()=>e[5]||(e[5]=[u("mdi-cog")])),_:1}),e[6]||(e[6]=u(" Configuration "))]),_:1}),a(Z,{value:"templates",class:"text-subtitle-1"},{default:l(()=>[a(m,{start:""},{default:l(()=>e[7]||(e[7]=[u("mdi-file-document-multiple")])),_:1}),e[8]||(e[8]=u(" Templates "))]),_:1})]),_:1},8,["modelValue"]),a(B,{class:"mt-6"},{default:l(()=>[a(Fe,{modelValue:w.value,"onUpdate:modelValue":e[3]||(e[3]=s=>w.value=s),class:"w-100"},{default:l(()=>[a(ee,{value:"config"},{default:l(()=>[a(B,null,{default:l(()=>[a(Q,{cols:"12",lg:"5"},{default:l(()=>[a(x,{class:"mb-4 rounded-lg",elevation:"2"},{default:l(()=>[a(U,null,{default:l(()=>[o("div",Ge,[a(m,{color:"primary",class:"mr-2"},{default:l(()=>e[9]||(e[9]=[u("mdi-database")])),_:1}),e[10]||(e[10]=u(" Database Settings "))]),a(J,{class:"mb-4"}),a(H,{modelValue:E.value,"onUpdate:modelValue":e[1]||(e[1]=s=>E.value=s),label:"Database name",variant:"outlined","prepend-inner-icon":"mdi-database-edit",placeholder:"my_database",class:"mb-4","hide-details":""},null,8,["modelValue"]),a(L,{modelValue:h.value,"onUpdate:modelValue":[e[2]||(e[2]=s=>h.value=s),_e],items:k.value,"item-title":"title","item-value":"value",label:"Load existing schema",variant:"outlined",class:"mb-4","prepend-inner-icon":"mdi-folder-open","hide-details":"",loading:K.value},null,8,["modelValue","items","loading"]),o("div",Je,[a(_,{color:"primary",onClick:$,"prepend-icon":"mdi-table-plus",variant:"tonal",class:"mr-2 mb-2"},{default:l(()=>e[11]||(e[11]=[u(" Add table ")])),_:1}),a(_,{color:"success",onClick:Ae,"prepend-icon":"mdi-content-save",variant:"tonal",class:"mr-2 mb-2"},{default:l(()=>e[12]||(e[12]=[u(" Save ")])),_:1}),a(_,{color:"error",onClick:Ee,"prepend-icon":"mdi-delete",variant:"tonal",class:"mb-2"},{default:l(()=>e[13]||(e[13]=[u(" Delete ")])),_:1})])]),_:1})]),_:1}),I.value?(i(),g(x,{key:0,class:"rounded-lg",elevation:"2"},{default:l(()=>[a(P,{class:"d-flex justify-space-between align-center bg-primary text-white py-3 px-4 rounded-t-lg"},{default:l(()=>[o("div",We,[a(m,{color:"white",class:"mr-2"},{default:l(()=>e[14]||(e[14]=[u("mdi-code-braces")])),_:1}),e[15]||(e[15]=u(" Generated SQL "))]),a(_,{icon:"",color:"white",onClick:ge,variant:"text"},{default:l(()=>[a(m,null,{default:l(()=>e[16]||(e[16]=[u("mdi-content-copy")])),_:1})]),_:1})]),_:1}),a(U,{class:"pa-0"},{default:l(()=>[o("div",Ze,[o("pre",el,[o("code",{innerHTML:de.value,class:"font-family-monospace text-body-2"},null,8,ll)])])]),_:1}),a(Ue,{class:"pa-4 pt-0 mt-3"},{default:l(()=>[a(_,{color:"primary",block:"",onClick:q,"prepend-icon":"mdi-refresh",variant:"tonal"},{default:l(()=>e[17]||(e[17]=[u(" Regenerate SQL ")])),_:1})]),_:1})]),_:1})):S("",!0)]),_:1}),a(Q,{cols:"12",lg:"7"},{default:l(()=>[a(x,{class:"rounded-lg",elevation:"2"},{default:l(()=>[a(P,{class:"bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center"},{default:l(()=>[a(m,{color:"white",class:"mr-2"},{default:l(()=>e[18]||(e[18]=[u("mdi-table-multiple")])),_:1}),e[20]||(e[20]=u(" Database tables ")),a(W),I.value?S("",!0):(i(),g(_,{key:0,color:"white",variant:"text",onClick:q,"prepend-icon":"mdi-play"},{default:l(()=>e[19]||(e[19]=[u(" Generate SQL ")])),_:1}))]),_:1}),a(U,{class:"pa-4"},{default:l(()=>[T.value.length===0?(i(),f("div",al,[a(m,{size:"64",color:"grey-lighten-1"},{default:l(()=>e[21]||(e[21]=[u("mdi-table-plus")])),_:1}),e[23]||(e[23]=o("div",{class:"text-h6 mt-4 text-grey"},"No tables defined",-1)),e[24]||(e[24]=o("div",{class:"text-body-1 text-grey-darken-1 mb-4"},"Start by adding a table to your database",-1)),a(_,{color:"primary",variant:"tonal",onClick:$,"prepend-icon":"mdi-table-plus"},{default:l(()=>e[22]||(e[22]=[u(" Add table ")])),_:1})])):(i(),g(le,{key:1,variant:"accordion",multiple:""},{default:l(()=>[(i(!0),f(N,null,M(T.value,(s,n)=>(i(),g(ae,{key:n,class:"mb-4 rounded-lg border border-grey-lighten-2 hover-border-primary transition-all",title:s.name||"Unnamed table"},{title:l(()=>[o("div",tl,[a(m,{color:"primary",class:"mr-2"},{default:l(()=>e[25]||(e[25]=[u("mdi-table")])),_:1}),o("span",nl,v(s.name||"Unnamed table"),1),a(R,{class:"ml-2",size:"small",color:"grey-lighten-3"},{default:l(()=>[u(v(s.columns.length)+" column"+v(s.columns.length!==1?"s":""),1)]),_:2},1024)])]),default:l(()=>[a(te,null,{default:l(()=>[a(H,{modelValue:s.name,"onUpdate:modelValue":t=>s.name=t,label:"Table name",variant:"outlined","prepend-inner-icon":"mdi-table-edit",placeholder:"users, products, orders...",class:"mb-4"},null,8,["modelValue","onUpdate:modelValue"]),o("div",rl,[o("div",sl,[a(m,{color:"primary",class:"mr-2"},{default:l(()=>e[26]||(e[26]=[u("mdi-table-column")])),_:1}),e[27]||(e[27]=u(" Columns "))]),a(_,{color:"primary",size:"small",variant:"tonal",onClick:t=>ye(s),"prepend-icon":"mdi-plus"},{default:l(()=>e[28]||(e[28]=[u(" Add column ")])),_:2},1032,["onClick"])]),a(J,{class:"mb-4"}),s.columns.length===0?(i(),f("div",ul,[a(m,{color:"grey"},{default:l(()=>e[29]||(e[29]=[u("mdi-table-column-plus-after")])),_:1}),e[30]||(e[30]=o("div",{class:"text-body-2 text-grey-darken-1 mt-2"},"No columns defined",-1))])):S("",!0),(i(!0),f(N,null,M(s.columns,(t,c)=>(i(),g(x,{key:c,variant:"outlined",class:"mb-3 hover-elevate-1 transition-all",color:Te(t)},{default:l(()=>[a(U,{class:"pa-3"},{default:l(()=>{var X;return[o("div",ol,[a(H,{modelValue:t.name,"onUpdate:modelValue":d=>t.name=d,label:"Name",variant:"outlined",density:"compact",class:"flex-grow-1 min-width-150 mr-3 mb-2","hide-details":"",error:t.name?!O(t.name):!1,"error-messages":t.name&&!O(t.name)?"Les emojis ne sont pas autorisés":""},null,8,["modelValue","onUpdate:modelValue","error","error-messages"]),a(L,{modelValue:t.type,"onUpdate:modelValue":d=>t.type=d,items:ie,label:"Type",variant:"outlined",density:"compact",class:"flex-grow-1 min-width-150 mr-3 mb-2","hide-details":""},null,8,["modelValue","onUpdate:modelValue"]),a(L,{modelValue:t.constraints,"onUpdate:modelValue":[d=>t.constraints=d,d=>pe(d,t)],items:ue,"item-title":"title","item-value":"value",label:"Constraints",variant:"outlined",density:"compact",multiple:"",chips:"",class:"flex-grow-1 min-width-150 mr-3 mb-2","hide-details":""},null,8,["modelValue","onUpdate:modelValue"]),(X=t.constraints)!=null&&X.includes("default")?(i(),f("div",il,[a(m,{color:"orange-darken-1",class:"mr-3"},{default:l(()=>e[31]||(e[31]=[u("mdi-format-quote-close")])),_:1}),a(L,{modelValue:t.defaultType,"onUpdate:modelValue":[d=>t.defaultType=d,d=>ce(t,d)],items:oe,"item-title":"title","item-value":"value",label:"Default value type",variant:"outlined",density:"compact",class:"flex-grow-1 min-width-150 mr-3 mb-2","hide-details":""},null,8,["modelValue","onUpdate:modelValue"]),t.defaultType==="custom"?(i(),g(H,{key:0,modelValue:t.default,"onUpdate:modelValue":d=>t.default=d,label:"Default value",variant:"outlined",density:"compact",class:"flex-grow-1 min-width-150","hide-details":""},null,8,["modelValue","onUpdate:modelValue"])):S("",!0)])):S("",!0),a(_,{color:"error",icon:"",variant:"text",density:"compact",onClick:d=>be(s,c)},{default:l(()=>[a(m,null,{default:l(()=>e[32]||(e[32]=[u("mdi-delete")])),_:1})]),_:2},1032,["onClick"])]),t.foreignKey?(i(),f("div",dl,[a(m,{color:"blue-darken-1",class:"mr-3"},{default:l(()=>e[33]||(e[33]=[u("mdi-link-variant")])),_:1}),a(L,{modelValue:t.referencedTable,"onUpdate:modelValue":d=>t.referencedTable=d,items:T.value.filter(d=>d.name&&d.name!==s.name).map(d=>d.name),label:"Referenced table",variant:"outlined",density:"compact",class:"flex-grow-1 min-width-150 mr-3 mb-2","hide-details":"","prepend-inner-icon":"mdi-table"},null,8,["modelValue","onUpdate:modelValue","items"]),a(L,{modelValue:t.referencedColumn,"onUpdate:modelValue":d=>t.referencedColumn=d,items:ve(t.referencedTable||""),label:"Referenced column",variant:"outlined",density:"compact",class:"flex-grow-1 min-width-150 mb-2","hide-details":"","prepend-inner-icon":"mdi-table-column",disabled:!t.referencedTable},null,8,["modelValue","onUpdate:modelValue","items","disabled"])])):S("",!0)]}),_:2},1024)]),_:2},1032,["color"]))),128)),o("div",ml,[a(_,{color:"error",variant:"text",onClick:t=>fe(n),"prepend-icon":"mdi-delete",size:"small"},{default:l(()=>e[34]||(e[34]=[u(" Delete this table ")])),_:2},1032,["onClick"])])]),_:2},1024)]),_:2},1032,["title"]))),128))]),_:1}))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),a(ee,{value:"templates"},{default:l(()=>[a(B,null,{default:l(()=>[a(Q,{cols:"12",md:"4",lg:"3"},{default:l(()=>[a(x,{class:"rounded-lg",elevation:"2"},{default:l(()=>[a(P,{class:"bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center"},{default:l(()=>[a(m,{color:"white",class:"mr-2"},{default:l(()=>e[35]||(e[35]=[u("mdi-file-document-multiple")])),_:1}),e[36]||(e[36]=u(" Database Templates "))]),_:1}),a(U,{class:"py-4"},{default:l(()=>[e[38]||(e[38]=o("p",{class:"text-body-2 mb-4"},"Choose a pre-defined database schema template to quickly get started. ",-1)),a(Le,{lines:"two"},{default:l(()=>[(i(!0),f(N,null,M(se.value,s=>(i(),g(we,{key:s.value,onClick:n=>Ce(s.value),class:"mb-2",rounded:"",elevation:"1"},{prepend:l(()=>[a(ke,{color:"primary",variant:"tonal"},{default:l(()=>[a(m,null,{default:l(()=>e[37]||(e[37]=[u("mdi-database-outline")])),_:1})]),_:1})]),default:l(()=>[a(Ke,null,{default:l(()=>[u(v(s.title),1)]),_:2},1024),a(De,null,{default:l(()=>[u(v(s.description),1)]),_:2},1024)]),_:2},1032,["onClick"]))),128))]),_:1})]),_:1})]),_:1})]),_:1}),a(Q,{cols:"12",md:"8",lg:"9"},{default:l(()=>[a(x,{class:"rounded-lg",elevation:"2"},{default:l(()=>[a(P,{class:"bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center"},{default:l(()=>[a(m,{color:"white",class:"mr-2"},{default:l(()=>e[39]||(e[39]=[u("mdi-file-eye")])),_:1}),e[40]||(e[40]=u(" Template Preview "))]),_:1}),a(U,{class:"pa-4"},{default:l(()=>[V.value?(i(),f("div",pl,[o("div",cl,[a(R,{color:"primary",variant:"tonal",class:"mr-2"},{default:l(()=>[u(v(V.value.name),1)]),_:1}),a(W),a(_,{color:"primary",onClick:Se,"prepend-icon":"mdi-check",variant:"tonal"},{default:l(()=>e[44]||(e[44]=[u(" Use this template ")])),_:1})]),a(ne,{color:"info",variant:"tonal",class:"mb-4"},{default:l(()=>[o("div",yl,v(V.value.description),1)]),_:1}),o("div",bl,[a(m,{color:"primary",class:"mr-2"},{default:l(()=>e[45]||(e[45]=[u("mdi-table-multiple")])),_:1}),e[46]||(e[46]=u(" Tables Structure "))]),a(le,{variant:"accordion",class:"mb-4"},{default:l(()=>[(i(!0),f(N,null,M(V.value.tables,s=>(i(),g(ae,{key:s.name,class:"mb-2 rounded-lg border border-grey-lighten-2"},{default:l(()=>[a($e,null,{default:l(()=>[o("div",vl,[a(m,{color:"primary",class:"mr-2"},{default:l(()=>e[47]||(e[47]=[u("mdi-table")])),_:1}),o("strong",null,v(s.name),1),a(R,{size:"small",color:"grey",variant:"tonal",class:"ml-3"},{default:l(()=>[u(v(s.columns.length)+" columns ",1)]),_:2},1024)])]),_:2},1024),a(te,null,{default:l(()=>[a(ze,{density:"compact",class:"table-fixed"},{default:l(()=>[e[53]||(e[53]=o("thead",null,[o("tr",null,[o("th",null,"Column"),o("th",null,"Type"),o("th",null,"Nullable"),o("th",null,"Default"),o("th",null,"Other")])],-1)),o("tbody",null,[(i(!0),f(N,null,M(s.columns,n=>(i(),f("tr",{key:n.name,class:qe({"primary-lighten-5":n.name===s.primaryKey})},[o("td",null,[o("div",Tl,[o("strong",null,v(n.name),1)])]),o("td",null,v(n.type),1),o("td",null,[n.nullable?(i(),g(m,{key:0,color:"success",size:"small"},{default:l(()=>e[48]||(e[48]=[u("mdi-check")])),_:1})):(i(),g(m,{key:1,color:"error",size:"small"},{default:l(()=>e[49]||(e[49]=[u("mdi-close")])),_:1}))]),o("td",null,[n.defaultType==="NULL"?(i(),f("span",gl,"NULL")):n.defaultType==="CURRENT_TIMESTAMP"?(i(),f("span",Al,"CURRENT_TIMESTAMP")):n.default?(i(),f("span",El,"'"+v(n.default)+"'",1)):(i(),f(N,{key:3},[u("-")],64))]),o("td",null,[o("div",Cl,[n.unique?(i(),g(R,{key:0,size:"x-small",color:"info",variant:"tonal",class:"mr-1 mb-1"},{default:l(()=>e[50]||(e[50]=[u(" UNIQUE ")])),_:1})):S("",!0),n.autoIncrement?(i(),g(R,{key:1,size:"x-small",color:"success",variant:"tonal",class:"mr-1 mb-1"},{default:l(()=>e[51]||(e[51]=[u(" AUTO INC ")])),_:1})):S("",!0),n.primaryKey?(i(),g(R,{key:2,size:"x-small",color:"warning",variant:"tonal",class:"mr-1 mb-1"},{default:l(()=>e[52]||(e[52]=[u(" PRIMARY ")])),_:1})):S("",!0)])])],2))),128))])]),_:2},1024),s.foreignKeys&&s.foreignKeys.length>0?(i(),f("div",Sl,[e[54]||(e[54]=o("div",{class:"text-subtitle-2 mb-2"},"Foreign Keys:",-1)),(i(!0),f(N,null,M(s.foreignKeys,(n,t)=>(i(),g(R,{key:t,color:"secondary",variant:"tonal",class:"mr-2 mb-2"},{default:l(()=>[u(v(n.columns.join(", "))+" → "+v(n.referenceTable)+"."+v(n.referenceColumns.join(",")),1)]),_:2},1024))),128))])):S("",!0),s.indices&&s.indices.length>0?(i(),f("div",_l,[e[55]||(e[55]=o("div",{class:"text-subtitle-2 mb-2"},"Indices:",-1)),(i(!0),f(N,null,M(s.indices,(n,t)=>(i(),g(R,{key:t,color:n.unique?"warning":"grey",variant:"tonal",class:"mr-2"},{default:l(()=>[u(v(n.name)+": "+v(n.columns.join(", ")),1)]),_:2},1032,["color"]))),128))])):S("",!0)]),_:2},1024)]),_:2},1024))),128))]),_:1}),a(ne,{color:"grey",variant:"tonal",class:"mb-2 mt-4"},{default:l(()=>[o("div",Il,[a(m,{color:"info",class:"mr-1"},{default:l(()=>e[56]||(e[56]=[u("mdi-information")])),_:1}),e[57]||(e[57]=u(" Using this template will replace your current database schema. Make sure to save your work before applying a template. "))])]),_:1})])):(i(),f("div",fl,[a(m,{size:"64",color:"grey-lighten-1"},{default:l(()=>e[41]||(e[41]=[u("mdi-database-search")])),_:1}),e[42]||(e[42]=o("div",{class:"text-h6 mt-4 text-grey"},"No template selected",-1)),e[43]||(e[43]=o("div",{class:"text-body-1 text-grey-darken-1 mb-4"},"Select a template from the list to preview its tables and structure",-1))]))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(Qe,{modelValue:p.value,"onUpdate:modelValue":e[4]||(e[4]=s=>p.value=s),text:y.value,color:b.value,timeout:3e3},null,8,["modelValue","text","color"])]),_:1}))}});export{jl as default};
