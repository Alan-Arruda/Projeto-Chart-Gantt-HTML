
// Capture original source BEFORE any render() modifies the DOM
// Works with file://, http:// and https://
window._originalSrc='<!DOCTYPE html>\n'+document.documentElement.outerHTML;

// ============================================================
// CONSTANTS & DEFAULTS
// ============================================================
const COLORS=['#1B5ED4','#0D7D68','#B54430','#4A36A8','#2E7D32','#7B2557','#B06010','#8C1F1F','#1565A8','#C0592A','#B03570','#0B6E8F'];
const SM={track:{cls:'s-track',label:'No prazo'},risk:{cls:'s-risk',label:'Em risco'},delay:{cls:'s-delay',label:'Atrasado'},done:{cls:'s-done',label:'Concluído'}};
const CONSTRAINT_LABELS={ASAP:'ASAP',ALAP:'ALAP',MSO:'MSO',MFO:'MFO',SNET:'SNET',SNLT:'SNLT',FNET:'FNET',FNLT:'FNLT'};
const STORAGE='gantt_pro_sbr4_v1';
const DEF_WIDTHS={task:200,owner:110,status:100,pct:70,dates:110,period:50};
let colWidths={...DEF_WIDTHS};
const COL_DEFS=[{key:'owner',label:'Responsável'},{key:'status',label:'Status'},{key:'pct',label:'% Conclusão'},{key:'dates',label:'Datas'}];
let colVis={owner:true,status:true,pct:true,dates:true,legend:true};
let customCols=[];

const DEF_TASKS=[
  {id:1,wbsCode:"",name:"CRONOGRAMA AUXILIAR - SBR4 - ACOMPANHAMENTO SHIP MANAGER",owner:'',color:'#1B5ED4',start:'2024-09-18',end:'2026-11-30',pct:0,isMilestone:false,isSummary:true,parentId:null,collapsed:true,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:2,wbsCode:"2",name:"MARCO J06 (LANÇAMENTO AO MAR)",owner:'',color:'#0D7D68',start:'2024-10-07',end:'2026-11-30',pct:0,isMilestone:false,isSummary:true,parentId:1,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:3,wbsCode:"2.26",name:"DN - SISTEMA DE MONITORAMENTO DE COTA, PONTA E BANDA",owner:'',color:'#0D7D68',start:'2026-05-04',end:'2026-05-04',pct:0,isMilestone:true,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:4,wbsCode:"2.1",name:"DT - SISTEMA HIDRÁULICO PRINCIPAL",owner:'',color:'#0D7D68',start:'2024-10-07',end:'2025-10-24',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:5,wbsCode:"2.2",name:"ER - SISTEMA DE ENGRAXAMENTO",owner:'',color:'#0D7D68',start:'2024-10-09',end:'2026-07-23',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:6,wbsCode:"2.4",name:"DM - SISTEMA DE COMPENSAÇÃO",owner:'',color:'#0D7D68',start:'2024-11-04',end:'2026-05-11',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:7,wbsCode:"2.5",name:"EQ - SISTEMA DE SALVAMENTO",owner:'',color:'#0D7D68',start:'2024-12-23',end:'2026-07-23',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:8,wbsCode:"2.3",name:"KE - SISTEMA DE MANOBRA DO ARMAMENTO",owner:'',color:'#0D7D68',start:'2024-10-14',end:'2026-06-30',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:9,wbsCode:"2.6",name:"AG - ESCOTILHAS",owner:'',color:'#0D7D68',start:'2025-01-20',end:'2026-05-04',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:10,wbsCode:"2.7",name:"DU - BLOQUEIO DE EMERGÊNCIA DOS SISTEMAS DE ÁGUA SALGADA",owner:'',color:'#0D7D68',start:'2025-01-27',end:'2025-10-16',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:11,wbsCode:"2.8",name:"RM - SISTEMA DE MASTROS",owner:'',color:'#0D7D68',start:'2025-01-27',end:'2026-05-12',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:12,wbsCode:"2.9",name:"KT - SISTEMA DE LANÇAMENTO DE TORPEDOS",owner:'',color:'#0D7D68',start:'2025-02-17',end:'2026-11-30',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:13,wbsCode:"2.10",name:"BQ - SISTEMA DE EXAUSTÃO DOS DIESEL GERADORES",owner:'',color:'#0D7D68',start:'2025-11-17',end:'2026-08-05',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:14,wbsCode:"2.11",name:"BM - CIRCUITO DE REFRIGERAÇÃO DOS DIESEL GERADORES",owner:'',color:'#0D7D68',start:'2025-11-18',end:'2026-08-13',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:15,wbsCode:"2.12",name:"UL - EJETOR MULTIUSO",owner:'',color:'#0D7D68',start:'2025-09-08',end:'2026-05-12',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:16,wbsCode:"2.13",name:"ES - SISTEMA DE REFRIGERAÇÃO COM ÁGUA DOCE DE RÉ",owner:'',color:'#0D7D68',start:'2025-11-18',end:'2026-06-30',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:17,wbsCode:"2.14",name:"EW - SISTEMA DE SUPRIMENTO DE ÁGUA SALGADA",owner:'',color:'#0D7D68',start:'2025-11-18',end:'2026-09-15',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:18,wbsCode:"2.15",name:"EJ - SISTEMA DE AGUADA",owner:'',color:'#0D7D68',start:'2025-11-18',end:'2026-06-09',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:19,wbsCode:"2.16",name:"FQ - SISTEMA SANITÁRIO",owner:'',color:'#0D7D68',start:'2025-11-18',end:'2026-11-04',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:20,wbsCode:"2.17",name:"MB - LINHA DE EIXO",owner:'',color:'#0D7D68',start:'2025-11-18',end:'2026-03-02',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:21,wbsCode:"2.18",name:"FV - FRIGORÍFICA E PAIOL DE GÊNEROS",owner:'',color:'#0D7D68',start:'2025-12-08',end:'2026-07-06',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:22,wbsCode:"2.19",name:"DA - SISTEMA DE ESGOTO",owner:'',color:'#0D7D68',start:'2025-06-16',end:'2026-07-13',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:23,wbsCode:"2.20",name:"RF - ANTENA FLUTUANTE",owner:'',color:'#0D7D68',start:'2025-05-26',end:'2026-10-01',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:24,wbsCode:"2.21",name:"DS - SISTEMA HIDRÁULICO EXTERNO",owner:'',color:'#0D7D68',start:'2026-01-26',end:'2026-09-09',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:25,wbsCode:"2.22",name:"FC - SISTEMA DE AR CONDICIONADO",owner:'',color:'#0D7D68',start:'2026-02-09',end:'2026-09-09',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:26,wbsCode:"2.23",name:"FA - LIMPEZA E HIGIENE",owner:'',color:'#0D7D68',start:'2026-03-06',end:'2026-06-01',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:27,wbsCode:"2.24",name:"EM - SISTEMA DE CIRCULAÇÃO DE ÁGUA SALGADA DE RÉ",owner:'',color:'#0D7D68',start:'2026-03-06',end:'2026-05-20',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:28,wbsCode:"2.25",name:"KO - SISTEMA DE COMANDO E CONTROLE",owner:'',color:'#0D7D68',start:'2026-04-06',end:'2026-10-13',pct:0,isMilestone:false,isSummary:false,parentId:2,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:29,wbsCode:"4",name:"MARCO J05 (PARTIDA DO DIESEL GERADOR)",owner:'',color:'#B54430',start:'2024-11-19',end:'2026-08-11',pct:0,isMilestone:false,isSummary:true,parentId:1,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:30,wbsCode:"4.1",name:"BD - DIESEL GERADORES",owner:'',color:'#B54430',start:'2026-05-13',end:'2026-08-11',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:31,wbsCode:"4.2",name:"BX - REDE DE FLUIDOS AUXILIARES DOS DIESEL GERADORES",owner:'',color:'#B54430',start:'2025-01-15',end:'2026-08-11',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:32,wbsCode:"4.3",name:"EF - DETECÇÃO E COMBATE A INCÊNDIO",owner:'',color:'#B54430',start:'2024-11-19',end:'2026-05-06',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:33,wbsCode:"4.4",name:"EG - SISTEMA DE ÓLEO COMBUSTÍVEL",owner:'',color:'#B54430',start:'2025-01-28',end:'2026-07-06',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:34,wbsCode:"4.5",name:"EJ - SISTEMA DE AGUADA",owner:'',color:'#B54430',start:'2025-11-06',end:'2026-05-04',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:35,wbsCode:"4.6",name:"EL - SISTEMA DE ÓLEO LUBRIFICANTE",owner:'',color:'#B54430',start:'2026-01-12',end:'2026-06-01',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:36,wbsCode:"4.7",name:"AD - FECHAMENTO DE ESTRUTURAS INTERNAS NÃO RESISTENTES",owner:'',color:'#B54430',start:'2026-02-09',end:'2026-05-20',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:37,wbsCode:"4.8",name:"FR - REVITALIZAÇÃO E CONTROLE DA ATMOSFERA",owner:'',color:'#B54430',start:'2025-11-03',end:'2025-11-04',pct:0,isMilestone:false,isSummary:false,parentId:29,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:38,wbsCode:"5",name:"MARCO J07 (TESTE DE PROPULSÃO)",owner:'',color:'#4A36A8',start:'2024-09-18',end:'2026-08-20',pct:0,isMilestone:false,isSummary:true,parentId:1,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:39,wbsCode:"5.1",name:"DB - TANQUES DE LASTRO",owner:'',color:'#4A36A8',start:'2026-02-02',end:'2026-05-13',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:40,wbsCode:"5.2",name:"DV - SISTEMA DE AR COMPRIMIDO PRINCIPAL",owner:'',color:'#4A36A8',start:'2026-05-04',end:'2026-05-05',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:41,wbsCode:"5.3",name:"EF - DETECÇÃO E COMBATE A INCÊNDIO",owner:'',color:'#4A36A8',start:'2026-05-04',end:'2026-05-04',pct:0,isMilestone:true,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:42,wbsCode:"5.4",name:"EX - ATRACAÇÃO, FUNDEIO E REBOQUE",owner:'',color:'#4A36A8',start:'2026-03-16',end:'2026-05-19',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:43,wbsCode:"5.5",name:"EZ - SISTEMA DE AR PARA RESPIRAÇÃO",owner:'',color:'#4A36A8',start:'2025-11-03',end:'2026-05-12',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:44,wbsCode:"5.6",name:"MB - LINHA DE EIXO",owner:'',color:'#4A36A8',start:'2026-01-26',end:'2026-07-28',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:45,wbsCode:"5.7",name:"ME - MOTOR ELÉTRICO PRINCIPAL",owner:'',color:'#4A36A8',start:'2024-11-19',end:'2026-08-20',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:46,wbsCode:"5.8",name:"BC - REDE DE CORRENTE CONTINUA",owner:'',color:'#4A36A8',start:'2024-09-18',end:'2026-02-09',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:47,wbsCode:"5.9",name:"BF - REDE 115V/60Hz",owner:'',color:'#4A36A8',start:'2026-05-04',end:'2026-05-05',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
  {id:48,wbsCode:"5.10",name:"FH - SISTEMA DE VENTILAÇÃO",owner:'',color:'#4A36A8',start:'2026-08-19',end:'2026-08-20',pct:0,isMilestone:false,isSummary:false,parentId:38,collapsed:false,constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]},
];
const DEF_DEPS=[];

// ============================================================
// STATE
// ============================================================
let tasks,deps,nextId,nextDepId,baselines,dataDate,showCP,connectMode;
let collapseState={};
let activeBaselines=[];
let scurveChart=null;
let modalTaskId=null,selColor=COLORS[0];
let editDepId=null;
let importData=null;
let pendingConnectFrom=null;
let _dragBar={},_dragDep={};

function defaultState(){
  tasks=JSON.parse(JSON.stringify(DEF_TASKS));
  deps=JSON.parse(JSON.stringify(DEF_DEPS));
  nextId=49;nextDepId=1;
  baselines=[null,null,null];
  dataDate=null;showCP=false;connectMode=false;
  activeBaselines=[];collapseState={};
}

// ============================================================
// PERSISTENCE
// ============================================================
const STORAGE_KEY=STORAGE;
function saveState(){
  try{
    const ti=document.getElementById('ganttTitle'),su=document.getElementById('ganttSub');
    const state={tasks,deps,nextId,nextDepId,baselines,dataDate,showCP,colVis,colWidths,customCols,activeBaselines,
      title:ti?ti.innerText:'',sub:su?su.innerText:''};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
    const el=document.getElementById('savedMsg');
    if(el){el.style.opacity='1';clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity='0',2200);}
  }catch(e){}
}
function loadState(){
  try{
    if(typeof __SAVED_STATE__!=='undefined')return __SAVED_STATE__;
    const s=localStorage.getItem(STORAGE_KEY);return s?JSON.parse(s):null;
  }catch(e){return null;}
}
function applyState(s){
  if(!s)return;
  tasks=s.tasks||JSON.parse(JSON.stringify(DEF_TASKS));
  deps=s.deps||[];
  nextId=s.nextId||18;nextDepId=s.nextDepId||1;
  baselines=s.baselines||[null,null,null];
  dataDate=s.dataDate||null;
  showCP=s.showCP||false;
  activeBaselines=s.activeBaselines||[];
  if(s.colVis)Object.assign(colVis,s.colVis);
  if(s.colWidths)Object.assign(colWidths,s.colWidths);
  if(s.customCols)customCols=s.customCols;
  const ti=document.getElementById('ganttTitle'),su=document.getElementById('ganttSub');
  if(ti&&s.title)ti.innerText=s.title;
  if(su&&s.sub)su.innerText=s.sub;
}
function resetAll(){if(!confirm('Restaurar todos os dados ao padrão?'))return;localStorage.removeItem(STORAGE_KEY);location.reload();}
function saveAsFile(){
  const btn=document.querySelector('.btn-nav.green');
  const origText=btn?btn.textContent:'';
  if(btn){btn.textContent='Aguarde...';btn.disabled=true;}

  setTimeout(function(){
    try{
      const ti=document.getElementById('ganttTitle'),su=document.getElementById('ganttSub');
      const state={
        tasks:JSON.parse(JSON.stringify(tasks)),
        deps:JSON.parse(JSON.stringify(deps)),
        nextId,nextDepId,baselines,dataDate,showCP,
        colVis:JSON.parse(JSON.stringify(colVis)),
        colWidths:JSON.parse(JSON.stringify(colWidths)),
        customCols:JSON.parse(JSON.stringify(customCols)),
        activeBaselines,
        title:ti?ti.innerText:'',
        sub:su?su.innerText:''
      };

      const injection='\nconst __SAVED_STATE__='+JSON.stringify(state)+';\n';
      const marker='/*__SAVED_STATE__*/';
      const markerEnd='/*__SAVED_STATE_END__*/';

      // Usa o HTML original capturado antes de qualquer render()
      const src=window._originalSrc;
      const re=/\/\*__SAVED_STATE__\*\/[\s\S]*?\/\*__SAVED_STATE_END__\*\//;
      const out=re.test(src)
        ?src.replace(re,marker+injection+markerEnd)
        :src.replace(marker+markerEnd,marker+injection+markerEnd);

      const blob=new Blob([out],{type:'text/html;charset=utf-8'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='gantt_pro.html';
      document.body.appendChild(a);a.click();
      document.body.removeChild(a);URL.revokeObjectURL(a.href);

      showToast&&showToast('Arquivo salvo!');
    }catch(e){alert('Erro ao salvar: '+e.message);}

    if(btn){btn.textContent=origText;btn.disabled=false;}
  },50);
}

// ============================================================
// DATE HELPERS
// ============================================================
function parseDate(s){if(!s)return null;if(s instanceof Date)return s;const[y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d);}
function fmt(d){if(!d)return'';const dt=d instanceof Date?d:parseDate(d);if(!dt)return'';return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;}
function fmtS(s){const dt=parseDate(s);if(!dt)return'';return`${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;}
function daysDiff(a,b){return Math.round((parseDate(b)-parseDate(a))/86400000);}
function addDays(d,n){const r=new Date(d instanceof Date?d:parseDate(d));r.setDate(r.getDate()+n);return r;}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function getDataDate(){return dataDate?parseDate(dataDate):new Date();}

// ============================================================
// CPM ENGINE
// ============================================================
let taskMap={};
function buildTaskMap(){taskMap={};tasks.forEach(t=>taskMap[t.id]=t);}

function topoSort(){
  const ids=tasks.map(t=>t.id);
  const inDeg={};const adj={};
  ids.forEach(id=>{inDeg[id]=0;adj[id]=[];});
  deps.forEach(d=>{if(inDeg[d.toId]!==undefined)inDeg[d.toId]++;if(adj[d.fromId])adj[d.fromId].push(d.toId);});
  const queue=ids.filter(id=>inDeg[id]===0);const result=[];
  while(queue.length){const id=queue.shift();result.push(id);(adj[id]||[]).forEach(nid=>{if(--inDeg[nid]===0)queue.push(nid);});}
  ids.forEach(id=>{if(!result.includes(id))result.push(id);});
  return result;
}

function applyConstraintES(t,es){
  const cd=t.constraintDate?parseDate(t.constraintDate):null;
  switch(t.constraintType){
    case'MSO':return cd||es;
    case'SNET':return cd&&es<cd?cd:es;
    case'SNLT':return es;// enforced in backward
    default:return es;
  }
}
function applyConstraintLF(t,lf){
  const cd=t.constraintDate?parseDate(t.constraintDate):null;
  const dur=(parseDate(t.end)-parseDate(t.start));
  switch(t.constraintType){
    case'MSO':return cd?new Date(cd.getTime()+dur):lf;
    case'MFO':return cd||lf;
    case'SNLT':if(cd){const ls=new Date(cd.getTime());return new Date(ls.getTime()+dur);}return lf;
    case'FNLT':return cd&&lf>cd?cd:lf;
    default:return lf;
  }
}

function runCPM(){
  buildTaskMap();
  const order=topoSort();
  const dd=getDataDate();
  const threshold=parseInt(document.getElementById('cpThreshold')?.value||0);

  // Forward pass
  order.forEach(id=>{
    const t=taskMap[id];if(!t)return;
    const dur=Math.max(0,daysDiff(t.start,t.end));
    const preds=deps.filter(d=>d.toId===id);
    let es=parseDate(t.start);
    if(preds.length>0){
      es=new Date(0);
      preds.forEach(d=>{
        const from=taskMap[d.fromId];if(!from||!from.es)return;
        const lagMs=(d.lag||0)*86400000;
        let cand;
        const fromEF=from.ef||parseDate(from.end);
        const fromES=from.es||parseDate(from.start);
        switch(d.type){
          case'FS':cand=new Date(fromEF.getTime()+lagMs);break;
          case'SS':cand=new Date(fromES.getTime()+lagMs);break;
          case'FF':cand=new Date(fromEF.getTime()+lagMs-dur*86400000);break;
          case'SF':cand=new Date(fromES.getTime()+lagMs-dur*86400000);break;
          default:cand=new Date(fromEF.getTime()+lagMs);
        }
        if(cand>es)es=cand;
      });
    }
    es=applyConstraintES(t,es);
    t.es=es;t.ef=addDays(es,dur);
  });

  // Project end = latest EF
  let projEnd=new Date(0);
  order.forEach(id=>{const t=taskMap[id];if(t&&t.ef&&t.ef>projEnd)projEnd=t.ef;});
  if(projEnd.getTime()===0)projEnd=parseDate(tasks[tasks.length-1]?.end||fmt(new Date()));

  // Backward pass
  [...order].reverse().forEach(id=>{
    const t=taskMap[id];if(!t)return;
    const dur=Math.max(0,daysDiff(t.start,t.end));
    const succs=deps.filter(d=>d.fromId===id);
    let lf=new Date(projEnd);
    if(succs.length>0){
      lf=new Date(8640000000000000);
      succs.forEach(d=>{
        const to=taskMap[d.toId];if(!to||!to.ls)return;
        const lagMs=(d.lag||0)*86400000;
        let cand;
        const toLS=to.ls;const toLF=to.lf||addDays(to.ls,dur);
        switch(d.type){
          case'FS':cand=new Date(toLS.getTime()-lagMs);break;
          case'SS':cand=new Date(toLS.getTime()-lagMs+dur*86400000);break;
          case'FF':cand=new Date(toLF.getTime()-lagMs);break;
          case'SF':cand=new Date(toLF.getTime()-lagMs+dur*86400000);break;
          default:cand=new Date(toLS.getTime()-lagMs);
        }
        if(cand<lf)lf=cand;
      });
    }
    lf=applyConstraintLF(t,lf);
    t.lf=lf;t.ls=addDays(lf,-dur);
    t.tf=Math.round((t.ls.getTime()-t.es.getTime())/86400000);
    t.ff=0;
    t.isCritical=showCP&&(t.tf<=threshold);
    // Constraint conflict check
    t.hasConflict=false;
    if(t.constraintDate&&t.es){
      const cd=parseDate(t.constraintDate);
      if((t.constraintType==='MSO'||t.constraintType==='SNET')&&t.es>cd)t.hasConflict=true;
      if((t.constraintType==='MFO'||t.constraintType==='FNLT')&&t.ef&&t.ef>cd)t.hasConflict=true;
    }
  });

  // Free float
  order.forEach(id=>{
    const t=taskMap[id];if(!t)return;
    const succs=deps.filter(d=>d.fromId===id);
    if(succs.length===0){t.ff=Math.max(0,t.tf||0);return;}
    let minEarliest=new Date(8640000000000000);
    succs.forEach(d=>{
      const to=taskMap[d.toId];if(!to||!to.es)return;
      const lagMs=(d.lag||0)*86400000;let cand;
      const dur=Math.max(0,daysDiff(t.start,t.end));
      switch(d.type){
        case'FS':cand=new Date(to.es.getTime()-lagMs);break;
        case'SS':cand=new Date(to.es.getTime()-lagMs+dur*86400000);break;
        case'FF':cand=new Date(to.ef?to.ef.getTime()-lagMs:to.es.getTime()-lagMs);break;
        default:cand=new Date(to.es.getTime()-lagMs);
      }
      if(cand<minEarliest)minEarliest=cand;
    });
    t.ff=Math.max(0,Math.round((minEarliest.getTime()-(t.ef?t.ef.getTime():parseDate(t.end).getTime()))/86400000));
  });

  // Mark critical deps
  deps.forEach(d=>{
    const from=taskMap[d.fromId],to=taskMap[d.toId];
    d.isCritical=showCP&&from&&to&&from.isCritical&&to.isCritical;
  });
}

// ============================================================
// AUTO STATUS
// ============================================================
function autoStatus(t){
  if(t.pct>=100)return'done';
  const dd=getDataDate();
  const s=parseDate(t.start),e=parseDate(t.end),tot=e-s;
  if(tot<=0)return'track';
  const elapsed=Math.min(1,Math.max(0,(dd-s)/tot));
  const gap=elapsed*100-t.pct;
  if(gap>10)return'risk';
  if(gap>0)return'delay';
  return'track';
}

// ============================================================
// WBS HELPERS
// ============================================================
function getVisibleTasks(){
  const collapsed=new Set();
  tasks.forEach(t=>{if(t.isSummary&&t.collapsed)collapsed.add(t.id);});
  return tasks.filter(t=>{
    if(!t.parentId)return true;
    // check all ancestors
    let pid=t.parentId;
    while(pid){
      if(collapsed.has(pid))return false;
      const parent=tasks.find(x=>x.id===pid);
      pid=parent?parent.parentId:null;
    }
    return true;
  });
}
function getIndentLevel(t){
  let level=0,pid=t.parentId;
  while(pid){level++;const p=tasks.find(x=>x.id===pid);pid=p?p.parentId:null;}
  return level;
}
function hasChildren(t){return tasks.some(x=>x.parentId===t.id);}
function getSummaryDates(t){
  const children=tasks.filter(x=>x.parentId===t.id);
  if(!children.length)return{start:t.start,end:t.end};
  let s=parseDate(children[0].start),e=parseDate(children[0].end);
  children.forEach(c=>{const cs=parseDate(c.start),ce=parseDate(c.end);if(cs<s)s=cs;if(ce>e)e=ce;});
  return{start:fmt(s),end:fmt(e)};
}

// ============================================================
// PERIOD / VIEW
// ============================================================
function getProjectDateRange(){
  // Find min start and max end across all tasks
  let minDate=null,maxDate=null;
  tasks.forEach(t=>{
    const s=parseDate(t.start),e=parseDate(t.end||t.start);
    if(!minDate||s<minDate)minDate=s;
    if(!maxDate||e>maxDate)maxDate=e;
  });
  if(!minDate){const y=new Date().getFullYear();minDate=new Date(y,0,1);maxDate=new Date(y,11,31);}
  // Add padding
  const padStart=new Date(minDate);padStart.setMonth(padStart.getMonth()-1);padStart.setDate(1);
  const padEnd=new Date(maxDate);padEnd.setMonth(padEnd.getMonth()+2);padEnd.setDate(0);
  return{start:padStart,end:padEnd};
}

function getYear(){return +document.getElementById('yearSel').value||new Date().getFullYear();}
function getMode(){return document.getElementById('viewMode')?.value||'month';}
function getPeriods(){
  const m=getMode();
  const MN=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const {start:rangeStart,end:rangeEnd}=getProjectDateRange();
  const out=[];

  if(m==='day'){
    let d=new Date(rangeStart);d.setDate(1);
    while(d<=rangeEnd){
      const y=d.getFullYear(),mi=d.getMonth(),days=new Date(y,mi+1,0).getDate();
      for(let di=1;di<=days;di++){
        const s=new Date(y,mi,di);
        if(s>rangeEnd)break;
        out.push({label:di===1?MN[mi]+' '+String(y).slice(2):String(di),start:s,end:s,cols:1,month:mi,year:y,isFirst:di===1});
      }
      d.setMonth(d.getMonth()+1);
    }
  }else if(m==='week'){
    let d=new Date(rangeStart);while(d.getDay()!==1)d.setDate(d.getDate()-1);
    let w=1;
    while(d<=rangeEnd){
      const s=new Date(d),e=new Date(d);e.setDate(e.getDate()+6);
      const lbl=s.getDate()===1||w===1?MN[s.getMonth()]+' '+String(s.getFullYear()).slice(2):'S'+s.getDate();
      out.push({label:lbl,start:s,end:e,cols:1,month:s.getMonth(),year:s.getFullYear()});
      d.setDate(d.getDate()+7);w++;
    }
  }else if(m==='month'){
    let d=new Date(rangeStart.getFullYear(),rangeStart.getMonth(),1);
    while(d<=rangeEnd){
      const y=d.getFullYear(),mi=d.getMonth();
      out.push({label:MN[mi],start:new Date(y,mi,1),end:new Date(y,mi+1,0),cols:1,month:mi,year:y});
      d.setMonth(d.getMonth()+1);
    }
  }else{// quarter
    let d=new Date(rangeStart.getFullYear(),0,1);
    while(d<=rangeEnd){
      const y=d.getFullYear();
      for(let q=0;q<4;q++){
        const qs=new Date(y,q*3,1),qe=new Date(y,(q+1)*3,0);
        if(qs>rangeEnd)break;
        out.push({label:`T${q+1} ${String(y).slice(2)}`,start:qs,end:qe,cols:3,month:q*3,year:y});
      }
      d.setFullYear(d.getFullYear()+1);
    }
  }
  return out;
}
function d2c(date,periods){
  const d=date instanceof Date?date:parseDate(date);if(!d)return 0;
  const tot=periods.reduce((a,p)=>a+p.cols,0);
  const rs=periods[0].start,re=new Date(periods[periods.length-1].end);re.setDate(re.getDate()+1);
  return Math.max(0,Math.min(tot,(d-rs)/(re-rs)*tot));
}

// ============================================================
// RENDER — GANTT TABLE
// ============================================================
function applyColWidths(){
  const m=getMode();
  const isDayView=m==='day';
  const pw=isDayView?Math.min(colWidths.period,24):colWidths.period;
  let s=document.getElementById('dynColWidths');
  if(!s){s=document.createElement('style');s.id='dynColWidths';document.head.appendChild(s);}
  s.textContent=`.c-task{width:${colWidths.task}px;min-width:${colWidths.task}px}.c-owner{width:${colWidths.owner}px;min-width:${colWidths.owner}px}.c-status{width:${colWidths.status}px;min-width:${colWidths.status}px}.c-pct{width:${colWidths.pct}px;min-width:${colWidths.pct}px}.c-dates{width:${colWidths.dates}px;min-width:${colWidths.dates}px}.th-period{min-width:${pw}px}.gcell{min-width:${isDayView?pw*365:colWidths.period*(m==='week'?52:12)}px}`;
}
function applyColVis(){
  COL_DEFS.forEach(col=>{
    document.querySelectorAll(`[data-col="${col.key}"]`).forEach(el=>el.classList.toggle('col-hidden',colVis[col.key]===false));
  });
}

function renderKPIs(){
  runCPM();
  const dd=getDataDate();
  const n=tasks.length;
  const done=tasks.filter(t=>autoStatus(t)==='done').length;
  const avg=n?Math.round(tasks.reduce((a,t)=>a+t.pct,0)/n):0;
  const risk=tasks.filter(t=>{const s=autoStatus(t);return s==='risk'||s==='delay';}).length;
  const crit=tasks.filter(t=>t.isCritical).length;
  const kpis=[
    {val:n,lbl:'TAREFAS',cls:''},
    {val:done,lbl:'CONCLUÍDAS',cls:'green'},
    {val:avg+'%',lbl:'PROGRESSO',cls:avg>=80?'green':avg>=50?'blue':'amber'},
    {val:risk,lbl:'EM RISCO',cls:risk>0?'red':''},
    {val:crit,lbl:'CRÍTICAS',cls:crit>0?'red':''},
  ];
  document.getElementById('kpiRow').innerHTML=kpis.map(k=>`<div class="kpi ${k.cls}"><div class="kpi-val">${k.val}</div><div class="kpi-lbl">${k.lbl}</div></div>`).join('');
}

function renderYearSel(){
  // Populate from project range
  const {start,end}=getProjectDateRange();
  const sel=document.getElementById('yearSel');
  const cur=sel.value||new Date().getFullYear();
  sel.innerHTML='';
  for(let y=start.getFullYear();y<=end.getFullYear();y++)
    sel.innerHTML+=`<option value="${y}"${y==cur?' selected':''}>${y}</option>`;
}

function scrollToYear(y){
  // Scroll gantt to the start of the selected year
  requestAnimationFrame(()=>{
    const periods=getPeriods();
    const tot=periods.reduce((a,p)=>a+p.cols,0);
    const targetDate=new Date(+y,0,1);
    const col=d2c(targetDate,periods);
    const outer=document.getElementById('ganttOuter');
    if(!outer)return;
    const gcell=document.querySelector('.gcell');
    if(!gcell)return;
    const totalPx=gcell.getBoundingClientRect().width/tot*periods.length;
    const cellPx=gcell.getBoundingClientRect().width/tot*col;
    outer.scrollLeft=Math.max(0,cellPx-60);
  });
}

function render(){
  renderYearSel();renderKPIs();applyColWidths();
  const periods=getPeriods(),tot=periods.reduce((a,p)=>a+p.cols,0);
  const m=getMode();const MN=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const isDoubleRow=m==='day'||m==='week';

  // Build month groups — include year label when crossing year boundary
  let monthGroups=[];
  if(isDoubleRow){
    let cur=null;
    periods.forEach(p=>{
      const key=`${p.year}-${p.month}`;
      if(!cur||cur.key!==key){
        cur={key,mo:p.month,year:p.year,label:MN[p.month]+(p.year!==periods[0].year||p.month===0?` ${String(p.year).slice(2)}`:''),count:0};
        monthGroups.push(cur);
      }
      cur.count++;
    });
  }

  // Year groups for month/quarter view (shown as top row)
  let yearGroups=[];
  if(m==='month'||m==='quarter'){
    let cur=null;
    periods.forEach(p=>{
      if(!cur||cur.year!==p.year){cur={year:p.year,count:0};yearGroups.push(cur);}
      cur.count+=p.cols;
    });
  }

  const hasYearRow=(m==='month'||m==='quarter')&&yearGroups.length>1;
  const rs=isDoubleRow||hasYearRow?'rowspan="2"':'';
  let html=`<thead>`;

  // Year header row (month/quarter only, when multi-year)
  if(hasYearRow){
    html+=`<tr>`;
    html+=`<th class="c-task" rowspan="2" style="text-align:left;padding-left:10px">TAREFA</th>`;
    html+=`<th class="th-c c-owner" data-col="owner" rowspan="2">RESPONSÁVEL</th>`;
    html+=`<th class="th-c c-status" data-col="status" rowspan="2">STATUS</th>`;
    html+=`<th class="th-c c-pct" data-col="pct" rowspan="2">%</th>`;
    html+=`<th class="th-c c-dates" data-col="dates" rowspan="2">DATAS</th>`;
    customCols.forEach(cc=>{if(colVis[cc.key]!==false)html+=`<th data-col="${cc.key}" rowspan="2" style="min-width:100px">${esc(cc.label)}</th>`;});
    yearGroups.forEach(yg=>html+=`<th class="th-period th-month-group" colspan="${yg.count}" style="font-size:11px;font-weight:800;letter-spacing:.05em">${yg.year}</th>`);
    html+=`<th class="no-print" rowspan="2" style="min-width:30px;border-left:1px solid var(--line2)"></th>`;
    html+=`</tr><tr>`;
    periods.forEach(p=>html+=`<th class="th-period" colspan="${p.cols}">${p.label}</th>`);
    html+=`</tr>`;
  } else {
    html+=`<tr>`;
    html+=`<th class="c-task" ${rs} style="text-align:left;padding-left:10px">TAREFA</th>`;
    html+=`<th class="th-c c-owner" data-col="owner" ${rs}>RESPONSÁVEL</th>`;
    html+=`<th class="th-c c-status" data-col="status" ${rs}>STATUS</th>`;
    html+=`<th class="th-c c-pct" data-col="pct" ${rs}>%</th>`;
    html+=`<th class="th-c c-dates" data-col="dates" ${rs}>DATAS</th>`;
    customCols.forEach(cc=>{if(colVis[cc.key]!==false)html+=`<th data-col="${cc.key}" ${rs} style="min-width:100px">${esc(cc.label)}</th>`;});
    if(isDoubleRow){
      monthGroups.forEach(mg=>html+=`<th class="th-period th-month-group" colspan="${mg.count}">${mg.label}</th>`);
      html+=`</tr><tr>`;
      periods.forEach(p=>{
        const isWknd=m==='day'&&[0,6].includes(p.start.getDay());
        html+=`<th class="th-period${isWknd?' weekend':''}">${p.label}</th>`;
      });
    }else{
      periods.forEach(p=>html+=`<th class="th-period" colspan="${p.cols}">${p.label}</th>`);
    }
    html+=`<th class="no-print" style="min-width:30px;border-left:1px solid var(--line2)" ${rs}></th>`;
    html+=`</tr>`;
  }
  html+=`</thead><tbody>`;

  const visible=getVisibleTasks();
  visible.forEach((t,i)=>{
    const isSummary=t.isSummary||hasChildren(t);
    const isMS=t.isMilestone;
    const indent=getIndentLevel(t);
    const dates=isSummary?getSummaryDates(t):{start:t.start,end:t.end};
    const sc=d2c(dates.start,periods),ec=d2c(dates.end,periods);
    const lp=(sc/tot)*100;
    const wp=isMS?0:Math.max(.3,(ec-sc)/tot*100);
    const sm=SM[autoStatus(t)]||SM.track;
    const statusCls=isSummary?'s-done':sm.cls;
    const statusLbl=isSummary?'—':sm.label;

    html+=`<tr class="${i%2?'alt':''}" data-id="${t.id}">`;
    // TASK CELL
    html+=`<td class="c-task"><div class="task-cell-inner">`;
    html+=`<div class="wbs-indent" style="width:${indent*14}px;flex-shrink:0"></div>`;
    if(isSummary){
      html+=`<button class="expand-btn" onclick="toggleCollapse(${t.id})">${t.collapsed?'▶':'▼'}</button>`;
    }else{
      html+=`<div style="width:16px;flex-shrink:0"></div>`;
    }
    if(t.wbsCode)html+=`<span style="font-size:9px;font-weight:700;color:var(--text3);margin-right:3px;flex-shrink:0">${esc(t.wbsCode)}</span>`;
    html+=`<input class="task-name-input${isSummary?' summary':isMS?' milestone-name':''}" value="${esc(t.name)}" onchange="upd(${t.id},'name',this.value)" ondblclick="openModal(${t.id})"/>`;
    if(t.constraintType&&t.constraintType!=='ASAP'&&t.constraintType!=='ALAP')
      html+=`<span class="constraint-badge" title="${CONSTRAINT_LABELS[t.constraintType]||''}">${t.constraintType}</span>`;
    html+=`</div></td>`;
    html+=`<td class="c-owner" data-col="owner"><input class="ci-sm" value="${esc(t.owner)}" onchange="upd(${t.id},'owner',this.value)"/></td>`;
    html+=`<td class="c-status" data-col="status"><span class="sbadge ${statusCls}" onclick="${isSummary?'':('cycleStatus('+t.id+')')}">${statusLbl}</span></td>`;
    html+=`<td class="c-pct" data-col="pct"><input class="ci-n" type="number" min="0" max="100" value="${t.pct}" onchange="upd(${t.id},'pct',+this.value)"/>%</td>`;
    html+=`<td class="c-dates" data-col="dates"><div class="c-dates-inner">${fmtS(dates.start)}<br/>${fmtS(dates.end)}</div></td>`;
    customCols.forEach(cc=>{if(colVis[cc.key]!==false)html+=`<td data-col="${cc.key}" style="padding:0 8px"><input class="ci-sm" value="${esc(t[cc.key]||'')}" onchange="upd(${t.id},'${cc.key}',this.value)"/></td>`;});

    // GCELL
    html+=`<td colspan="${tot}" class="gcell" data-id="${t.id}">`;

    if(isMS){
      // Milestone diamond
      const mlp=(d2c(t.start,periods)/tot*100);
      html+=`<div class="milestone-diamond${t.isCritical?' critical-ms':''}" data-id="${t.id}" style="left:calc(${mlp.toFixed(2)}% - 9px);background:${t.color}" ondblclick="openModal(${t.id})" title="${esc(t.name)}" onmouseenter="showTooltip(event,${t.id})" onmouseleave="hideTooltip()"></div>`;
    }else{
      // Bar
      const bcolor=isSummary?'rgba(30,41,59,.7)':t.color;
      const bh=isSummary?'summary-bar':'';
      html+=`<div class="bar ${bh}${t.isCritical?' critical-bar':''}" data-id="${t.id}" style="left:${lp.toFixed(2)}%;width:${wp.toFixed(2)}%;background:${bcolor}" ondblclick="openModal(${t.id})" onmouseenter="showTooltip(event,${t.id})" onmouseleave="hideTooltip()">`;
      if(!isSummary)html+=`<div class="bhandle bhl" data-h="l" data-id="${t.id}"></div>`;
      html+=`<div class="bprog" style="width:${t.pct}%"></div>`;
      html+=`<span class="bar-label">${esc(t.name)}</span>`;
      if(!isSummary)html+=`<div class="bhandle bhr" data-h="r" data-id="${t.id}"></div>`;
      // Connect handles
      html+=`<div class="dep-handle dh-start" data-htype="start" data-id="${t.id}"></div>`;
      html+=`<div class="dep-handle dh-end" data-htype="end" data-id="${t.id}"></div>`;
      if(t.constraintType&&t.constraintType!=='ASAP')html+=`<span class="constraint-icon" title="${t.constraintType}">🔒</span>`;
      if(t.hasConflict)html+=`<span class="conflict-icon" title="Conflito de restrição">⚠️</span>`;
      html+=`</div>`;
    }

    // Baseline bars
    activeBaselines.forEach(slot=>{
      const bl=baselines[slot-1];if(!bl)return;
      const bt=bl.tasks.find(x=>x.id===t.id);if(!bt)return;
      const bsc=d2c(bt.start,periods),bec=d2c(bt.end,periods);
      const blp=(bsc/tot)*100,bwp=Math.max(.3,(bec-bsc)/tot*100);
      html+=`<div class="bl-bar" data-slot="${slot}" style="left:${blp.toFixed(2)}%;width:${bwp.toFixed(2)}%" title="Baseline B${slot}: ${fmtS(bt.start)} → ${fmtS(bt.end)}"></div>`;
    });

    html+=`</td>`;
    html+=`<td class="no-print" style="border-left:1px solid var(--line2);padding:0 4px;width:30px">
      <button onclick="removeTask(${t.id})" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:14px;padding:2px" title="Remover">×</button>
    </td>`;
    html+=`</tr>`;
  });

  html+=`</tbody>`;
  document.getElementById('ganttTable').innerHTML=html;

  // Today line
  const dd=getDataDate();const ddlp=d2c(dd,periods)/tot*100;
  document.querySelectorAll('.gcell').forEach(c=>{
    const ln=document.createElement('div');ln.className='today-ln';
    ln.style.left=ddlp.toFixed(2)+'%';
    ln.title='Data Date: '+fmtS(fmt(dd));
    c.appendChild(ln);
  });

  applyColVis();
  setTimeout(()=>{updateArrows();setupDrag();setupConnectHandles();},50);
  renderFooter();buildColPanel();updateAlertCount();
  if(currentPanel==='dash')renderDashboard();
  if(currentPanel==='look')renderLookahead();
  if(currentPanel==='alerts')renderAlerts();
}

// ============================================================
// SVG ARROWS
// ============================================================
function updateArrows(){
  const svg=document.getElementById('depSvg');const pathsG=document.getElementById('depPaths');
  if(!svg||!pathsG)return;
  const wrapper=document.getElementById('ganttWrapper');
  if(!wrapper)return;
  svg.setAttribute('width',wrapper.scrollWidth);
  svg.setAttribute('height',wrapper.scrollHeight);
  const wRect=wrapper.getBoundingClientRect();
  const outer=document.getElementById('ganttOuter');
  const sx=outer.scrollLeft,sy=outer.scrollTop;

  let html='';
  deps.forEach(d=>{
    const fromEl=document.querySelector(`.bar[data-id="${d.fromId}"], .milestone-diamond[data-id="${d.fromId}"]`);
    const toEl=document.querySelector(`.bar[data-id="${d.toId}"], .milestone-diamond[data-id="${d.toId}"]`);
    if(!fromEl||!toEl)return;
    const fr=fromEl.getBoundingClientRect(),tr=toEl.getBoundingClientRect();
    const fx=fr.left-wRect.left+sx,fy=fr.top-wRect.top+sy+fr.height/2;
    const fw=fr.width,fh=fr.height;
    const tx=tr.left-wRect.left+sx,ty=tr.top-wRect.top+sy+tr.height/2;
    const tw=tr.width;
    const color=d.isCritical?'#dc2626':'#64748b';
    const marker=d.isCritical?'arrowRed':'arrowGray';
    let x1,y1,x2,y2,path;
    switch(d.type){
      case'FS':x1=fx+fw;y1=fy;x2=tx;y2=ty;break;
      case'SS':x1=fx;y1=fy;x2=tx;y2=ty;break;
      case'FF':x1=fx+fw;y1=fy;x2=tx+tw;y2=ty;break;
      case'SF':x1=fx;y1=fy;x2=tx+tw;y2=ty;break;
      default:x1=fx+fw;y1=fy;x2=tx;y2=ty;
    }
    const lagLabel=d.lag?` ${d.lag>0?'+':''}${d.lag}d`:'';
    const typeLabel=d.type;
    // Orthogonal path
    if(Math.abs(y1-y2)<4){
      path=`M${x1},${y1} H${x2}`;
    }else{
      const mid=d.type==='SS'?Math.min(x1,x2)-20:(d.type==='FF'?Math.max(x1,x2)+20:(x1+x2)/2);
      if((d.type==='FS'||d.type==='SF')&&x2>x1+4){
        path=`M${x1},${y1} H${mid} V${y2} H${x2}`;
      }else if(d.type==='SS'||d.type==='FF'){
        const ox=d.type==='SS'?Math.min(x1,x2)-18:Math.max(x1,x2)+18;
        path=`M${x1},${y1} H${ox} V${y2} H${x2}`;
      }else{
        const bx=x1+20,midY=(y1+y2)/2;
        path=`M${x1},${y1} H${bx} V${midY} H${x2-20} V${y2} H${x2}`;
      }
    }
    const lmx=(x1+x2)/2,lmy=(y1+y2)/2;
    html+=`<g class="dep-arrow" data-dep-id="${d.id}" style="cursor:pointer" onclick="openDepPopover(event,${d.id})">
      <path d="${path}" fill="none" stroke="${color}" stroke-width="1.5" marker-end="url(#${marker})"/>
      <path d="${path}" fill="none" stroke="transparent" stroke-width="10"/>
      <rect x="${lmx-16}" y="${lmy-8}" width="32" height="14" rx="3" fill="${color}" opacity=".85"/>
      <text x="${lmx}" y="${lmy+3}" text-anchor="middle" font-size="8" fill="#fff" font-family="monospace">${typeLabel}${lagLabel}</text>
    </g>`;
  });
  pathsG.innerHTML=html;
}

// ============================================================
// DEPENDENCY POPOVER
// ============================================================
function openDepPopover(e,depId){
  e.stopPropagation();
  const d=deps.find(x=>x.id===depId);if(!d)return;
  editDepId=depId;
  document.getElementById('depType').value=d.type;
  document.getElementById('depLag').value=d.lag||0;
  const pop=document.getElementById('depPopover');
  pop.style.left=Math.min(e.clientX,window.innerWidth-220)+'px';
  pop.style.top=Math.min(e.clientY,window.innerHeight-160)+'px';
  pop.classList.add('open');
}
function closeDepPopover(){document.getElementById('depPopover').classList.remove('open');editDepId=null;}
function updateDep(){
  const d=deps.find(x=>x.id===editDepId);if(!d)return;
  d.type=document.getElementById('depType').value;
  d.lag=parseInt(document.getElementById('depLag').value)||0;
  runCPM();updateArrows();saveState();
}
function deleteDep(){
  deps=deps.filter(x=>x.id!==editDepId);closeDepPopover();render();saveState();
}
document.addEventListener('click',e=>{
  if(!document.getElementById('depPopover').contains(e.target))closeDepPopover();
});

// ============================================================
// DRAG — BAR MOVE & RESIZE
// ============================================================
function setupDrag(){
  const outer=document.getElementById('ganttOuter');
  let drag=null;
  function gx(e){return(e.touches?e.touches[0]:e).clientX;}
  function periods(){return getPeriods();}
  function tot(){return periods().reduce((a,p)=>a+p.cols,0);}
  function cellW(){const c=document.querySelector('.gcell');return c?c.getBoundingClientRect().width/tot():40;}
  function dpp(){const ps=periods();return(ps[ps.length-1].end-ps[0].start+86400000)/(tot()*86400000);}

  document.querySelectorAll('.bar').forEach(bar=>{
    bar.addEventListener('mousedown',function(e){
      if(e.target.dataset.h||e.target.classList.contains('dep-handle')||connectMode)return;
      e.preventDefault();
      const id=+this.dataset.id,t=tasks.find(x=>x.id===id);if(!t)return;
      drag={type:'move',id,x:gx(e),os:parseDate(t.start),oe:parseDate(t.end)};
      on();
    });
  });
  document.querySelectorAll('.bhandle').forEach(h=>{
    h.addEventListener('mousedown',function(e){
      e.preventDefault();e.stopPropagation();
      const id=+this.dataset.id,t=tasks.find(x=>x.id===id);if(!t)return;
      drag={type:'resize',side:this.dataset.h,id,x:gx(e),os:parseDate(t.start),oe:parseDate(t.end)};on();
    });
  });
  function on(){document.addEventListener('mousemove',mv);document.addEventListener('mouseup',off);}
  function off(){if(drag){drag=null;runCPM();updateArrows();saveState();}document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',off);}
  function mv(e){
    if(!drag)return;e.preventDefault();
    const dd=Math.round((gx(e)-drag.x)/cellW()*dpp());
    const t=tasks.find(x=>x.id===drag.id);if(!t)return;
    if(drag.type==='move'){
      t.start=fmt(addDays(drag.os,dd));t.end=fmt(addDays(drag.oe,dd));
    }else if(drag.side==='l'){
      const ns=addDays(drag.os,dd);if(ns<parseDate(t.end))t.start=fmt(ns);
    }else{
      const ne=addDays(drag.oe,dd);if(ne>parseDate(t.start))t.end=fmt(ne);
    }
    render();
  }
}

// ============================================================
// CONNECT MODE — DEPENDENCY CREATION
// ============================================================
let showArrows=true;
function toggleArrows(){
  showArrows=!showArrows;
  document.getElementById('depSvg').style.display=showArrows?'':'none';
  document.getElementById('arrowsBtn').classList.toggle('active',!showArrows);
  document.getElementById('arrowsBtn').textContent=showArrows?'↗ Setas':'↗ Setas (ocultas)';
}

function toggleConnectMode(){
  connectMode=!connectMode;
  document.getElementById('connectBtn').classList.toggle('active',connectMode);
  document.getElementById('ganttWrapper').classList.toggle('connect-mode',connectMode);
  document.getElementById('depSvg').classList.toggle('connect-active',connectMode);
  pendingConnectFrom=null;
  document.getElementById('depTemp').innerHTML='';
}

function setupConnectHandles(){
  document.querySelectorAll('.dep-handle').forEach(h=>{
    h.addEventListener('mousedown',function(e){
      if(!connectMode)return;
      e.preventDefault();e.stopPropagation();
      pendingConnectFrom={id:+this.dataset.id,htype:this.dataset.htype,el:this};
    });
    h.addEventListener('mouseup',function(e){
      if(!connectMode||!pendingConnectFrom)return;
      e.preventDefault();e.stopPropagation();
      const toId=+this.dataset.id,toHtype=this.dataset.htype;
      const fromId=pendingConnectFrom.id,fromHtype=pendingConnectFrom.htype;
      if(fromId===toId){pendingConnectFrom=null;document.getElementById('depTemp').innerHTML='';return;}
      let type='FS';
      if(fromHtype==='end'&&toHtype==='start')type='FS';
      else if(fromHtype==='start'&&toHtype==='start')type='SS';
      else if(fromHtype==='end'&&toHtype==='end')type='FF';
      else if(fromHtype==='start'&&toHtype==='end')type='SF';
      // Check for duplicate
      if(!deps.find(d=>d.fromId===fromId&&d.toId===toId&&d.type===type)){
        deps.push({id:nextDepId++,fromId,toId,type,lag:0});
        runCPM();updateArrows();saveState();
      }
      pendingConnectFrom=null;document.getElementById('depTemp').innerHTML='';
    });
  });

  const svg=document.getElementById('depSvg');
  if(!svg)return;
  svg.addEventListener('mousemove',function(e){
    if(!connectMode||!pendingConnectFrom)return;
    const fromEl=pendingConnectFrom.el;
    const fr=fromEl.getBoundingClientRect();
    const wRect=document.getElementById('ganttWrapper').getBoundingClientRect();
    const outer=document.getElementById('ganttOuter');
    const x1=fr.left-wRect.left+outer.scrollLeft+fr.width/2;
    const y1=fr.top-wRect.top+outer.scrollTop+fr.height/2;
    const x2=e.clientX-wRect.left+outer.scrollLeft;
    const y2=e.clientY-wRect.top+outer.scrollTop;
    document.getElementById('depTemp').innerHTML=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2563eb" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrowBlue)"/>`;
  });
  svg.addEventListener('mouseup',function(){
    if(!connectMode||!pendingConnectFrom)return;
    pendingConnectFrom=null;document.getElementById('depTemp').innerHTML='';
  });
}

// ============================================================
// TOOLTIP
// ============================================================
function showTooltip(e,id){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  const tip=document.getElementById('ganttTooltip');
  const esSt=t.es?fmtS(fmt(t.es)):'—',efSt=t.ef?fmtS(fmt(t.ef)):'—';
  const lsSt=t.ls?fmtS(fmt(t.ls)):'—',lfSt=t.lf?fmtS(fmt(t.lf)):'—';
  const tf=t.tf!==undefined?t.tf:'—',ff=t.ff!==undefined?t.ff:'—';
  const sm=autoStatus(t);
  let bl='';
  activeBaselines.forEach(slot=>{
    const blObj=baselines[slot-1];if(!blObj)return;
    const bt=blObj.tasks.find(x=>x.id===id);if(!bt)return;
    const sv=t.pct-bt.pct;const di=daysDiff(bt.end,t.end);
    bl+=`<div class="tt-sep"></div><div class="tt-row"><span class="tt-label">B${slot} Início</span><span class="tt-val">${fmtS(bt.start)}</span></div><div class="tt-row"><span class="tt-label">B${slot} Término</span><span class="tt-val">${fmtS(bt.end)}</span></div><div class="tt-row"><span class="tt-label">Desvio Prazo</span><span class="tt-val ${di>0?'critical':''}">${di>0?'+':''}${di}d</span></div><div class="tt-row"><span class="tt-label">SV</span><span class="tt-val ${sv<0?'critical':''}">${sv>0?'+':''}${sv}%</span></div>`;
  });
  const predList=deps.filter(d=>d.toId===id).map(d=>{const f=tasks.find(x=>x.id===d.fromId);return f?`${f.wbsCode||''} ${d.type}${d.lag?`+${d.lag}d`:''}`:'';}).filter(Boolean);
  tip.innerHTML=`<div class="tt-title">${esc(t.wbsCode?t.wbsCode+' ':'')}${esc(t.name)}</div>
    <div class="tt-row"><span class="tt-label">Status</span><span class="tt-val">${SM[sm]?.label||sm}</span></div>
    <div class="tt-row"><span class="tt-label">Progresso</span><span class="tt-val">${t.pct}%</span></div>
    <div class="tt-sep"></div>
    <div class="tt-row"><span class="tt-label">ES</span><span class="tt-val">${esSt}</span></div>
    <div class="tt-row"><span class="tt-label">EF</span><span class="tt-val">${efSt}</span></div>
    <div class="tt-row"><span class="tt-label">LS</span><span class="tt-val">${lsSt}</span></div>
    <div class="tt-row"><span class="tt-label">LF</span><span class="tt-val">${lfSt}</span></div>
    <div class="tt-sep"></div>
    <div class="tt-row"><span class="tt-label">Total Float</span><span class="tt-val ${t.isCritical?'critical':''}">${tf} dias</span></div>
    <div class="tt-row"><span class="tt-label">Free Float</span><span class="tt-val">${ff} dias</span></div>
    ${predList.length?`<div class="tt-sep"></div><div class="tt-row"><span class="tt-label">Predecessores</span><span class="tt-val">${predList.join(', ')}</span></div>`:''}
    ${bl}
    ${t.notes?`<div class="tt-sep"></div><div style="font-size:10px;color:#94a3b8;margin-top:2px">${esc(t.notes)}</div>`:''}`;
  tip.style.display='block';
  const x=Math.min(e.clientX+12,window.innerWidth-220);
  const y=Math.min(e.clientY+12,window.innerHeight-300);
  tip.style.left=x+'px';tip.style.top=y+'px';
}
function hideTooltip(){document.getElementById('ganttTooltip').style.display='none';}

// ============================================================
// FOOTER
// ============================================================
function renderFooter(){
  const el=document.getElementById('footerLegend');
  if(colVis.legend===false){el.style.display='none';return;}
  el.style.display='flex';
  let h='';
  tasks.filter(t=>!t.isSummary).slice(0,8).forEach(t=>h+=`<div class="li"><span class="ldot" style="background:${t.color}"></span>${esc(t.name)}</div>`);
  if(tasks.length>8)h+=`<div class="li" style="color:var(--text3)">+${tasks.length-8} mais</div>`;
  h+='<div class="lsep"></div>';
  Object.values(SM).forEach(v=>h+=`<div class="li"><span class="sbadge ${v.cls}" style="font-size:9px;padding:2px 6px;cursor:default">${v.label}</span></div>`);
  h+='<div class="lsep"></div><div class="li"><span class="ldot" style="background:#dc2626"></span>Data Date</div>';
  el.innerHTML=h;
}

// ============================================================
// TASK MODAL
// ============================================================
function openModal(id){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  modalTaskId=id;
  document.getElementById('modalTitle').textContent=t.isMilestone?'Editar Marco':'Editar Tarefa';
  document.getElementById('mName').value=t.name;
  document.getElementById('mOwner').value=t.owner||'';
  document.getElementById('mType').value=t.isMilestone?'milestone':t.isSummary?'summary':'task';
  document.getElementById('mStart').value=t.start;
  document.getElementById('mEnd').value=t.end;
  document.getElementById('mPct').value=t.pct;
  document.getElementById('mWbsCode').value=t.wbsCode||'';
  document.getElementById('mConstraint').value=t.constraintType||'ASAP';
  document.getElementById('mConstraintDate').value=t.constraintDate||'';
  document.getElementById('mNotes').value=t.notes||'';
  toggleConstraintDate();
  // Parent select
  const pSel=document.getElementById('mParent');
  pSel.innerHTML='<option value="">— Sem pai —</option>';
  tasks.filter(x=>x.id!==id&&(x.isSummary||hasChildren(x))).forEach(x=>{
    pSel.innerHTML+=`<option value="${x.id}"${x.id===t.parentId?' selected':''}>${esc(x.wbsCode||'')} ${esc(x.name)}</option>`;
  });
  // Swatches
  selColor=t.color;
  document.getElementById('swatches').innerHTML=COLORS.map(c=>`<div class="swatch${c===selColor?' sel':''}" style="background:${c}" onclick="selColor='${c}';document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('sel'));this.classList.add('sel')"></div>`).join('');
  // Deps list
  const predDeps=deps.filter(d=>d.toId===id);
  const succDeps=deps.filter(d=>d.fromId===id);
  let depHtml='';
  if(predDeps.length){
    depHtml+='<div style="font-size:10px;font-weight:700;color:var(--text3);margin-bottom:4px">PREDECESSORES</div>';
    predDeps.forEach(d=>{
      const f=tasks.find(x=>x.id===d.fromId);
      depHtml+=`<div class="dep-item"><span>${f?esc(f.wbsCode+' '+f.name):'?'} — <strong>${d.type}</strong>${d.lag?` Lag:${d.lag}d`:''}</span><button onclick="removeDep(${d.id})" title="Remover">×</button></div>`;
    });
  }
  if(succDeps.length){
    depHtml+='<div style="font-size:10px;font-weight:700;color:var(--text3);margin-top:6px;margin-bottom:4px">SUCESSORES</div>';
    succDeps.forEach(d=>{
      const to=tasks.find(x=>x.id===d.toId);
      depHtml+=`<div class="dep-item"><span>${to?esc(to.wbsCode+' '+to.name):'?'} — <strong>${d.type}</strong>${d.lag?` Lag:${d.lag}d`:''}</span><button onclick="removeDep(${d.id})" title="Remover">×</button></div>`;
    });
  }
  if(!predDeps.length&&!succDeps.length)depHtml='<div style="color:var(--text3);font-size:11px;font-style:italic">Nenhuma dependência. Use o modo 🔗 Conectar no Gantt.</div>';
  document.getElementById('modalDepList').innerHTML=depHtml;
  document.getElementById('taskModal').classList.add('open');
}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function removeDep(depId){deps=deps.filter(d=>d.id!==depId);openModal(modalTaskId);runCPM();updateArrows();saveState();}
function toggleConstraintDate(){
  const v=document.getElementById('mConstraint').value;
  document.getElementById('constraintDateField').style.display=['ASAP','ALAP'].includes(v)?'none':'block';
}
function saveModal(){
  const t=tasks.find(x=>x.id===modalTaskId);if(!t)return;
  const type=document.getElementById('mType').value;
  t.name=document.getElementById('mName').value;
  t.owner=document.getElementById('mOwner').value;
  t.isMilestone=type==='milestone';
  t.isSummary=type==='summary';
  t.start=document.getElementById('mStart').value;
  t.end=t.isMilestone?t.start:document.getElementById('mEnd').value;
  t.pct=+document.getElementById('mPct').value;
  t.color=selColor;
  t.wbsCode=document.getElementById('mWbsCode').value;
  t.constraintType=document.getElementById('mConstraint').value;
  t.constraintDate=document.getElementById('mConstraintDate').value||null;
  t.notes=document.getElementById('mNotes').value;
  const pid=document.getElementById('mParent').value;
  t.parentId=pid?+pid:null;
  closeModal('taskModal');render();saveState();
}

// ============================================================
// ADD TASK / MILESTONE / COLLAPSE
// ============================================================
function addTask(){
  const y=getYear();
  tasks.push({id:nextId++,wbsCode:'',name:'Nova Tarefa',owner:'—',color:COLORS[nextId%COLORS.length],
    start:`${y}-01-01`,end:`${y}-03-31`,pct:0,isMilestone:false,isSummary:false,parentId:null,
    collapsed:false,constraintType:'ASAP',constraintDate:null,notes:''});
  render();saveState();
}
function addMilestone(){
  const y=getYear();
  tasks.push({id:nextId++,wbsCode:'',name:'Marco',owner:'',color:COLORS[5],
    start:`${y}-06-30`,end:`${y}-06-30`,pct:0,isMilestone:true,isSummary:false,parentId:null,
    collapsed:false,constraintType:'ASAP',constraintDate:null,notes:''});
  render();saveState();
}
function toggleCollapse(id){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  t.collapsed=!t.collapsed;render();saveState();
}
function removeTask(id){
  if(!confirm('Remover esta tarefa?'))return;
  tasks=tasks.filter(t=>t.id!==id);
  tasks.forEach(t=>{if(t.parentId===id)t.parentId=null;});
  deps=deps.filter(d=>d.fromId!==id&&d.toId!==id);
  closeModal('taskModal');render();saveState();
}
function upd(id,f,v){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  t[f]=v;
  if(f==='pct'||f==='start'||f==='end'){runCPM();updateArrows();}
  if(f!=='name'&&f!=='owner')render();
  saveState();
}
function cycleStatus(id){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  const c=['track','risk','delay','done'];
  t.status=c[(c.indexOf(t.status)+1)%c.length];render();saveState();
}

// ============================================================
// CRITICAL PATH TOGGLE
// ============================================================
function toggleCP(){
  showCP=!showCP;
  document.getElementById('cpBtn').classList.toggle('active',showCP);
  render();saveState();
}

// ============================================================
// DATA DATE
// ============================================================
function onDataDateChange(){
  dataDate=document.getElementById('dataDateInput').value||null;
  render();saveState();
}
function resetDataDate(){
  dataDate=null;document.getElementById('dataDateInput').value='';render();saveState();
}

// ============================================================
// BASELINE
// ============================================================
function toggleBaseline(slot){
  const idx=activeBaselines.indexOf(slot);
  if(idx>=0)activeBaselines.splice(idx,1);
  else activeBaselines.push(slot);
  document.querySelectorAll('.bl-btn').forEach(b=>{
    b.classList.toggle('active',activeBaselines.includes(+b.dataset.slot));
  });
  render();saveState();
}
function saveBaseline(slot,name){
  baselines[slot-1]={slot,name,savedAt:fmt(new Date()),tasks:JSON.parse(JSON.stringify(tasks.map(t=>({id:t.id,name:t.name,start:t.start,end:t.end,pct:t.pct}))))};
  saveState();openBaselineModal();render();
}
function clearBaseline(slot){
  if(!confirm(`Limpar Baseline B${slot}?`))return;
  baselines[slot-1]=null;
  activeBaselines=activeBaselines.filter(s=>s!==slot);
  document.querySelector(`.bl-btn[data-slot="${slot}"]`).classList.remove('active');
  saveState();openBaselineModal();render();
}
function openBaselineModal(){
  const body=document.getElementById('baselineModalBody');
  let h='';
  [1,2,3].forEach(slot=>{
    const bl=baselines[slot-1];
    const color=['var(--b1)','var(--b2)','var(--b3)'][slot-1];
    h+=`<div class="bl-slot" style="border-color:${color}">`;
    h+=`<div class="bl-slot-header"><span class="bl-slot-name" style="color:${color}">B${slot}</span>`;
    if(bl)h+=`<span class="bl-slot-date">Salva em ${bl.savedAt} — ${bl.name||''}</span>`;
    h+=`</div>`;
    if(!bl){
      h+=`<div class="bl-empty" style="margin-bottom:8px">Nenhuma baseline salva neste slot.</div>`;
    }else{
      h+=`<div style="font-size:11px;color:var(--text2);margin-bottom:8px">${bl.tasks.length} tarefas capturadas</div>`;
    }
    const nameId=`blName${slot}`;
    h+=`<div style="display:flex;gap:8px;align-items:center">`;
    h+=`<input id="${nameId}" type="text" placeholder="Nome da baseline" value="${bl?bl.name||'':''}" style="border:1px solid var(--line);border-radius:5px;padding:4px 8px;font-size:12px;background:var(--surface);color:var(--text1);flex:1"/>`;
    h+=`<button class="btn-save" style="padding:5px 12px;font-size:12px" onclick="saveBaseline(${slot},document.getElementById('${nameId}').value)">📸 Salvar B${slot}</button>`;
    if(bl)h+=`<button class="btn-danger-sm" style="padding:5px 10px;font-size:11px" onclick="clearBaseline(${slot})">Limpar</button>`;
    h+=`</div></div>`;
  });
  body.innerHTML=h;
  document.getElementById('baselineModal').classList.add('open');
}

// ============================================================
// COLUMN PANEL
// ============================================================
let currentPanel='filter';
function switchPanel(p){
  currentPanel=p;
  ['filter','cols','dash','look','alerts'].forEach(x=>{
    document.getElementById('panel'+x.charAt(0).toUpperCase()+x.slice(1)).classList.toggle('open',x===p);
    document.getElementById('ptab'+x.charAt(0).toUpperCase()+x.slice(1))?.classList.toggle('active',x===p);
  });
  if(p==='dash')renderDashboard();
  if(p==='look')renderLookahead();
  if(p==='alerts')renderAlerts();
}
function buildColPanel(){
  // Standard toggles
  const ct=document.getElementById('colToggles');ct.innerHTML='';
  COL_DEFS.forEach(col=>{
    const on=colVis[col.key]!==false;
    const lbl=document.createElement('label');
    lbl.className='col-toggle'+(on?' active':' off');
    lbl.innerHTML=`<input type="checkbox" ${on?'checked':''}><span>${col.label}</span>`;
    lbl.querySelector('input').addEventListener('change',function(){
      colVis[col.key]=this.checked;applyColVis();lbl.className='col-toggle'+(this.checked?' active':' off');saveState();
    });
    ct.appendChild(lbl);
  });
  // Legend sync
  const lChk=document.getElementById('legendChk');
  if(lChk){lChk.checked=colVis.legend!==false;document.getElementById('legendToggle').className='col-toggle'+(lChk.checked?' active':' off');}
  // Custom cols
  const ccl=document.getElementById('customColList');ccl.innerHTML='';
  customCols.forEach(cc=>{
    const on=colVis[cc.key]!==false;
    const wrap=document.createElement('div');wrap.style.cssText='display:flex;align-items:center;gap:3px';
    const lbl=document.createElement('label');
    lbl.className='col-toggle'+(on?' active':' off');
    lbl.innerHTML=`<input type="checkbox" ${on?'checked':''}><span>${esc(cc.label)}</span>`;
    lbl.querySelector('input').addEventListener('change',function(){colVis[cc.key]=this.checked;lbl.className='col-toggle'+(this.checked?' active':' off');render();saveState();});
    const del=document.createElement('button');del.textContent='✕';del.className='btn-ghost';
    del.style.cssText='padding:3px 7px;font-size:11px';
    del.onclick=()=>{customCols=customCols.filter(c=>c.key!==cc.key);delete colVis[cc.key];buildColPanel();render();saveState();};
    wrap.appendChild(lbl);wrap.appendChild(del);ccl.appendChild(wrap);
  });
  // Sliders
  const cg=document.getElementById('cwGrid');cg.innerHTML='';
  const CW=[{key:'task',label:'Tarefa',min:100,max:450},{key:'owner',label:'Responsável',min:60,max:220},{key:'status',label:'Status',min:60,max:200},{key:'pct',label:'% Conclusão',min:50,max:150},{key:'dates',label:'Datas',min:70,max:200},{key:'period',label:'Colunas Gantt',min:16,max:120}];
  CW.forEach(def=>{
    const v=colWidths[def.key]||DEF_WIDTHS[def.key];
    const row=document.createElement('div');row.className='cw-row';
    row.innerHTML=`<span class="cw-label">${def.label}</span><input type="range" class="cw-slider" min="${def.min}" max="${def.max}" value="${v}" data-k="${def.key}"/><span class="cw-val" id="cwv_${def.key}">${v}px</span>`;
    row.querySelector('input').addEventListener('input',function(){colWidths[this.dataset.k]=+this.value;document.getElementById('cwv_'+this.dataset.k).textContent=this.value+'px';applyColWidths();saveState();});
    cg.appendChild(row);
  });
}
function addCustomCol(){
  const inp=document.getElementById('newColLabel');const label=inp.value.trim();if(!label)return;
  const key='cc_'+Date.now();customCols.push({key,label});colVis[key]=true;
  tasks.forEach(t=>t[key]='');inp.value='';buildColPanel();render();saveState();
}
function resetWidths(){Object.assign(colWidths,DEF_WIDTHS);applyColWidths();buildColPanel();saveState();}

// ============================================================
// FILTERS
// ============================================================
function applyFilters(){
  const nm=(document.getElementById('fName').value||'').toLowerCase();
  const ow=(document.getElementById('fOwner').value||'').toLowerCase();
  const st=document.getElementById('fStatus').value;
  const mn=+document.getElementById('fPctMin').value;
  const mx=+document.getElementById('fPctMax').value;
  const ds=document.getElementById('fDateStart').value;
  const de=document.getElementById('fDateEnd').value;
  document.querySelectorAll('#ganttTable tbody tr').forEach(row=>{
    const id=+row.dataset.id;const t=tasks.find(x=>x.id===id);if(!t){row.removeAttribute('data-hidden');return;}
    let hide=false;
    if(nm&&!t.name.toLowerCase().includes(nm))hide=true;
    if(ow&&!t.owner.toLowerCase().includes(ow))hide=true;
    if(st&&autoStatus(t)!==st)hide=true;
    if(t.pct<mn||t.pct>mx)hide=true;
    if(ds&&t.end<ds)hide=true;
    if(de&&t.start>de)hide=true;
    row.dataset.hidden=hide?'true':'false';
  });
}
function clearFilters(){
  ['fName','fOwner'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fStatus').value='';
  document.getElementById('fPctMin').value=0;document.getElementById('fPctMax').value=100;
  ['fDateStart','fDateEnd'].forEach(id=>document.getElementById(id).value='');
  applyFilters();
}
function goToday(){
  dataDate=null;document.getElementById('dataDateInput').value='';
  render();
  setTimeout(()=>scrollToYear(new Date().getFullYear()),100);
}

// ============================================================
// DASHBOARD & S-CURVE
// ============================================================
function renderDashboard(){
  // Health
  const dd=getDataDate();
  const critCount=tasks.filter(t=>t.isCritical).length;
  const delayCount=tasks.filter(t=>autoStatus(t)==='delay').length;
  const riskCount=tasks.filter(t=>autoStatus(t)==='risk').length;
  const avg=tasks.length?Math.round(tasks.reduce((a,t)=>a+t.pct,0)/tasks.length):0;
  let health='Verde',hColor='#16a34a';
  if(delayCount>0||critCount>2){health='Vermelho';hColor='#dc2626';}
  else if(riskCount>0||critCount>0){health='Amarelo';hColor='#d97706';}
  document.getElementById('dashHealth').innerHTML=`
    <div class="dash-card-title">Saúde do Projeto</div>
    <div class="health-indicator"><div class="health-dot" style="background:${hColor}"></div><span class="health-label" style="color:${hColor}">${health}</span></div>
    <div class="tt-row"><span class="tt-label" style="color:var(--text2)">Progresso médio</span><span style="font-weight:700">${avg}%</span></div>
    <div class="tt-row"><span class="tt-label" style="color:var(--text2)">Tarefas críticas</span><span style="font-weight:700;color:${critCount>0?'#dc2626':'inherit'}">${critCount}</span></div>
    <div class="tt-row"><span class="tt-label" style="color:var(--text2)">Em atraso</span><span style="font-weight:700;color:${delayCount>0?'#dc2626':'inherit'}">${delayCount}</span></div>
    <div class="tt-row"><span class="tt-label" style="color:var(--text2)">Em risco</span><span style="font-weight:700;color:${riskCount>0?'#d97706':'inherit'}">${riskCount}</span></div>
    <div class="tt-row"><span class="tt-label" style="color:var(--text2)">Data Date</span><span style="font-weight:700">${fmtS(fmt(dd))}</span></div>`;

  // Critical tasks
  const critTasks=tasks.filter(t=>t.isCritical).slice(0,5);
  document.getElementById('dashCritical').innerHTML=`<div class="dash-card-title">🔴 Caminho Crítico (Top 5)</div>`+
    (critTasks.length?critTasks.map(t=>`<div class="lookahead-task"><span>${esc(t.wbsCode||'')} ${esc(t.name)}</span><span style="font-size:10px;color:var(--text3)">${t.tf}d float</span></div>`).join(''):'<div style="color:var(--text3);font-size:12px">Ative o Caminho Crítico para ver.</div>');

  // Milestones
  const ms=tasks.filter(t=>t.isMilestone).sort((a,b)=>a.start.localeCompare(b.start));
  document.getElementById('dashMilestones').innerHTML=`<div class="dash-card-title">◆ Marcos</div>`+
    (ms.length?ms.map(t=>{const past=t.start<fmt(dd);return`<div class="lookahead-task"><span>${esc(t.name)}</span><span style="font-size:10px;color:${past?'#dc2626':'var(--text3)'}">${fmtS(t.start)}</span></div>`;}).join(''):'<div style="color:var(--text3);font-size:12px">Nenhum marco cadastrado.</div>');

  // S-Curve
  renderSCurve();
}

function renderSCurve(){
  const periods=[];const y=getYear();
  for(let m=0;m<12;m++){periods.push({label:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][m],date:new Date(y,m,28)});}
  const nonSummary=tasks.filter(t=>!t.isSummary&&!t.isMilestone);
  if(!nonSummary.length)return;
  const totalDur=nonSummary.reduce((a,t)=>a+Math.max(1,daysDiff(t.start,t.end)),0);
  let cumPlan=0,cumActual=0;const planData=[],actualData=[];
  periods.forEach(p=>{
    nonSummary.forEach(t=>{
      const ts=parseDate(t.start),te=parseDate(t.end);
      const inPeriod=ts<=p.date;
      if(inPeriod){
        const overlap=Math.min(p.date,te)-ts;const dur=Math.max(1,te-ts);
        const ratio=Math.min(1,Math.max(0,overlap/dur));
        const w=Math.max(1,daysDiff(t.start,t.end))/totalDur;
        cumPlan+=ratio*w*100/nonSummary.length;
        cumActual+=(t.pct/100)*w*100/nonSummary.length;
      }
    });
    planData.push(Math.min(100,cumPlan));actualData.push(Math.min(100,cumActual));
    cumPlan=0;cumActual=0;
  });
  // Recalculate properly as cumulative
  let cp=0,ca=0;const pD=[],aD=[];
  nonSummary.forEach(t=>{});
  // Simple cumulative: monthly slice
  for(let mi=0;mi<12;mi++){
    const pEnd=new Date(y,mi+1,0);
    let planWeight=0,actualWeight=0;
    nonSummary.forEach(t=>{
      const ts=parseDate(t.start),te=parseDate(t.end);const pStart=new Date(y,mi,1);
      if(ts>pEnd||te<pStart)return;
      const overlapS=Math.max(ts,pStart),overlapE=Math.min(te,pEnd);
      const fullDur=Math.max(1,te-ts);const overlapDur=Math.max(0,overlapE-overlapS);
      const w=(Math.max(1,daysDiff(t.start,t.end))/totalDur);
      planWeight+=overlapDur/fullDur*w;
      actualWeight+=overlapDur/fullDur*w*(t.pct/100);
    });
    cp+=planWeight*100;ca+=actualWeight*100;
    pD.push(Math.min(100,Math.round(cp)));aD.push(Math.min(100,Math.round(ca)));
  }
  const labels=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  if(scurveChart)scurveChart.destroy();
  const ctx=document.getElementById('scurveChart');if(!ctx)return;
  scurveChart=new Chart(ctx,{type:'line',data:{labels,datasets:[
    {label:'Planejado',data:pD,borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,.1)',tension:.4,fill:true,pointRadius:2},
    {label:'Realizado',data:aD,borderColor:'#0d9488',backgroundColor:'rgba(13,148,136,.08)',tension:.4,fill:true,pointRadius:2,borderDash:[4,3]},
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:10},boxWidth:12}},tooltip:{bodyFont:{size:10}}},scales:{y:{min:0,max:100,ticks:{font:{size:9},callback:v=>v+'%'}},x:{ticks:{font:{size:9}}}}}});
}

// ============================================================
// LOOKAHEAD
// ============================================================
function renderLookahead(){
  const weeks=+document.getElementById('lookaheadWeeks').value||2;
  const dd=getDataDate();const end=addDays(dd,weeks*7);
  const laTasks=tasks.filter(t=>!t.isSummary&&parseDate(t.end)>=dd&&parseDate(t.start)<=end).sort((a,b)=>a.start.localeCompare(b.start));
  const div=document.getElementById('lookaheadList');
  if(!laTasks.length){div.innerHTML='<div style="color:var(--text3);font-size:12px">Nenhuma tarefa no período selecionado.</div>';return;}
  div.innerHTML=`<div style="font-size:11px;font-weight:700;color:var(--text3);margin-bottom:8px">PRÓXIMAS ${weeks} SEMANA(S) — ${laTasks.length} TAREFA(S)</div>`+
    laTasks.map(t=>{
      const sm=autoStatus(t);const badge=SM[sm]||SM.track;
      return`<div class="lookahead-task">
        <span>${t.isMilestone?'◆ ':''}<strong>${esc(t.wbsCode||'')} </strong>${esc(t.name)}</span>
        <span style="display:flex;align-items:center;gap:8px">
          <span class="sbadge ${badge.cls}" style="font-size:9px;padding:2px 7px;cursor:default">${badge.label}</span>
          <span style="font-size:10px;color:var(--text3)">${fmtS(t.start)} → ${fmtS(t.end)}</span>
          <span style="font-size:10px;color:var(--text2)">${t.owner||'—'}</span>
          ${t.isCritical?'<span style="font-size:10px;color:#dc2626;font-weight:700">🔴 CRÍTICA</span>':''}
        </span>
      </div>`;
    }).join('');
}

// ============================================================
// ALERTS
// ============================================================
function getAlerts(){
  const dd=getDataDate();const alerts=[];
  tasks.filter(t=>!t.isSummary).forEach(t=>{
    const st=autoStatus(t);
    if(st==='delay')alerts.push({type:'delay',icon:'🔴',title:t.name,msg:`Atraso detectado. Progresso: ${t.pct}% vs esperado.`});
    else if(st==='risk')alerts.push({type:'risk',icon:'🟡',title:t.name,msg:`Em risco. Folga reduzida.`});
    if(t.isCritical&&t.pct<100)alerts.push({type:'critical',icon:'🔴',title:t.name,msg:`No caminho crítico. Float: ${t.tf||0} dias.`});
    const te=parseDate(t.end);const diff=Math.round((te-dd)/86400000);
    if(diff>=0&&diff<=7&&t.pct<100)alerts.push({type:'soon',icon:'⏰',title:t.name,msg:`Vence em ${diff} dia(s). Progresso: ${t.pct}%.`});
    if(t.hasConflict)alerts.push({type:'conflict',icon:'⚠️',title:t.name,msg:`Conflito de restrição (${t.constraintType}).`});
    // Dependency violations
    const preds=deps.filter(d=>d.toId===t.id);
    preds.forEach(d=>{
      const from=tasks.find(x=>x.id===d.fromId);
      if(!from)return;
      if(d.type==='FS'&&parseDate(t.start)<parseDate(from.end))
        alerts.push({type:'depviol',icon:'⚠️',title:t.name,msg:`Violação FS: inicia antes do término de "${from.name}".`});
    });
  });
  return alerts;
}
function renderAlerts(){
  const alerts=getAlerts();
  const div=document.getElementById('alertsList');
  if(!alerts.length){div.innerHTML='<div style="color:var(--teal);font-size:12px">✅ Nenhum alerta. Projeto sem pendências críticas.</div>';return;}
  div.innerHTML=alerts.map(a=>`<div class="alert-item"><span class="alert-icon">${a.icon}</span><div><div class="alert-title">${esc(a.title)}</div><div class="alert-text">${a.msg}</div></div></div>`).join('');
}
function updateAlertCount(){
  const n=getAlerts().length;
  document.getElementById('alertCount').textContent=n>0?`(${n})`:'';
}

// ============================================================
// EXCEL IMPORT / EXPORT
// ============================================================
let pendingImportTasks=[];
const EXPORT_COLS=[
  {key:'wbsCode',label:'WBS',def:true},
  {key:'name',label:'Nome da Tarefa',def:true,required:true},
  {key:'owner',label:'Responsável',def:true},
  {key:'status',label:'Status',def:true},
  {key:'pct',label:'% Conclusão',def:true},
  {key:'start',label:'Início',def:true},
  {key:'end',label:'Término',def:true},
  {key:'type',label:'Tipo',def:true},
  {key:'color',label:'Cor',def:false},
  {key:'constraintType',label:'Restrição',def:false},
  {key:'constraintDate',label:'Data Restrição',def:false},
  {key:'tf',label:'Total Float',def:false},
  {key:'ff',label:'Free Float',def:false},
  {key:'es',label:'ES (Early Start)',def:false},
  {key:'ef',label:'EF (Early Finish)',def:false},
  {key:'ls',label:'LS (Late Start)',def:false},
  {key:'lf',label:'LF (Late Finish)',def:false},
  {key:'notes',label:'Notas',def:false},
];
let exportColSel={};
let exportBaselineSel={};

function openExportModal(){
  // Init selections
  EXPORT_COLS.forEach(c=>{if(exportColSel[c.key]===undefined)exportColSel[c.key]=c.def;});
  customCols.forEach(c=>{if(exportColSel[c.key]===undefined)exportColSel[c.key]=true;});
  [1,2,3].forEach(s=>{if(exportBaselineSel[s]===undefined)exportBaselineSel[s]=!!baselines[s-1];});
  renderExportModal();
  document.getElementById('exportModal').classList.add('open');
}
function renderExportModal(){
  // Standard cols
  const list=document.getElementById('exportColList');
  const allCols=[...EXPORT_COLS,...customCols.map(c=>({key:c.key,label:c.label+' (customizada)',def:true}))];
  list.innerHTML=allCols.map(c=>`
    <label style="display:flex;align-items:center;gap:8px;cursor:${c.required?'default':'pointer'};padding:5px 8px;border-radius:6px;border:1px solid var(--line);background:var(--surface)">
      <input type="checkbox" data-expkey="${c.key}" ${exportColSel[c.key]?'checked':''} ${c.required?'disabled':''} onchange="exportColSel['${c.key}']=this.checked"/>
      <span style="font-size:12px;font-weight:${c.required?'700':'400'};color:var(--text1)">${c.label}${c.required?' <span style=\"color:var(--text3);font-size:10px\">(obrigatória)</span>':''}</span>
    </label>`).join('');
  // Baselines
  const blList=document.getElementById('exportBaselineList');
  blList.innerHTML=[1,2,3].map(s=>{
    const bl=baselines[s-1];
    return`<label style="display:flex;align-items:center;gap:6px;cursor:${bl?'pointer':'default'};opacity:${bl?1:.4}">
      <input type="checkbox" ${exportBaselineSel[s]&&bl?'checked':''} ${!bl?'disabled':''} onchange="exportBaselineSel[${s}]=this.checked"/>
      <span style="font-size:12px">B${s}${bl?' — '+esc(bl.name||bl.savedAt):'(vazia)'}</span>
    </label>`;
  }).join('');
}
function setAllExportCols(v){
  EXPORT_COLS.forEach(c=>{if(!c.required)exportColSel[c.key]=v;});
  customCols.forEach(c=>{exportColSel[c.key]=v;});
  renderExportModal();
}
function exportExcel(){
  if(typeof XLSX==='undefined'){alert('SheetJS não carregado. Verifique sua conexão.');return;}
  // Build headers and row builder from selected cols
  runCPM();
  const selStd=EXPORT_COLS.filter(c=>exportColSel[c.key]!==false);
  const selCustom=customCols.filter(c=>exportColSel[c.key]!==false);
  const hdrs=[...selStd.map(c=>c.label),...selCustom.map(c=>c.label)];
  const getVal=(t,key)=>{
    switch(key){
      case'wbsCode':return t.wbsCode||'';
      case'name':return t.name||'';
      case'owner':return t.owner||'';
      case'status':return SM[autoStatus(t)]?.label||'';
      case'pct':return t.pct;
      case'start':return fmtS(t.start);
      case'end':return fmtS(t.end);
      case'type':return t.isMilestone?'Marco':t.isSummary?'Sumário':'Tarefa';
      case'color':return t.color||'';
      case'constraintType':return t.constraintType||'ASAP';
      case'constraintDate':return t.constraintDate?fmtS(t.constraintDate):'';
      case'tf':return t.tf!==undefined?t.tf:'';
      case'ff':return t.ff!==undefined?t.ff:'';
      case'es':return t.es?fmtS(fmt(t.es)):'';
      case'ef':return t.ef?fmtS(fmt(t.ef)):'';
      case'ls':return t.ls?fmtS(fmt(t.ls)):'';
      case'lf':return t.lf?fmtS(fmt(t.lf)):'';
      case'notes':return t.notes||'';
      default:return t[key]||'';
    }
  };
  const rows=tasks.map(t=>[...selStd.map(c=>getVal(t,c.key)),...selCustom.map(c=>t[c.key]||'')]);
  const ws=XLSX.utils.aoa_to_sheet([hdrs,...rows]);
  ws['!cols']=hdrs.map(()=>({wch:18}));
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Tarefas');
  // Selected baselines
  [1,2,3].forEach(s=>{
    if(!exportBaselineSel[s]||!baselines[s-1])return;
    const bl=baselines[s-1];
    const bws=XLSX.utils.aoa_to_sheet([['WBS','Nome','Início Baseline','Término Baseline','% Baseline','Início Atual','Término Atual','% Atual','Desvio Início (d)','Desvio Término (d)','SV (%)'],
      ...bl.tasks.map(bt=>{const t=tasks.find(x=>x.id===bt.id);const sv=t?(t.pct-bt.pct):0;const di=t?daysDiff(bt.start,t.start):0;const df=t?daysDiff(bt.end,t.end):0;return[t?.wbsCode||'',bt.name,fmtS(bt.start),fmtS(bt.end),bt.pct,t?fmtS(t.start):'',t?fmtS(t.end):'',t?t.pct:'',di,df,sv];})]);
    bws['!cols']=Array(11).fill({wch:16});
    XLSX.utils.book_append_sheet(wb,bws,`Baseline B${s}`);
  });
  XLSX.writeFile(wb,'gantt_pro.xlsx');
  closeModal('exportModal');
}
function importExcel(inp){
  if(!inp.files[0])return;
  if(typeof XLSX==='undefined'){alert('SheetJS não carregado.');return;}
  const reader=new FileReader();
  reader.onload=e=>{
    const wb=XLSX.read(e.target.result,{type:'binary',cellDates:true});
    const ws=wb.Sheets[wb.SheetNames[0]];
    const rows=XLSX.utils.sheet_to_json(ws,{header:1,raw:false,dateNF:'yyyy-mm-dd'});
    if(rows.length<2){alert('Arquivo sem dados.');return;}
    const hdrs=rows[0].map(h=>String(h||'').trim());
    const warnings=[];pendingImportTasks=[];

    // ─── Detect format ───────────────────────────────────────────
    const isPrimavera=hdrs.includes('Activity ID')&&hdrs.includes('Start')&&hdrs.includes('Finish');

    // ─── Universal date parser ────────────────────────────────────
    function parseXLDate(s){
      if(!s&&s!==0)return null;
      // Already ISO yyyy-mm-dd
      if(typeof s==='string'&&/^\d{4}-\d{2}-\d{2}/.test(s))return s.slice(0,10);
      // "dd-mm-yy A" or "dd-mm-yy" (Primavera format)
      const mP=String(s).match(/^(\d{1,2})-(\d{2})-(\d{2})\s*A?$/);
      if(mP){const y=+mP[3]<50?2000+ +mP[3]:1900+ +mP[3];return`${y}-${mP[2].padStart(2,'0')}-${mP[1].padStart(2,'0')}`;}
      // "dd/mm/yyyy"
      const mD=String(s).match(/^(\d{1,2})\/(\d{2})\/(\d{4})$/);
      if(mD)return`${mD[3]}-${mD[2]}-${mD[1].padStart(2,'0')}`;
      // "dd de Mon" (Portuguese)
      const months={jan:1,fev:2,mar:3,abr:4,mai:5,jun:6,jul:7,ago:8,set:9,out:10,nov:11,dez:12};
      const mM=String(s).match(/(\d{1,2})\s+de\s+(\w{3})/i);
      if(mM){const mo=months[mM[2].toLowerCase()];if(mo)return`${new Date().getFullYear()}-${String(mo).padStart(2,'0')}-${String(mM[1]).padStart(2,'0')}`;}
      // Excel serial number
      if(!isNaN(+s)&&+s>1000){const d=new Date(Math.round((+s-25569)*86400000));if(!isNaN(d.getTime()))return fmt(d);}
      return null;
    }

    // ─── PRIMAVERA / SHIP MANAGER FORMAT ─────────────────────────
    if(isPrimavera){
      const idIdx=hdrs.indexOf('Activity ID');
      const stIdx=hdrs.indexOf('Start');
      const fnIdx=hdrs.indexOf('Finish');
      const colPalette=COLORS;
      // Build a stack to track parent hierarchy
      const stack=[];      // [{id, level}]
      let taskId=1;
      // Assign a color per top-level group
      const groupColors={};let colorIdx=0;

      rows.slice(1).forEach((row,ri)=>{
        const rawId=String(row[idIdx]||'');
        if(!rawId.trim())return;
        // Count leading spaces to determine indent level (groups of 2)
        const spaces=rawId.match(/^(\s*)/)[1].length;
        const level=Math.floor(spaces/2); // 0=root,1=project,2=group,3=task
        const trimmed=rawId.trim();

        // Skip root "Total" row
        if(level===0)return;
        // Skip pure project header (level 1, no WBS number)
        // Actually keep it as a top-level summary
        
        // Extract WBS code and name from "2.1 - DT - SISTEMA..." pattern
        let wbsCode='', name=trimmed;
        const wbsMatch=trimmed.match(/^(\d[\d.]*)\s*-\s*(.+)$/);
        if(wbsMatch){wbsCode=wbsMatch[1];name=wbsMatch[2].trim();}
        else{wbsCode='';name=trimmed;}

        // Parse dates
        const startRaw=row[stIdx];const endRaw=row[fnIdx];
        let start=parseXLDate(startRaw);
        let end=parseXLDate(endRaw)||start;
        if(!start){
          // Use a placeholder if date is missing
          start='2026-01-01';end='2026-12-31';
          warnings.push(`Linha ${ri+2}: "${name}" — data inválida, usando placeholder.`);
        }

        // Determine summary vs task vs milestone
        // Level 2 = group summary (e.g. "2 - MARCO J06")
        // Level 1 = project summary
        // Level 3 = actual task; if start===end → milestone
        const isSummary=(level<=2);
        const isMilestone=!isSummary&&start===end;

        // Parent resolution
        while(stack.length>0&&stack[stack.length-1].level>=level)stack.pop();
        const parentId=stack.length>0?stack[stack.length-1].id:null;

        // Color: assign per top-level group (level 2)
        let color;
        const topWbs=wbsCode.split('.')[0]||String(level);
        if(!groupColors[topWbs]){groupColors[topWbs]=colPalette[colorIdx%colPalette.length];colorIdx++;}
        color=groupColors[topWbs]||COLORS[0];

        const task={
          id:taskId++,wbsCode,name,owner:'',color,start,end,pct:0,
          isMilestone,isSummary,parentId,collapsed:level<=1,
          constraintType:'ASAP',constraintDate:null,notes:'',taskResources:[]
        };
        pendingImportTasks.push(task);
        stack.push({id:task.id,level});
      });

      // Fix parentIds to match actual assigned IDs
      // (already correct since we assign IDs sequentially and track stack)
    }

    // ─── STANDARD GANTT PRO FORMAT ────────────────────────────────
    else{
      const STD=['WBS','Nome da Tarefa','Responsável','Status','% Conclusão','Início','Término','Cor','Tipo','Restrição','Data Restrição','Notas'];
      const newCustom=[];
      hdrs.forEach((h,i)=>{if(!STD.includes(h)&&h)newCustom.push({key:'cc_'+h.replace(/\s+/g,'_').toLowerCase(),label:h,colIdx:i});});
      rows.slice(1).forEach((row,ri)=>{
        const get=(name,def='')=>{const i=hdrs.indexOf(name);return i>=0&&row[i]!==undefined?String(row[i]):def;};
        const name=get('Nome da Tarefa');if(!name){warnings.push(`Linha ${ri+2}: nome vazio, ignorada.`);return;}
        const start=parseXLDate(get('Início'));const end=parseXLDate(get('Término'))||start;
        if(!start){warnings.push(`Linha ${ri+2}: data inválida, ignorada.`);return;}
        const pct=Math.min(100,Math.max(0,parseInt(get('% Conclusão','0'))||0));
        const tipo=get('Tipo','').toLowerCase();
        const task={id:0,wbsCode:get('WBS'),name,owner:get('Responsável'),color:get('Cor',COLORS[ri%COLORS.length]),start,end,pct,
          isMilestone:tipo.includes('marco')||tipo.includes('milestone'),
          isSummary:tipo.includes('sumário')||tipo.includes('summary'),
          parentId:null,collapsed:false,constraintType:get('Restrição','ASAP'),constraintDate:null,notes:get('Notas'),taskResources:[]};
        newCustom.forEach(nc=>{task[nc.key]=row[nc.colIdx]!==undefined?String(row[nc.colIdx]):'';});
        pendingImportTasks.push(task);
      });
      newCustom.forEach(nc=>{if(!customCols.find(c=>c.key===nc.key)){customCols.push({key:nc.key,label:nc.label});colVis[nc.key]=true;}});
    }

    document.getElementById('importCount').textContent=pendingImportTasks.length;
    document.getElementById('importFormat').textContent=isPrimavera?'Formato detectado: Primavera/Ship Manager ✓':'Formato detectado: Gantt Pro padrão ✓';
    document.getElementById('importWarnings').textContent=warnings.length?warnings.join('\n'):'';
    document.getElementById('importModal').classList.add('open');
    inp.value='';
  };
  reader.readAsBinaryString(inp.files[0]);
}

function confirmImport(){
  const mode=document.querySelector('input[name="importMode"]:checked')?.value||'replace';
  let startId=mode==='replace'?1:nextId;
  // Re-assign IDs sequentially and fix parentIds
  const idMap={};
  pendingImportTasks.forEach((t,i)=>{idMap[t.id]=startId+i;});
  const imported=pendingImportTasks.map(t=>({
    ...t,
    id:idMap[t.id],
    parentId:t.parentId!=null&&idMap[t.parentId]!=null?idMap[t.parentId]:null
  }));
  if(mode==='replace'){tasks=imported;deps=[];nextId=startId+imported.length;}
  else{tasks=[...tasks,...imported];nextId=startId+imported.length;}
  closeModal('importModal');render();saveState();
}

// ============================================================
// DARK MODE & ZOOM
// ============================================================
function toggleDark(){
  document.body.classList.toggle('dark-mode');
  document.getElementById('darkModeBtn').textContent=document.body.classList.contains('dark-mode')?'☀️':'🌙';
}
// Middle mouse button pan on gantt
(function(){
  const outer=document.getElementById('ganttOuter');
  if(!outer)return;
  let isPanning=false,startX=0,startY=0,scrollLeft=0,scrollTop=0;
  outer.addEventListener('mousedown',e=>{
    if(e.button!==1)return;
    e.preventDefault();
    isPanning=true;startX=e.clientX;startY=e.clientY;
    scrollLeft=outer.scrollLeft;scrollTop=outer.scrollTop;
    outer.style.cursor='grabbing';
  });
  window.addEventListener('mousemove',e=>{
    if(!isPanning)return;
    outer.scrollLeft=scrollLeft-(e.clientX-startX);
    outer.scrollTop=scrollTop-(e.clientY-startY);
  });
  window.addEventListener('mouseup',e=>{
    if(e.button!==1)return;
    isPanning=false;outer.style.cursor='';
  });

  // Shift+Wheel = horizontal scroll
  outer.addEventListener('wheel',e=>{
    if(e.ctrlKey){
      // Zoom (already handled below)
      return;
    }
    if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)){
      e.preventDefault();
      outer.scrollLeft+=e.deltaX||e.deltaY;
    }
  },{passive:false});
})();

// Ctrl+Wheel zoom
document.getElementById('ganttOuter')?.addEventListener('wheel',e=>{
  if(!e.ctrlKey)return;
  e.preventDefault();
  const delta=e.deltaY>0?-3:3;
  colWidths.period=Math.max(16,Math.min(120,colWidths.period+delta));
  applyColWidths();buildColPanel();saveState();
},{passive:false});

// ============================================================
// INITIALISATION
// ============================================================
window.addEventListener('load',()=>{
  defaultState();
  const saved=loadState();
  if(saved)applyState(saved);

  // Data date input
  if(dataDate)document.getElementById('dataDateInput').value=dataDate;

  // CP button state
  document.getElementById('cpBtn').classList.toggle('active',showCP);

  // Baseline buttons
  activeBaselines.forEach(slot=>{document.querySelector(`.bl-btn[data-slot="${slot}"]`)?.classList.add('active');});

  // Year selector
  renderYearSel();
  const curYear=dataDate?parseDate(dataDate).getFullYear():new Date().getFullYear();
  document.getElementById('yearSel').value=curYear;

  // Template banner
  if(typeof __SAVED_STATE__==='undefined')document.getElementById('templateBanner').style.display='flex';

  // Initial render
  render();
  buildColPanel();
  // Scroll to current year/data date after render
  setTimeout(()=>{
    const scrollYear=dataDate?parseDate(dataDate).getFullYear():new Date().getFullYear();
    document.getElementById('yearSel').value=scrollYear;
    scrollToYear(scrollYear);
  },150);

  // Autosave every 30s
  setInterval(()=>{
    const dot=document.getElementById('autosaveDot'),lbl=document.getElementById('autosaveLabel');
    if(dot)dot.classList.add('saving');if(lbl)lbl.textContent='Salvando…';
    setTimeout(()=>{saveState();if(dot)dot.classList.remove('saving');if(lbl){const n=new Date();lbl.textContent=`Auto-salvo ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;}},600);
  },30000);

  // Ctrl+Z basic undo hint
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeDepPopover();if(connectMode)toggleConnectMode();}
  });
});
