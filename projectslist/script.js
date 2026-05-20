const modalBackdrop = document.getElementById('modal-backdrop');
const modalGlyph = document.getElementById('modal-glyph');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

/* ---------------------------------------------
   PROJECT TITLE MAP
   (Displayed at the top of the modal)
--------------------------------------------- */
const projectTitleMap = {
  'project-one': 'Project One',
  'logicpack': 'Project LogicPack',
  'ace': 'Project ACE',
  'gravpuzz': 'Project GravPuzz',
  'gravityshift-fps': 'Project GravityShift FPS',
  'esoterica': 'Project Esoterica',
  'pivot-tool': 'Unity Pivot Tool',
  'group-tool': 'G.R.O.U.P.',
  'invisible': 'Project Invisible',
  'core': 'Project CORE',
  'one-spawner': 'Project One Spawner System',
  'one-light': 'Project One Light Manager',
  'voicestudio': 'VoiceStudio',
  'neuralstudio': 'NeuralStudio Voice Personality System',
  'winforms-theme': 'WinForms Control Theme Suite',
  'password-saver': 'Local‑Only Encrypted Password Saver',
  'sanctuary': 'Project Sanctuary',
  'illlogic-site': 'iLL‑Logic Studios Website',
  'dna': 'Dynamic Nexus Archive',
  'oracle': 'ORACLE Quantum‑Esoteric Computer',

  /* ⭐ ADDED: AION */
  'aion': 'Project AION'
};

/* ---------------------------------------------
   TEMPLATE MAP
   (Which <template> each project uses)
--------------------------------------------- */
const templateMap = {
  'project-one': 'tpl-project-one',
  'logicpack': 'tpl-logicpack',
  'ace': 'tpl-ace',
  'gravpuzz': 'tpl-gravpuzz',
  'gravityshift-fps': 'tpl-gravityshift-fps',
  'esoterica': 'tpl-esoterica',
  'pivot-tool': 'tpl-pivot-tool',
  'group-tool': 'tpl-group-tool',
  'invisible': 'tpl-invisible',
  'core': 'tpl-core',
  'one-spawner': 'tpl-one-spawner',
  'one-light': 'tpl-one-light',
  'voicestudio': 'tpl-voicestudio',
  'neuralstudio': 'tpl-neuralstudio',
  'winforms-theme': 'tpl-winforms-theme',
  'password-saver': 'tpl-password-saver',
  'sanctuary': 'tpl-sanctuary',
  'illlogic-site': 'tpl-illlogic-site',
  'dna': 'tpl-dna',
  'oracle': 'tpl-oracle',

  /* ⭐ ADDED: AION */
  'aion': 'tpl-aion'
};

/* ---------------------------------------------
   OPEN MODAL
--------------------------------------------- */
function openModal(projectKey) {
  const tplId = templateMap[projectKey];
  const tpl = document.getElementById(tplId);
  if (!tpl) return;

  const fragment = tpl.content.cloneNode(true);
  const meta = fragment.querySelector('data');
  const glyph = meta?.getAttribute('data-glyph') || '✦';
  const subtitle = meta?.getAttribute('data-subtitle') || '';
  if (meta) meta.remove();

  modalGlyph.textContent = glyph;
  modalTitle.textContent = projectTitleMap[projectKey] || 'Project';
  modalSubtitle.textContent = subtitle;
  modalBody.innerHTML = '';
  modalBody.appendChild(fragment);

  modalBackdrop.classList.add('active');
}

/* ---------------------------------------------
   CLOSE MODAL
--------------------------------------------- */
function closeModal() {
  modalBackdrop.classList.remove('active');
}

/* ---------------------------------------------
   EVENT LISTENERS
--------------------------------------------- */
document.querySelectorAll('.project-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-project');
    openModal(key);
  });
});

modalClose.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
