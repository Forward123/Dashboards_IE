/**
 * Executive Strategy Hub — script.js
 * Eun Mi Park, Ed.D. | Executive Hub Prototype
 *
 * Handles:
 *  - View mode toggling (Standard / Strategic Focus / Executive Exhibit)
 *  - Bar-chart grow-on-scroll animation via IntersectionObserver
 *  - Keyboard accessibility (Escape closes exhibit memo)
 */

/* ─────────────────────────────────────────────────────────────
   1. TOGGLE EXHIBIT MODE
   ───────────────────────────────────────────────────────────── */

/**
 * Switches the dashboard between three display modes:
 *   'standard'  – default, all KPIs fully visible
 *   'strategic' – highlights retention trough & recovery bars, dims other KPIs
 *   'exhibit'   – shows the Strategic Impact Memo modal overlay
 *
 * @param {'standard'|'strategic'|'exhibit'} mode
 */
function toggleExhibit(mode) {
  // ── Button references ──────────────────────────────────────
  const btnStandard = document.getElementById('btn-standard');
  const btnStrategic = document.getElementById('btn-strategic');
  const btnExhibit = document.getElementById('btn-exhibit');

  // ── Section / element references ──────────────────────────
  const kpiSection    = document.getElementById('kpi-section');
  const chartSection  = document.getElementById('chart-section');
  const currentUnit   = document.getElementById('current-unit');
  const troughUnit    = document.getElementById('trough-unit');
  const targetGap     = document.getElementById('target-gap');
  const trajectoryLine = document.getElementById('trajectory-line');
  const memoBox       = document.getElementById('memo-box');
  const kpiGrad       = document.getElementById('kpi-grad');
  const kpiFiscal     = document.getElementById('kpi-fiscal');

  // ── Reset all buttons to inactive state ───────────────────
  [btnStandard, btnStrategic, btnExhibit].forEach(btn => {
    btn.classList.remove('bg-[#004a23]', 'text-white', 'bg-amber-500');
    btn.classList.add('text-slate-500');
  });

  // ── Reset all interactive states ──────────────────────────
  kpiSection.classList.remove('dim-overlay');
  chartSection.classList.remove('dim-overlay');
  currentUnit.classList.remove('highlight-focus');
  troughUnit.classList.remove('highlight-focus');
  targetGap.style.opacity     = '0';
  trajectoryLine.style.opacity = '0';
  memoBox.style.display       = 'none';
  kpiGrad.style.opacity       = '1';
  kpiFiscal.style.opacity     = '1';

  // ── Apply mode-specific state ──────────────────────────────
  switch (mode) {

    case 'strategic':
      btnStrategic.classList.add('bg-[#004a23]', 'text-white');
      btnStrategic.classList.remove('text-slate-500');

      // Spotlight the trough and recovery bars
      currentUnit.classList.add('highlight-focus');
      troughUnit.classList.add('highlight-focus');

      // Show the 75 % target-gap marker and forecast trajectory
      targetGap.style.opacity      = '1';
      trajectoryLine.style.opacity = '1';

      // Dim the non-retention KPI cards
      kpiGrad.style.opacity   = '0.3';
      kpiFiscal.style.opacity = '0.3';
      break;

    case 'exhibit':
      btnExhibit.classList.add('bg-amber-500', 'text-white');
      btnExhibit.classList.remove('text-slate-500');

      // Display the executive memo modal
      memoBox.style.display = 'block';
      break;

    case 'standard':
    default:
      btnStandard.classList.add('bg-[#004a23]', 'text-white');
      btnStandard.classList.remove('text-slate-500');
      // All resets already applied above — nothing more needed
      break;
  }
}


/* ─────────────────────────────────────────────────────────────
   2. BAR-CHART ENTRANCE ANIMATION
   Replays the CSS `growUp` animation each time the chart
   scrolls back into view.
   ───────────────────────────────────────────────────────────── */

(function initChartAnimation() {
  const chartArea = document.getElementById('chart-area');
  if (!chartArea || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Re-trigger the animation by cloning and replacing each bar
        chartArea.querySelectorAll('.bar-growth').forEach(bar => {
          const clone = bar.cloneNode(true);
          bar.parentNode.replaceChild(clone, bar);
        });
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(chartArea);
}());


/* ─────────────────────────────────────────────────────────────
   3. KEYBOARD ACCESSIBILITY
   Pressing Escape while the exhibit memo is open returns to
   Standard view.
   ───────────────────────────────────────────────────────────── */

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const memoBox = document.getElementById('memo-box');
    if (memoBox && memoBox.style.display === 'block') {
      toggleExhibit('standard');
    }
  }
});
