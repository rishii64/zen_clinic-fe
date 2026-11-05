/**
 * Diagnostic Laboratory Report Templates & Medical Interpretation Guidelines
 * Comprehensive pathological reference ranges, methodologies, and interpretation logic
 */

export const SPECIMEN_TYPES = {
  Hematology: 'Whole Blood (EDTA)',
  Biochemistry: 'Venous Blood (Serum / Fluoride Plasma)',
  'Liver Function': 'Clotted Blood (Serum)',
  'Kidney & Renal': 'Clotted Blood (Serum)',
  'Lipid & Cardiac': 'Fasting Venous Blood (Serum)',
  'Clinical Pathology': 'Clean Catch Midstream Urine / Fresh Stool',
  'Card Tests': 'Serum / Plasma / Whole Blood',
  Serology: 'Clotted Blood (Serum)',
  Microbiology: 'Sterile Specimen Container',
  Histopathology: 'Tissue Biopsy in 10% Formalin'
};

export const STANDARD_METHODS = {
  CBC: 'Automated 5-Part Hematology Analyzer & Light Microscopy',
  TC_DC: 'Automated Impedance / Leishman Stained Smear Microscopy',
  HB: 'Cyanmethemoglobin / SLS Hemoglobin Method',
  ESR: 'Westergren Method (Automated Photometric)',
  SUGAR_F: 'Glucose Oxidase - Peroxidase (GOD-POD) Enzymatic',
  SUGAR_R: 'Glucose Oxidase - Peroxidase (GOD-POD) Enzymatic',
  SUGAR_PP: 'Glucose Oxidase - Peroxidase (GOD-POD) Enzymatic',
  LFT: 'Spectrophotometric Enzymatic / IFCC / Diazo / Biuret Method',
  KFT: 'GLDH Kinetic / Modified Jaffe / Uricase / ISE Method',
  LIPID_PROFILE: 'CHOD-PAP / GPO-POD / Direct Clearance Method',
  URINE_RE: 'Automated Reflectance Photometry & Centrifuged Sediment Microscopy',
  STOOL_RE: 'Direct Wet Mount (Saline & Iodine) Light Microscopy',
  WIDAL: 'Slide Agglutination & Tube Agglutination Quantitative Titre',
  CARD_DENGUE: 'Rapid Immunochromatographic Assay (NS1 Ag & IgG/IgM Ab)',
  CARD_MALARIA: 'Rapid Immunochromatographic Assay (pLDH & HRP-2)',
  CARD_TYPHOID: 'Rapid Immunochromatographic Assay (IgG & IgM)',
  CARD_HIV: '3rd/4th Gen Rapid Immunochromatographic Tri-Line Assay',
  CARD_HBSAG: 'Rapid Immunochromatographic Assay (Lateral Flow)',
  CARD_HCV: 'Rapid Immunochromatographic Assay (Recombinant Antigens)',
  CARD_VDRL: 'Carbon Antigen Flocculation (RPR / VDRL)',
  THYROID: 'Chemiluminescence Immunoassay (CLIA)'
};

/**
 * Automatically evaluates result value against numeric range or qualitative terms
 */
export function evaluateResultFlag(value, refRange) {
  if (!value || typeof value !== 'string') return 'Normal';
  const valTrimmed = value.trim();

  // Qualitative checks
  const lower = valTrimmed.toLowerCase();
  if (lower.includes('positive') || lower.includes('reactive') || lower.includes('present') || lower.includes('detected')) {
    return 'Positive';
  }
  if (lower.includes('negative') || lower.includes('non-reactive') || lower.includes('absent') || lower.includes('nil') || lower.includes('not seen')) {
    return 'Normal';
  }

  // Numeric checks
  const num = parseFloat(valTrimmed.replace(/[^0-9.-]/g, ''));
  if (!isNaN(num) && refRange) {
    // Check range pattern "min - max"
    const match = refRange.match(/([0-9.]+)\s*-\s*([0-9.]+)/);
    if (match) {
      const min = parseFloat(match[1]);
      const max = parseFloat(match[2]);
      if (num < min) {
        return num < min * 0.7 ? 'Critical' : 'Low';
      }
      if (num > max) {
        return num > max * 1.4 ? 'Critical' : 'High';
      }
      return 'Normal';
    }

    // Check "< max" pattern
    const matchLess = refRange.match(/<\s*([0-9.]+)/);
    if (matchLess) {
      const max = parseFloat(matchLess[1]);
      if (num > max) return num > max * 1.4 ? 'Critical' : 'High';
      return 'Normal';
    }

    // Check "> min" pattern
    const matchGreater = refRange.match(/>\s*([0-9.]+)/);
    if (matchGreater) {
      const min = parseFloat(matchGreater[1]);
      if (num < min) return 'Low';
      return 'Normal';
    }
  }

  return 'Normal';
}

/**
 * Generate medically accurate clinical impressions based on tested parameters and flags
 */
export function generateMedicalImpression(tests) {
  if (!tests || !Array.isArray(tests) || tests.length === 0) {
    return 'All tested parameters are within normal biological reference limits.';
  }

  const abnormalItems = [];
  tests.forEach((t) => {
    (t.results || []).forEach((r) => {
      if (r.flag && r.flag !== 'Normal' && r.flag !== 'Negative') {
        abnormalItems.push({
          testCode: t.testCode,
          testName: t.testName,
          paramName: r.paramName,
          value: r.resultValue,
          unit: r.unit,
          flag: r.flag
        });
      }
    });
  });

  if (abnormalItems.length === 0) {
    return 'Parameters evaluated are within biological reference intervals for age and sex. No diagnostic abnormality detected.';
  }

  const findings = [];

  // Anemia / CBC findings
  const hbItem = abnormalItems.find((i) => i.paramName.toLowerCase().includes('hemoglobin') || i.paramName.toLowerCase().includes('hb'));
  if (hbItem) {
    if (hbItem.flag === 'Low') {
      const val = parseFloat(hbItem.value);
      if (!isNaN(val) && val < 8) {
        findings.push('Severe anemia noted (Hb < 8 g/dL). Urgent clinical evaluation and peripheral smear correlation recommended.');
      } else if (!isNaN(val) && val < 11) {
        findings.push('Moderate anemia observed. Correlate with iron studies / RBC indices.');
      } else {
        findings.push('Mild anemia observed.');
      }
    } else if (hbItem.flag === 'High') {
      findings.push('Elevated hemoglobin / polycythemic trend noted.');
    }
  }

  // Leukocyte findings
  const tlcItem = abnormalItems.find((i) => i.paramName.toLowerCase().includes('leukocyte') || i.paramName.toLowerCase().includes('tlc'));
  if (tlcItem) {
    if (tlcItem.flag === 'High') {
      findings.push('Leukocytosis noted, suggestive of systemic inflammatory or infectious etiology.');
    } else if (tlcItem.flag === 'Low') {
      findings.push('Leukopenia observed. Correlate clinically.');
    }
  }

  // Platelet findings
  const pltItem = abnormalItems.find((i) => i.paramName.toLowerCase().includes('platelet'));
  if (pltItem) {
    if (pltItem.flag === 'Low') {
      const val = parseFloat(pltItem.value);
      if (!isNaN(val) && val < 50000) {
        findings.push('Marked thrombocytopenia (< 50,000/cumm). Monitor for hemorrhagic tendencies.');
      } else {
        findings.push('Thrombocytopenia observed. Close follow-up recommended.');
      }
    } else if (pltItem.flag === 'High') {
      findings.push('Thrombocytosis noted.');
    }
  }

  // Glucose findings
  const glucoseItem = abnormalItems.find((i) => i.paramName.toLowerCase().includes('sugar') || i.paramName.toLowerCase().includes('glucose'));
  if (glucoseItem) {
    if (glucoseItem.flag === 'High') {
      findings.push('Hyperglycemia noted. Follow-up with HbA1c and glycemic monitoring advised.');
    } else if (glucoseItem.flag === 'Low') {
      findings.push('Hypoglycemia detected. Immediate clinical attention advised.');
    }
  }

  // Liver enzymes findings
  const lftEnzyme = abnormalItems.find((i) => i.paramName.includes('SGPT') || i.paramName.includes('SGOT') || i.paramName.includes('Bilirubin'));
  if (lftEnzyme) {
    findings.push('Deranged liver function parameters noted. Correlate with clinical history and hepatic profile.');
  }

  // Kidney / Creatinine findings
  const renalItem = abnormalItems.find((i) => i.paramName.toLowerCase().includes('creatinine') || i.paramName.toLowerCase().includes('urea'));
  if (renalItem && renalItem.flag === 'High') {
    findings.push('Elevated renal retention markers (Urea / Creatinine) observed. Nephrological correlation suggested.');
  }

  // Rapid Cards / Serology findings
  const posSerology = abnormalItems.filter((i) => i.flag === 'Positive' || i.flag === 'Reactive');
  if (posSerology.length > 0) {
    posSerology.forEach((s) => {
      findings.push(`Reactive / Positive finding for ${s.paramName}. Confirmatory correlation recommended.`);
    });
  }

  // Fallback if specific patterns not matched
  if (findings.length === 0) {
    const list = abnormalItems.map((i) => `${i.paramName} (${i.flag})`).join(', ');
    findings.push(`Isolated variation in: ${list}. Correlate clinically with patient symptoms.`);
  }

  return findings.join(' ');
}
