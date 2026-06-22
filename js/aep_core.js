
// ════════════════════════════════════════════════════════
// DATA — embedded from planilha AEP_CITY_2026
// ════════════════════════════════════════════════════════
const EMPRESA = {
  nome: '', cnpj: '', cnae: '', atividade: '', grauRisco: '',
  endereco: '', coleta: '', elaboracao: '', normas: '',
  responsavel: '', participacao: '', totalEmp: '',
  revisao: '', unidades: '',
};

const EMPREGADOS = [
  {setor:'ABASTECIMENTO',qt:5},{setor:'ADMINISTRAÇÃO',qt:20},{setor:'ADMINISTRAÇÃO OFICINA',qt:6},
  {setor:'ALMOXARIFADO',qt:6},{setor:'BORRACHARIA',qt:5},{setor:'Depto. de Tráfego / Plantão',qt:17},
  {setor:'DEPTO. MÉDICO',qt:2},{setor:'Depto. Monitoramento',qt:4},{setor:'ELÉTRICA PREDIAL',qt:1},
  {setor:'ELETRICISTA DE VEÍCULO',qt:5},{setor:'ELETRONICA',qt:1},{setor:'FISCALIZAÇÃO',qt:148},
  {setor:'FUNILARIA',qt:4},{setor:'LIMPEZA',qt:25},{setor:'LUBRIFICAÇÃO',qt:2},
  {setor:'MANOBRISTA',qt:15},{setor:'MANUTENÇÃO ADMINISTRAÇÃO',qt:3},{setor:'MANUTENÇÃO PREDIAL',qt:7},
  {setor:'MECÂNICA',qt:18},{setor:'OPERAÇÃO MOTORISTA',qt:502},{setor:'PINTURA',qt:4},
  {setor:'PISTA (catracaria)',qt:4},{setor:'PORTARIA',qt:1},{setor:'SERVIÇOS GERAIS',qt:1},{setor:'TST',qt:3},
];

const PLANO_ACOES = [];

// ════════════════════════════════════════
// INVENTARIO — will be set from embedded data or import
// ════════════════════════════════════════
let INVENTARIO = [];
let ATIVIDADES_MAP = {};   // setor (uppercase) → atividade description

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
const state = {
  search: '',
  unidade: '',
  setor: '',
  funcao: '',
  graus: new Set(),
  probInt: new Set(),
  probFreq: new Set(),
  probCalc: new Set(),
  sevMag: new Set(),
  sevImp: new Set(),
  sevCalc: new Set(),
  tipos: new Set(),
  secoes: new Set(['sumario','identificacao','introducao','base_legal','metodologia','matrizes','inventario','matriz','plano','afastamentos','vibracoes','conclusao']),
};

// ════════════════════════════════════════
// RISK CALCULATIONS
// ════════════════════════════════════════
const PROB_MAP_I = {'INTENSIDADE BAIXA':1,'INTENSIDADE MÉDIA':2,'INTENSIDADE ALTA':3};
const PROB_MAP_F = {'FREQUÊNCIA BAIXA':1,'FREQUÊNCIA MÉDIA':2,'FREQUÊNCIA ALTA':3};
const PROB_RESULT= {1:'A - M. Improvável',2:'B - Improvável',3:'C - Possível',4:'C - Possível',6:'D - Provável',9:'E - M. Provável'};
const MAG_MAP = {'MAGNITUDE BAIXA':1,'MAGNITUDE MODERADA':2,'MAGNITUDE ALTA':3};
const IMP_MAP = {'IMPACTO PROFISSIONAL BAIXO':1,'IMPACTO PROFISSIONAL MODERADO':2,'IMPACTO PROFISSIONAL ALTO':3};
const SEV_RESULT= {1:'I - Insignificante',2:'II - Pequeno',3:'III - Significante',4:'III - Significante',6:'IV - Grande',9:'V - Catastrófico'};
const MATRIZ_RISCO = {
  'A':{I:'Grau I',II:'Grau I',III:'Grau II',IV:'Grau II',V:'Grau III'},
  'B':{I:'Grau I',II:'Grau II',III:'Grau II',IV:'Grau III',V:'Grau IV'},
  'C':{I:'Grau II',II:'Grau II',III:'Grau III',IV:'Grau IV',V:'Grau IV'},
  'D':{I:'Grau II',II:'Grau III',III:'Grau IV',IV:'Grau IV',V:'Grau V'},
  'E':{I:'Grau III',II:'Grau IV',III:'Grau IV',IV:'Grau V',V:'Grau V'},
};

function calcRisk(row) {
  const pi = (row.prob_int||row.probIntensidade||'').trim();
  const pf = (row.prob_freq||row.probFrequencia||'').trim();
  const sm = (row.sev_mag||row.sevMagnitude||'').trim();
  const si = (row.sev_imp||row.sevImpacto||'').trim();
  const pn = (PROB_MAP_I[pi]||0) * (PROB_MAP_F[pf]||0);
  const sn = (MAG_MAP[sm]||0) * (IMP_MAP[si]||0);
  const prob = PROB_RESULT[pn] || row.probabilidade || '';
  const sev  = SEV_RESULT[sn]  || row.severidade   || '';
  const pk = prob.charAt(0);
  const sk = sev.split('-')[0].trim();
  const grau = (MATRIZ_RISCO[pk]||{})[sk] || row.grau || '';
  return { prob_int:pi, prob_freq:pf, probabilidade:prob, sev_mag:sm, sev_imp:si, severidade:sev, grau };
}

function getTipo(fator) {
  const f = String(fator||'').toLowerCase();
  if (f.includes('psicossocial')||f.includes('cognitivo')) return 'Psicossocial';
  if (f.includes('organizacional')) return 'Organizacional';
  if (f.includes('ambiental')||f.includes('pressão sonora')||f.includes('temperatura')||f.includes('intempérie')) return 'Ambiental';
  if (f.includes('mobiliário')||f.includes('equipamento')) return 'Mobiliário';
  return 'Ergonômico';
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════


// ── LOGO DA EMPRESA ──
var LOGO_EMPRESA = '';
function triggerLogoUpload() { document.getElementById('logo-input')?.click(); }
function loadLogoImage(input) {
  if (!input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    LOGO_EMPRESA = e.target.result;
    var logoArea = document.getElementById('logo-area');
    if (logoArea) logoArea.innerHTML = '<img src="'+e.target.result+'" alt="Logo" style="max-height:52px;max-width:110px;object-fit:contain">';
  };
  reader.readAsDataURL(input.files[0]);
}


// ── Print orientation toggle
var _printLandscape = true; // default landscape
function toggleOrientation() {
  _printLandscape = !_printLandscape;
  var btn = document.getElementById('btn-orientation');
  var styleEl = document.getElementById('print-orientation-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'print-orientation-style';
    document.head.appendChild(styleEl);
  }
  if (_printLandscape) {
    styleEl.textContent = '@page { size: A4 landscape; margin: 6mm 6mm 6mm 6mm; }';
    if (btn) btn.textContent = '🔄 Paisagem';
  } else {
    styleEl.textContent = '@page { size: A4 portrait; margin: 10mm 8mm 10mm 8mm; }';
    if (btn) btn.textContent = '🔄 Retrato';
  }
}


// ════════════════════════════════════════
// GERAR HTML PUBLICÁVEL
// Embeds planilha + logo + assinaturas e baixa HTML autocontido
// ════════════════════════════════════════
function gerarHTMLPublicavel() {
  if (!INVENTARIO.length) {
    showToast('Importe uma planilha primeiro.', 'error');
    return;
  }
  showToast('Gerando sistema.html publicável...', 'info');

  // ── 1. Collect all current data to embed
  var dadosEmbutidos = {
    inventario: INVENTARIO,
    planoAcoes: PLANO_ACOES,
    empresa: EMPRESA,
    logo: LOGO_EMPRESA || '',
    assinaturas: ASSINATURAS,
    atividades: ATIVIDADES_MAP,
    afastamentos: _AFASTAMENTOS_DATA,
    vibracoes: _VIBRACOES_DATA,
  };

  // ── 2. Get current page HTML (the AEP generator)
  var docHtml = document.documentElement.outerHTML;

  // ── 3. Session bar CSS
  var sessionCss = [
    '<style>',
    '.session-bar{background:#0d1420;border-bottom:1px solid #1f2d3d;padding:4px 20px;',
    'display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#4a6a8a;z-index:150}',
    '.session-bar strong{color:#c8d0db}',
    '.btn-logout{background:none;border:none;color:#4a6a8a;cursor:pointer;font-size:11px;padding:2px 8px;border-radius:4px}',
    '.btn-logout:hover{color:#f87171;background:rgba(239,68,68,.1)}',
    '</style>'
  ].join('');

  // ── 4. Session bar HTML (inserted after <body>)
  var sessionBarHtml = [
    '<div class="session-bar" id="session-bar" style="display:none">',
    '<span>&#x1F510; <strong id="user-name"></strong> &nbsp;|&nbsp; <strong id="emp-name"></strong></span>',
    '<button class="btn-logout" onclick="logoutSistema()">Sair</button>',
    '</div>'
  ].join('');

  // ── 5. Data pre-load + session script
  var sessionScript = [
    '<script src="data/config.js"><\/script>',
    '<script>',
    // Embed data
    'var _DADOS = ' + JSON.stringify(dadosEmbutidos) + ';',
    // Auto-load data on boot
    'function _carregarDados(){',
    '  try{',
    '    INVENTARIO=_DADOS.inventario||[];',
    '    if(_DADOS.planoAcoes&&_DADOS.planoAcoes.length){PLANO_ACOES.length=0;_DADOS.planoAcoes.forEach(function(p){PLANO_ACOES.push(p);});}',
    '    Object.assign(EMPRESA,_DADOS.empresa||{});',
    '    LOGO_EMPRESA=_DADOS.logo||"";',
    '    Object.assign(ASSINATURAS,_DADOS.assinaturas||{});',
    '    ATIVIDADES_MAP=_DADOS.atividades||{};',
    '    if(_DADOS.afastamentos)Object.assign(_AFASTAMENTOS_DATA,_DADOS.afastamentos);',
    '    if(_DADOS.vibracoes)Object.assign(_VIBRACOES_DATA,_DADOS.vibracoes);',
    '  }catch(e){console.error("Erro dados:",e);}',
    '}',
    // Session check
    'function runInitSession(){',
    '  var sess=sessionStorage.getItem("aep_session");',
    '  if(!sess){window.location.href="index.html";return;}',
    '  var s;try{s=JSON.parse(sess);if(s.expiry<Date.now()){sessionStorage.removeItem("aep_session");window.location.href="index.html";return;}}catch(e){window.location.href="index.html";return;}',
    '  var bar=document.getElementById("session-bar");if(bar)bar.style.display="flex";',
    '  document.getElementById("user-name").textContent=s.nome||s.userId;',
    '  if(s.perfil!=="admin"&&s.permissoes)applyPermissoes(s.permissoes);',
    '  // Load company config (logo/responsaveis override embedded data)',
    '  if(typeof CONFIG!=="undefined"&&s.empresaId){',
    '    var emp=(CONFIG.empresas||[]).find(function(e){return e.id===s.empresaId;});',
    '    if(emp){loadEmpresaOverride(emp);document.getElementById("emp-name").textContent=emp.nome?emp.nome.substring(0,35):"";}',
    '    else document.getElementById("emp-name").textContent="Todas";',
    '  }else document.getElementById("emp-name").textContent="Admin";',
    '  // Load embedded data then render',
    '  _carregarDados();buildFilters();gerarDocumento();',
    '  var la=document.getElementById("logo-area");if(la&&LOGO_EMPRESA)la.innerHTML="<img src=\""+LOGO_EMPRESA+"\" style=\"max-height:52px;max-width:110px;object-fit:contain\">";',
    '  var sb=document.getElementById("sb-company");if(sb&&EMPRESA.nome)sb.textContent=EMPRESA.nome.substring(0,32);',
    '  var tm=document.getElementById("topbar-meta");if(tm&&EMPRESA.nome)tm.textContent=EMPRESA.nome+" • "+new Date().getFullYear();',
    '}',
    'function loadEmpresaOverride(emp){',
    '  if(emp.nome)EMPRESA.nome=emp.nome;if(emp.cnpj)EMPRESA.cnpj=emp.cnpj;',
    '  if(emp.logo){LOGO_EMPRESA=emp.logo;var la=document.getElementById("logo-area");if(la)la.innerHTML="<img src=\""+emp.logo+"\" style=\"max-height:52px;max-width:110px;object-fit:contain\">"}',
    '  if(emp.responsaveis&&emp.responsaveis.length){Object.keys(ASSINATURAS).forEach(function(k){delete ASSINATURAS[k];});emp.responsaveis.forEach(function(r,i){ASSINATURAS["resp"+(i+1)]={nome:r.nome||"",cargo:r.cargo||"",crea:r.registro||"",funcao:r.funcao||"",img:r.assinatura||""};});}',
    '}',
    'function logoutSistema(){sessionStorage.removeItem("aep_session");window.location.href="index.html";}',
    'function applyPermissoes(perms){',
    '  var has=function(p){return perms.indexOf(p)>=0;};',
    '  if(!has("importar_planilha"))document.querySelectorAll(".btn-import").forEach(function(b){b.style.display="none";});',
    '  if(!has("gerar_pdf"))document.querySelectorAll(".btn-print,#btn-orientation").forEach(function(b){b.style.display="none";});',
    '  if(!has("gerar_laudo")){var bg=document.querySelector(".btn-gerar");if(bg)bg.style.display="none";}',
    '  var m={sumario:"ver_sumario",identificacao:"ver_identificacao",introducao:"ver_introducao",base_legal:"ver_base_legal",metodologia:"ver_metodologia",matrizes:"ver_matrizes",inventario:"ver_inventario",matriz:"ver_matriz_risco",plano:"ver_plano",afastamentos:"ver_afastamentos",vibracoes:"ver_vibracoes",conclusao:"ver_conclusao"};',
    '  Object.keys(m).forEach(function(s){if(!has(m[s])){var cb=document.querySelector("[data-secao=\""+s+"\"]");if(cb){cb.checked=false;cb.disabled=true;cb.closest("label").style.opacity="0.3";cb.closest("label").style.pointerEvents="none";if(state&&state.secoes)state.secoes.delete(s);}}});',
    '}',
    // Boot
    'if(typeof CONFIG!=="undefined"){runInitSession();}',
    'else{window.addEventListener("load",function(){typeof CONFIG!=="undefined"?runInitSession():setTimeout(runInitSession,300);});}',
    '<\/script>'
  ].join('\n');

  // ── 6. Build final HTML
  var out = docHtml;

  // Add session CSS before </style>
  out = out.replace('</style>', sessionCss + '</style>');

  // Add session bar before app-wrapper
  out = out.replace('<div class="app-wrapper">', sessionBarHtml + '<div class="app-wrapper">');

  // Remove "Salvar HTML" button
  out = out.replace(/<button[^>]*onclick="gerarHTMLPublicavel\(\)"[^>]*>.*?<\/button>/g, '');

  // Replace boot call with session init
  out = out.replace(
    '// Sistema aguarda importação da planilha\nshowWelcomeScreen();',
    '// Boot handled by session script'
  );

  // Add session script before </body>
  out = out.replace('</body>', sessionScript + '\n</body>');

  // ── 7. Download as sistema.html
  var blob = new Blob([out], { type: 'text/html;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'sistema.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('sistema.html gerado! Suba no GitHub como sistema.html', 'success');
}

function showWelcomeScreen() {
  document.getElementById('doc-area').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
      min-height:70vh;text-align:center;color:#4a6a8a;padding:40px">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin-bottom:20px;opacity:.4">
        <rect x="8" y="8" width="64" height="64" rx="8" stroke="#4a9eff" stroke-width="2"/>
        <path d="M24 40h32M24 28h32M24 52h20" stroke="#4a9eff" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="60" cy="52" r="10" fill="#4a9eff" opacity=".3"/>
        <path d="M57 52h6M60 49v6" stroke="#4a9eff" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <h2 style="font-size:18px;font-weight:700;color:#c8d0db;margin-bottom:8px">Sistema Aguardando Planilha</h2>
      <p style="font-size:13px;max-width:380px;line-height:1.8;margin-bottom:24px">
        Importe a planilha AEP (.xlsx) para gerar o laudo completo com inventário de riscos,
        matriz e plano de ações.
      </p>
      <button onclick="openImportModal()" style="
        padding:12px 28px;background:#4a9eff;color:white;border:none;border-radius:6px;
        font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;
        font-family:Inter,sans-serif;letter-spacing:.03em">
        📂 Importar Planilha .xlsx
      </button>
      <p style="font-size:11px;margin-top:16px;color:#3a4a5a">
        Aceita qualquer planilha AEP no formato padrão (aba "Inventário de Riscos")
      </p>
    </div>`;
  document.getElementById('count-display').textContent = '0';
  document.getElementById('sb-company').textContent = 'Nenhuma planilha';
}

function initWithData(rows) {
  if (!rows || rows.length === 0) {
    showWelcomeScreen();
    return;
  }
  INVENTARIO = rows.map(r => {
    const calc = calcRisk(r);
    return {
      unidade: r.unidade||'GUARUJA',
      setor: r.setor||'',
      funcao: r.funcao||r.função||r['funcao']||'',
      fator: r.fator||r['fator de risco']||'',
      fonte: r.fonte||'',
      agravo: r.agravo||'',
      prob_int: calc.prob_int,
      prob_freq: calc.prob_freq,
      probabilidade: calc.probabilidade,
      sev_mag: calc.sev_mag,
      sev_imp: calc.sev_imp,
      severidade: calc.severidade,
      grau: calc.grau,
      plano: r.plano||r['plano de ação']||r['planoAcao']||r['plano_acao']||'',
      tipo: getTipo(r.fator||r['fator de risco']||''),
    };
  }).filter(r => r.setor);

  buildFilters();
  updateCount();
  document.getElementById('count-display').textContent = INVENTARIO.length;
}

function buildFilters() {
  const unique = (key) => [...new Set(INVENTARIO.map(r=>r[key]).filter(Boolean))].sort();

  // Unidade
  const sel_u = document.getElementById('f-unidade');
  unique('unidade').forEach(v => sel_u.innerHTML += `<option value="${v}">${v}</option>`);

  // Setor
  const sel_s = document.getElementById('f-setor');
  unique('setor').forEach(v => sel_s.innerHTML += `<option value="${esc(v)}">${v}</option>`);

  // Funcao
  const sel_f = document.getElementById('f-funcao');
  unique('funcao').forEach(v => sel_f.innerHTML += `<option value="${esc(v)}">${v}</option>`);

  // Grau chips
  buildChips('grau-chips', unique('grau'), 'graus', grauChipClass);

  // Prob int
  buildChips('prob-int-chips', unique('prob_int'), 'probInt', ()=>'chip-default', v=>v.replace('INTENSIDADE ',''));
  buildChips('prob-freq-chips', unique('prob_freq'), 'probFreq', ()=>'chip-default', v=>v.replace('FREQUÊNCIA ',''));
  buildChips('prob-calc-chips', unique('probabilidade'), 'probCalc', ()=>'chip-default');

  // Sev
  buildChips('sev-mag-chips', unique('sev_mag'), 'sevMag', ()=>'chip-default', v=>v.replace('MAGNITUDE ',''));
  buildChips('sev-imp-chips', unique('sev_imp'), 'sevImp', ()=>'chip-default', v=>v.replace('IMPACTO PROFISSIONAL ',''));
  buildChips('sev-calc-chips', unique('severidade'), 'sevCalc', ()=>'chip-default');

  // Tipo
  buildChips('tipo-chips', unique('tipo'), 'tipos', tipoChipClass);

  // Events
  document.getElementById('f-unidade').addEventListener('change', e => { state.unidade = e.target.value; updateCount(); });
  document.getElementById('f-setor').addEventListener('change', e => {
    state.setor = e.target.value;
    // Update funcao options
    const funcs = [...new Set(INVENTARIO.filter(r=>!state.setor||r.setor===state.setor).map(r=>r.funcao).filter(Boolean))].sort();
    const sf = document.getElementById('f-funcao');
    sf.innerHTML = '<option value="">Todas as Funções</option>';
    funcs.forEach(v => sf.innerHTML += `<option value="${esc(v)}">${v}</option>`);
    state.funcao = '';
    updateCount();
    // Auto-regenerate document if already generated
    if (document.querySelector('.sector-block, .intro-section, .matrix-section')) {
      gerarDocumento();
    }
  });
  document.getElementById('f-funcao').addEventListener('change', e => {
    state.funcao = e.target.value;
    updateCount();
    if (document.querySelector('.sector-block, .intro-section')) gerarDocumento();
  });
  document.getElementById('f-search').addEventListener('input', e => {
    state.search = e.target.value.toLowerCase();
    updateCount();
    if (document.querySelector('.sector-block, .intro-section')) gerarDocumento();
  });

  // Seções checkboxes
  document.querySelectorAll('[data-secao]').forEach(cb => {
    cb.addEventListener('change', () => {
      state.secoes = new Set([...document.querySelectorAll('[data-secao]:checked')].map(c=>c.dataset.secao));
    });
  });
}

function buildChips(containerId, values, stateKey, classFn, labelFn=v=>v) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  // Initialize state to all selected
  state[stateKey] = new Set(values);

  values.forEach(v => {
    const chip = document.createElement('label');
    chip.className = `filter-chip ${classFn(v)} chip-active`;
    chip.innerHTML = `<input type="checkbox" checked data-key="${stateKey}" data-val="${esc(v)}"> ${labelFn(v)}`;
    el.appendChild(chip);
    chip.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) state[stateKey].add(v);
      else state[stateKey].delete(v);
      chip.classList.toggle('chip-inactive', !e.target.checked);
      chip.classList.toggle('chip-active', e.target.checked);
      updateCount();
      // Auto-regenerate if document already showing
      if (document.querySelector('.sector-block, .intro-section, .matrix-section, .plano-section')) {
        gerarDocumento();
      }
    });
  });
}

function grauChipClass(g) {
  if (!g) return 'chip-default';
  if (g.includes('I ') || g === 'Grau I') return 'chip-grau-i';
  if (g.includes('II') && !g.includes('III')) return 'chip-grau-ii';
  if (g.includes('III')) return 'chip-grau-iii';
  if (g.includes('IV')) return 'chip-grau-iv';
  if (g.includes('V')) return 'chip-grau-v';
  return 'chip-default';
}
function tipoChipClass(t) {
  const m = {Ergonômico:'chip-tipo-erg',Psicossocial:'chip-tipo-psi',Organizacional:'chip-tipo-org',Ambiental:'chip-tipo-amb',Mobiliário:'chip-tipo-mob'};
  return m[t]||'chip-default';
}

// ════════════════════════════════════════
// FILTERING
// ════════════════════════════════════════
function filterData() {
  return INVENTARIO.filter(r => {
    if (state.unidade && r.unidade !== state.unidade) return false;
    if (state.setor   && r.setor   !== state.setor)   return false;
    if (state.funcao  && r.funcao  !== state.funcao)   return false;
    if (state.graus.size  && !state.graus.has(r.grau))         return false;
    if (state.probInt.size && !state.probInt.has(r.prob_int))  return false;
    if (state.probFreq.size&& !state.probFreq.has(r.prob_freq))return false;
    if (state.probCalc.size&& !state.probCalc.has(r.probabilidade)) return false;
    if (state.sevMag.size  && !state.sevMag.has(r.sev_mag))   return false;
    if (state.sevImp.size  && !state.sevImp.has(r.sev_imp))   return false;
    if (state.sevCalc.size && !state.sevCalc.has(r.severidade)) return false;
    if (state.tipos.size   && !state.tipos.has(r.tipo))        return false;
    if (state.search) {
      const hay = [r.fator,r.fonte,r.agravo,r.plano,r.setor].join(' ').toLowerCase();
      if (!hay.includes(state.search)) return false;
    }
    return true;
  });
}

function updateCount() {
  const n = filterData().length;
  document.getElementById('count-display').textContent = n;
}

function limparFiltros() {
  state.search=''; state.unidade=''; state.setor=''; state.funcao='';
  document.getElementById('f-search').value='';
  document.getElementById('f-unidade').value='';
  document.getElementById('f-setor').value='';
  document.getElementById('f-funcao').value='';
  document.querySelectorAll('[data-key]').forEach(cb => {
    cb.checked=true;
    const key = cb.dataset.key;
    const val = cb.dataset.val;
    if (state[key]) state[key].add(val);
    cb.closest('.filter-chip')?.classList.replace('chip-inactive','chip-active');
  });
  updateCount();
}

// ════════════════════════════════════════
// DOCUMENT GENERATION
// ════════════════════════════════════════
function gerarDocumento() {
  const filtered = filterData();
  const docArea = document.getElementById('doc-area');
  document.getElementById('empty-state')?.remove();

  let html = '';

  // ── HEADER
  const setoresUnicos = [...new Set(filtered.map(r=>r.setor))];
  const grauIII = filtered.filter(r=>r.grau==='Grau III').length;
  const grauII  = filtered.filter(r=>r.grau==='Grau II').length;
  const grauI   = filtered.filter(r=>r.grau==='Grau I').length;

  html += `
  <div class="doc-header-v2">
    <div class="dhv2-left">
      <div class="dhv2-logo-area" id="logo-area" onclick="triggerLogoUpload()" title="Clique para importar o logo da empresa">
        ${LOGO_EMPRESA
          ? '<img src="'+LOGO_EMPRESA+'" alt="Logo" style="max-height:52px;max-width:110px;object-fit:contain">'
          : '<div class="dhv2-logo-placeholder"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="4" fill="#003366"/><path d="M7 14h14M14 7v14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg><span>Logo</span></div>'
        }
      </div>
      <input type="file" id="logo-input" accept="image/*" style="display:none" onchange="loadLogoImage(this)">
      <div class="dhv2-badge">
        <div class="dhv2-badge-title">AEP NR-17</div>
        <div class="dhv2-badge-sub">ERGONOMIA</div>
      </div>
    </div>
    <div class="dhv2-center">
      <div class="dhv2-empresa-nome">${EMPRESA.nome || 'AEP — Avaliação Ergonômica Preliminar'}</div>
      <div class="dhv2-empresa-sub">Análise Ergonômica Preliminar — AEP NR-17${EMPRESA.elaboracao ? ' • Elaboração: ' + EMPRESA.elaboracao : ''}</div>
    </div>
    <div class="dhv2-right">
      ${EMPRESA.cnpj     ? '<div>CNPJ: <strong>'+EMPRESA.cnpj+'</strong></div>' : ''}
      ${EMPRESA.grauRisco? '<div>Grau de Risco: <strong style="color:#e74c3c">'+EMPRESA.grauRisco+'</strong></div>' : ''}
      <div>Data: <strong>${new Date().toLocaleDateString('pt-BR')}</strong></div>
    </div>
  </div>`;

  // Active filters summary (declared BEFORE use)
  var activeFilters = [];
  if (state.setor) activeFilters.push(state.setor);
  if (state.funcao) activeFilters.push(state.funcao);
  if (state.search) activeFilters.push('"' + state.search + '"');
  if (state.graus.size < 5) Array.from(state.graus).forEach(function(g){activeFilters.push(g);});
  if (state.tipos.size < 5) Array.from(state.tipos).forEach(function(t){activeFilters.push(t);});

  // Active filters bar
  if (activeFilters.length) {
    html += `<div class="active-filters">
      <span class="label">Filtros ativos:</span>
      ${activeFilters.map(function(f){return '<span class="af-tag">'+f+'</span>';}).join('')}
      <span class="af-count">${filtered.length} de ${INVENTARIO.length} riscos</span>
    </div>`;
  }

  // ── SUMÁRIO
  if (state.secoes.has('sumario')) {
    html += buildSumario(filtered);
  }

  // ── IDENTIFICAÇÃO
  if (state.secoes.has('identificacao')) {
    html += `
    <div class="intro-section">
      <div class="intro-section-header" onclick="toggleIntro(this)">
        ■ IDENTIFICAÇÃO DA EMPRESA
        <span style="font-size:10px;font-weight:400;opacity:.7">▾</span>
      </div>
      <div class="intro-body">
        <div class="id-grid">
          ${[
            ['Empresa',                  EMPRESA.nome],
            ['CNPJ',                     EMPRESA.cnpj],
            ['CNAE',                     EMPRESA.cnae ? EMPRESA.cnae + (EMPRESA.atividade ? ' — ' + EMPRESA.atividade : '') : EMPRESA.atividade],
            ['Grau de Risco',            EMPRESA.grauRisco ? EMPRESA.grauRisco + ' (conforme NR-04)' : ''],
            ['Endereço',                 EMPRESA.endereco],
            ['Unidade / Filial',         state.unidade || 'Todos'],
            ['Data de Elaboração',       EMPRESA.elaboracao],
            ['Data de Coleta',           EMPRESA.coleta],
            ['Data de Revisão',          EMPRESA.revisao],
            ['Normas Aplicáveis',        EMPRESA.normas],
            ['Elaborado por',            EMPRESA.responsavel],
            ['Participação Técnica',     EMPRESA.participacao],
            ['Total de Empregados',      EMPRESA.totalEmp ? String(EMPRESA.totalEmp) : ''],
            ['Setor Avaliado',           state.setor || 'Todos os Setores'],
          ].filter(function(item){ var v=item[1]; return v && String(v).trim() && String(v).trim() !== '—'; })
           .map(function(item){ return '<div class="id-row"><div class="id-key">'+item[0]+'</div><div class="id-val">'+item[1]+'</div></div>'; }).join('')}
        </div>
      </div>
    </div>`;
  }

  // ── INTRODUÇÃO
  if (state.secoes.has('introducao')) {
    html += buildIntroducao();
  }

  // ── BASE LEGAL
  if (state.secoes.has('base_legal')) {
    html += buildBaseLegal();
  }

  // ── METODOLOGIA
  if (state.secoes.has('metodologia')) {
    html += buildMetodologia();
  }

  // ── MATRIZES DE AVALIAÇÃO (processo avaliativo)
  if (state.secoes.has('matrizes')) {
    html += buildMatrizesAvaliacao();
  }

  // ── MATRIZ DE RISCO
  if (state.secoes.has('matriz')) {
    html += buildMatrizSection(filtered);
  }

  // ── INVENTÁRIO POR SETOR
  if (state.secoes.has('inventario')) {
    if (filtered.length === 0) {
      html += `<div class="sector-block"><div style="padding:24px;text-align:center;color:#888">Nenhum risco encontrado com os filtros aplicados.</div></div>`;
    } else {
      // Group by setor
      const bySetor = {};
      filtered.forEach(r => {
        if (!bySetor[r.setor]) bySetor[r.setor] = [];
        bySetor[r.setor].push(r);
      });

      Object.entries(bySetor).forEach(([setor, riscos]) => {
        const funcoes = [...new Set(riscos.map(r=>r.funcao).filter(Boolean))].join(', ');
        const maxGrau = riscos.reduce((mx,r)=>{
          const order={'Grau I':1,'Grau II':2,'Grau III':3,'Grau IV':4,'Grau V':5};
          return (order[r.grau]||0) > (order[mx]||0) ? r.grau : mx;
        },'');
        const empQt = EMPREGADOS.find(e=>e.setor.toLowerCase().includes(setor.toLowerCase().substring(0,6)))?.qt || '—';

        html += `
        <div class="sector-block">
          <div class="sector-header">
            <div class="sector-title">
              ■ SETOR: ${setor.toUpperCase()}
              <span class="sector-count">${riscos.length} fator${riscos.length>1?'es':''}</span>
            </div>
            <div class="sector-meta">
              <span>${empQt} trabalhadores</span>
              ${maxGrau?`<span class="sector-fn">${maxGrau}</span>`:''}
            </div>
          </div>`;

        // Setor description from atividades (short text)
        const ativDesc = getAtividade(setor);
        html += `<div class="sector-desc">
          ${ativDesc 
            ? '<b>Descrição da Atividade:</b> ' + ativDesc
            : 'Função: <b>' + (funcoes||setor) + '</b> — Avaliação realizada conforme NR-17 e ABNT NBR ISO/IEC 31010:2012.'
          }
        </div>`;

        html += `<div class="risk-table-wrap"><table class="risk-table">
          <thead><tr>
            <th>Fator de Risco</th>
            <th>Tipo</th>
            <th>Fonte / Situação</th>
            <th>Agravo Potencial</th>
            <th>PROB.</th>
            <th>SEV.</th>
            <th>GRAU</th>
            <th>Recomendações</th>
          </tr></thead><tbody>`;

        riscos.forEach(r => {
          const rowCls = r.grau==='Grau III'?'row-grau-iii':r.grau==='Grau IV'?'row-grau-iv':'';
          html += `<tr class="${rowCls}">
            <td class="td-fator"><span class="text-clamp">${r.fator||'—'}</span></td>
            <td class="td-center"><span class="tipo-badge tipo-${r.tipo?.toLowerCase().replace('ô','o').replace('/','')}">${r.tipo||'—'}</span></td>
            <td class="td-fonte"><span class="text-clamp">${r.fonte||'—'}</span></td>
            <td class="td-agravo"><span class="text-clamp">${r.agravo||'—'}</span></td>
            <td class="td-center"><span class="${probCalcClass(r.probabilidade)}">${r.probabilidade||'—'}</span></td>
            <td class="td-center"><span class="${sevCalcClass(r.severidade)}">${r.severidade||'—'}</span></td>
            <td class="td-center"><span class="grau-pill ${grauClass(r.grau)}">${r.grau||'—'}</span></td>
            <td class="td-plano"><span class="text-clamp">${r.plano||'—'}</span></td>
          </tr>`;
        });

        html += `</tbody></table></div></div>`;
      });
    }
  }

  // ── PLANO DE AÇÕES
  if (state.secoes.has('plano')) {
    // Filter plano by active state - setor match, grau match
    // Use normalize for flexible comparison (trim, lowercase)
    function normStr(s) { return String(s||'').trim().toLowerCase(); }
    const setorAtivo = normStr(state.setor);
    const planoFiltrado = PLANO_ACOES.filter(p => {
      // Setor filter: if setor selected, match plano setor
      if (setorAtivo && normStr(p.setor) !== setorAtivo) return false;
      // Grau filter
      if (state.graus.size > 0 && !state.graus.has(p.grau)) return false;
      return true;
    });
    html += `
    <div class="plano-section">
      <div class="plano-header">■ PLANO DE AÇÕES – AVALIAÇÃO ERGONÔMICA PRELIMINAR</div>
      <div style="overflow-x:auto"><table class="plano-table">
        <thead><tr>
          <th style="width:32px">#</th>
          <th style="width:110px">Setor</th>
          <th style="width:160px">Fator de Risco</th>
          <th style="width:64px">Grau</th>
          <th>O Quê (Ação Proposta)</th>
          <th>Por Quê (Objetivo)</th>
          <th style="width:90px">Responsável</th>
          <th style="width:80px">Status</th>
        </tr></thead>
        <tbody>
        ${planoFiltrado.length === 0 ? `
          <tr><td colspan="8" style="text-align:center;padding:20px;color:var(--text-muted,#888);font-size:12px">
            ${setorAtivo ? 'Nenhuma ação cadastrada para o setor "' + state.setor + '".' : 'Nenhuma ação encontrada com os filtros aplicados.'}
          </td></tr>` : planoFiltrado.map(p=>`<tr>
          <td class="td-center" style="color:#888;font-size:10px">${p.num}</td>
          <td style="font-weight:600;font-size:11px">${p.setor}</td>
          <td style="font-size:10px;color:#555">${p.fator}</td>
          <td class="td-center"><span class="grau-pill ${grauClass(p.grau)}">${p.grau}</span></td>
          <td style="font-size:10px;line-height:1.5;color:#333">${p.oque}</td>
          <td style="font-size:10px;line-height:1.5;color:#555">${p.porque}</td>
          <td style="font-size:10px">${p.responsavel||'—'}</td>
          <td class="td-center"><span class="status-chip ${statusClass(p.status)}">${p.status}</span></td>
        </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`;
  }

  // ── AVALIAÇÃO DE AFASTAMENTOS
  if (state.secoes.has('afastamentos')) { html += buildAfastamentos(); }
  // ── AVALIAÇÃO DE VIBRAÇÕES
  if (state.secoes.has('vibracoes')) { html += buildVibracoes(); }
  // ── CONCLUSÃO
  if (state.secoes.has('conclusao')) { html += buildConclusao(filtered); }
  // FOOTER
  html += `<div class="doc-footer">
    <div>
      <b>Elaborado por:</b> ${EMPRESA.responsavel} &nbsp;|&nbsp;
      <b>Participação:</b> ${EMPRESA.participacao}
    </div>
    <div>
      <b>Normas:</b> ${EMPRESA.normas} &nbsp;|&nbsp;
      <b>Gerado em:</b> ${new Date().toLocaleDateString('pt-BR')}
    </div>
  </div>`;

  docArea.innerHTML = html;
}


// ════ AFASTAMENTOS DATA + PARSER ════
const _AFASTAMENTOS_DATA = {"ano": "2025", "cidf": {"atestados": 359, "func_unicos": 177, "dias": 56962, "lista": [{"rank": 1, "funcao": "MOTORISTA", "atestados": 159, "func_unicos": 50, "dias": 24687}, {"rank": 2, "funcao": "COBRADOR", "atestados": 134, "func_unicos": 87, "dias": 20181}, {"rank": 3, "funcao": "MOTORISTA READ COBRA", "atestados": 18, "func_unicos": 11, "dias": 3497}, {"rank": 4, "funcao": "FISCAL", "atestados": 14, "func_unicos": 10, "dias": 1977}, {"rank": 5, "funcao": "AUX OPERACIONAL", "atestados": 8, "func_unicos": 5, "dias": 994}, {"rank": 6, "funcao": "COBRADOR READ AUX OP", "atestados": 5, "func_unicos": 3, "dias": 1332}, {"rank": 7, "funcao": "MANOBRISTA PATIO", "atestados": 4, "func_unicos": 2, "dias": 1029}, {"rank": 8, "funcao": "AUX CONTROLE OPE", "atestados": 3, "func_unicos": 2, "dias": 320}, {"rank": 9, "funcao": "FISCAL READ COBRADOR", "atestados": 2, "func_unicos": 1, "dias": 479}, {"rank": 10, "funcao": "LUBRIFICADOR I", "atestados": 2, "func_unicos": 1, "dias": 162}, {"rank": 11, "funcao": "MOTORISTA D", "atestados": 2, "func_unicos": 1, "dias": 361}, {"rank": 12, "funcao": "MOTORISTA READ MANOB", "atestados": 2, "func_unicos": 1, "dias": 517}, {"rank": 13, "funcao": "COORDENADOR", "atestados": 2, "func_unicos": 1, "dias": 177}, {"rank": 14, "funcao": "AUX ALMOXARIFE", "atestados": 2, "func_unicos": 1, "dias": 722}, {"rank": 15, "funcao": "COBRADOR READ PORTE", "atestados": 2, "func_unicos": 1, "dias": 527}]}, "cidm": {"atestados": 168, "func_unicos": 83, "dias": 28919, "lista": [{"rank": 1, "funcao": "MOTORISTA", "atestados": 91, "func_unicos": 30, "dias": 15360}, {"rank": 2, "funcao": "COBRADOR", "atestados": 42, "func_unicos": 30, "dias": 6512}, {"rank": 3, "funcao": "MOTORISTA READ COBRA", "atestados": 6, "func_unicos": 4, "dias": 1794}, {"rank": 4, "funcao": "FISCAL", "atestados": 5, "func_unicos": 3, "dias": 667}, {"rank": 5, "funcao": "MOTORISTA APOIO OPER", "atestados": 3, "func_unicos": 3, "dias": 484}, {"rank": 6, "funcao": "MANOBRISTA PATIO", "atestados": 3, "func_unicos": 2, "dias": 674}, {"rank": 7, "funcao": "ENC OFICINA", "atestados": 2, "func_unicos": 1, "dias": 391}, {"rank": 8, "funcao": "OFICIAL MECANICO II", "atestados": 2, "func_unicos": 2, "dias": 190}, {"rank": 9, "funcao": "COBRADOR READ PORTE", "atestados": 2, "func_unicos": 1, "dias": 791}, {"rank": 10, "funcao": "AUX CONS LIMPEZA", "atestados": 2, "func_unicos": 2, "dias": 265}, {"rank": 11, "funcao": "COBRADOR D", "atestados": 2, "func_unicos": 1, "dias": 177}, {"rank": 12, "funcao": "FUNILEIRO I", "atestados": 2, "func_unicos": 1, "dias": 533}, {"rank": 13, "funcao": "MOTORISTA READ PORTE", "atestados": 2, "func_unicos": 1, "dias": 271}, {"rank": 14, "funcao": "OFICIAL ELETRICISTA", "atestados": 2, "func_unicos": 1, "dias": 625}, {"rank": 15, "funcao": "MECANICO II", "atestados": 2, "func_unicos": 1, "dias": 185}]}};

function parseAfastamentosSheet(ws) {
  if (!ws || !ws['!ref']) return;
  const range = XLSX.utils.decode_range(ws['!ref']);
  let modeF=false, modeM=false;
  const cidf=[], cidm=[];
  let ano = new Date().getFullYear().toString();
  for (let r=range.s.r; r<=range.e.r; r++) {
    const c0 = ws[XLSX.utils.encode_cell({r, c:0})];
    const v0 = c0 ? String(c0.v||'').toUpperCase() : '';
    if (v0.match(/20\d\d/)) ano = v0.match(/20\d\d/)[0];
    // Detect CID "F" or CID "M" using quoted letter to avoid false matches
    // (e.g. "AFASTAMENTOS" contains F, breaking simple letter detection)
    // CID-F: matches 'CID "F' (with or without closing quote), or SAUDE MENTAL
    if (v0.includes('CID') && (v0.includes('CID "F') || v0.includes("CID 'F") || v0.includes('SAUDE MENTAL') || v0.includes('SAÚDE MENTAL'))) { modeF=true; modeM=false; }
    // CID-M: matches 'CID "M' or ARTICULAR/MUSCULO
    if (v0.includes('CID') && (v0.includes('CID "M') || v0.includes("CID 'M") || v0.includes('ARTICULAR') || v0.includes('MUSCULO') || v0.includes('MÚSCULO'))) { modeM=true; modeF=false; }
    const c1 = ws[XLSX.utils.encode_cell({r, c:1})];
    if (!c1 || !c1.v || String(c1.v).trim()==='Função') continue;
    const rank = c0 && !isNaN(Number(c0.v)) ? Number(c0.v) : null;
    if (rank && rank>=1 && rank<=15) {
      const gc = (col) => { const cc=ws[XLSX.utils.encode_cell({r,c:col})]; return cc&&cc.v!==undefined ? Number(cc.v)||0 : 0; };
      const entry = { rank, funcao: String(c1.v).trim(), atestados: gc(2), func_unicos: gc(3), dias: gc(4) };
      if (modeF) cidf.push(entry);
      else if (modeM) cidm.push(entry);
    }
  }
  if (cidf.length || cidm.length) {
    _AFASTAMENTOS_DATA.ano = ano;
    _AFASTAMENTOS_DATA.cidf = { atestados: cidf.reduce((s,r)=>s+r.atestados,0), func_unicos: cidf.reduce((s,r)=>s+r.func_unicos,0), dias: cidf.reduce((s,r)=>s+r.dias,0), lista: cidf };
    _AFASTAMENTOS_DATA.cidm = { atestados: cidm.reduce((s,r)=>s+r.atestados,0), func_unicos: cidm.reduce((s,r)=>s+r.func_unicos,0), dias: cidm.reduce((s,r)=>s+r.dias,0), lista: cidm };
  }
}

function buildAfastamentos() {
  const d = _AFASTAMENTOS_DATA;
  if (!d || !d.cidf) return '';

  // Filter lists by selected setor/funcao if applicable
  function normSetor(s) {
    return String(s||'').toLowerCase()
      .replace(/[áàãâ]/g,'a').replace(/[éèê]/g,'e')
      .replace(/[íì]/g,'i').replace(/[óòõô]/g,'o')
      .replace(/[úù]/g,'u').replace(/[ç]/g,'c').trim();
  }
  const setorFiltro = normSetor(state.setor || state.funcao || '');
  function filterLista(lista) {
    if (!setorFiltro || !lista) return lista;
    return lista.filter(function(r) {
      const fn = normSetor(r.funcao);
      return fn.includes(setorFiltro) || setorFiltro.includes(fn);
    });
  }
  const fLista = filterLista(d.cidf.lista);
  const mLista = filterLista(d.cidm.lista);
  const f = { atestados: fLista.reduce(function(s,r){return s+(r.atestados||0);},0), func_unicos: fLista.reduce(function(s,r){return s+(r.func_unicos||0);},0), dias: fLista.reduce(function(s,r){return s+(r.dias||0);},0), lista: fLista };
  const m = { atestados: mLista.reduce(function(s,r){return s+(r.atestados||0);},0), func_unicos: mLista.reduce(function(s,r){return s+(r.func_unicos||0);},0), dias: mLista.reduce(function(s,r){return s+(r.dias||0);},0), lista: mLista };
  const totalDias = (f.dias||0) + (m.dias||0);
  const renderList = (lista, bg, color) =>
    (lista||[]).map(r => '<tr><td style="font-weight:500">'+r.funcao+'</td>'
      +'<td class="td-center"><span class="af-badge" style="background:'+bg+';color:'+color+'">'+r.func_unicos+'</span></td>'
      +'<td class="td-center td-mono">'+Number(r.dias).toLocaleString('pt-BR')+'</td></tr>').join('');
  return `
  <div class="doc-section">
    <div class="doc-section-header" style="background:#2e3e80">
      <span class="sec-num" style="background:#1a2a60">8</span>
      AVALIAÇÃO DE AFASTAMENTOS — ANO ${d.ano||'2025'}
    </div>
    <div class="doc-section-body">
      <p>A análise dos afastamentos auxilia na correlação entre os fatores de risco identificados na AEP e os agravos à saúde. Dados referentes ao ano de <strong>${d.ano||'2025'}</strong>.</p>
      <div class="af-stats-grid">
        <div class="af-stat-card" style="border-color:#9b59b6"><div class="af-stat-val" style="color:#9b59b6">${(f.atestados||0).toLocaleString('pt-BR')}</div><div class="af-stat-lbl">ATESTADOS CID-F<br><small>Saúde Mental</small></div></div>
        <div class="af-stat-card" style="border-color:#9b59b6"><div class="af-stat-val" style="color:#9b59b6">${(f.func_unicos||0).toLocaleString('pt-BR')}</div><div class="af-stat-lbl">FUNC. ÚNICOS CID-F</div></div>
        <div class="af-stat-card" style="border-color:#e74c3c"><div class="af-stat-val" style="color:#e74c3c">${(f.dias||0).toLocaleString('pt-BR')}</div><div class="af-stat-lbl">DIAS AFASTADOS CID-F</div></div>
        <div class="af-stat-card" style="border-color:#e67e22"><div class="af-stat-val" style="color:#e67e22">${(m.atestados||0).toLocaleString('pt-BR')}</div><div class="af-stat-lbl">ATESTADOS CID-M<br><small>Articular/Músculo-Esq.</small></div></div>
        <div class="af-stat-card" style="border-color:#e67e22"><div class="af-stat-val" style="color:#e67e22">${(m.func_unicos||0).toLocaleString('pt-BR')}</div><div class="af-stat-lbl">FUNC. ÚNICOS CID-M</div></div>
        <div class="af-stat-card" style="border-color:#e74c3c"><div class="af-stat-val" style="color:#e74c3c">${(m.dias||0).toLocaleString('pt-BR')}</div><div class="af-stat-lbl">DIAS AFASTADOS CID-M</div></div>
      </div>
      <div class="af-tables-grid">
        <div>
          <div class="af-table-header" style="background:#6c3483;color:white">CID "F" — Saúde Mental &nbsp;·&nbsp; ${(f.lista||[]).length} funções · ${(f.dias||0).toLocaleString('pt-BR')} dias</div>
          <table class="af-table"><thead><tr><th>Função</th><th>Func. únicos</th><th>Dias</th></tr></thead><tbody>${renderList(f.lista,'#e8d5f5','#6c3483')}</tbody></table>
        </div>
        <div>
          <div class="af-table-header" style="background:#784212;color:white">CID "M" — Articular/Músculo-Esq. &nbsp;·&nbsp; ${(m.lista||[]).length} funções · ${(m.dias||0).toLocaleString('pt-BR')} dias</div>
          <table class="af-table"><thead><tr><th>Função</th><th>Func. únicos</th><th>Dias</th></tr></thead><tbody>${renderList(m.lista,'#fdebd0','#784212')}</tbody></table>
        </div>
      </div>
      <div class="af-correlation">🔗 <strong>Correlação com os Fatores de Risco Identificados na AEP:</strong><br>
        O total de <strong>${totalDias.toLocaleString('pt-BR')} dias de afastamento</strong> em ${d.ano||'2025'} (CID-F + CID-M) evidencia o impacto dos riscos ergonômicos e psicossociais, reforçando a urgência das ações preventivas previstas no Plano desta AEP.</div>
    </div>
  </div>`;
}

// ════ VIBRAÇÕES DATA + PARSER ════
const _VIBRACOES_DATA = {"intro": "Com base na avaliação quantitativa de Vibração de Corpo Inteiro (VCI) realizada na Viação Metrópole Paulista S/A pela empresa Alec Engenharia, foram analisadas as exposições ocupacionais dos trabalhadores das funções de Motorista, Cobrador e Mecânico Socorrista, considerando as condições reais de operação dos veículos e atividades desempenhadas. A avaliação foi executada em conformidade com os critérios técnicos estabelecidos pela NR-15, Anexo 8, Portaria nº 3.214/78 do Ministério do Trabalho, NHO 09 da FUNDACENTRO e norma ISO 2631-1, contemplando medições de vibração transmitida ao corpo inteiro durante a jornada de trabalho.\n\nAs medições foram realizadas utilizando acelerômetro triaxial e analisador de vibração ocupacional devidamente calibrados, instalados nos assentos dos operadores e trabalhadores avaliados, permitindo a determinação dos parâmetros AREN (Aceleração Resultante de Exposição Normalizada) e VDVR (Valor da Dose de Vibração Resultante), conforme metodologia prevista na NHO 09.\n\nOs resultados obtidos indicaram exposições abaixo do limite de tolerância ocupacional previsto na legislação vigente, porém algumas atividades apresentaram níveis acima do nível de ação, demandando a adoção e manutenção de medidas preventivas, tais como controle de manutenção dos veículos, acompanhamento periódico das exposições, orientações aos trabalhadores, monitoramento médico ocupacional e ações voltadas à redução da intensidade e do tempo de exposição à vibração mecânica.", "registros": [{"tipo": "VIBRAÇÕES DE CORPO INTEIRO (VCI) – NHO 09", "setor": "Motorista", "funcao": "Motorista (Edinaldo)", "equipamento": "Ônibus MB / Induscar Apache Ano 2012 | Motor Dianteiro | Diesel Placa EFW 6306 | Chassi 9BM384078CB876008 nº série 3 3341", "tempo": "7h", "aren": 0.6, "limite_aren": 1.1, "vdvr": 9.8, "limite_vdvr": 21, "situacao": "Abaixo do Limite de Exposição Ocupacional"}, {"tipo": "VIBRAÇÕES DE CORPO INTEIRO (VCI) – NHO 09", "setor": "Motorista", "funcao": "Josué Barbosa dos Santos\n(Mat. 208067)", "equipamento": "Ônibus MB / Induscar Milleniun Ano 2019 | Motor Traseiro | Diesel Placa FSM 6195 | Chassi 9BM382189KB123604 nº série 3 3745", "tempo": "7h", "aren": 0.7, "limite_aren": 1.1, "vdvr": 11, "limite_vdvr": 21, "situacao": "Abaixo do Limite de Exposição Ocupacional"}, {"tipo": "VIBRAÇÕES DE CORPO INTEIRO (VCI) – NHO 09", "setor": "Cobrador", "funcao": "Marcelo Santos Ferreira\n(Mat. 209030)", "equipamento": "Ônibus MB / Induscar Apache Ano 2012 | Motor Dianteiro | Diesel Placa EFW 6306 | Chassi 9BM384078CB876008 nº série 3 3341", "tempo": "7h", "aren": 0.9, "limite_aren": 1.1, "vdvr": 14, "limite_vdvr": 21, "situacao": "Abaixo do Limite de Exposição Ocupacional"}, {"tipo": "VIBRAÇÕES DE CORPO INTEIRO (VCI) – NHO 09", "setor": "Cobrador", "funcao": "Anderson Pereira Lima\n(Mat. 211072)", "equipamento": "Ônibus MB / Induscar Milleniun Ano 2019 | Motor Traseiro | Diesel Placa FSM 6195 | Chassi 9BM382189KB123604 nº série 3 3745", "tempo": "7h", "aren": 0.5, "limite_aren": 1.1, "vdvr": 7.1, "limite_vdvr": 21, "situacao": "Abaixo do Limite de Exposição Ocupacional"}, {"tipo": "VIBRAÇÕES DE CORPO INTEIRO (VCI) – NHO 09", "setor": "Mecânica  Socorrista", "funcao": "Edvaldo de Jesus Silva", "equipamento": "Caminhão MB Atron 1635S / Guincho Ano 2019 | Modelo 2020 | Motor Dianteiro | Diesel Placa GJK5E15 | Chassi 9BM695053LB148691 nº série 3 206", "tempo": "—", "aren": 0.5, "limite_aren": 1.1, "vdvr": 9.8, "limite_vdvr": 21, "situacao": "Abaixo do Limite de Exposição Ocupacional"}, {"tipo": "VIBRAÇÕES EM MÃO E BRAÇOS (VMB) – NHO 10", "setor": "Borracharia", "funcao": "Edvaldo de Jesus Silva\n(Mat. 202929)", "equipamento": "Chave de Impacto Longa 1\" Pinless Hammer – 14,2 kg (Modelo: LDR2 / 3800 rpm / 90 psi)", "tempo": "30", "aren": 3, "limite_aren": 5, "vdvr": null, "limite_vdvr": null, "situacao": "Abaixo do Limite de Exposição Ocupacional"}, {"tipo": "VIBRAÇÕES EM MÃO E BRAÇOS (VMB) – NHO 10", "setor": "Mecânica", "funcao": "Washington Wellington da Silva\n(Mat. 212058)", "equipamento": "Chave Parafusadeira de Impacto 1/2\" FORTGPRO FG3200 – 2,7 kg (7.500 rpm – gatilho anatômico)", "tempo": "60", "aren": 2.2, "limite_aren": 5, "vdvr": null, "limite_vdvr": null, "situacao": "Abaixo do Limite de Exposição Ocupacional"}]};

function parseVibracoesSheet(ws) {
  if (!ws || !ws['!ref']) return;
  var range = XLSX.utils.decode_range(ws['!ref']);
  var regs = [];
  for (var row=range.s.r; row<=range.e.r; row++) {
    var c1 = ws[XLSX.utils.encode_cell({r: row, c: 1})];
    if (!c1 || !c1.v) continue;
    var v1 = String(c1.v).trim();
    if (v1.toLowerCase().indexOf('nho') >= 0) {
      var getVibCell = function(ws2, rowIdx, colIdx) {
        var cell = ws2[XLSX.utils.encode_cell({r: rowIdx, c: colIdx})];
        return (cell && cell.v !== undefined) ? String(cell.v).replace(/\n/g, ' ').trim() : '';
      };
      regs.push({
        tipo: v1,
        setor: getVibCell(ws, row, 2),
        funcao: getVibCell(ws, row, 3),
        equipamento: getVibCell(ws, row, 4),
        tempo: getVibCell(ws, row, 5),
        aren: getVibCell(ws, row, 6),
        limite_aren: getVibCell(ws, row, 7),
        vdvr: getVibCell(ws, row, 8),
        limite_vdvr: getVibCell(ws, row, 9),
        situacao: getVibCell(ws, row, 10),
      });
    }
  }
  if (regs.length) { _VIBRACOES_DATA.registros = regs; }
}
function buildVibracoes() {
  const d = _VIBRACOES_DATA;
  if (!d || !d.registros || !d.registros.length) return '';

  // Filter by active setor state (same normalization as inventory)
  function normSetor(s) {
    return String(s||'').toLowerCase()
      .replace(/[áàãâ]/g,'a').replace(/[éèê]/g,'e')
      .replace(/[íì]/g,'i').replace(/[óòõô]/g,'o')
      .replace(/[úù]/g,'u').replace(/[ç]/g,'c').trim();
  }
  const setorFiltro = normSetor(state.setor);
  const allRegs = setorFiltro
    ? d.registros.filter(function(r) {
        return normSetor(r.setor).includes(setorFiltro) || setorFiltro.includes(normSetor(r.setor));
      })
    : d.registros;

  // If no records match the filter, don't show this section
  if (setorFiltro && !allRegs.length) return '';

  const vci = allRegs.filter(function(r){ return r.tipo.includes('CORPO') || r.tipo.includes('VCI'); });
  const vmb = allRegs.filter(function(r){ return r.tipo.includes('MÃO') || r.tipo.includes('VMB'); });
  function renderRows(regs) {
    return regs.map(function(r) {
      const ok = r.situacao.toLowerCase().includes('abaixo');
      const vdvrCols = r.vdvr ? '<td class="td-center td-mono">'+r.vdvr+'</td><td class="td-center td-mono">'+r.limite_vdvr+'</td>' : '';
      return '<tr><td style="font-weight:600;white-space:nowrap">'+r.setor+'</td>'
        +'<td style="font-size:10px">'+r.funcao+'</td>'
        +'<td style="font-size:10px">'+r.equipamento+'</td>'
        +'<td class="td-center">'+r.tempo+'</td>'
        +'<td class="td-center td-mono" style="font-weight:700">'+r.aren+'</td>'
        +'<td class="td-center td-mono">'+r.limite_aren+'</td>'
        +vdvrCols
        +'<td><span class="vib-status '+(ok?'vib-ok':'vib-ng')+'">'+(ok?'✓ Abaixo do Limite':'⚠ Acima do Limite')+'</span></td></tr>';
    }).join('');
  }
  function renderTable(regs, label) {
    const hasVdvr = regs.some(function(r){ return r.vdvr; });
    return '<div class="vib-type-header">'+label+'</div>'
      +'<div style="overflow-x:auto"><table class="vib-table"><thead><tr>'
      +'<th>Setor</th><th>Função / Avaliado</th><th>Equipamento</th>'
      +'<th>Tempo</th><th>AREN (m/s²)</th><th>Limite</th>'
      +(hasVdvr ? '<th>VDVR (m/s¹·⁷⁵)</th><th>Limite</th>' : '')
      +'<th>Situação</th></tr></thead><tbody>'
      +renderRows(regs)+'</tbody></table></div>';
  }
  return `
  <div class="doc-section">
    <div class="doc-section-header" style="background:#154360"><span class="sec-num" style="background:#0e2d40">V</span> AVALIAÇÃO DE VIBRAÇÕES OCUPACIONAIS</div>
    <div class="doc-section-body">
      <p>${d.intro||'Avaliação de vibrações ocupacionais conforme NHO 09 e NHO 10 (Fundacentro).'}</p>
      ${vci.length ? renderTable(vci,'🔵 VCI — Vibrações de Corpo Inteiro (NHO 09)') : ''}
      ${vmb.length ? '<div style="margin-top:14px">'+renderTable(vmb,'🟠 VMB — Vibrações em Mãos e Braços (NHO 10)')+'</div>' : ''}
    </div>
  </div>`;
}

// ════ CONCLUSÃO + ASSINATURAS ════
const ASSINATURAS = {
  resp1: { nome:'', cargo:'Engenheiro de Segurança do Trabalho', crea:'', funcao:'Responsável pela Elaboração Técnica', img:'' },
  resp2: { nome:'', cargo:'Engenheiro de Segurança do Trabalho / Ergonomista', crea:'', funcao:'Participação Técnica na Implantação', img:'' },
};

function buildConclusao(filtered) {
  const total = filtered.length;
  const setores = [...new Set(filtered.map(function(r){ return r.setor; }).filter(Boolean))];
  const gI   = filtered.filter(function(r){ return r.grau==='Grau I'; }).length;
  const gII  = filtered.filter(function(r){ return (r.grau||'').includes('II') && !(r.grau||'').includes('III'); }).length;
  const gIII = filtered.filter(function(r){ return (r.grau||'').includes('III'); }).length;
  const gIV  = filtered.filter(function(r){ return (r.grau||'').includes('IV'); }).length;
  const pctI  = total>0 ? ((gI/total)*100).toFixed(1) : '0.0';
  const pctII = total>0 ? ((gII/total)*100).toFixed(1) : '0.0';
  const empresa = EMPRESA.nome || 'a empresa';
  const cidade = EMPRESA.endereco ? EMPRESA.endereco.split('-').pop().trim().split(' ').slice(0,2).join(' ') : 'São Paulo';
  const hoje = new Date().toLocaleDateString('pt-BR',{month:'long',year:'numeric'});

  const sigBlocks = Object.keys(ASSINATURAS).map(function(key) {
    const s = ASSINATURAS[key];
    const imgHtml = s.img
      ? '<img src="' + s.img + '" alt="Assinatura" style="max-width:180px;max-height:60px;object-fit:contain">'
      : '<div class="assinatura-placeholder"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 17v3h3l8.5-8.5-3-3L3 17zm14.2-9.2a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-1.2 1.2 3 3 1.2-1.2z" fill="#9CA3AF"/></svg><span>Importar assinatura</span></div>';
    return [
      '<div class="assinatura-box">',
        '<div class="assinatura-img-area" data-upload-key="' + key + '" title="Clique para importar assinatura">' + imgHtml + '</div>',
        '<div class="assinatura-linha"></div>',
        '<div class="assinatura-nome" contenteditable="true" data-sig-key="' + key + '" data-sig-field="nome">' + (s.nome || 'Clique para digitar o nome') + '</div>',
        '<div class="assinatura-cargo" contenteditable="true" data-sig-key="' + key + '" data-sig-field="cargo">' + (s.cargo || '') + '</div>',
        '<div class="assinatura-crea" contenteditable="true" data-sig-key="' + key + '" data-sig-field="crea">' + (s.crea || 'CREA: ') + '</div>',
        '<div class="assinatura-funcao">' + (s.funcao || '') + '</div>',
        '<input type="file" id="sig-input-' + key + '" accept="image/*" style="display:none">',
      '</div>'
    ].join('');
  }).join('');

  return `
  <div class="doc-section" id="secao-conclusao">
    <div class="doc-section-header" style="background:#1a3a5c"><span class="sec-num">9</span> CONCLUSÃO E RESPONSABILIDADE TÉCNICA</div>
    <div class="doc-section-body">
      <p>A presente Análise Ergonômica Preliminar identificou e avaliou <strong>${total} fatores de risco</strong> distribuídos em <strong>${setores.length} setores</strong> da <strong>${empresa}</strong>.</p>
      <p>Os resultados demonstram que <strong>${pctI}% (${gI} fatores) são Grau I</strong> e <strong>${pctII}% (${gII} fatores) são Grau II</strong>, indicando que as medidas de controle existentes são, em sua maioria, adequadas.${gIII>0?' <strong>'+((gIII/total)*100).toFixed(1)+'% ('+gIII+') foram classificados como Grau III</strong>, demandando intervenção em momento próximo.':''}${gIV>0?' <strong>'+gIV+' fator(es) de Grau IV</strong> requerem intervenção imediata.':''}</p>
      <p>As ações do Plano de Ações devem ser implementadas dentro dos prazos estipulados, com acompanhamento pelo SESMT e integração com o PCMSO.</p>
      <p>Recomenda-se a implementação das ações do Plano de Ações, integração com o PCMSO e revisão desta AEP em prazo não superior a <strong>2 (dois) anos</strong> ou quando houver alterações significativas nos processos de trabalho.</p>
      <div style="margin-top:16px;font-size:11px;color:#555">${cidade}, ${hoje}.</div>
      <div class="assinaturas-container">
        <div class="assinaturas-grid" id="assinaturas-grid">${sigBlocks}</div>
        <div class="assinatura-actions">
          <button class="btn-add-sig" onclick="addAssinante()">+ Adicionar responsável</button>
          <button class="btn-add-sig" onclick="removeLastAssinante()">− Remover último</button>
        </div>
      </div>
    </div>
  </div>`;
}

function triggerSigUpload(key) {
  var el = document.getElementById('sig-input-'+key);
  if (el) el.click();
}
function loadSigImage(key, input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    ASSINATURAS[key].img = e.target.result;
    const imgArea = document.querySelector('[data-sig-key="'+key+'"]')?.closest('.assinatura-box')?.querySelector('.assinatura-img-area');
    if (imgArea) imgArea.innerHTML = '<img src="'+e.target.result+'" alt="Assinatura" style="max-width:180px;max-height:60px;object-fit:contain">';
  };
  reader.readAsDataURL(input.files[0]);
}
// Event delegation for signature upload areas
document.addEventListener('click', function(e) {
  var area = e.target.closest('[data-upload-key]');
  if (area) {
    var key = area.getAttribute('data-upload-key');
    triggerSigUpload(key);
  }
});

// File input change handler (delegated)
document.addEventListener('change', function(e) {
  if (e.target.type === 'file' && e.target.id && e.target.id.startsWith('sig-input-')) {
    var key = e.target.id.replace('sig-input-', '');
    loadSigImage(key, e.target);
  }
});

document.addEventListener('input', function(e) {
  const el = e.target;
  if (el.dataset.sigKey && el.dataset.sigField) ASSINATURAS[el.dataset.sigKey][el.dataset.sigField] = el.textContent.trim();
});
function addAssinante() {
  const newKey = 'resp'+(Object.keys(ASSINATURAS).length+1);
  ASSINATURAS[newKey] = { nome:'', cargo:'', crea:'', funcao:'', img:'' };
  if (document.querySelector('#secao-conclusao')) gerarDocumento();
}
function removeLastAssinante() {
  const keys = Object.keys(ASSINATURAS);
  if (keys.length <= 1) return;
  delete ASSINATURAS[keys[keys.length-1]];
  if (document.querySelector('#secao-conclusao')) gerarDocumento();
}


// ════════════════════════════════════════
// SUMÁRIO
// ════════════════════════════════════════
function buildSumario(filtered) {
  const setores = [...new Set(filtered.map(r=>r.setor).filter(Boolean))];
  // dist not needed — calculated inline below
  const total = filtered.length;
  const gIII = filtered.filter(r=>(r.grau||'').includes('III')).length;
  const gII  = filtered.filter(r=>(r.grau||'').includes('II') && !(r.grau||'').includes('III')).length;
  const gI   = filtered.filter(r=>r.grau==='Grau I').length;

  const items = [
    ['1', 'Sumário'],
    ['2', 'Escopo e Introdução'],
    ['3', 'Base Legal'],
    ['4', 'Metodologia — Matrizes de Avaliação de Risco'],
    ['5', 'Identificação da Empresa'],
    ['6', 'Processo Avaliativo — Quadro Qualitativo'],
    ['7', 'Inventário de Fatores de Risco Ergonômico — AEP NR-17'],
    ['8', 'Matriz de Risco — Relação entre Severidade e Probabilidade'],
    ['9', 'Plano de Ações — Avaliação Ergonômica Preliminar'],
  ];

  return `
  <div class="sumario-section">
    <div class="sumario-header">SUMÁRIO</div>
    <div class="sumario-body">
      <table class="sumario-table">
        <tbody>
          ${items.map(([n,t])=>`<tr>
            <td class="sum-num">${n}</td>
            <td class="sum-title">${t}</td>
            <td class="sum-dots"></td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="sumario-scope">
        <span>📋 Escopo:</span>
        <strong>${total} fatores de risco</strong> em
        <strong>${setores.length} setores</strong> —
        <span style="color:#FF0000;font-weight:700">${gIII} Grau III</span> ·
        <span style="color:#A9D18E;font-weight:700">${gII} Grau II</span> ·
        <span style="color:#70AD47;font-weight:700">${gI} Grau I</span>
      </div>
    </div>
  </div>`;
}

// ════════════════════════════════════════
// INTRODUÇÃO + ESCOPO
// ════════════════════════════════════════
function buildIntroducao() {
  const empresa = EMPRESA.nome || 'a empresa';
  const normas  = EMPRESA.normas || 'NR-17 (Port. MTP 423/2021) | NR-01 (Port. 1.419/2024)';

  return `
  <div class="doc-section">
    <div class="doc-section-header">
      <span class="sec-num">2</span> ESCOPO E INTRODUÇÃO
    </div>
    <div class="doc-section-body">
      <p>A Ergonomia, também conhecida como Fatores Humanos, é uma ciência aplicada que estuda as interações entre os seres humanos e os sistemas com os quais trabalham, com o objetivo de otimizar o bem-estar humano e o desempenho global do sistema.</p>
      <p>Conforme a International Ergonomics Association (IEA), a ergonomia engloba três domínios principais: <strong>Ergonomia Física</strong> (aspectos anatômicos, antropométricos, fisiológicos e biomecânicos), <strong>Ergonomia Cognitiva</strong> (processos mentais, percepção, memória e tomada de decisão) e <strong>Ergonomia Organizacional</strong> (estrutura organizacional, escalas e comunicação).</p>
      <p>A presente AEP foi elaborada em conformidade com a NR-17 (Port. MTP 423/2021) e a NR-01 (Port. 1.419/2024), com identificação e avaliação dos fatores de risco ergonômico e psicossociais conforme o Anexo I da NR-01, subsidiando a alimentação do Programa de Gerenciamento de Riscos (PGR).</p>
      <div class="scope-badge">
        📋 Escopo: <strong>${INVENTARIO.length} fatores de risco</strong> em <strong>${[...new Set(INVENTARIO.map(r=>r.setor).filter(Boolean))].length} setores</strong>
        ${[...new Set(INVENTARIO.map(r=>r.grau).filter(Boolean))].sort().reverse().map(g=>{
          const cnt = INVENTARIO.filter(r=>r.grau===g).length;
          return cnt > 0 ? ' — <strong>'+cnt+' '+g+'</strong>' : '';
        }).join('')}.
      </div>
    </div>
  </div>`;
}

// ════════════════════════════════════════
// BASE LEGAL
// ════════════════════════════════════════
function buildBaseLegal() {
  const normas = [
    ['NR-17 (Port. MTP 423/2021)', 'Ergonomia: adaptação das condições de trabalho às características psicofisiológicas dos trabalhadores'],
    ['NR-01 (Port. 1.419/2024)', 'Gerenciamento de Riscos Ocupacionais (GRO) e Programa de Gerenciamento de Riscos (PGR)'],
    ['Anexo I da NR-01', 'Identificação dos Fatores de Risco Psicossociais Relacionados ao Trabalho'],
    ['NR-07', 'Programa de Controle Médico de Saúde Ocupacional (PCMSO)'],
    ['NR-09', 'Avaliação e Controle das Exposições Ocupacionais a Agentes Físicos, Químicos e Biológicos'],
    ['NR-15', 'Atividades e Operações Insalubres'],
    ['ABNT NBR ISO/IEC 31010:2012', 'Gestão de riscos: técnicas para o processo de avaliação de riscos'],
    ['ABNT NBR ISO 9241', 'Requisitos ergonômicos para trabalho de escritórios com computadores'],
    ['CLT — Art. 157 e 158', 'Obrigações do empregador e empregado em segurança e medicina do trabalho'],
  ];
  return `
  <div class="doc-section">
    <div class="doc-section-header">
      <span class="sec-num">3</span> BASE LEGAL
    </div>
    <div class="doc-section-body">
      <ul class="base-legal-list">
        ${normas.map(([n,d])=>`<li><strong>${n}</strong> — ${d}</li>`).join('')}
      </ul>
    </div>
  </div>`;
}

// ════════════════════════════════════════
// METODOLOGIA
// ════════════════════════════════════════
function buildMetodologia() {
  return `
  <div class="doc-section">
    <div class="doc-section-header">
      <span class="sec-num">4</span> METODOLOGIA — MATRIZES DE AVALIAÇÃO DE RISCO
    </div>
    <div class="doc-section-body">
      <p>A presente metodologia considerou não apenas a identificação dos perigos ocupacionais, mas também a análise integrada de indicadores epidemiológicos de saúde ocupacional, aspectos etiológicos relacionados à ergonomia, percepção dos trabalhadores e de seus representantes, além da avaliação técnica especializada, com foco na identificação dos determinantes dos agravos e na definição de estratégias de gerenciamento dos riscos ocupacionais. A avaliação dos riscos foi realizada conforme <strong>Matriz Qualitativa de Probabilidade × Severidade</strong>, adaptada da ABNT NBR ISO/IEC 31010:2012.</p>

      <h4 class="met-subtitle">4.1 Modelo Visual — Probabilidade e Severidade</h4>

      <div class="met-matrices-grid">
        <!-- Probabilidade matrix -->
        <div>
          <div class="met-matrix-title" style="background:#1a3a5c;color:white">PROBABILIDADE (Intensidade × Frequência)</div>
          <table class="met-matrix-table">
            <thead>
              <tr>
                <th style="background:#9DC3E6;color:#0a2a4a">Freq \\ Int</th>
                <th style="background:#9DC3E6;color:#0a2a4a">1</th>
                <th style="background:#9DC3E6;color:#0a2a4a">2</th>
                <th style="background:#9DC3E6;color:#0a2a4a">3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="met-row-label" style="background:#F4B183;color:#5a2800">1</td>
                <td style="background:#70AD47;color:#fff;font-weight:700;text-align:center;padding:8px">M. Improvável</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Improvável</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Possível</td>
              </tr>
              <tr>
                <td class="met-row-label" style="background:#F4B183;color:#5a2800">2</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Improvável</td>
                <td style="background:#FFC000;color:#5a3000;font-weight:700;text-align:center;padding:8px">Possível</td>
                <td style="background:#FF0000;color:#fff;font-weight:700;text-align:center;padding:8px">Provável</td>
              </tr>
              <tr>
                <td class="met-row-label" style="background:#F4B183;color:#5a2800">3</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Possível</td>
                <td style="background:#FF0000;color:#fff;font-weight:700;text-align:center;padding:8px">Provável</td>
                <td style="background:#FF0000;color:#fff;font-weight:700;text-align:center;padding:8px">M. Provável</td>
              </tr>
            </tbody>
          </table>
          <ul class="met-legend">
            <li><span class="met-leg-dot" style="background:#70AD47"></span><strong>A MUITO IMPROVÁVEL</strong> — Chance muito baixa de gerar eventos adversos</li>
            <li><span class="met-leg-dot" style="background:#A9D18E"></span><strong>B IMPROVÁVEL</strong> — Chance baixa de gerar eventos adversos</li>
            <li><span class="met-leg-dot" style="background:#FFFF00;border:1px solid #ccc"></span><strong>C POSSÍVEL</strong> — Chance moderada de gerar eventos adversos</li>
            <li><span class="met-leg-dot" style="background:#FFC000"></span><strong>D PROVÁVEL</strong> — Chance alta de gerar eventos adversos</li>
            <li><span class="met-leg-dot" style="background:#FF0000"></span><strong>E MUITO PROVÁVEL</strong> — Chance muito alta de gerar eventos adversos</li>
          </ul>
        </div>

        <!-- Severidade matrix -->
        <div>
          <div class="met-matrix-title" style="background:#1a3a5c;color:white">SEVERIDADE (Magnitude × Impacto Laboral)</div>
          <table class="met-matrix-table">
            <thead>
              <tr>
                <th style="background:#9DC3E6;color:#0a2a4a">Imp \\ Mag</th>
                <th style="background:#9DC3E6;color:#0a2a4a">1</th>
                <th style="background:#9DC3E6;color:#0a2a4a">2</th>
                <th style="background:#9DC3E6;color:#0a2a4a">3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="met-row-label" style="background:#F4B183;color:#5a2800">1</td>
                <td style="background:#70AD47;color:#fff;font-weight:700;text-align:center;padding:8px">Insignificante</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Pequeno</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Significante</td>
              </tr>
              <tr>
                <td class="met-row-label" style="background:#F4B183;color:#5a2800">2</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Pequeno</td>
                <td style="background:#FFC000;color:#5a3000;font-weight:700;text-align:center;padding:8px">Significante</td>
                <td style="background:#FF0000;color:#fff;font-weight:700;text-align:center;padding:8px">Grande</td>
              </tr>
              <tr>
                <td class="met-row-label" style="background:#F4B183;color:#5a2800">3</td>
                <td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center;padding:8px">Significante</td>
                <td style="background:#FF0000;color:#fff;font-weight:700;text-align:center;padding:8px">Grande</td>
                <td style="background:#FF0000;color:#fff;font-weight:700;text-align:center;padding:8px">Catastrófico</td>
              </tr>
            </tbody>
          </table>
          <ul class="met-legend">
            <li><span class="met-leg-dot" style="background:#70AD47"></span><strong>I INSIGNIFICANTE</strong> — Gravidade muito baixa para a empresa</li>
            <li><span class="met-leg-dot" style="background:#A9D18E"></span><strong>II PEQUENO</strong> — Gravidade baixa para a empresa</li>
            <li><span class="met-leg-dot" style="background:#FFFF00;border:1px solid #ccc"></span><strong>III SIGNIFICANTE</strong> — Gravidade moderada para a empresa</li>
            <li><span class="met-leg-dot" style="background:#FFC000"></span><strong>IV GRANDE</strong> — Gravidade alta para a empresa</li>
            <li><span class="met-leg-dot" style="background:#FF0000"></span><strong>V CATASTRÓFICO</strong> — Gravidade muito alta para a empresa</li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
}


// ════════════════════════════════════════
// BUILD MATRIZES DE AVALIAÇÃO SECTION
// ════════════════════════════════════════
function buildMatrizesAvaliacao() {
  return `
  <div class="matrizes-section">
    <div class="matrizes-header">■ PROCESSO AVALIATIVO — Quadro Qualitativo de Probabilidade e Severidade</div>
    <div class="matrizes-body">

      <div class="matrizes-subtitle">Tabela 1 – Quadro qualitativo do processo avaliativo de Probabilidade e Severidade</div>

      <div class="av-grid-2col">
        <!-- PROBABILIDADE -->
        <div>
          <div class="av-table-title" style="background:#F4B183">PROBABILIDADE</div>
          <table class="av-table">
            <thead>
              <tr>
                <th colspan="4" style="background:#F4B183;color:#5a2800">INTENSIDADE</th>
              </tr>
              <tr>
                <th style="background:#F4B183;color:#5a2800">Valor</th>
                <th style="background:#F4B183;color:#5a2800">Nível</th>
                <th style="background:#F4B183;color:#5a2800">Valor</th>
                <th style="background:#F4B183;color:#5a2800">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="av-num">1</td><td class="av-label">INTENSIDADE BAIXA</td><td class="av-num">1</td><td class="av-desc">O perigo encontra-se em doses reduzidas</td></tr>
              <tr><td class="av-num">2</td><td class="av-label">INTENSIDADE MÉDIA</td><td class="av-num">2</td><td class="av-desc">O perigo encontra-se em doses moderadas</td></tr>
              <tr><td class="av-num">3</td><td class="av-label">INTENSIDADE ALTA</td><td class="av-num">3</td><td class="av-desc">O perigo encontra-se em doses aumentadas</td></tr>
            </tbody>
          </table>
          <table class="av-table" style="margin-top:6px">
            <thead>
              <tr>
                <th colspan="4" style="background:#9DC3E6;color:#0a2a4a">FREQUÊNCIA</th>
              </tr>
              <tr>
                <th style="background:#9DC3E6;color:#0a2a4a">Valor</th>
                <th style="background:#9DC3E6;color:#0a2a4a">Nível</th>
                <th style="background:#9DC3E6;color:#0a2a4a">Valor</th>
                <th style="background:#9DC3E6;color:#0a2a4a">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="av-num">1</td><td class="av-label">FREQUÊNCIA BAIXA</td><td class="av-num">1</td><td class="av-desc">O perigo se repete de forma pontual</td></tr>
              <tr><td class="av-num">2</td><td class="av-label">FREQUÊNCIA MÉDIA</td><td class="av-num">2</td><td class="av-desc">O perigo se repete de forma intermitente</td></tr>
              <tr><td class="av-num">3</td><td class="av-label">FREQUÊNCIA ALTA</td><td class="av-num">3</td><td class="av-desc">O perigo se repete de forma contínua</td></tr>
            </tbody>
          </table>
        </div>

        <!-- SEVERIDADE -->
        <div>
          <div class="av-table-title" style="background:#F4B183">SEVERIDADE</div>
          <table class="av-table">
            <thead>
              <tr>
                <th colspan="4" style="background:#F4B183;color:#5a2800">MAGNITUDE</th>
              </tr>
              <tr>
                <th style="background:#F4B183;color:#5a2800">Valor</th>
                <th style="background:#F4B183;color:#5a2800">Nível</th>
                <th style="background:#F4B183;color:#5a2800">Valor</th>
                <th style="background:#F4B183;color:#5a2800">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="av-num">1</td><td class="av-label">MAGNITUDE BAIXA</td><td class="av-num">1</td><td class="av-desc">Potencial para sintomas leves e momentâneos</td></tr>
              <tr><td class="av-num">2</td><td class="av-label">MAGNITUDE MODERADA</td><td class="av-num">2</td><td class="av-desc">Potência para efeitos clínicos reversíveis</td></tr>
              <tr><td class="av-num">3</td><td class="av-label">MAGNITUDE ALTA</td><td class="av-num">3</td><td class="av-desc">Potência para efeitos clínicos irreversíveis</td></tr>
            </tbody>
          </table>
          <table class="av-table" style="margin-top:6px">
            <thead>
              <tr>
                <th colspan="4" style="background:#9DC3E6;color:#0a2a4a">IMPACTO PROFISSIONAL</th>
              </tr>
              <tr>
                <th style="background:#9DC3E6;color:#0a2a4a">Valor</th>
                <th style="background:#9DC3E6;color:#0a2a4a">Nível</th>
                <th style="background:#9DC3E6;color:#0a2a4a">Valor</th>
                <th style="background:#9DC3E6;color:#0a2a4a">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="av-num">1</td><td class="av-label">IMPACTO PROFISSIONAL BAIXO</td><td class="av-num">1</td><td class="av-desc">Algum trabalhador envolvido</td></tr>
              <tr><td class="av-num">2</td><td class="av-label">IMPACTO PROFISSIONAL MODERADO</td><td class="av-num">2</td><td class="av-desc">Certos trabalhadores envolvidos</td></tr>
              <tr><td class="av-num">3</td><td class="av-label">IMPACTO PROFISSIONAL ALTO</td><td class="av-num">3</td><td class="av-desc">Muitos trabalhadores envolvidos</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MATRIZES NUMÉRICAS 3x3 -->
      <div class="matrizes-subtitle" style="margin-top:16px">Matriz de cálculo — Probabilidade × Severidade (resultado numérico)</div>
      <div class="av-grid-2col" style="gap:20px">
        <!-- Prob matrix -->
        <div>
          <div class="av-mini-header" style="background:#F4B183;color:#5a2800">Intensidade × Frequência = Probabilidade</div>
          <table class="av-mini-table">
            <thead>
              <tr>
                <th style="background:#F4B183;color:#5a2800">Freq \ Int</th>
                <th style="background:#9DC3E6;color:#0a2a4a">1</th>
                <th style="background:#9DC3E6;color:#0a2a4a">2</th>
                <th style="background:#9DC3E6;color:#0a2a4a">3</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="av-mini-row" style="background:#F4B183;color:#5a2800">1</td><td style="background:#70AD47;color:#fff;font-weight:700;text-align:center">1</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">2</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">3</td></tr>
              <tr><td class="av-mini-row" style="background:#F4B183;color:#5a2800">2</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">2</td><td style="background:#FFC000;color:#5a3000;font-weight:700;text-align:center">4</td><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">6</td></tr>
              <tr><td class="av-mini-row" style="background:#F4B183;color:#5a2800">3</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">3</td><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">6</td><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">9</td></tr>
            </tbody>
          </table>
          <div style="margin-top:8px">
            <table class="av-legend-table">
              <tbody>
                <tr><td style="background:#70AD47;color:#fff;font-weight:700;width:28px;text-align:center">1</td><td>A – Muito Improvável</td></tr>
                <tr><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">2-3</td><td>B/C – Improvável / Possível</td></tr>
                <tr><td style="background:#FFC000;color:#5a3000;font-weight:700;text-align:center">4</td><td>C – Possível</td></tr>
                <tr><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">6-9</td><td>D/E – Provável / M. Provável</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Sev matrix -->
        <div>
          <div class="av-mini-header" style="background:#F4B183;color:#5a2800">Magnitude × Impacto = Severidade</div>
          <table class="av-mini-table">
            <thead>
              <tr>
                <th style="background:#F4B183;color:#5a2800">Imp \ Mag</th>
                <th style="background:#9DC3E6;color:#0a2a4a">1</th>
                <th style="background:#9DC3E6;color:#0a2a4a">2</th>
                <th style="background:#9DC3E6;color:#0a2a4a">3</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="av-mini-row" style="background:#F4B183;color:#5a2800">1</td><td style="background:#70AD47;color:#fff;font-weight:700;text-align:center">1</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">2</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">3</td></tr>
              <tr><td class="av-mini-row" style="background:#F4B183;color:#5a2800">2</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">2</td><td style="background:#FFC000;color:#5a3000;font-weight:700;text-align:center">4</td><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">6</td></tr>
              <tr><td class="av-mini-row" style="background:#F4B183;color:#5a2800">3</td><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">3</td><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">6</td><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">9</td></tr>
            </tbody>
          </table>
          <div style="margin-top:8px">
            <table class="av-legend-table">
              <tbody>
                <tr><td style="background:#70AD47;color:#fff;font-weight:700;width:28px;text-align:center">1</td><td>I – Insignificante</td></tr>
                <tr><td style="background:#FFFF00;color:#5a5a00;font-weight:700;text-align:center">2-3</td><td>II/III – Pequeno / Significante</td></tr>
                <tr><td style="background:#FFC000;color:#5a3000;font-weight:700;text-align:center">4</td><td>III – Significante</td></tr>
                <tr><td style="background:#FF0000;color:#fff;font-weight:700;text-align:center">6-9</td><td>IV/V – Grande / Catastrófico</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- LEGENDA QUALITATIVA -->
      <div class="matrizes-subtitle" style="margin-top:16px">Tabela 2 – Tabela Qualitativa de Referência de Probabilidade e Severidade (NBR ISO/IEC 31010:2012)</div>
      <div class="av-grid-2col">
        <table class="av-table">
          <thead>
            <tr><th colspan="2" style="background:#D6D6D6;color:#333">Probabilidade</th></tr>
            <tr><th style="background:#D6D6D6;color:#333">Código</th><th style="background:#D6D6D6;color:#333">Descrição</th></tr>
          </thead>
          <tbody>
            <tr><td class="av-code" style="background:#70AD47;color:#fff">A</td><td>Muito Improvável — Chance muito baixa de gerar eventos adversos</td></tr>
            <tr><td class="av-code" style="background:#A9D18E;color:#1a3a00">B</td><td>Improvável — Chance baixa de gerar eventos adversos</td></tr>
            <tr><td class="av-code" style="background:#FFFF00;color:#5a5a00">C</td><td>Possível — Chance moderada de gerar eventos adversos</td></tr>
            <tr><td class="av-code" style="background:#FFC000;color:#5a3000">D</td><td>Provável — Chance alta de gerar eventos adversos</td></tr>
            <tr><td class="av-code" style="background:#FF0000;color:#fff">E</td><td>Muito Provável — Chance muito alta de gerar eventos adversos</td></tr>
          </tbody>
        </table>
        <table class="av-table">
          <thead>
            <tr><th colspan="2" style="background:#D6D6D6;color:#333">Severidade</th></tr>
            <tr><th style="background:#D6D6D6;color:#333">Código</th><th style="background:#D6D6D6;color:#333">Descrição</th></tr>
          </thead>
          <tbody>
            <tr><td class="av-code" style="background:#70AD47;color:#fff">I</td><td>Insignificante — Gravidade muito baixa para a empresa</td></tr>
            <tr><td class="av-code" style="background:#A9D18E;color:#1a3a00">II</td><td>Pequeno — Gravidade baixa para a empresa</td></tr>
            <tr><td class="av-code" style="background:#FFFF00;color:#5a5a00">III</td><td>Significante — Gravidade moderada para a empresa</td></tr>
            <tr><td class="av-code" style="background:#FFC000;color:#5a3000">IV</td><td>Grande — Gravidade alta para a empresa</td></tr>
            <tr><td class="av-code" style="background:#FF0000;color:#fff">V</td><td>Catastrófico — Gravidade muito alta para a empresa</td></tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>`;
}


function buildMatrizSection(filtered) {
  const PROB_LABELS = ['A','B','C','D','E'];
  const SEV_LABELS  = ['I','II','III','IV','V'];
  const PROB_DESC   = {A:'M. Improvável',B:'Improvável',C:'Possível',D:'Provável',E:'M. Provável'};
  const SEV_DESC    = {I:'Insig.',II:'Pequeno',III:'Signif.',IV:'Grande',V:'Catastrófico'};

  // Count per cell
  const cellCount = {};
  filtered.forEach(r => {
    const pk = r.probabilidade?.charAt(0)||'';
    const sk = r.severidade?.split('-')[0]?.trim()||'';
    if (pk && sk) {
      const key=`${pk}:${sk}`;
      cellCount[key]=(cellCount[key]||0)+1;
    }
  });

  // Distribution
  const grauDist = {};
  filtered.forEach(r => { if(r.grau) grauDist[r.grau]=(grauDist[r.grau]||0)+1; });
  const grauOrder = ['Grau I','Grau II','Grau III','Grau IV','Grau V'];
  const maxCount = Math.max(...Object.values(grauDist),1);

  let html = `
    <!-- TABELA 3 -->
    <div class="tab3-section">
      <div class="tab3-title">Tabela 3 – Classificação dos Níveis de Riscos e o Determinante para o seu Gerenciamento</div>
      <table class="tab3-table">
        <thead>
          <tr>
            <th style="background:#d6d6d6;color:#222;width:20%">Graduação</th>
            <th style="background:#d6d6d6;color:#222;width:40%">Descrição</th>
            <th style="background:#d6d6d6;color:#222;width:40%">Priorização &amp; Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="background:#70AD47;font-weight:700;text-align:center">Grau I</td>
            <td style="background:#70AD47">Risco Ocupacional Muito Baixo / Impacto irrelevante à saúde e segurança do trabalho</td>
            <td style="background:#70AD47">Intervenção trivial/não necessária no momento</td>
          </tr>
          <tr>
            <td style="background:#A9D18E;font-weight:700;text-align:center">Grau II</td>
            <td style="background:#A9D18E">Risco Ocupacional Baixo / Impacto reduzido à saúde e segurança do trabalho</td>
            <td style="background:#A9D18E">Intervenção necessária em um momento posterior</td>
          </tr>
          <tr>
            <td style="background:#FFFF00;font-weight:700;text-align:center">Grau III</td>
            <td style="background:#FFFF00">Risco Ocupacional Médio / Impacto considerável à saúde e segurança do trabalho</td>
            <td style="background:#FFFF00">Intervenção necessária em um momento próximo</td>
          </tr>
          <tr>
            <td style="background:#FFC000;font-weight:700;text-align:center">Grau IV</td>
            <td style="background:#FFC000">Risco Ocupacional Alto / Impacto elevado à saúde e segurança do trabalho</td>
            <td style="background:#FFC000">Intervenção necessária tão logo quanto possível</td>
          </tr>
          <tr>
            <td style="background:#FF0000;color:white;font-weight:700;text-align:center">Grau V</td>
            <td style="background:#FF0000;color:white">Risco Ocupacional Muito Alto / Impacto altamente relevante à saúde e segurança do trabalho</td>
            <td style="background:#FF0000;color:white">Intervenção necessária imediatamente</td>
          </tr>
        </tbody>
      </table>
    </div>
<div class="matrix-section">
    <div class="matrix-section-header">■ MATRIZ DE RISCO — Relação entre Severidade e Probabilidade</div>
    <div class="matrix-wrap">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">
        <div>
          <div class="matrix-grid">
            <div class="mh"></div>
            ${SEV_LABELS.map(s=>`<div class="mh">${s}<br><span style="font-size:8px;font-weight:400">${SEV_DESC[s]}</span></div>`).join('')}
            ${PROB_LABELS.map(p=>`
              <div class="ml">${p} – ${PROB_DESC[p]}</div>
              ${SEV_LABELS.map(s=>{
                const grau = (MATRIZ_RISCO[p]||{})[s]||'';
                const cnt  = cellCount[`${p}:${s}`]||0;
                const gc   = matrizCellClass(grau);
                return `<div class="mc ${gc}" title="${grau}: ${cnt} risco(s)">
                  <span class="cnt">${cnt>0?cnt:'·'}</span>
                  <span class="glabel">${grau?grau.replace('Grau ','G'):''}</span>
                </div>`;
              }).join('')}
            `).join('')}
          </div>
          <div class="matrix-legend">
            ${[['#70AD47','#fff','Grau I – M. Baixo'],['#A9D18E','#1a3a00','Grau II – Baixo'],
               ['#FFFF00','#5a5a00','Grau III – Médio'],['#FFC000','#5a3000','Grau IV – Alto'],
               ['#FF0000','#fff','Grau V – M. Alto']].map(([bg,c,l])=>
              `<div class="legend-item"><div class="legend-dot" style="background:${bg};border:1px solid ${c}"></div><span style="color:${c};font-weight:600">${l}</span></div>`
            ).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:#1a3a5c;margin-bottom:8px">Distribuição dos Riscos</div>
          <div class="dist-chart">
            ${grauOrder.map(g=>{
              const cnt = grauDist[g]||0;
              const pct = Math.round(cnt/maxCount*100);
              const tot = filtered.length||1;
              const grauColors={'Grau I':'#70AD47','Grau II':'#A9D18E','Grau III':'#FFFF00','Grau IV':'#FFC000','Grau V':'#FF0000'};
              return `<div class="dist-row">
                <div class="dist-lbl">${g}</div>
                <div class="dist-bar-bg">
                  <div class="dist-bar-fill" style="width:${pct}%;background:${grauColors[g]}">${cnt>0?cnt:''}</div>
                </div>
                <div class="dist-val">${cnt} (${Math.round(cnt/tot*100)}%)</div>
              </div>`;
            }).join('')}
          </div>
          <div style="margin-top:14px;font-size:10px;color:#888;font-style:italic">
            Fonte: adaptado ABNT NBR ISO/IEC 31010:2012
          </div>
        </div>
      </div>
    </div>


  </div>`;
  return html;
}

// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════

// ── Color helpers for input cells (INT, FREQ, MAG, IMPAC) ──
function nivelClass(v) {
  if (!v) return '';
  const s = String(v).toUpperCase();
  if (s.includes('BAIXA') || s.includes('BAIXO'))                   return 'nivel-baixo';
  if (s.includes('MÉDIA') || s.includes('MODERADA') || s.includes('MODERADO')) return 'nivel-medio';
  if (s.includes('ALTA')  || s.includes('ALTO'))                    return 'nivel-alto';
  return '';
}
// Color helpers for probabilidade calculated (A-E)
function probCalcClass(v) {
  if (!v) return '';
  const l = String(v).trim().charAt(0).toUpperCase();
  return {A:'prob-calc-a', B:'prob-calc-b', C:'prob-calc-c', D:'prob-calc-d', E:'prob-calc-e'}[l] || '';
}
// Color helpers for severidade calculated (I-V)
function sevCalcClass(v) {
  if (!v) return '';
  const s = String(v).trim();
  if (s.startsWith('V ') || s === 'V' || s.startsWith('V-') || s.startsWith('V –')) return 'sev-calc-v';
  if (s.startsWith('IV'))  return 'sev-calc-iv';
  if (s.startsWith('III')) return 'sev-calc-iii';
  if (s.startsWith('II'))  return 'sev-calc-ii';
  if (s.startsWith('I'))   return 'sev-calc-i';
  return '';
}

function shortProb(v){if(!v)return '—';return String(v).replace('INTENSIDADE ','').trim()||'—'}
function shortFreq(v){if(!v)return '—';return String(v).replace('FREQUÊNCIA ','').trim()||'—'}
function shortMag(v){if(!v)return '—';return String(v).replace('MAGNITUDE ','').trim()||'—'}
function shortImp(v){if(!v)return '—';return String(v).replace('IMPACTO PROFISSIONAL ','').trim()||'—'}
function probClass(v){if(!v)return '';const l=v.charAt(0);return(l==='C'||l==='D'||l==='E')?'prob-c':'';}
function sevClass(v){if(!v)return '';if(v.startsWith('III')||v.startsWith('IV')||v.startsWith('V'))return 'sev-iii';return '';}
function grauClass(g){if(!g)return '';if(g==='Grau I')return 'grau-i';if(g==='Grau II')return 'grau-ii';if(g==='Grau III')return 'grau-iii';if(g==='Grau IV')return 'grau-iv';if(g==='Grau V')return 'grau-v';return '';}
function matrizCellClass(g){if(!g)return '';return {'Grau I':'mc-gi','Grau II':'mc-gii','Grau III':'mc-giii','Grau IV':'mc-giv','Grau V':'mc-gv'}[g]||'';}
function statusClass(s){const m={'Em Andamento':'st-andamento','Pendente':'st-pendente','Concluído':'st-concluido','Cancelado':'st-cancelado'};return m[s]||'st-pendente';}
function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function toggleSection(id) {
  const el = document.getElementById('section-'+id);
  const arrow = document.getElementById('arrow-'+id);
  if (!el) return;
  const isHidden = el.style.display==='none';
  el.style.display = isHidden ? '' : 'none';
  if (arrow) arrow.textContent = isHidden ? '▾' : '▸';
}
function toggleIntro(header) {
  const body = header.nextElementSibling;
  const arrow = header.querySelector('span:last-child');
  if (!body) return;
  const isHidden = body.style.display==='none';
  body.style.display = isHidden ? '' : 'none';
  if (arrow) arrow.textContent = isHidden ? '▾' : '▸';
}

// ════════════════════════════════════════
// IMPORT FROM XLSX — FIXED VERSION
// ════════════════════════════════════════
function openImportModal(){document.getElementById('modal-bg').classList.add('open')}
function closeImportModal(){document.getElementById('modal-bg').classList.remove('open')}

document.getElementById('drop-area').addEventListener('dragover', e=>{e.preventDefault();e.currentTarget.classList.add('drag')});
document.getElementById('drop-area').addEventListener('dragleave', e=>e.currentTarget.classList.remove('drag'));
document.getElementById('drop-area').addEventListener('drop', e=>{
  e.preventDefault();e.currentTarget.classList.remove('drag');
  if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
});
document.getElementById('file-input').addEventListener('change', e=>{
  if(e.target.files[0]) processFile(e.target.files[0]);
});
document.getElementById('modal-bg').addEventListener('click', e=>{
  if(e.target===document.getElementById('modal-bg')) closeImportModal();
});

function processFile(file) {
  if (!file) return;
  if (!file.name.match(/\.xlsx?$/i)) {
    showToast('Arquivo inválido. Use .xlsx', 'error'); return;
  }
  showToast('Lendo planilha…', 'info');
  
  // Use ArrayBuffer — works in all modern browsers (readAsBinaryString is deprecated)
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const arr = e.target.result;
      const wb = XLSX.read(arr, {type: 'array', cellDates: false, raw: true});
      
      // Debug: log all sheet names
      console.log('Sheet names:', wb.SheetNames);
      
      // Parse inventário
      const invSheet = findSheet(wb, ['inventário', 'inventario', 'invent']);
      if (!invSheet) {
        showToast('Aba "Inventário de Riscos" não encontrada. Abas disponíveis: ' + wb.SheetNames.join(', '), 'error');
        return;
      }
      
      const rows = parseInventarioSheet(invSheet);
      console.log('Parsed rows:', rows.length);
      
      if (!rows.length) {
        showToast('Nenhum dado encontrado na aba de Inventário.', 'error');
        return;
      }
      
      // Parse empresa
      const identSheet = findSheet(wb, ['identificação', 'identificacao', 'identifica']);
      if (identSheet) parseEmpresaSheet(identSheet);
      
      // Parse Empregados for total count
      const empSheet = findSheet(wb, ['empregados', 'empregado']);
      if (empSheet) parseEmpregadosSheet(empSheet);

      // Parse Atividade sheet for sector descriptions
      const ativSheet = findSheet(wb, ['atividade', 'atividades']);
      if (ativSheet) parseAtividadeSheet(ativSheet);

      // Parse Afastamentos
      const afSheet = findSheet(wb, ['afastamento', 'afastamentos']);
      if (afSheet) parseAfastamentosSheet(afSheet);

      // Parse Vibrações
      const vibSheet = findSheet(wb, ['vibra']);
      if (vibSheet) parseVibracoesSheet(vibSheet);
      
      // Parse plano de ações
      const planoSheet = findSheet(wb, ['plano de ações', 'plano de acoes', 'plano']);
      if (planoSheet) parsePlanoSheet(planoSheet);
      
      // Update empresa header
      document.getElementById('sb-company').textContent = EMPRESA.nome ? EMPRESA.nome.substring(0, 32) : 'Planilha carregada';
      document.getElementById('topbar-meta').textContent = (EMPRESA.nome ? EMPRESA.nome.substring(0, 50) : 'AEP') + (EMPRESA.elaboracao ? ' • ' + EMPRESA.elaboracao : ' • ' + new Date().getFullYear());
      
      // Reset and rebuild
      closeImportModal();
      resetFiltersUI();
      initWithData(rows);
      gerarDocumento();
      showToast('✓ Planilha importada: ' + rows.length + ' riscos', 'success');
      
    } catch(err) {
      console.error('Import error:', err);
      showToast('Erro ao ler planilha: ' + err.message, 'error');
    }
  };
  reader.onerror = function() { showToast('Erro ao ler arquivo.', 'error'); };
  reader.readAsArrayBuffer(file);  // <-- ArrayBuffer, not BinaryString
}

// Find sheet by partial name match (case-insensitive, accent-insensitive)
function findSheet(wb, keywords) {
  // Normalize: remove accents for comparison
  function norm(s) {
    return s.toLowerCase()
      .replace(/[áàãâä]/g,'a').replace(/[éèêë]/g,'e')
      .replace(/[íìîï]/g,'i').replace(/[óòõôö]/g,'o')
      .replace(/[úùûü]/g,'u').replace(/[ç]/g,'c')
      .replace(/[ñ]/g,'n');
  }
  for (const name of wb.SheetNames) {
    const n = norm(name);
    if (keywords.some(k => n.includes(norm(k)))) {
      return wb.Sheets[name];
    }
  }
  return null;
}

function parseInventarioSheet(ws) {
  if (!ws || !ws['!ref']) return [];
  const range = XLSX.utils.decode_range(ws['!ref']);
  
  // Find header row (look for 'Unidade' or 'Setor' in col A or B, rows 0-5)
  let hrow = 0;
  outer: for (let r = 0; r <= Math.min(5, range.e.r); r++) {
    for (let c = range.s.c; c <= Math.min(range.s.c + 5, range.e.c); c++) {
      const cell = ws[XLSX.utils.encode_cell({r, c})];
      if (cell && cell.v && /unidade|setor/i.test(String(cell.v))) {
        hrow = r; break outer;
      }
    }
  }
  
  // Read headers
  const headers = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = ws[XLSX.utils.encode_cell({r: hrow, c})];
    headers.push(cell && cell.v ? String(cell.v).replace(/\n/g,' ').trim().toLowerCase() : '');
  }
  console.log('Headers:', headers);
  
  // Map columns by header content
  const colMap = {};
  headers.forEach((h, i) => {
    if (h.includes('unidade'))                        colMap.unidade   = i;
    if (h.includes('setor'))                          colMap.setor     = i;
    if (h.includes('fun') && !colMap.funcao)          colMap.funcao    = i;
    if (h.includes('fator de risco'))                 colMap.fator     = i;
    if (h.includes('fonte'))                          colMap.fonte     = i;
    if (h.includes('agravo'))                         colMap.agravo    = i;
    if (h.includes('intensidade') || (h.includes('probabilidade') && h.includes('int'))) colMap.prob_int = i;
    if (h.includes('frequência') || h.includes('frequencia'))   colMap.prob_freq = i;
    if (h.includes('magnitude') || (h.includes('severidade') && h.includes('mag')))     colMap.sev_mag  = i;
    if (h.includes('impacto profissional'))           colMap.sev_imp   = i;
    if (h.includes('plano de ação') || h.includes('plano de acao')) colMap.plano = i;
  });
  
  console.log('Column map:', colMap);
  
  // Fallback to position-based if header detection fails
  if (colMap.unidade === undefined) colMap.unidade  = 0;
  if (colMap.setor   === undefined) colMap.setor    = 1;
  if (colMap.funcao  === undefined) colMap.funcao   = 2;
  if (colMap.fator   === undefined) colMap.fator    = 3;
  if (colMap.fonte   === undefined) colMap.fonte    = 4;
  if (colMap.agravo  === undefined) colMap.agravo   = 5;
  if (colMap.prob_int=== undefined) colMap.prob_int = 6;
  if (colMap.prob_freq===undefined) colMap.prob_freq= 7;
  if (colMap.sev_mag === undefined) colMap.sev_mag  = 9;
  if (colMap.sev_imp === undefined) colMap.sev_imp  = 10;
  if (colMap.plano   === undefined) colMap.plano    = 14;
  
  function getCell(row, colKey) {
    const ci = colMap[colKey];
    if (ci === undefined) return '';
    const cell = ws[XLSX.utils.encode_cell({r: row, c: range.s.c + ci})];
    if (!cell || cell.v === null || cell.v === undefined) return '';
    const v = String(cell.v).trim();
    return (v === '#REF!' || v === '#N/A' || v === '#VALUE!' || v === '#DIV/0!') ? '' : v;
  }
  
  const rows = [];
  for (let r = hrow + 1; r <= range.e.r; r++) {
    const unidade = getCell(r, 'unidade');
    const setor   = getCell(r, 'setor');
    if (!unidade && !setor) continue;  // skip empty rows
    
    const pi = getCell(r, 'prob_int');
    const pf = getCell(r, 'prob_freq');
    const sm = getCell(r, 'sev_mag');
    const si = getCell(r, 'sev_imp');
    
    rows.push({
      unidade, setor,
      funcao:  getCell(r, 'funcao'),
      fator:   getCell(r, 'fator'),
      fonte:   getCell(r, 'fonte'),
      agravo:  getCell(r, 'agravo'),
      prob_int: pi, prob_freq: pf, sev_mag: sm, sev_imp: si,
      plano:   getCell(r, 'plano'),
    });
  }
  return rows;
}

function parseEmpresaSheet(ws) {
  if (!ws || !ws['!ref']) return;
  const range = XLSX.utils.decode_range(ws['!ref']);

  // Normalize string for comparison (remove accents, lowercase, trim)
  function norm(s) {
    return String(s||'').toLowerCase()
      .replace(/[áàãâä]/g,'a').replace(/[éèêë]/g,'e')
      .replace(/[íìîï]/g,'i').replace(/[óòõôö]/g,'o')
      .replace(/[úùûü]/g,'u').replace(/[ç]/g,'c').trim();
  }

  // Map normalized key → EMPRESA field name
  const keyMap = {
    'empresa':                   'nome',
    'cnpj (matriz)':             'cnpj',
    'cnpj':                      'cnpj',
    'cnae':                      'cnae',
    'atividade principal':       'atividade',
    'grau de risco':             'grauRisco',
    'endereco matriz':           'endereco',
    'endereco':                  'endereco',
    'coleta de dados':           'coleta',
    'elaboracao do documento':   'elaboracao',
    'normas aplicaveis':         'normas',
    'responsavel tecnico':       'responsavel',
    'participacao tecnica':      'participacao',
    'total de empregados':       'totalEmp',
    'data de revisao da aep':    'revisao',
    'unidades (matriz e filiais)': 'unidades',
  };

  // Clear previous values so switching companies works
  Object.keys(EMPRESA).forEach(k => EMPRESA[k] = '');

  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c - 1; c++) {
      const kc = ws[XLSX.utils.encode_cell({r, c})];
      const vc = ws[XLSX.utils.encode_cell({r, c: c+1})];
      if (!kc || !vc || kc.v == null || vc.v == null) continue;
      const k = norm(String(kc.v));
      const v = String(vc.v).trim();
      if (!v || v === '' || v.includes('PUXAR')) continue; // skip placeholder cells
      const field = keyMap[k];
      if (field) EMPRESA[field] = v;
    }
  }
}

// Parse Empregados sheet to sum total employees
function parseEmpregadosSheet(ws) {
  if (!ws || !ws['!ref']) return;
  const range = XLSX.utils.decode_range(ws['!ref']);
  let total = 0;
  const list = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const nameCell = ws[XLSX.utils.encode_cell({r, c: range.s.c})];
    const qtCell  = ws[XLSX.utils.encode_cell({r, c: range.s.c + 1})];
    if (!nameCell || !qtCell) continue;
    const name = String(nameCell.v||'').trim();
    const qt   = Number(qtCell.v) || 0;
    if (!name || !qt) continue;
    if (/total/i.test(name)) continue; // skip total row
    total += qt;
    list.push({ setor: name, qt });
  }
  if (total > 0) EMPRESA.totalEmp = String(total);
  // Store for use in setores count
  window._empregadosList = list;
}

// Parse aba Atividade: build setor → atividade description map
function parseAtividadeSheet(ws) {
  if (!ws || !ws['!ref']) return;
  const range = XLSX.utils.decode_range(ws['!ref']);
  ATIVIDADES_MAP = {};
  let currentSetor = null;

  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const setorCell = ws[XLSX.utils.encode_cell({r, c: range.s.c + 1})];
    const ativCell  = ws[XLSX.utils.encode_cell({r, c: range.s.c + 2})];
    const setor = setorCell && setorCell.v ? String(setorCell.v).trim().toUpperCase() : null;
    const ativ  = ativCell  && ativCell.v  ? String(ativCell.v).trim()  : null;
    if (!ativ) continue;
    if (setor && setor !== 'SETOR') currentSetor = setor;
    if (!currentSetor) continue;
    if (!ATIVIDADES_MAP[currentSetor]) ATIVIDADES_MAP[currentSetor] = [];
    if (!ATIVIDADES_MAP[currentSetor].includes(ativ)) ATIVIDADES_MAP[currentSetor].push(ativ);
  }
  console.log('Atividades mapeadas:', Object.keys(ATIVIDADES_MAP).length, 'setores');
}

// Look up atividade by setor name (fuzzy: normalize and try partial matches)
function getAtividade(setor) {
  if (!setor || !Object.keys(ATIVIDADES_MAP).length) return null;
  const norm = s => String(s).toUpperCase()
    .replace(/[ÁÀÃÂ]/g,'A').replace(/[ÉÈÊ]/g,'E')
    .replace(/[ÍÌ]/g,'I').replace(/[ÓÒÕÔ]/g,'O').replace(/[ÚÙ]/g,'U')
    .replace(/[Ç]/g,'C').trim();
  const key = norm(setor);
  // 1. Exact match
  for (const k of Object.keys(ATIVIDADES_MAP)) {
    if (norm(k) === key) return ATIVIDADES_MAP[k].join(' ');
  }
  // 2. Partial match — key contains or is contained
  const matches = Object.keys(ATIVIDADES_MAP).filter(k => {
    const nk = norm(k);
    return nk.includes(key) || key.includes(nk);
  });
  if (matches.length === 1) return ATIVIDADES_MAP[matches[0]].join(' ');
  if (matches.length > 1) {
    // Pick best (longest overlap)
    const best = matches.sort((a,b) => Math.abs(norm(a).length - key.length) - Math.abs(norm(b).length - key.length))[0];
    return ATIVIDADES_MAP[best].join(' ');
  }
  return null;
}



function parsePlanoSheet(ws) {
  if (!ws || !ws['!ref']) return;
  const range = XLSX.utils.decode_range(ws['!ref']);
  const newPlano = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const cell0 = ws[XLSX.utils.encode_cell({r, c: range.s.c})];
    if (cell0 && cell0.v && typeof cell0.v === 'number' && cell0.v > 0) {
      const gc = (col) => { const c = ws[XLSX.utils.encode_cell({r, c: range.s.c + col})]; return c && c.v ? String(c.v).trim() : ''; };
      newPlano.push({
        num: cell0.v, setor: gc(1), fator: gc(2), grau: gc(3),
        oque: gc(4), porque: gc(5), como: gc(6),
        responsavel: gc(7), prazo: gc(8), status: gc(9)||'Pendente',
      });
    }
  }
  if (newPlano.length > 0) {
    PLANO_ACOES.length = 0;
    newPlano.forEach(p => PLANO_ACOES.push(p));
    console.log('Plano de ações:', PLANO_ACOES.length, 'items');
  }
}

function resetFiltersUI() {
  // ATIVIDADES_MAP is NOT cleared here — it's loaded from planilha and persists
  // Clear all dynamic filter elements
  ['grau-chips','prob-int-chips','prob-freq-chips','prob-calc-chips',
   'sev-mag-chips','sev-imp-chips','sev-calc-chips','tipo-chips'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  document.getElementById('f-unidade').innerHTML = '<option value="">Todas as Unidades</option>';
  document.getElementById('f-setor').innerHTML   = '<option value="">Todos os Setores</option>';
  document.getElementById('f-funcao').innerHTML  = '<option value="">Todas as Funções</option>';
  document.getElementById('f-search').value = '';
  // Reset state
  state.search=''; state.unidade=''; state.setor=''; state.funcao='';
  state.graus=new Set(); state.probInt=new Set(); state.probFreq=new Set();
  state.probCalc=new Set(); state.sevMag=new Set(); state.sevImp=new Set();
  state.sevCalc=new Set(); state.tipos=new Set();
  state.secoes=new Set(['sumario','identificacao','introducao','base_legal','metodologia','matrizes','inventario','matriz','plano','afastamentos','vibracoes','conclusao']);
}

// Toast helper
function showToast(msg, type='info') {
  const existing = document.getElementById('toast-msg');
  if (existing) existing.remove();
  const colors = {info:'#4a9eff', success:'#22c55e', error:'#ef4444'};
  const t = document.createElement('div');
  t.id = 'toast-msg';
  t.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:9999;background:#1a2535;
    border:1px solid ${colors[type]||'#4a9eff'};border-left:4px solid ${colors[type]||'#4a9eff'};
    color:#e0e6f0;padding:10px 16px;border-radius:6px;font-size:12px;font-family:Inter,sans-serif;
    box-shadow:0 4px 16px rgba(0,0,0,.4);max-width:360px;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), type==='error'?6000:3000);
}

// Sistema aguarda importação da planilha
// Se há dados pré-carregados via Build Tool, usa eles; senão mostra tela de boas-vindas
if (window.__AEP_DATA && window.__AEP_DATA.inventario && window.__AEP_DATA.inventario.length > 0) {
  // Dados embutidos pelo Build Tool — carrega automaticamente
  (function _loadBuiltData() {
    var D = window.__AEP_DATA;
    try {
      // Empresa
      if (D.empresa) Object.assign(EMPRESA, D.empresa);
      // Inventário
      if (D.inventario) { INVENTARIO.length = 0; D.inventario.forEach(function(r){INVENTARIO.push(r);}); }
      // Plano de ações
      if (D.planoAcoes) { PLANO_ACOES.length = 0; D.planoAcoes.forEach(function(p){PLANO_ACOES.push(p);}); }
      // Mapas
      if (D.atividades) ATIVIDADES_MAP = D.atividades;
      // Afastamentos
      if (D.afastamentos && (D.afastamentos.cidf || D.afastamentos.cidm)) Object.assign(_AFASTAMENTOS_DATA, D.afastamentos);
      // Vibrações
      if (D.vibracoes) _VIBRACOES_DATA.registros = D.vibracoes;
      if (D.vibIntro)  _VIBRACOES_DATA.intro = D.vibIntro;
      // Logo
      if (D.logo) {
        LOGO_EMPRESA = D.logo;
        var la = document.getElementById('logo-area');
        if (la) la.innerHTML = '<img src="' + D.logo + '" style="max-height:52px;max-width:110px;object-fit:contain">';
      }
      // Assinaturas / Responsáveis
      if (D.responsaveis && D.responsaveis.length) {
        Object.keys(ASSINATURAS).forEach(function(k){delete ASSINATURAS[k];});
        D.responsaveis.forEach(function(r, i) {
          ASSINATURAS['resp'+(i+1)] = {nome:r.nome||'',cargo:r.cargo||'',crea:r.registro||'',funcao:r.funcao||'',img:r.sig||''};
        });
      }
      // Sidebar / topbar
      var sb = document.getElementById('sb-company');
      if (sb && EMPRESA.nome) sb.textContent = EMPRESA.nome.substring(0,32);
      var tm = document.getElementById('topbar-meta');
      if (tm && EMPRESA.nome) tm.textContent = EMPRESA.nome + ' • ' + new Date().getFullYear();
      // Gera o documento
      buildFilters();
      gerarDocumento();
      console.log('[AEP Build] Dados carregados:', INVENTARIO.length, 'riscos');
    } catch(e) {
      console.error('[AEP Build] Erro ao carregar dados:', e);
      showWelcomeScreen();
    }
  })();
} else {
  showWelcomeScreen();
}
