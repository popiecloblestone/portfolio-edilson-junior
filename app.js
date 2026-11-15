'use strict';

const projectData = {
  bola: { eyebrow: '01 / COMÉRCIO DIGITAL', title: 'Bola da Vez 10', subtitle: 'Uma loja de futebol com experiência de compra e ferramentas de gestão.', challenge: 'Organizar um catálogo de equipamentos esportivos e conectar a escolha do produto às etapas da compra.', built: 'Catálogo com busca e filtros, páginas de produto, favoritos, carrinho, conta do cliente e fluxo de checkout. O projeto também se conecta ao Supabase para dados e autenticação.', tech: 'React · TypeScript · Supabase · Vite', url: 'https://boladavez10.com/', cta: 'Visitar a loja', note: 'Repositório privado. A apresentação usa a interface pública do projeto.' },
  aires: { eyebrow: '02 / AUDIOVISUAL', title: 'Aires Films', subtitle: 'Um site que apresenta uma produtora com o ritmo e a presença do audiovisual.', challenge: 'Dar espaço aos filmes e à identidade da produtora sem perder a clareza da navegação.', built: 'Abertura em vídeo com linguagem de visor de câmera, seções de produções, apresentação da produtora, processo de trabalho e contato.', tech: 'React · TypeScript · Vite · CSS', url: 'https://landin-page-aires-films.vercel.app/', cta: 'Visitar o site', repo: 'https://github.com/popiecloblestone/Landin-page-Aires-Films' },
  terra: { eyebrow: '03 / JOGO AUTORAL', title: 'A Terra que Rejeitou', subtitle: 'Um espírito atravessa biomas brasileiros e enfrenta criaturas inspiradas no nosso folclore.', challenge: 'Transformar um universo inspirado no Brasil em um jogo de plataforma 2D que funcione diretamente no navegador.', built: 'Exploração, combate, guardiões, inventário e escolhas narrativas. Os cenários atravessam Amazônia, Cerrado, Pantanal, Caatinga e Mata Atlântica, com controles para computador e celular.', tech: 'JavaScript · HTML · CSS · Pixel art', url: 'https://a-terra-que-rejeitou-edilson.calmhazelnut2.chatgpt.site', cta: 'Jogar no navegador', note: 'Projeto autoral. A capa do portfólio é uma composição editorial inspirada no universo do jogo.' },
  quest: { eyebrow: '04 / EDUCAÇÃO & GAMIFICAÇÃO', title: 'ENEM Quest', subtitle: 'Uma aplicação que aproxima a rotina de estudos da progressão de um jogo.', challenge: 'Explorar uma rotina de estudos organizada em pequenas etapas, sessões de foco e recompensas.', built: 'Painel de estudos, trilhas de conhecimento, desafios, questões, materiais, rotina e temporizador Pomodoro. O projeto inclui empacotamento para desktop com Electron.', tech: 'React · TypeScript · Electron · Vite', url: 'https://github.com/popiecloblestone/sarameuamor', cta: 'Explorar o código', note: 'Projeto experimental de estudos. A capa representa a proposta do aplicativo.' },
  clinica: { eyebrow: '05 / AGENDAMENTO & GESTÃO', title: 'Clínica Integra', subtitle: 'Um template interativo para conhecer a jornada do paciente e o dia a dia da recepção.', challenge: 'Organizar a escolha de especialidade, profissional e horário, com acompanhamento dos pedidos de agendamento pela equipe.', built: 'Fluxo de agendamento, área do paciente, painéis de recepção, médico e administrador, aprovação e recusa de solicitações, remarcação e preparação manual de mensagens no WhatsApp.', tech: 'JavaScript · HTML · CSS · Armazenamento local', url: 'demos/clinica/index.html', cta: 'Explorar a demonstração', note: 'Template demonstrativo com clínica, acessos e dados fictícios. Os dados ficam somente no navegador; não é um sistema clínico em produção.' }
};

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); document.body.classList.remove('menu-is-open'); }
menuButton.addEventListener('click', () => { const open = mobileNav.hidden; mobileNav.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); document.body.classList.toggle('menu-is-open', open); });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); } });
window.matchMedia('(min-width:781px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  document.querySelectorAll('.project').forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; });
}));

const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let dialogTrigger;
document.querySelectorAll('.open-case').forEach(button => button.addEventListener('click', () => {
  const project = projectData[button.dataset.project];
  if (!project) return;
  dialogTrigger = button;
  dialogContent.innerHTML = `<p class="eyebrow dialog-eyebrow">${project.eyebrow}</p><h2 id="dialog-title" class="dialog-title">${project.title}</h2><p class="dialog-subtitle">${project.subtitle}</p><div class="dialog-detail"><div><h3>A ideia</h3><p>${project.challenge}</p></div><div><h3>O que foi construído</h3><p>${project.built}</p></div></div><p class="dialog-tech">${project.tech}</p><div class="dialog-links"><a class="button button-dark" href="${project.url}" target="_blank" rel="noopener noreferrer">${project.cta} <span aria-hidden="true">↗</span></a>${project.repo ? `<a class="text-link" href="${project.repo}" target="_blank" rel="noopener noreferrer">Ver código no GitHub ↗</a>` : ''}</div>${project.note ? `<p class="dialog-note">${project.note}</p>` : ''}`;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  dialog.scrollTop = 0;
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; dialogTrigger?.focus({ preventScroll: true }); });

document.querySelectorAll('input[name="interest"]').forEach(input => input.addEventListener('change', () => {
  const message = `Olá, Junior! Vi seu portfólio e quero conversar sobre ${input.value}.`;
  document.querySelector('#whatsapp-contact').href = `https://wa.me/5563981590428?text=${encodeURIComponent(message)}`;
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.06 });
  document.querySelectorAll('.section-heading,.project,.about-heading,.about-copy,.process-item').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}

// A fine continuous ribbon, rendered as vectors. Pointer motion only changes its angle slightly.
const sculpture = document.querySelector('.sculpture');
const ribbonLines = document.querySelector('#ribbon-lines');
const ribbonSpark = document.querySelector('#ribbon-spark');
const svgNS = 'http://www.w3.org/2000/svg';
const paths = Array.from({ length: 40 }, (_, i) => { const p = document.createElementNS(svgNS, 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', i % 7 === 0 ? '#454e3b' : '#69725c'); p.setAttribute('stroke-width', i % 7 === 0 ? '.8' : '.55'); p.setAttribute('opacity', i % 7 === 0 ? '.7' : '.36'); ribbonLines.appendChild(p); return p; });
const ribs = Array.from({ length: 30 }, () => { const p = document.createElementNS(svgNS, 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#7a826e'); p.setAttribute('stroke-width', '.45'); p.setAttribute('opacity', '.17'); ribbonLines.appendChild(p); return p; });
let pointerX = 0, pointerY = 0, angleX = 0, angleY = 0, sculptureVisible = true, animationId;
const canHover = window.matchMedia('(hover:hover)').matches;
sculpture.addEventListener('pointermove', e => { if (!canHover || reducedMotion.matches) return; const rect = sculpture.getBoundingClientRect(); pointerX = ((e.clientX - rect.left) / rect.width - .5) * .22; pointerY = ((e.clientY - rect.top) / rect.height - .5) * .15; requestRibbonFrame(); });
sculpture.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; requestRibbonFrame(); });
function projectPoint(u, v) {
  const radius = 135;
  let x = (radius + v * Math.cos(u / 2)) * Math.cos(u), y = (radius + v * Math.cos(u / 2)) * Math.sin(u), z = v * Math.sin(u / 2);
  const ax = .91 + angleY, ay = -.38 + angleX, az = -.39;
  const y1 = y * Math.cos(ax) - z * Math.sin(ax), z1 = y * Math.sin(ax) + z * Math.cos(ax);
  const x2 = x * Math.cos(ay) + z1 * Math.sin(ay), z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
  const x3 = x2 * Math.cos(az) - y1 * Math.sin(az), y3 = x2 * Math.sin(az) + y1 * Math.cos(az);
  const perspective = 680 / (680 - z2);
  return [260 + x3 * perspective * 1.13, 232 + y3 * perspective * 1.13];
}
function pathFor(points) { return points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(''); }
function drawRibbon() {
  paths.forEach((path, i) => { const v = -54 + i * 108 / (paths.length - 1); path.setAttribute('d', pathFor(Array.from({ length: 150 }, (_, j) => projectPoint(j / 149 * Math.PI * 2, v)))); });
  ribs.forEach((path, i) => { const u = i / ribs.length * Math.PI * 2; path.setAttribute('d', pathFor(Array.from({ length: 20 }, (_, j) => projectPoint(u, -54 + j * 108 / 19)))); });
  const spark = projectPoint(4.72, 53); ribbonSpark.setAttribute('cx', spark[0]); ribbonSpark.setAttribute('cy', spark[1]);
}
function requestRibbonFrame() { if (!animationId && sculptureVisible && !document.hidden) animationId = requestAnimationFrame(updateRibbon); }
function updateRibbon() { animationId = undefined; angleX += (pointerX - angleX) * .07; angleY += (pointerY - angleY) * .07; drawRibbon(); if (Math.abs(pointerX - angleX) + Math.abs(pointerY - angleY) > .0001) requestRibbonFrame(); }
if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { sculptureVisible = entry.isIntersecting; if (sculptureVisible) requestRibbonFrame(); }).observe(sculpture);
document.addEventListener('visibilitychange', () => { if (!document.hidden) requestRibbonFrame(); });
reducedMotion.addEventListener('change', () => { pointerX = pointerY = angleX = angleY = 0; drawRibbon(); });
drawRibbon();
