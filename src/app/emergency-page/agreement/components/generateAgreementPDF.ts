// Professional PDF generator for the Blood Donation Commitment agreement.
// Uses a hidden iframe + window.print() so the browser's native "Save as PDF"
// dialog opens — letting the user pick any folder, with no extra dependencies.

type AgreementData = {
  reference: string;
  today: string;
  emergency: {
    hospital: string;
    city: string;
    ward?: string;
    contactName: string;
    contactPhone: string;
    bloodType: string;
    units: number | string;
    urgency: string;
    reason?: string;
    respondersCount?: number;
  };
  donor: {
    name: string;
    bloodType?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
  signature: string;
  // Absolute URL to the logo (so it works inside the iframe)
  logoUrl: string;
};

function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildAgreementHTML(d: AgreementData): string {
  const terms = [
    'I am voluntarily committing to donate blood for this request, with no payment given or received in any form.',
    'I confirm that I meet the basic eligibility criteria and have answered all screening questions truthfully.',
    'I understand that the hospital will perform a mandatory medical screening before any donation takes place.',
    'I will make a genuine and timely effort to reach the hospital, and will inform the hospital contact promptly if I am unable to honour this commitment.',
    'I consent to RaktSetu sharing my name and contact number with the requesting hospital solely for the purpose of fulfilling this specific request.',
    'I acknowledge that this is a voluntary humanitarian pledge and not a legally binding contract, and that RaktSetu acts only as a facilitator between the donor and the hospital.',
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Blood Donation Commitment — ${esc(d.reference)}</title>
<style>
  @page { size: A4; margin: 14mm 14mm 16mm 14mm; }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #1a1a1a;
    font-family: "Helvetica Neue", Helvetica, Arial, "Segoe UI", Roboto, sans-serif;
    font-size: 11pt;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    max-width: 182mm;
    margin: 0 auto;
    padding: 0;
  }

  /* ── Header ─────────────────────────────────────────────── */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 2.5pt solid #c8102e;
    padding-bottom: 10pt;
    margin-bottom: 14pt;
  }
  .brand { display: flex; align-items: center; gap: 10pt; }
  .brand img {
    width: 48pt;
    height: 48pt;
    object-fit: contain;
    display: block;
  }
  .brand-text .name {
    font-size: 16pt;
    font-weight: 800;
    color: #c8102e;
    letter-spacing: 0.3pt;
    line-height: 1;
  }
  .brand-text .tagline {
    font-size: 8.5pt;
    color: #555;
    margin-top: 3pt;
    letter-spacing: 0.4pt;
    text-transform: uppercase;
  }
  .meta { text-align: right; font-size: 8.5pt; color: #444; }
  .meta .label { color: #888; text-transform: uppercase; letter-spacing: 0.5pt; font-size: 7.5pt; }
  .meta .ref { font-weight: 700; color: #1a1a1a; font-size: 10pt; letter-spacing: 0.4pt; margin-top: 2pt; }

  /* ── Title block ────────────────────────────────────────── */
  .title-block {
    text-align: center;
    margin: 6pt 0 16pt 0;
  }
  .title-block h1 {
    margin: 0;
    font-size: 17pt;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: 0.5pt;
    text-transform: uppercase;
  }
  .title-block .sub {
    margin-top: 4pt;
    font-size: 9.5pt;
    color: #666;
    font-style: italic;
  }

  /* ── Preamble ───────────────────────────────────────────── */
  .preamble {
    text-align: justify;
    font-size: 10.5pt;
    margin-bottom: 14pt;
    color: #2a2a2a;
  }
  .preamble strong { color: #c8102e; }

  /* ── Section heading ────────────────────────────────────── */
  .section-title {
    font-size: 9pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2pt;
    color: #c8102e;
    border-bottom: 0.6pt solid #e3c3c8;
    padding-bottom: 3pt;
    margin: 12pt 0 8pt 0;
  }

  /* ── Parties table ──────────────────────────────────────── */
  .parties {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8pt;
  }
  .parties td {
    width: 50%;
    vertical-align: top;
    padding: 9pt 11pt;
    border: 0.6pt solid #d6d6d6;
    background: #fafafa;
  }
  .parties .role {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    color: #888;
    font-weight: 700;
    margin-bottom: 4pt;
  }
  .parties .name {
    font-size: 11.5pt;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 4pt;
  }
  .parties .line {
    font-size: 9.5pt;
    color: #444;
    margin: 1.5pt 0;
  }
  .parties .line .k {
    color: #888;
    display: inline-block;
    min-width: 52pt;
  }

  /* ── Details table ──────────────────────────────────────── */
  .details {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4pt;
  }
  .details td {
    border: 0.6pt solid #d6d6d6;
    padding: 7pt 10pt;
    width: 25%;
    background: #fff;
  }
  .details .lab {
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.6pt;
    color: #888;
    font-weight: 600;
  }
  .details .val {
    font-size: 11pt;
    font-weight: 700;
    color: #1a1a1a;
    margin-top: 2pt;
  }
  .reason-box {
    border: 0.6pt solid #d6d6d6;
    background: #fafafa;
    padding: 8pt 11pt;
    margin-top: 6pt;
    font-size: 10pt;
    color: #333;
  }
  .reason-box strong { color: #1a1a1a; }

  /* ── Terms ──────────────────────────────────────────────── */
  ol.terms {
    margin: 4pt 0 0 0;
    padding-left: 18pt;
    counter-reset: term;
  }
  ol.terms li {
    margin-bottom: 6pt;
    font-size: 10pt;
    color: #2a2a2a;
    text-align: justify;
    line-height: 1.55;
  }
  ol.terms li::marker { color: #c8102e; font-weight: 700; }

  /* ── Signature block ────────────────────────────────────── */
  .sign-grid {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10pt;
  }
  .sign-grid td {
    width: 50%;
    vertical-align: top;
    padding: 10pt 12pt;
  }
  .sign-box {
    border: 0.6pt solid #d6d6d6;
    border-radius: 3pt;
    padding: 12pt;
    background: #fafafa;
    min-height: 70pt;
  }
  .sign-label {
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    color: #888;
    font-weight: 700;
    margin-bottom: 6pt;
  }
  .sign-value {
    font-family: "Brush Script MT", "Lucida Handwriting", "Segoe Script", cursive;
    font-size: 22pt;
    color: #c8102e;
    line-height: 1;
    margin: 8pt 0 10pt 0;
    border-bottom: 0.5pt solid #c8102e;
    padding-bottom: 6pt;
    min-height: 26pt;
  }
  .sign-meta { font-size: 8.5pt; color: #555; }
  .sign-meta .row { margin: 1.5pt 0; }
  .sign-meta .k { color: #888; display: inline-block; min-width: 52pt; }

  /* ── Footer ─────────────────────────────────────────────── */
  .footer {
    margin-top: 20pt;
    border-top: 0.6pt solid #d6d6d6;
    padding-top: 8pt;
    font-size: 7.5pt;
    color: #888;
    text-align: center;
    line-height: 1.6;
  }
  .footer strong { color: #c8102e; }

  .watermark-note {
    margin-top: 10pt;
    font-size: 8.5pt;
    color: #888;
    text-align: center;
    font-style: italic;
  }

  /* Avoid breaking these in the middle */
  .no-break { page-break-inside: avoid; break-inside: avoid; }
</style>
</head>
<body>
  <div class="page">

    <!-- Header -->
    <div class="header no-break">
      <div class="brand">
        <img src="${esc(d.logoUrl)}" alt="RaktSetu Logo" />
        <div class="brand-text">
          <div class="name">RaktSetu</div>
          <div class="tagline">Connecting Donors, Saving Lives</div>
        </div>
      </div>
      <div class="meta">
        <div class="label">Reference No.</div>
        <div class="ref">${esc(d.reference)}</div>
        <div class="label" style="margin-top:6pt;">Issued On</div>
        <div style="font-weight:600;color:#1a1a1a;margin-top:2pt;">${esc(d.today)}</div>
      </div>
    </div>

    <!-- Title -->
    <div class="title-block">
      <h1>Blood Donation Commitment Agreement</h1>
      <div class="sub">A voluntary humanitarian pledge between the Donor and the Requesting Hospital</div>
    </div>

    <!-- Preamble -->
    <div class="preamble no-break">
      This Commitment Agreement is made on <strong>${esc(d.today)}</strong> through the
      <strong>RaktSetu</strong> platform, between the Requesting Hospital and the Committing Donor
      identified below, in respect of the blood request bearing reference
      <strong>${esc(d.reference)}</strong>. The parties acknowledge that RaktSetu serves
      solely as a facilitator and that this pledge is voluntary and humanitarian in nature.
    </div>

    <!-- Parties -->
    <div class="section-title">1. The Parties</div>
    <table class="parties no-break">
      <tr>
        <td>
          <div class="role">Requesting Hospital</div>
          <div class="name">${esc(d.emergency.hospital)}</div>
          <div class="line"><span class="k">Location:</span> ${esc((d.emergency.ward ? d.emergency.ward + ', ' : '') + d.emergency.city)}</div>
          <div class="line"><span class="k">Contact:</span> ${esc(d.emergency.contactName)}</div>
          <div class="line"><span class="k">Phone:</span> ${esc(d.emergency.contactPhone)}</div>
        </td>
        <td>
          <div class="role">Committing Donor</div>
          <div class="name">${esc(d.donor.name)}</div>
          <div class="line"><span class="k">Blood Type:</span> ${esc(d.donor.bloodType || '—')}</div>
          <div class="line"><span class="k">City:</span> ${esc(d.donor.city || '—')}</div>
          <div class="line"><span class="k">Phone:</span> ${esc(d.donor.phone || 'Registered number')}</div>
        </td>
      </tr>
    </table>

    <!-- Request details -->
    <div class="section-title">2. Request Details</div>
    <table class="details no-break">
      <tr>
        <td><div class="lab">Blood Type</div><div class="val">${esc(d.emergency.bloodType)}</div></td>
        <td><div class="lab">Units Needed</div><div class="val">${esc(d.emergency.units)}</div></td>
        <td><div class="lab">Urgency</div><div class="val" style="text-transform:capitalize;">${esc(d.emergency.urgency)}</div></td>
        <td><div class="lab">Responders</div><div class="val">${esc(d.emergency.respondersCount ?? 0)}</div></td>
      </tr>
    </table>
    ${d.emergency.reason ? `<div class="reason-box no-break"><strong>Reason for Request:</strong> ${esc(d.emergency.reason)}</div>` : ''}

    <!-- Terms -->
    <div class="section-title">3. Donor Commitment Terms</div>
    <ol class="terms">
      ${terms.map((t) => `<li>${esc(t)}</li>`).join('')}
    </ol>

    <!-- Signature -->
    <div class="section-title">4. Donor Acknowledgement &amp; Signature</div>
    <table class="sign-grid no-break">
      <tr>
        <td>
          <div class="sign-box">
            <div class="sign-label">Donor Signature</div>
            <div class="sign-value">${esc(d.signature || d.donor.name)}</div>
            <div class="sign-meta">
              <div class="row"><span class="k">Signed by:</span> ${esc(d.donor.name)}</div>
              <div class="row"><span class="k">Date:</span> ${esc(d.today)}</div>
              <div class="row"><span class="k">Reference:</span> ${esc(d.reference)}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="sign-box">
            <div class="sign-label">For RaktSetu (Facilitator)</div>
            <div class="sign-value" style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13pt;color:#1a1a1a;border-bottom:0.5pt solid #d6d6d6;">RaktSetu Platform</div>
            <div class="sign-meta">
              <div class="row"><span class="k">Recorded:</span> Digitally on ${esc(d.today)}</div>
              <div class="row"><span class="k">Hospital:</span> ${esc(d.emergency.hospital)}</div>
              <div class="row"><span class="k">Status:</span> Verified</div>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <div class="watermark-note">
      This document is a digitally generated record of a voluntary blood donation commitment made on the RaktSetu platform.
    </div>

    <!-- Footer -->
    <div class="footer">
      <strong>RaktSetu</strong> &nbsp;·&nbsp; Connecting Donors, Saving Lives<br/>
      RaktSetu never buys or sells blood. All donations are voluntary and humanitarian.<br/>
      This document was generated electronically and is valid without a physical signature.
    </div>

  </div>

  <script>
    // Wait for image to load (if any) before printing, so the logo prints reliably.
    window.addEventListener('load', function () {
      var img = document.querySelector('.brand img');
      function go() { setTimeout(function () { window.focus(); window.print(); }, 250); }
      if (img && !img.complete) {
        img.addEventListener('load', go);
        img.addEventListener('error', go);
      } else {
        go();
      }
    });
  </script>
</body>
</html>`;
}

export function downloadAgreementPDF(data: AgreementData) {
  // Strategy: open a hidden iframe with the printable HTML and trigger
  // window.print() inside it. The browser opens its native "Save as PDF"
  // dialog, letting the user choose any folder on their machine.
  const html = buildAgreementHTML(data);

  // Remove any previously injected frame
  const existing = document.getElementById('raktsetu-pdf-frame');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'raktsetu-pdf-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    // Fallback: open in a new tab so user can still Save as PDF (Ctrl/Cmd+P)
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Set a suggested filename via the title (most browsers use it as default).
  try { doc.title = `RaktSetu_Donation_Commitment_${data.reference}`; } catch {}
}