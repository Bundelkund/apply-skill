#!/usr/bin/env node
/**
 * generate-cvs.js — Apply Skill CV HTML generator
 *
 * Reads templates/cv.html as the layout and writes a per-application HTML
 * file into ${CAREER_DIR}/applications/{slug}/output/CV_{author}.html.
 *
 * Usage:
 *   node templates/generate-cvs.js
 *   CAREER_DIR=/path/to/career node templates/generate-cvs.js
 *
 * Configure each application in the `configs` array below — or build the
 * array dynamically from your tracker DB. Keep this file editable; it is
 * a starting point, not a framework.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CAREER_DIR = process.env.CAREER_DIR || path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(__dirname, 'cv.html');
const METADATA_PATH = path.join(CAREER_DIR, 'metadata.yaml');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`Template not found: ${TEMPLATE_PATH}`);
  process.exit(1);
}
if (!fs.existsSync(METADATA_PATH)) {
  console.error(
    `Metadata not found: ${METADATA_PATH}. ` +
    'Copy templates/metadata.yaml.example to ${CAREER_DIR}/metadata.yaml.'
  );
  process.exit(1);
}

const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const metadata = yaml.load(fs.readFileSync(METADATA_PATH, 'utf8'));

// =====================================================================
// Per-application configs — edit / extend per application or load from
// a tracker DB. Each entry maps to the placeholders in cv.html.
// =====================================================================
const configs = [
  {
    name: 'acme-solutions-architect',
    subtitle: 'Solutions Architect &amp; AI Adoption Lead',
    profil:
      'Hybrid Solutions Architect with five years of shipping AI infrastructure and a parallel ' +
      'track of agile coaching and enablement. Combines hands-on Python / TypeScript work ' +
      'with workshop facilitation for non-technical stakeholders.',
    page1Jobs: [
      {
        title: 'Senior AI Solutions Engineer',
        date: '2023 – present',
        company: 'Beispiel GmbH, Berlin',
        bullets: [
          'Shipped a 5-agent CrewAI workflow that automated 80% of inbound triage.',
          'Onboarded 12 enterprise customers; +42% activation in the first 90 days.',
        ],
      },
      {
        title: 'AI Trainer / Workshop Lead',
        date: '2020 – 2023',
        company: 'Acme Education, Hamburg',
        bullets: [
          'Designed and ran 200+ workshops on prompt engineering for non-engineers.',
          'Built a curriculum used by three large customers across DACH.',
        ],
      },
    ],
    page2Jobs: [
      {
        title: 'Software Engineer',
        date: '2017 – 2020',
        company: 'Generic Tech AG, Munich',
        bullets: [
          'Owned the data ingestion pipeline; cut latency by 60%.',
          'Mentored two junior engineers through their first production launch.',
        ],
      },
    ],
    sidebarSkills: [
      { label: 'Tech', pills: ['*Python', '*TypeScript', 'FastAPI', 'Next.js', 'n8n'] },
      { label: 'AI', pills: ['*RAG', 'GraphRAG', 'CrewAI', 'Multi-Agent', 'Prompt Eng.'] },
      { label: 'Soft', pills: ['*Workshop', '*Coaching', 'Facilitation'] },
    ],
    page2SidebarSkills: [
      { label: 'Languages', pills: ['*Deutsch (C2)', '*English (C1)'] },
    ],
    erfolge: [
      '5 multi-agent systems shipped in production',
      '200+ workshops delivered, NPS 9.2 average',
      'EUR 1.2M project volume managed end-to-end',
    ],
    certs: [
      'Agile Coach (in progress, 2026)',
      'CrewAI Certified Practitioner',
    ],
  },
];

// =====================================================================
// Render — replace {{PLACEHOLDER}} tokens. Anything not handled here
// MUST stay as-is so the post-replacement check (grep -c '{{') catches
// unfilled fields.
// =====================================================================
function renderJobs(jobs) {
  return jobs
    .map(
      (j) => `
        <div class="job">
          <div class="job-header">
            <span class="job-title">${j.title}</span>
            <span class="job-date">${j.date}</span>
          </div>
          <div class="job-company">${j.company}</div>
          <ul>${j.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
        </div>`
    )
    .join('\n');
}

function renderPills(section) {
  return section.pills
    .map((p) =>
      p.startsWith('*')
        ? `<span class="pill highlight">${p.slice(1)}</span>`
        : `<span class="pill">${p}</span>`
    )
    .join(' ');
}

function fill(template, data) {
  return template.replace(/{{([A-Z0-9_]+)}}/g, (_, key) => {
    const v = data[key];
    return v === undefined ? `{{${key}}}` : v;
  });
}

for (const cfg of configs) {
  const slug = cfg.name;
  const outputDir = path.join(CAREER_DIR, 'applications', slug, 'output');
  fs.mkdirSync(outputDir, { recursive: true });

  const sidebar = cfg.sidebarSkills.concat(
    Array(Math.max(0, 3 - cfg.sidebarSkills.length)).fill({ label: '', pills: [] })
  );

  const data = {
    AUTHOR: metadata.author,
    CITY: metadata.city,
    PHONE: metadata.phone,
    EMAIL: metadata.email,
    LINKEDIN: metadata.linkedin,
    SUBTITLE: cfg.subtitle,
    PROFIL: cfg.profil,
    PAGE1_JOBS: renderJobs(cfg.page1Jobs),
    PAGE2_JOBS: renderJobs(cfg.page2Jobs),
    SIDEBAR_SECTION_1_TITLE: sidebar[0].label,
    SIDEBAR_SECTION_1_PILLS: renderPills(sidebar[0]),
    SIDEBAR_SECTION_2_TITLE: sidebar[1].label,
    SIDEBAR_SECTION_2_PILLS: renderPills(sidebar[1]),
    SIDEBAR_SECTION_3_TITLE: sidebar[2].label,
    SIDEBAR_SECTION_3_PILLS: renderPills(sidebar[2]),
    PAGE2_SIDEBAR_TITLE: cfg.page2SidebarSkills[0]?.label || '',
    PAGE2_SIDEBAR_PILLS: cfg.page2SidebarSkills[0]
      ? renderPills(cfg.page2SidebarSkills[0])
      : '',
    ERFOLGE: cfg.erfolge.map((e) => `<li>${e}</li>`).join(''),
    CERTS: cfg.certs.map((c) => `<li>${c}</li>`).join(''),
    COMPANY: slug,
  };

  const html = fill(template, data);
  const outFile = path.join(outputDir, `CV_${metadata.author}.html`);
  fs.writeFileSync(outFile, html, 'utf8');
  console.log(`wrote ${outFile}`);

  const remaining = (html.match(/{{[A-Z0-9_]+}}/g) || []).length;
  if (remaining > 0) {
    console.warn(`  WARNING: ${remaining} unfilled placeholder(s) remain`);
  }
}
