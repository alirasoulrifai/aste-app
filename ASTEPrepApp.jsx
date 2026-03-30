import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  Stethoscope, Zap, Brain, Microscope, Activity, ChevronDown, ChevronUp,
  Check, BookOpen, Target, Award, AlertCircle, Search, Star, RotateCcw, X,
  Shield, TrendingUp, Users, FileText, BarChart2, Layers, Eye, Radio,
  Cpu, Database, Building2, Globe, ChevronRight, CheckCircle2
} from "lucide-react";

/* ─────────────────────────────── TECH GLOSSARY ─────────────────────────────── */
const TECH_GLOSSARY = {
  "photon-counting ct": {
    term: "Photon-Counting CT",
    category: "CT Technology",
    definition: "A revolutionary detector technology that converts X-ray photons directly into electrical pulses — skipping the traditional scintillator crystal layer entirely. Each photon is individually counted and its energy level recorded. This eliminates electronic noise at its source and captures spectral (energy-level) data with every single scan. Traditional CT detectors blur photon energy information together; photon-counting detects each photon individually.",
    clinical: "Enables spectral (multi-energy) imaging at zero additional radiation dose, with sharper images and better tissue characterization than any prior CT technology."
  },
  "pcct": {
    term: "PCCT (Photon-Counting CT)",
    category: "CT Technology",
    definition: "Abbreviation for Photon-Counting CT. The Naeotom Alpha is the world's first commercially available photon-counting CT scanner. It eliminates electronic noise entirely and provides spectral data at every scan without dose penalty.",
    clinical: "Represents the next generation of CT — currently only available from Siemens Healthineers."
  },
  "dual-source ct": {
    term: "Dual-Source CT",
    category: "CT Technology",
    definition: "A CT architecture using two complete X-ray tube and detector systems mounted at 95° offset within a single gantry. Because both sources rotate together, the system can acquire a full scan dataset in half a rotation, dramatically shortening the time window for each image. The SOMATOM Force achieves 66ms temporal resolution — meaning each image slice is captured in just 66 thousandths of a second.",
    clinical: "Freezes cardiac motion at any heart rate without needing medication, making it the gold standard for cardiac CT. Also enables dual-energy imaging with no dose penalty."
  },
  "dsct": {
    term: "DSCT (Dual-Source CT)",
    category: "CT Technology",
    definition: "Abbreviation for Dual-Source CT. See Dual-Source CT for full definition. Key model: SOMATOM Force.",
    clinical: "66ms temporal resolution is the clinical headline — best cardiac CT performance in its class."
  },
  "dual-energy ct": {
    term: "Dual-Energy CT",
    category: "CT Technology",
    definition: "A technique that acquires CT data at two different X-ray energies simultaneously. Different tissues absorb X-rays differently at different energies, allowing the scanner to mathematically separate materials — for example, distinguishing uric acid crystals (gout) from calcium deposits, or separating iodine contrast from bone. This provides information equivalent to two separate scans in a single acquisition.",
    clinical: "Enables virtual non-contrast imaging, tissue characterization, gout crystal detection, and iodine mapping — all from a single scan, saving time and radiation dose."
  },
  "dect": {
    term: "DECT (Dual-Energy CT)",
    category: "CT Technology",
    definition: "Abbreviation for Dual-Energy CT. Available on SOMATOM go.Top, go.All, and SOMATOM Force (natively via dual-source). Provides material decomposition and virtual monoenergetic imaging capabilities.",
    clinical: "Adds diagnostic value without additional scanning — one acquisition delivers multiple tissue-characterization datasets."
  },
  "admire": {
    term: "ADMIRE",
    category: "Dose Reduction / Image Quality",
    definition: "Advanced Modeled Iterative Reconstruction. Unlike older reconstruction methods that simply reverse-calculate images from raw data, ADMIRE builds a mathematical model of the entire CT acquisition process — including detector behavior, X-ray beam geometry, and patient anatomy. It then iteratively compares the model's predictions to actual measured data, refining the image with each cycle until noise is minimized. This is computationally intensive but produces far cleaner images at lower doses.",
    clinical: "Delivers up to 60% radiation dose reduction compared to conventional filtered back-projection, while maintaining or improving image quality. Enables pediatric-safe protocols and repeat scanning."
  },
  "safire": {
    term: "SAFIRE",
    category: "Dose Reduction",
    definition: "Sinogram Affirmed Iterative Reconstruction. Operates in the raw data (sinogram) domain before image reconstruction to identify and reduce noise. An earlier-generation iterative reconstruction method used on mid-range SOMATOM systems. Less computationally complex than ADMIRE but still delivers meaningful dose savings versus conventional methods.",
    clinical: "Provides dose savings of 30–50% on mid-range CT systems, making routine scans safer for patients without requiring premium hardware."
  },
  "imar": {
    term: "iMAR",
    category: "Image Quality",
    definition: "Iterative Metal Artifact Reduction. Metal implants — prosthetic hips, spinal hardware, dental fillings, shrapnel — cause bright streaking artifacts in CT images that can obscure surrounding anatomy completely. iMAR uses an iterative algorithm that models the metal object's X-ray absorption signature and mathematically subtracts the artifact pattern from the image, restoring diagnostic visibility around the implant.",
    clinical: "Restores diagnostic quality around metal implants and shrapnel — particularly relevant in post-conflict Syria where shrapnel-bearing patients are common."
  },
  "care dose4d": {
    term: "CARE Dose4D",
    category: "Dose Reduction",
    definition: "Automatic Exposure Control that adjusts the X-ray tube current in real time as the gantry rotates. As the tube passes different body regions — wider pelvis vs. narrower waist, or anterior vs. posterior through the spine — the current automatically increases or decreases to deliver exactly the dose needed for diagnostic quality at that specific angle and position. 'Care' stands for Combined Applications to Reduce Exposure.",
    clinical: "Ensures every scan uses the minimum dose required at every point — patients receive a personalized dose profile rather than a fixed, one-size-fits-all exposure."
  },
  "tin filter": {
    term: "Tin Filter (Sn Filter)",
    category: "Dose Reduction",
    definition: "A physical tin (Sn) filter placed in the X-ray beam path that absorbs low-energy photons. Low-energy photons contribute heavily to patient radiation dose but add very little useful information to the image (they are absorbed before reaching the detectors). By filtering them out at the source, the beam becomes 'harder' (higher average energy), reducing dose dramatically for routine chest and abdomen scans.",
    clinical: "Up to 80% dose reduction for routine chest/abdomen CT scans. Enables ultra-low-dose screening protocols that were previously impossible without sacrificing image quality."
  },
  "stellar": {
    term: "Stellar Detector",
    category: "CT Hardware",
    definition: "Siemens' integrated circuit detector technology that combines the scintillator crystal and photodiode into a single manufactured cell with no gaps between elements. Conventional detectors lose signal in the spaces between detector cells; Stellar eliminates these gaps, capturing more of the available X-ray signal. The result is higher light collection efficiency, lower inherent electronic noise, and better raw data quality entering the reconstruction chain.",
    clinical: "Higher-quality raw data means better final images at any dose level — particularly valuable for low-dose protocols where signal-to-noise ratio is most challenged."
  },
  "stellarinfinity": {
    term: "StellarInfinity Detector",
    category: "CT Hardware",
    definition: "The next-generation evolution of Siemens' Stellar detector technology, featured on the SOMATOM X.cite flagship. Builds on the integrated no-gap design of Stellar with further improvements in quantum efficiency (more X-ray photons converted to signal) and electronic noise suppression. Enables the X.cite's industry-leading image quality metrics.",
    clinical: "Delivers the best conventional (non-photon-counting) CT image quality available, supporting advanced cardiac, oncology, and spectral applications."
  },
  "flash spiral": {
    term: "Flash Spiral",
    category: "CT Technology",
    definition: "A high-pitch spiral scanning mode exclusive to dual-source CT systems. By using both X-ray sources simultaneously and advancing the table at very high speed (pitch up to 3.2), the scanner can cover the entire chest or abdomen in under one second. Originally developed for single-heartbeat cardiac CT, Flash spiral is also transformative for trauma patients who cannot hold their breath and uncooperative pediatric patients.",
    clinical: "Captures the entire chest in under one second — enabling cardiac CT in a single heartbeat and trauma scans without breath-holding. Dramatically reduces motion artifacts."
  },
  "myexam companion": {
    term: "myExam Companion",
    category: "AI Feature",
    definition: "Siemens' AI-driven CT exam guidance system on the SOMATOM X.cite. Uses a camera array and deep learning model to automatically detect patient anatomy, identify the correct scan region, select the appropriate protocol, and set all technical parameters — then guides the technologist through each step with visual cues. The system continuously monitors patient positioning and alerts to errors before scanning begins.",
    clinical: "Reduces dependency on highly trained technologists — a less experienced operator can perform exams that previously required specialist skill, addressing workforce gaps in markets like Syria."
  },
  "myexam compass": {
    term: "myExam Compass",
    category: "AI Feature",
    definition: "AI-assisted workflow guidance system on the SOMATOM go.Up. Provides step-by-step exam guidance and auto-selection of protocols based on patient information entered at the console. Less comprehensive than myExam Companion but still significantly reduces technologist skill requirements for routine examinations.",
    clinical: "Improves exam consistency and reduces errors in facilities with limited specialist technologist availability."
  },
  "deep resolve": {
    term: "Deep Resolve",
    category: "AI Feature — MRI",
    definition: "Siemens' deep learning reconstruction engine for MRI. Trained on millions of high-quality reference MRI images, Deep Resolve learns to reconstruct diagnostic-quality images from significantly undersampled k-space data (raw MRI signal). Because less data is acquired, scan time drops dramatically — but the AI fills in the missing information based on learned patterns, producing images as good as or better than fully sampled acquisitions.",
    clinical: "Up to 50% scan time reduction with maintained or improved SNR. The same exam in half the time, or higher resolution in the same time — transforming MRI productivity without hardware upgrades."
  },
  "drycool": {
    term: "DryCool Technology",
    category: "MRI Technology",
    definition: "Siemens' helium-free MRI cooling system used in the MAGNETOM Free.Max and MAGNETOM Flow. Traditional superconducting MRI magnets require large quantities of liquid helium (a finite, expensive, geopolitically constrained resource) to maintain the superconducting coils at near absolute zero. DryCool uses a closed-loop cryocooler that eliminates the need for liquid helium entirely — the magnet is cooled by mechanical refrigeration.",
    clinical: "Eliminates helium dependency, quench pipe infrastructure requirements, and supply chain risk. Critical for deployment in regions with limited helium supply, such as Syria."
  },
  "biomatrix": {
    term: "BioMatrix Technology",
    category: "MRI Technology",
    definition: "Siemens' adaptive imaging platform that compensates for individual patient physiological variations. BioMatrix includes intelligent RF coils that auto-adjust frequency tuning for different body compositions, motion sensors that detect breathing and cardiac motion for automatic gating, and algorithms that adapt image contrast based on measured tissue properties. The system 'learns' each patient's body during a brief setup scan.",
    clinical: "Reduces setup time and retakes from patient variation — particularly valuable for pediatric patients, obese patients, and patients with abnormal physiology who are difficult to scan with fixed protocols."
  },
  "tim 4g": {
    term: "Tim 4G",
    category: "MRI Hardware",
    definition: "Total Imaging Matrix 4th Generation. Siemens' RF coil connectivity architecture that allows up to 204 individual coil elements to be connected and combined simultaneously. More coil elements provide better signal coverage, enable higher-speed parallel imaging (acquiring multiple k-space lines simultaneously), and allow full-body coverage without repositioning coils between scan regions.",
    clinical: "Faster scans through parallel imaging acceleration, better image quality through increased SNR, and full-body examinations without coil repositioning — improving workflow and patient experience."
  },
  "turbo suite": {
    term: "Turbo Suite",
    category: "MRI Technology",
    definition: "A package combining two complementary acceleration technologies: Compressed Sensing (CS) and Simultaneous Multi-Slice (SMS). CS acquires a sparse, randomized subset of k-space data and uses mathematical reconstruction to fill in the missing information. SMS excites and acquires multiple slice locations simultaneously using controlled radio frequency pulses that can be mathematically separated post-acquisition.",
    clinical: "Combined CS and SMS delivers 50–70% scan time reduction across multiple sequence types, making previously impractical long MRI protocols clinically routine."
  },
  "syngo virtual cockpit": {
    term: "syngo Virtual Cockpit",
    category: "AI Feature — MRI",
    definition: "A remote scanning platform that gives an expert MRI technologist or radiologist the ability to take control of an MRI scanner at a remote site in real time — seeing the patient camera, adjusting parameters, modifying scan planes, and guiding local staff through complex examinations via video link. Built into the syngo MR XA software platform.",
    clinical: "Enables expert support of multiple facilities from a single central location — critical for building MRI capacity in underserved regions without requiring full-time expert staffing at every site."
  },
  "iqspect": {
    term: "IQ•SPECT",
    category: "Nuclear Medicine",
    definition: "A cardiac-optimized SPECT acquisition system using a cardiocentric orbit (the detector follows the patient's chest contour at close range) combined with multi-focal convergent collimators that focus sensitivity on the heart region. Conventional SPECT uses parallel-hole collimators that treat every region equally; IQ•SPECT concentrates acquisition efficiency where it matters most for cardiac imaging.",
    clinical: "Up to 4x faster cardiac SPECT acquisition — a 15-minute conventional exam completed in under 4 minutes, or equivalent quality in the same time with dramatically reduced radiotracer dose."
  },
  "xspect quant": {
    term: "xSPECT Quant",
    category: "Nuclear Medicine",
    definition: "Quantitative SPECT reconstruction technology that provides absolute radiotracer concentration measurements (in Becquerels per milliliter) using CT-based attenuation correction. Traditional SPECT produces relative uptake maps; xSPECT Quant calibrates measurements against known standards to provide absolute values that can be compared between patients, time points, and institutions.",
    clinical: "Enables objective treatment monitoring in oncology (tumor response assessment) and precise dosimetry for radionuclide therapy — moving nuclear medicine from qualitative to quantitative diagnosis."
  },
  "atellica solution": {
    term: "Atellica Solution",
    category: "Lab Technology",
    definition: "Siemens' integrated core laboratory automation platform that combines immunoassay testing (hormones, tumor markers, infectious disease, cardiac biomarkers) and clinical chemistry (metabolic panels, enzymes, proteins) on a single bidirectional automation track. Samples are loaded once at the input module and automatically routed to the correct analyzer, with results returned to a unified data management system.",
    clinical: "Replaces two separate analyzer platforms with one integrated system — reducing footprint, staffing requirements, and sample handling errors while providing 300+ test menu coverage."
  },
  "zero helium boil-off": {
    term: "Zero Helium Boil-Off",
    category: "MRI Technology",
    definition: "A magnet cooling technology used in systems like the MAGNETOM Altea that continuously re-condenses helium gas back into liquid form using an integrated cryocooler. Unlike older magnets that slowly lose helium as gas that must be periodically replenished, Zero Helium Boil-off systems are sealed — after the initial fill, no additional helium is ever needed under normal operation.",
    clinical: "Eliminates ongoing helium supply costs and logistics. For facilities in regions with helium supply uncertainty, this is a significant operational risk mitigation."
  },
  "bioaccoustic ai": {
    term: "BioAcoustic AI",
    category: "AI Feature — Ultrasound",
    definition: "Siemens' AI-powered beamforming and signal processing architecture in the ACUSON Sequoia. Uses deep learning to optimize acoustic signal acquisition and image reconstruction based on patient-specific tissue characteristics. Automatically adjusts transmit focusing, receive processing, and image parameters to optimize penetration and resolution for each patient.",
    clinical: "Delivers consistently excellent image quality regardless of patient body habitus — particularly valuable for difficult-to-scan obese patients or those with challenging acoustic windows."
  },
};

/* ─────────────────────────────── PRODUCTS DATA ─────────────────────────────── */
const PRODUCTS = [
  // CT
  {
    id: "ct1", modality: "CT", name: "SOMATOM go.Now", subtitle: "Entry-level, 16-slice equivalent",
    specs: [
      ["Detector Rows", "16-row detector"], ["Rotation Time", "0.5s"], ["Bore Size", "78cm"],
      ["Key Feature", "Tin Filter"], ["Workflow", "go.Suite"]
    ],
    features: ["Simple, guided workflow via go.Suite touch interface", "Tin Filter reduces dose up to 80% for routine scans", "Compact footprint for space-limited facilities"],
    usps: ["Affordable entry point for CT deployment in rebuilding Syrian hospitals", "Tin Filter delivers premium dose reduction at entry-level price", "Minimal training required — ideal for less experienced staff"],
    customer: "District hospitals, outpatient diagnostic centers, primary government facilities",
    competitive: ["Tin Filter dose performance matches systems 2x the price", "go.Suite workflow requires less technologist training than GE or Philips equivalents"]
  },
  {
    id: "ct2", modality: "CT", name: "SOMATOM go.Up", subtitle: "Mid-range daily workhorse",
    specs: [
      ["Collimation", "32×0.6mm"], ["Rotation Time", "0.5s"], ["Bore Size", "78cm"],
      ["AI Positioning", "FAST 3D Camera"], ["Reconstruction", "ADMIRE"], ["Workflow AI", "myExam Compass"]
    ],
    features: ["FAST 3D Camera automatically detects patient anatomy for positioning", "myExam Compass AI protocol selection", "ADMIRE iterative reconstruction for dose reduction", "Ideal for high-volume trauma and general radiology"],
    usps: ["AI-assisted positioning reduces technologist skill dependency", "ADMIRE delivers up to 60% dose reduction vs. conventional FBP", "Designed for busy all-day operation with high reliability"],
    customer: "Mid-size general hospitals, trauma centers, busy diagnostic imaging departments",
    competitive: ["FAST 3D Camera AI positioning is absent on GE Revolution Access equivalent", "ADMIRE outperforms Philips iDose in noise model accuracy"]
  },
  {
    id: "ct3", modality: "CT", name: "SOMATOM go.All / go.Top", subtitle: "Advanced single-source",
    specs: [
      ["Slice Equivalent", "128-slice"], ["Rotation Time", "0.28s (go.Top)"], ["Dual Energy", "Yes (go.Top)"],
      ["Bore Size", "78cm"], ["Detector", "Stellar detector"], ["Artifact Reduction", "iMAR"]
    ],
    features: ["go.Top: advanced cardiac capability with 0.28s rotation", "go.All: Dual-Energy for tissue characterization", "Stellar detector for improved SNR and dose efficiency", "iMAR eliminates metal implant artifacts"],
    usps: ["go.Top handles advanced cardiac CT without dual-source cost", "Dual-Energy enables virtual non-contrast and material decomposition", "iMAR essential for Syria's post-conflict shrapnel-bearing patient population"],
    customer: "Large general hospitals, university hospitals, facilities building advanced imaging programs",
    competitive: ["Stellar detector outperforms GE ASiR detector in low-dose SNR", "Dual-Energy at single-source price point unavailable on Canon equivalent"]
  },
  {
    id: "ct4", modality: "CT", name: "SOMATOM X.cite", subtitle: "High-end single-source flagship",
    specs: [
      ["X-ray Tube", "Vectron tube"], ["Detector", "StellarInfinity"], ["Bore Size", "82cm"],
      ["AI Guidance", "myExam Companion (full)"], ["Rotation Time", "0.25s"],
      ["Reconstruction", "ADMIRE + SAFIRE + iMAR"], ["Dose Filter", "Tin Filter"]
    ],
    features: ["myExam Companion: first CT with full AI exam guidance system", "82cm bore — largest single-source bore in the industry", "StellarInfinity detector: highest-performance conventional CT detector", "Full AI guidance from patient setup to image acquisition"],
    usps: ["Only CT with full AI user guidance — myExam Companion automates the entire exam workflow", "82cm bore accommodates bariatric patients and complex trauma positioning", "Best-in-class conventional CT imaging for advanced clinical programs"],
    customer: "Tertiary hospitals, university medical centers, advanced imaging centers",
    competitive: ["82cm bore exceeds GE Revolution Apex (80cm) and all Philips single-source options", "myExam Companion AI depth has no direct equivalent in GE or Philips portfolio"]
  },
  {
    id: "ct5", modality: "CT", name: "SOMATOM Force", subtitle: "Dual-Source premium CT",
    specs: [
      ["Architecture", "Dual-source, 95° offset"], ["Rotation Time", "0.25s"],
      ["Temporal Resolution", "66ms"], ["kV Range", "70–150+Sn"], ["Reconstruction", "ADMIRE"],
      ["Bore Size", "78cm"], ["Special Mode", "Flash Spiral"]
    ],
    features: ["66ms temporal resolution — freezes cardiac motion at any heart rate", "Flash Spiral: full chest scan in under 1 second", "Dual-Energy imaging natively via dual-source — no dose penalty", "kV range 70–150+Sn for full spectral flexibility"],
    usps: ["Best cardiac CT in its class — 66ms eliminates need for beta-blockers", "Flash Spiral enables trauma CT without breath-holding", "Dual-Energy at full CT speed — no separate acquisition needed"],
    customer: "Cardiac centers, trauma centers, university hospitals, high-volume advanced imaging",
    competitive: ["66ms temporal resolution beats GE Revolution CT (175ms) and Philips IQon (135ms) significantly", "Flash Spiral with dual-source speed unmatched in GE or Philips portfolio"]
  },
  {
    id: "ct6", modality: "CT", name: "Naeotom Alpha / Alpha.Pro", subtitle: "Photon-Counting CT flagship",
    specs: [
      ["Detector Type", "Photon-counting (no scintillator)"], ["Scan Speed", "491mm/s (Alpha.Pro)"],
      ["Architecture", "Dual-source"], ["Rotation Time", "0.25s"],
      ["Spectral", "Every scan, no dose penalty"]
    ],
    features: ["World's first commercial photon-counting CT scanner", "Eliminates electronic noise entirely at detector level", "Spectral data at every scan without additional dose", "Highest spatial resolution available in clinical CT"],
    usps: ["Only photon-counting CT available — Siemens Healthineers exclusive technology", "Spectral imaging on every patient without workflow change or dose increase", "Represents the future generation of CT — competitors have no equivalent product"],
    customer: "Leading university hospitals, cancer centers, research institutions, sites seeking technology leadership",
    competitive: ["No GE, Philips, or Canon equivalent exists — photon-counting CT is a Siemens Healthineers exclusive", "491mm/s scan speed surpasses any competing conventional CT system"]
  },
  // MRI
  {
    id: "mri1", modality: "MRI", name: "MAGNETOM Free.Max", subtitle: "0.55T · 80cm bore · Helium-Free",
    specs: [
      ["Field Strength", "0.55T"], ["Bore Size", "80cm (world's widest MRI bore)"],
      ["Cooling", "DryCool — helium-free"], ["Quench Pipe", "Not required"],
      ["AI Reconstruction", "Deep Resolve"]
    ],
    features: ["DryCool technology: fully helium-free from day one", "80cm bore — widest MRI bore in the world", "No quench pipe requirement — installs where traditional MRI cannot", "Reduced metal artifacts vs. higher field systems"],
    usps: ["Helium-free operation eliminates supply chain risk — critical for Syria", "80cm bore serves bariatric, claustrophobic, and pediatric patients", "Installs in non-standard facilities without quench pipe infrastructure"],
    customer: "Community hospitals, facilities with infrastructure limitations, bariatric programs, pediatric units",
    competitive: ["80cm bore exceeds any competitor offering — GE SIGNA Artist is 70cm, Philips Ingenia Ambition 70cm", "Helium-free operation unavailable on GE or Philips equivalents at this field strength"]
  },
  {
    id: "mri2", modality: "MRI", name: "MAGNETOM Aera / Altea", subtitle: "1.5T · Standard/Open Bore",
    specs: [
      ["Field Strength", "1.5T superconducting"], ["Bore (Aera)", "70cm"], ["Bore (Altea)", "Open Bore"],
      ["Coil Platform", "BioMatrix · Tim 4G (128+ channels)"],
      ["AI", "Deep Resolve · Turbo Suite"], ["Helium", "Zero Helium Boil-off (Altea)"]
    ],
    features: ["BioMatrix adaptive coil technology for patient-specific optimization", "Tim 4G: up to 128+ RF channels for parallel imaging", "Deep Resolve: up to 50% scan time reduction", "Turbo Suite: Compressed Sensing + Simultaneous Multi-Slice"],
    usps: ["Altea Open Bore improves patient comfort and accommodates bariatric patients", "Deep Resolve delivers 50% faster scans — doubles effective daily throughput", "BioMatrix reduces retakes from patient variation"],
    customer: "Mid-size and large hospitals, outpatient imaging centers, general radiology and orthopedics",
    competitive: ["Tim 4G channel count exceeds GE SIGNA Artist (64 channels)", "Turbo Suite scan acceleration outperforms Philips Compressed SENSE implementation"]
  },
  {
    id: "mri3", modality: "MRI", name: "MAGNETOM Lumina", subtitle: "3T · Open Bore",
    specs: [
      ["Field Strength", "3T"], ["Bore Size", "70cm Open Bore"],
      ["Adaptability", "BioMatrix Tuners"], ["Acceleration", "Turbo Suite"],
      ["AI", "Deep Resolve"], ["Software", "syngo MR XA · syngo Virtual Cockpit"]
    ],
    features: ["Premium 3T image quality with AI automation", "BioMatrix Tuners auto-adapt to patient anatomy and physiology", "syngo Virtual Cockpit enables remote expert scanning support", "Turbo Suite + Deep Resolve: comprehensive scan acceleration"],
    usps: ["3T quality with AI-driven workflow — neurology, cardiac MRI, and MSK at highest resolution", "Virtual Cockpit enables multi-site operation from one central console", "Open Bore 3T for better patient acceptance at premium field strength"],
    customer: "University hospitals, neurology centers, cardiac MRI programs, cancer imaging centers",
    competitive: ["syngo Virtual Cockpit has no direct equivalent in GE or Philips 3T portfolio", "BioMatrix Tuner adaptation outperforms Philips SmartExam positioning"]
  },
  {
    id: "mri4", modality: "MRI", name: "MAGNETOM Flow", subtitle: "1.5T · Next-Generation",
    specs: [
      ["Field Strength", "1.5T"], ["Cooling", "DryCool — helium-independent"],
      ["AI", "Deep Resolve"], ["Workflow", "Automated workflow platform"],
      ["Platform", "Next-gen AI imaging platform"]
    ],
    features: ["DryCool helium-independent technology on a standard 1.5T", "AI-driven fully automated workflow from patient to report", "Future-proofed AI platform with continuous software updates", "Combines sustainability (helium-free) with productivity (AI automation)"],
    usps: ["Next-generation 1.5T combining helium independence with AI-first design", "Designed for sustainability and long-term cost predictability", "AI automation reduces skilled staff requirements for routine imaging"],
    customer: "Forward-thinking hospitals, new builds, facilities prioritizing sustainability and long-term TCO",
    competitive: ["Helium-independent 1.5T with full AI workflow unavailable in GE or Philips portfolio", "AI platform architecture designed for future feature expansion via software updates"]
  },
  // Ultrasound
  {
    id: "us1", modality: "Ultrasound", name: "ACUSON Sequoia", subtitle: "Premium AI-powered platform",
    specs: [
      ["AI Engine", "BioAcoustic AI"], ["Architecture", "nSIGHT+ signal processing"],
      ["Panoramic", "SieScape panoramic imaging"], ["Elastography", "eSie Touch"],
      ["4D", "Full 4D imaging capability"], ["Applications", "Cardiac · OB/GYN · Vascular · MSK"]
    ],
    features: ["BioAcoustic AI: deepest tissue penetration in the ultrasound class", "nSIGHT+ architecture: AI-enhanced image optimization for any body habitus", "SieScape panoramic for large anatomical coverage", "eSie Touch elastography for tissue stiffness mapping"],
    usps: ["Deepest penetration in class — consistent quality regardless of patient size", "AI image optimization eliminates need for manual parameter adjustment", "Full multi-specialty platform: one system covers all clinical departments"],
    customer: "Large hospitals requiring multi-specialty ultrasound, cardiology, obstetrics, vascular surgery departments",
    competitive: ["BioAcoustic AI penetration depth exceeds GE LOGIQ E10 in obese patient studies", "nSIGHT+ architecture provides more consistent AI optimization than Philips EPIQ Elite"]
  },
  {
    id: "us2", modality: "Ultrasound", name: "ACUSON Maple", subtitle: "Mid-range AI-powered",
    specs: [
      ["AI", "AI-based auto-optimization"], ["Probes", "Multiple probe support"],
      ["Workflow", "Intuitive AI-guided workflow"], ["Form Factor", "Portable-capable"]
    ],
    features: ["AI auto-optimization for consistent image quality at lower price point", "Multiple probe compatibility for multi-specialty use", "Portable-capable design for point-of-care and bedside use", "Intuitive workflow reduces training requirements"],
    usps: ["Affordable AI ultrasound entry point for rebuilding Syrian healthcare network", "Portable capability enables field hospital and outpatient deployment", "Multi-probe support provides flexibility for different clinical needs"],
    customer: "Community hospitals, outpatient centers, primary care facilities, field hospitals in reconstruction zones",
    competitive: ["AI optimization at this price tier outperforms GE Voluson E6 image consistency", "Portable capability broader than Philips EPIQ 5G at this price point"]
  },
  // X-Ray
  {
    id: "xr1", modality: "X-Ray & Fluoroscopy", name: "MULTIX Impact E", subtitle: "Digital Radiography",
    specs: [
      ["Type", "Floor-mounted DR system"], ["Detector", "Flat-panel detector"],
      ["Dose Tools", "Dose Area Product monitoring"], ["Protocols", "Low-dose preset protocols"]
    ],
    features: ["Simple operation designed for less experienced radiographers", "Flat-panel detector for excellent digital image quality", "Low-dose protocols pre-programmed for common examinations", "Dose Area Product monitoring for radiation safety compliance"],
    usps: ["Lowest total cost of ownership in the DR category — ideal for budget-constrained Syrian facilities", "Simple operation minimizes training requirements for new staff", "High-volume capability for busy general radiology departments"],
    customer: "District hospitals, general radiology departments, high-volume outpatient imaging centers",
    competitive: ["Lower maintenance cost than GE Discovery XR656 at equivalent image quality", "Simpler operator interface than Philips DigitalDiagnost C90"]
  },
  {
    id: "xr2", modality: "X-Ray & Fluoroscopy", name: "Luminos dRF / Luminos Agile", subtitle: "Fluoroscopy Systems",
    specs: [
      ["Control", "Remote + patient-side control"], ["Detector", "Flat-panel detector"],
      ["Dual-Use", "Fluoroscopy + Radiography combined"], ["Dose Tools", "iDose + CARE Dose integration"]
    ],
    features: ["Remote control reduces operator radiation exposure during fluoroscopy", "Dual-use system replaces separate fluoroscopy and radiography units", "Flat-panel detector for high-quality fluoroscopic and static images", "iDose and CARE Dose tools for radiation dose management"],
    usps: ["One system replaces two separate units — lower capital cost and smaller footprint", "Remote control for staff radiation safety during interventional procedures", "Full dose management suite for regulatory compliance"],
    customer: "Hospitals with GI, interventional radiology, orthopedic, and urology departments",
    competitive: ["Combined fluoro+radio functionality eliminates need for two separate GE or Philips installations", "Remote control capability standard — not an option upgrade as on Philips Veradius"]
  },
  // Mammography
  {
    id: "mg1", modality: "Mammography", name: "MAMMOMAT Revelation / B.brilliant", subtitle: "Tomosynthesis (3D)",
    specs: [
      ["Technology", "Tomosynthesis 3D"], ["Dose", "PRIME dose reduction algorithm"],
      ["AI Detection", "AI-aided lesion detection (Revelation)"],
      ["Contrast", "ClearCEM contrast-enhanced (B.brilliant)"],
      ["Acquisition", "5-second wide-angle tomosynthesis"], ["Biopsy", "Integrated biopsy system"]
    ],
    features: ["3D tomosynthesis with up to 30% lower dose than conventional 3D", "AI-aided lesion detection reduces reader fatigue and missed findings", "ClearCEM contrast-enhanced mammography on B.brilliant for equivocal cases", "Integrated biopsy capability — diagnosis and tissue sampling in same system"],
    usps: ["3D tomo with 30% dose reduction vs. competitor 3D systems", "AI detection reduces false positives and reader workload", "Complete breast care platform from screening to biopsy in one unit"],
    customer: "Breast imaging centers, women's health departments, cancer screening programs",
    competitive: ["PRIME dose reduction outperforms Hologic Genius 3D dose efficiency", "Integrated biopsy in one platform eliminates separate biopsy unit cost vs. GE Senographe Pristina"]
  },
  // Nuclear Medicine
  {
    id: "nm1", modality: "Nuclear Medicine", name: "Symbia Intevo", subtitle: "SPECT/CT hybrid",
    specs: [
      ["Type", "Integrated SPECT + CT"], ["Collimator", "IQ•SPECT cardiocentric"],
      ["Quantitative", "xSPECT Quant (absolute Bq/mL)"],
      ["Software", "syngo MI applications suite"], ["CT", "Low-dose CT for attenuation correction"]
    ],
    features: ["Integrated SPECT and CT in a single gantry — no patient repositioning", "IQ•SPECT reduces cardiac acquisition time by up to 4x", "xSPECT Quant provides absolute quantitative SPECT measurements", "Low-dose CT for attenuation correction and anatomical co-registration"],
    usps: ["Hybrid SPECT/CT eliminates separate CT room requirement", "IQ•SPECT 4x faster acquisition — same throughput with lower radiotracer dose", "Quantitative SPECT enables objective oncology treatment monitoring"],
    customer: "Nuclear medicine departments in university hospitals, oncology centers, cardiology centers",
    competitive: ["xSPECT Quant absolute quantification outperforms GE Discovery NM/CT 670 qualitative SPECT", "IQ•SPECT acquisition speed advantage has no equivalent in Philips nuclear medicine portfolio"]
  },
  // Lab
  {
    id: "lab1", modality: "Lab Diagnostics", name: "Atellica Solution", subtitle: "Core Lab Automation Platform",
    specs: [
      ["Integration", "Immunoassay + Chemistry on one track"], ["Automation", "Bidirectional automation"],
      ["Test Menu", "300+ assays"], ["Expansion", "Modular, scalable platform"],
      ["STAT", "Priority STAT routing"]
    ],
    features: ["Single platform for immunoassay and chemistry — fewer instruments, less space", "Bidirectional automation for intelligent sample routing", "300+ test menu covers all core laboratory needs", "Modular expansion — add capacity without replacing the system"],
    usps: ["Consolidates two analyzer platforms into one — 40-50% footprint reduction", "Lower total staffing requirement vs. separate immunoassay + chemistry systems", "Ideal for Syrian central hospital labs modernizing core laboratory infrastructure"],
    customer: "Central hospital laboratories, reference laboratories, large-volume diagnostic facilities",
    competitive: ["Single-platform integration unavailable in Roche cobas c series (requires separate immunoassay module)", "Bidirectional automation track more flexible than Abbott Alinity consolidation approach"]
  },
  {
    id: "lab2", modality: "Lab Diagnostics", name: "Atellica CH", subtitle: "Chemistry Analyzer",
    specs: [
      ["Throughput", "1000 photometric + 400 ISE tests/hour"],
      ["Priority", "STAT capability"], ["Footprint", "Compact design"]
    ],
    features: ["High throughput in compact footprint for space-constrained labs", "STAT capability for urgent clinical chemistry results", "Integration-ready for Atellica automation track", "Comprehensive chemistry menu covering all routine and specialty tests"],
    usps: ["1,000 tests/hour in a small footprint — highest throughput-to-space ratio in class", "STAT workflow ensures urgent results reach clinicians without delay", "Standalone or integrated with Atellica Solution automation"],
    customer: "Mid-size hospital laboratories, facilities with space constraints but high test volume requirements",
    competitive: ["Higher throughput per square meter than Roche cobas c 503 standalone", "STAT integration more seamless than Beckman Coulter AU5800 equivalent"]
  },
  {
    id: "lab3", modality: "Lab Diagnostics", name: "CLINITEST Rapid / POC Testing", subtitle: "Point-of-Care",
    specs: [
      ["Type", "Rapid multiplex testing"], ["Results", "Bedside turnaround"],
      ["Infrastructure", "No lab required"], ["Applications", "Emergency, primary care, field settings"]
    ],
    features: ["Rapid multiplex testing for multiple targets simultaneously", "Bedside results eliminate transport time to central lab", "Requires no laboratory infrastructure — deploy anywhere", "Relevant for Syria's primary care and emergency expansion"],
    usps: ["Instant results at patient location — critical for emergency triage", "No lab infrastructure needed — deployable in field hospitals and primary clinics", "Fills diagnostic gap in areas without central laboratory access"],
    customer: "Emergency departments, primary care clinics, field hospitals, mobile health units",
    competitive: ["Broader multiplex menu than Abbott ID NOW at equivalent speed", "No infrastructure requirement more flexible than Roche cobas Liat POC platform"]
  }
];

/* ─────────────────────────────── SALES PLAYBOOK DATA ─────────────────────────── */
const PLAYBOOK_SECTIONS = [
  {
    id: "customers", icon: Users, title: "Understanding the Customer",
    content: [
      { type: "subheading", text: "Hospital Types in Syria" },
      { type: "list", items: ["Public (MOH) — Syrian Ministry of Health facilities; budget-constrained but high-volume, tender-driven procurement", "Private hospitals — faster decision cycles, single decision-maker, premium product appetite", "Diagnostic centers — volume-focused, price-sensitive, specialty-equipment buyers", "University hospitals (Damascus, Aleppo) — clinical champions, reference sites, technology leadership seekers", "Military hospitals — specialized procurement channels, often highest-tier equipment requirements", "Reconstruction zone facilities — NGO/international funding, phased procurement, pragmatic choices"] },
      { type: "subheading", text: "Key Stakeholders" },
      { type: "table", rows: [["Clinical Director", "Sets clinical priorities; champions new capabilities to administration"], ["Radiologist / Nuclear Medicine Physician", "Primary clinical user; evaluates image quality and workflow"], ["BME Department Head", "Technical validator; evaluates installation, maintenance, service support"], ["CFO / Finance Director", "Budget approver; responds to TCO, ROI, and financing structure arguments"], ["Procurement Officer", "Process manager; focused on tender compliance, documentation, and timelines"], ["Hospital CEO / Director", "Strategic decision-maker for major capital equipment; responds to strategic framing"]] },
      { type: "tip", text: "The radiologist champions clinical need; the BME validates technical fit; finance approves budget. Win all three — or the deal dies at any one gate." },
      { type: "subheading", text: "SPIN Selling Framework" },
      { type: "table", rows: [["Situation", "How many CT exams do you perform daily? What is your current system's age?"], ["Problem", "What happens operationally when your CT goes down for maintenance?"], ["Implication", "How does extended downtime affect patient referral patterns and revenue?"], ["Need-Payoff", "If remote diagnostics reduced your downtime by 70%, how would that change your monthly throughput and revenue?"]] }
    ]
  },
  {
    id: "value", icon: TrendingUp, title: "Value-Based Selling",
    content: [
      { type: "subheading", text: "Four Value Dimensions" },
      { type: "table", rows: [["Clinical Value", "Superior image quality → more accurate diagnosis → better patient outcomes and reputation"], ["Operational Value", "AI automation → fewer skilled technologists needed → lower labor costs, consistent throughput"], ["Financial Value", "Bundled service contracts → predictable OPEX → CFO-friendly multi-year planning"], ["Strategic Value", "Siemens brand → easier accreditation, stronger patient trust, technology leadership positioning"]] },
      { type: "tip", text: "Always frame the sale around 5–10 year Total Cost of Ownership, not acquisition price. A cheaper system that requires more maintenance, more staff, more helium, and more downtime costs more." },
      { type: "subheading", text: "ROI Framework" },
      { type: "list", items: ["ROI = (Additional Revenue from New Case Volume) − TCO ÷ Years", "Factor in: consumables, service contracts, helium (if applicable), staffing, downtime frequency, upgrade costs", "New case revenue: estimate additional scans per day × reimbursement rate × operating days per year", "Downtime cost: estimated lost revenue per day × average annual downtime days"] },
      { type: "subheading", text: "Syria-Specific Value Argument" },
      { type: "list", items: ["Post-conflict rebuild = opportunity to install current-generation systems from day one — not 10-year-old refurbished equipment", "Facilities built now will define Syria's healthcare infrastructure for the next 20 years", "ASTE's 35+ year presence and local certified engineers are a service continuity guarantee competitors cannot match", "Siemens Healthineers AI features reduce skilled staff dependency — critical in markets rebuilding workforce capacity"] }
    ]
  },
  {
    id: "objections", icon: Shield, title: "Objection Handling",
    content: [
      { type: "subheading", text: "Common Objections and Responses" },
      { type: "objections", items: [
        { objection: "'Your CT is 30% more expensive than the competitor.'", response: "Frame around 7-year TCO: cost per scan including helium, maintenance, parts availability, and downtime. ASTE's local certified engineers guarantee faster uptime recovery than a competitor whose nearest engineer is in Beirut. Request the competitor's service contract terms for comparison." },
        { objection: "'We already have a relationship with GE / Philips.'", response: "Acknowledge the relationship, then target a specific clinical gap: 'Siemens has the only dual-source CT with 66ms temporal resolution in this tier — what cardiac volume do you see monthly? Let's look at whether your current system is limiting your cardiac program growth.'" },
        { objection: "'We don't have trained staff for this technology.'", response: "'myExam Companion guides any technologist through the exam step by step. ASTE includes full application training in every installation package. Our training team from Erlangen has deployed across the Middle East.'" },
        { objection: "'Our infrastructure can't support an MRI installation.'", response: "'The MAGNETOM Free.Max needs no quench pipe and is fully helium-free — it installs where a traditional 1.5T system physically cannot. We conduct a free site survey before any proposal.'" },
        { objection: "'Budget is frozen / no funds available this cycle.'", response: "'Would phased acquisition or lease-to-own financing work? We can structure payments through Siemens Financial Services to match your budget cycle. A letter of intent this cycle can secure pricing for next cycle.'" },
        { objection: "'Post-war instability concerns us about long-term commitments.'", response: "'ASTE has operated continuously in Syria since 1988 — through every period of instability. Our local team and spare parts inventory mean we don't depend on international logistics to keep your equipment running.'" }
      ]}
    ]
  },
  {
    id: "commercial", icon: FileText, title: "Commercial Documents",
    content: [
      { type: "subheading", text: "Document Types and Purpose" },
      { type: "table", rows: [["RFQ (Request for Quotation)", "Technical specs, quantity, delivery timeline, warranty requirements — the formal buying process initiator"], ["Proforma Invoice", "Issued before sale to confirm pricing and terms; used for financing or import approval"], ["Commercial Invoice", "Issued after confirmed sale; triggers customs clearance and payment"], ["Letter of Credit (LC)", "Bank-backed payment guarantee; explain to hospital procurement that LC protects both parties"], ["Compliance Matrix", "Tender requirement checklist confirming each technical specification is met"], ["Technical Proposal", "Full technical solution document for tender submission"], ["Commercial Proposal", "Pricing, warranty, service contract, financing terms for tender submission"], ["SLA (Service Level Agreement)", "Response time guarantees, uptime commitments, PM schedule, escalation procedures"]] },
      { type: "subheading", text: "INCOTERMS for Syria" },
      { type: "list", items: ["CIP (Carriage and Insurance Paid): Seller delivers to named port; insurance obligation transfers at ship-side — common for Syrian imports", "DAP (Delivered at Place): Seller delivers to named destination in Syria; ASTE typically uses DAP Damascus for local hospital deliveries", "Always confirm which INCOTERM applies to the sale — it affects cost, risk, and insurance in the tender"] },
      { type: "subheading", text: "Mandatory Certifications" },
      { type: "list", items: ["CE Marking (EU/Middle East requirement) — all Siemens Healthineers products carry CE", "ISO 13485 (Medical device quality management system) — Siemens Healthineers certified", "FDA 510(k) clearance where applicable — relevant for international tender references", "Syrian MOH import registration — ASTE manages this registration process as authorized partner"] }
    ]
  },
  {
    id: "competitive", icon: Target, title: "Competitive Landscape",
    content: [
      { type: "subheading", text: "Siemens Healthineers Core Advantages" },
      { type: "list", items: [
        "ONLY vendor with Photon-Counting CT (Naeotom Alpha) — a full technology generation ahead of GE and Philips",
        "ONLY vendor with 80cm bore MRI (MAGNETOM Free.Max) — widest patient access in the industry",
        "Deepest AI integration ecosystem (myExam Companion, Deep Resolve, BioMatrix, Turbo Suite) — comprehensive vs. point solutions from competitors",
        "ASTE = exclusive authorized partner in Syria → faster service than any competitor with no local presence"
      ] },
      { type: "subheading", text: "Head-to-Head: Key Differentiators" },
      { type: "table", rows: [
        ["Feature", "Siemens", "GE", "Philips", "Canon"],
        ["Photon-Counting CT", "✓ Naeotom Alpha", "✗", "✗", "✗"],
        ["80cm MRI Bore", "✓ Free.Max", "✗ (70cm max)", "✗ (70cm max)", "✗"],
        ["Cardiac CT Temporal Res.", "66ms (Force)", "175ms (Revolution)", "135ms (IQon)", "~150ms"],
        ["Helium-Free MRI", "✓ DryCool (Free.Max, Flow)", "✗", "Partial (Ambition)", "✗"],
        ["Full AI Exam Guidance", "✓ myExam Companion", "Partial", "Partial", "✗"],
        ["Quantitative SPECT", "✓ xSPECT Quant", "✓ Limited", "✗", "✗"],
        ["Syria Local Service", "✓ ASTE certified team", "✗ Beirut-based", "✗ Dubai-based", "✗"]
      ] }
    ]
  },
  {
    id: "numbers", icon: BarChart2, title: "Key Numbers to Memorize",
    content: [
      { type: "subheading", text: "Siemens Healthineers Corporate" },
      { type: "table", rows: [
        ["FY2024 Revenue", "~$22 billion total"], ["Imaging Segment", "~$11.8 billion"],
        ["Diagnostics Segment", "~$4.4 billion"], ["Employees", "65,000 globally"],
        ["HQ", "Erlangen, Germany"], ["CEO", "Bernd Montag"],
        ["Siemens AG stake", "~75% retained after 2017 spin-off"]
      ] },
      { type: "subheading", text: "Critical Product Numbers" },
      { type: "table", rows: [
        ["SOMATOM Force temporal resolution", "66ms (best cardiac CT in class)"],
        ["MAGNETOM Free.Max bore", "80cm (world's widest MRI bore)"],
        ["Naeotom Alpha.Pro scan speed", "491mm/s"],
        ["Deep Resolve scan time reduction", "Up to 50%"],
        ["ADMIRE dose reduction", "Up to 60% vs. conventional FBP"],
        ["Tin Filter dose reduction", "Up to 80% for routine chest/abdomen"],
        ["IQ•SPECT acquisition speed", "Up to 4x faster cardiac SPECT"],
        ["Atellica Solution test menu", "300+ assays on one platform"],
        ["Atellica CH throughput", "1,000 photometric + 400 ISE tests/hour"]
      ] },
      { type: "subheading", text: "ASTE Key Facts" },
      { type: "table", rows: [
        ["Founded", "1988 by Moheden Al-Shatta, Damascus"],
        ["Siemens relationship", "Since founding — first as GM of Siemens AG Damascus Branch"],
        ["Restructured", "2007 as independent Siemens Approved Partner"],
        ["Engineer training", "Siemens Training Center, Erlangen, Germany"],
        ["Current CHO", "Salem Al-Shatta"],
        ["Technical Manager", "Mohammad Alsheikh Kassem"]
      ] }
    ]
  }
];

/* ─────────────────────────────── INTERVIEW Q&A DATA ─────────────────────────── */
const QA_CATEGORIES = ["All", "Background & Motivation", "Technical Knowledge", "Sales Scenarios", "Behavioral (STAR)", "Curveball"];

const QA_DATA = [
  {
    id: 1, category: "Background & Motivation", difficulty: "Easy",
    question: "Tell me about yourself and why you're applying.",
    answer: "Lead with MSc biomedical engineering, IEEE publication on AI-driven imaging (SAM-GAN for skin cancer diagnosis), clinical engineering internship at Elias Al-Hrawi Hospital, and AI research at MedStar/Georgetown. Frame the transition: 'I understand both the clinical environment where these devices are used and the engineering behind them — that's exactly what a sales engineer needs to bridge technical and commercial conversations.'",
    keyPoint: "Position your dual identity — engineer + clinician — as a unique commercial asset that neither a pure engineer nor a pure salesperson can offer."
  },
  {
    id: 2, category: "Background & Motivation", difficulty: "Easy",
    question: "Why medical device sales rather than clinical or research roles?",
    answer: "Emphasize impact at scale: a researcher improves outcomes for one patient population in a study; a sales engineer brings technology to hundreds of facilities that treat thousands of patients. Frame it as the intersection of problem-solving, human relationships, and technical depth. Sales also offers faster feedback cycles and tangible markers of impact that research timelines rarely provide.",
    keyPoint: "Frame sales as 'scaled clinical impact' — not a departure from your engineering identity, but its most powerful application."
  },
  {
    id: 3, category: "Background & Motivation", difficulty: "Medium",
    question: "Why ASTE specifically?",
    answer: "ASTE is the exclusive Siemens Healthineers partner in Syria — the only role that puts you at the center of Syria's healthcare infrastructure rebuild. Mention ASTE's 35+ year track record, the Siemens brand strength, and your conviction that this generation of healthcare investment will define Syrian medicine for decades. Syria's reconstruction moment is a once-in-a-generation opportunity to build something lasting.",
    keyPoint: "Show awareness of ASTE's unique market position and Syria's current reconstruction moment. This is not a generic sales job — it's a role with historical significance."
  },
  {
    id: 4, category: "Background & Motivation", difficulty: "Easy",
    question: "Where do you see yourself in 5 years?",
    answer: "Territory ownership and quota attainment within 2 years. Regional sales management exposure by year 4. Potentially contributing to ASTE's expansion strategy as Syria's market opens and neighboring markets become accessible. Express desire to grow inside ASTE as it scales — this is a company where loyalty is rewarded with responsibility.",
    keyPoint: "Show ambition anchored to loyalty — you want to grow inside ASTE, not use it as a stepping stone to a multinational."
  },
  {
    id: 5, category: "Background & Motivation", difficulty: "Medium",
    question: "What do you know about ASTE's business model?",
    answer: "ASTE is an Approved Siemens Healthineers Partner operating a full turnkey model: needs assessment, civil works coordination, installation, application training, and after-sales service under Managed Equipment Service (MES) contracts. All engineers are Siemens-certified, trained at the Siemens Training Center in Erlangen, Germany. Founded 1988 by Moheden Al-Shatta; he served as General Manager of Siemens AG Damascus Branch for 18 years before restructuring as an independent company in 2007.",
    keyPoint: "Name the MES model, Erlangen training, and the 1988 founding. These specifics signal that you've done genuine homework — not just read the website."
  },
  {
    id: 6, category: "Technical Knowledge", difficulty: "Medium",
    question: "Walk me through how a CT scanner works.",
    answer: "An X-ray tube rotates around the patient emitting a fan-shaped (or cone) beam; detector arrays on the opposite side measure photon attenuation through each angle. Raw data is acquired as a sinogram and reconstructed into cross-sectional images using algorithms — historically filtered back-projection (FBP), now primarily iterative methods like ADMIRE. Modern CTs use slip-ring technology for continuous rotation, multirow detector arrays for volumetric acquisition, and automatic exposure control (CARE Dose4D) for real-time dose optimization.",
    keyPoint: "Mention sinogram, iterative reconstruction (ADMIRE), and multirow detectors — this demonstrates graduate-level depth that separates you from candidates reciting Wikipedia."
  },
  {
    id: 7, category: "Technical Knowledge", difficulty: "Medium",
    question: "What is dual-source CT and why is it clinically significant?",
    answer: "Dual-source CT uses two complete X-ray tube and detector arrays mounted at 95° offset within one gantry. Because each source covers half a rotation, a full dataset is acquired in half the rotational time — achieving 66ms temporal resolution on the SOMATOM Force. This freezes cardiac motion at any heart rate without the need for beta-blocker medication. Independently, each source can run at a different kVp, enabling native dual-energy imaging without dose compromise.",
    keyPoint: "66ms temporal resolution is the headline number. It's Siemens' key cardiac CT differentiator — commit it to memory and lead with it in every cardiac conversation."
  },
  {
    id: 8, category: "Technical Knowledge", difficulty: "Medium",
    question: "What is the clinical difference between 1.5T and 3T MRI?",
    answer: "3T provides double the signal-to-noise ratio (SNR) of 1.5T, enabling higher spatial resolution, faster scan times, or both simultaneously. Clinical benefits: superior neurological, musculoskeletal, and cardiac imaging. However, tradeoffs exist: higher specific absorption rate (SAR — energy deposited in tissue as heat), greater susceptibility artifacts near air-tissue and metal interfaces, and higher system cost. 1.5T remains the clinical workhorse for most routine applications and is preferred for patients with metallic implants due to lower artifact severity.",
    keyPoint: "Always acknowledge 3T tradeoffs — SAR, artifacts, cost. This shows clinical maturity. Saying '3T is always better' signals superficial knowledge."
  },
  {
    id: 9, category: "Technical Knowledge", difficulty: "Medium",
    question: "A radiologist asks about Deep Resolve. What do you say?",
    answer: "Deep Resolve is Siemens' deep learning MRI reconstruction engine, trained on millions of high-quality reference images. It reconstructs diagnostic-quality images from significantly undersampled raw data — the scanner acquires less k-space data than normally required, and the AI fills in the missing information based on learned patterns. The result is up to 50% scan time reduction while maintaining or improving SNR and image sharpness. In practice: the same exam in half the time, or substantially higher resolution in the same time.",
    keyPoint: "Translate the technology to clinical workflow impact: 'same quality in half the time.' The radiologist cares about throughput and quality — not the neural network architecture."
  },
  {
    id: 10, category: "Technical Knowledge", difficulty: "Hard",
    question: "What are the key installation requirements for an MRI system?",
    answer: "RF shielding (Faraday cage) to prevent external radiofrequency interference and contain the scanner's RF emissions. Magnetic field exclusion zones (5-gauss line) to protect cardiac pacemakers and ferromagnetic equipment. Quench pipe venting for helium gas exhaust — critical for conventional superconducting systems, but NOT required for DryCool/Free.Max. Reinforced structural flooring for magnet weight (up to 10+ tonnes). Controlled temperature and humidity (typically 18–24°C, <60% RH). UPS power for field stability. A detailed site survey precedes every MRI installation.",
    keyPoint: "Mention the DryCool/MAGNETOM Free.Max exception — no quench pipe, no helium infrastructure — as a Syria-specific advantage. It shows product-specific knowledge with local market relevance."
  },
  {
    id: 11, category: "Technical Knowledge", difficulty: "Medium",
    question: "How does the Atellica Solution differ from traditional lab analyzers?",
    answer: "Traditional core labs run immunoassay (hormones, tumor markers, infectious disease) and clinical chemistry (metabolic panels, enzymes) on completely separate instruments with manual sample transfer between them. The Atellica Solution integrates both modalities on a single bidirectional automation track — samples are loaded once and route intelligently to the correct analyzer. This eliminates manual transfer errors, reduces footprint by 40–50%, consolidates 300+ assays onto one platform, and requires fewer FTEs to operate.",
    keyPoint: "Frame it around labor savings and space reduction — the CFO argument, not just clinical efficiency. In Syria's rebuilding lab infrastructure context, fewer staff and smaller footprint are compelling."
  },
  {
    id: 12, category: "Technical Knowledge", difficulty: "Hard",
    question: "A hospital engineer asks about helium requirements for the MAGNETOM Altea.",
    answer: "The Altea uses Zero Helium Boil-off technology — a sealed cryocooler continuously re-condenses helium gas back into liquid, meaning the magnet never requires a helium refill after the initial fill. For Syria specifically, if helium supply chain is an operational concern, I would proactively introduce the MAGNETOM Free.Max — which uses DryCool technology and requires no liquid helium at all, from day one, with no quench pipe. The Free.Max also offers an 80cm bore as an added clinical benefit.",
    keyPoint: "Always offer the helium-free alternative proactively in Syria — helium supply is a real operational risk locally. Proactive problem-solving distinguishes you from a product reciter."
  },
  {
    id: 13, category: "Technical Knowledge", difficulty: "Medium",
    question: "What is ADMIRE and why do hospitals care?",
    answer: "ADMIRE (Advanced Modeled Iterative Reconstruction) builds a mathematical model of the entire CT acquisition process — including detector noise characteristics, X-ray beam geometry, and patient-specific anatomy — and iteratively refines the reconstructed image to match measured data while minimizing noise. Unlike conventional filtered back-projection, ADMIRE understands the physics of the system it's correcting. Result: up to 60% dose reduction versus conventional FBP with equal or better image quality.",
    keyPoint: "Always connect dose reduction to patient safety and regulatory compliance, not just image quality. The hospital administrator cares about liability and accreditation — not just beautiful images."
  },
  {
    id: 14, category: "Sales Scenarios", difficulty: "Hard",
    question: "A hospital director says your CT is 30% more expensive than a competitor.",
    answer: "Never defend the sticker price. Shift immediately to 7-year Total Cost of Ownership: 'Let's look at cost per scan over 7 years — including service contract costs, helium consumption if applicable, consumable costs, parts availability, and downtime frequency. ASTE's locally certified engineers also guarantee faster uptime recovery than a competitor whose nearest service engineer is in Beirut or Dubai.' Request the competitor's service contract terms for a documented comparison.",
    keyPoint: "Reframe every price objection to 7-year TCO and ASTE's local service advantage. The day a competitor's scanner goes down and takes 3 weeks to fix is the day your higher upfront price is justified in full."
  },
  {
    id: 15, category: "Sales Scenarios", difficulty: "Hard",
    question: "You're presenting to a committee: radiologist loves Siemens, CFO cares only about price, BME cares about service.",
    answer: "Prepare three simultaneous value proposition tracks within one unified presentation: For the radiologist — clinical outcomes, image quality metrics, advanced capabilities (Deep Resolve scan time, ADMIRE dose reduction, dual-energy tissue characterization). For the CFO — 7-year TCO analysis, cost per scan calculation, revenue projection from new case volume, Siemens Financial Services financing options. For the BME — uptime SLA commitments, ASTE certified engineer response times, remote diagnostics via Siemens syngo.via, local spare parts inventory.",
    keyPoint: "Never use a single generic deck for a committee. Three audience members, three value propositions — even within one presentation. The champion (usually the radiologist) will advocate for you internally only if you've given each stakeholder a reason to vote yes."
  },
  {
    id: 16, category: "Sales Scenarios", difficulty: "Hard",
    question: "What's your strategy to build a territory from scratch in Syria?",
    answer: "Weeks 1–4: Map the territory systematically — create a database of all public hospitals, private hospitals, and diagnostic centers by governorate. Identify equipment age and modality gaps. Month 2: Analyze ASTE's installed base database to identify aging Siemens equipment (upgrade opportunities) and competitor-installed equipment (displacement opportunities). Month 3: Prioritize accounts by budget cycle timing and clinical urgency. Build primary relationships with radiologists first — they are the clinical champions who pull procurement decisions from the clinical side.",
    keyPoint: "Show systematic territory management thinking: mapping → installed base analysis → prioritization → relationship building. This signals sales process maturity from day one."
  },
  {
    id: 17, category: "Sales Scenarios", difficulty: "Medium",
    question: "A hospital CFO says they can't justify the capital expense this year.",
    answer: "Explore alternative acquisition structures before accepting the objection: 'Would an operating lease structure work within your annual budget? Siemens Financial Services offers financing solutions that convert capital expenditure to predictable monthly operational expense. Alternatively, a phased acquisition — starting with the most urgent modality — could fit within current budget while establishing the Siemens relationship for future expansion.' A letter of intent this cycle can lock in current pricing for next year's budget.",
    keyPoint: "Never let a budget objection end the conversation. Financing structures, phased acquisition, and letters of intent are all legitimate tools to preserve the opportunity across budget cycles."
  },
  {
    id: 18, category: "Behavioral (STAR)", difficulty: "Medium",
    question: "Tell me about a time you explained a complex technical concept to a non-technical person.",
    answer: "S: During my AI CoLab internship at MedStar/Georgetown, radiologists needed to evaluate GAN-generated synthetic skin lesion images for clinical validity — without deep learning expertise. T: Explain AI image synthesis without model architecture jargon, in a way that enabled meaningful clinical evaluation. A: Designed visual comparison panels — synthetic vs. real lesions — and framed the evaluation around standard clinical diagnostic criteria (lesion border, color variation, surface texture) rather than pixel-level statistics or model metrics. R: The radiology team adopted the evaluation protocol and their clinical feedback was incorporated into the final IEEE-published findings.",
    keyPoint: "Use the SAM-GAN/IEEE publication story — it's both technically impressive and clinically relevant. It directly demonstrates the bridge between engineering and clinical communication that a sales engineer must make daily."
  },
  {
    id: 19, category: "Behavioral (STAR)", difficulty: "Medium",
    question: "Describe a situation where you had to work under pressure.",
    answer: "S: During my MSc thesis on SAM-GAN skin cancer synthesis, I was simultaneously completing my clinical internship at Elias Al-Hrawi Hospital with overlapping deadlines. T: Deliver a complete, IEEE-submission-quality research project while maintaining clinical internship commitments. A: Created a detailed day-level project plan with daily milestones, negotiated thesis committee review timeline, and used morning hours for clinical work and evenings for research writing. Communicated proactively with supervisors when scope adjustments were needed. R: Successfully submitted and published in IEEE ICABME 2025 while completing the clinical internship on schedule.",
    keyPoint: "Show that your pressure response is structured and communicative — not just 'I worked harder.' Structured prioritization and proactive communication are what interviewers want to hear."
  },
  {
    id: 20, category: "Behavioral (STAR)", difficulty: "Medium",
    question: "Tell me about a time you had to convince someone who disagreed with you.",
    answer: "S: During the HCAHPS RAG-based quality analysis project at AI CoLab, a project stakeholder favored a different technical architecture for the retrieval system. T: Advocate for the approach I believed would perform better without damaging the collaborative relationship. A: Documented a structured technical comparison — performance benchmarks, implementation complexity, and long-term maintainability — and presented it as shared decision-making criteria rather than personal preference. Acknowledged the validity of the alternative approach's strengths before presenting the data supporting my recommendation. R: Stakeholder agreed after reviewing the documented comparison; the chosen architecture met all project benchmarks.",
    keyPoint: "Frame persuasion through evidence and shared criteria, not authority or persistence. Never say 'I convinced them I was right' — say 'the data supported the decision we made together.'"
  },
  {
    id: 21, category: "Behavioral (STAR)", difficulty: "Medium",
    question: "Tell me about a time you failed or made a mistake.",
    answer: "S: Early in my clinical internship, I underestimated the time required to document a preventive maintenance report for a complex ultrasound system, missing an internal deadline. T: Complete the documentation to standard while managing the consequences of the delay. A: Immediately communicated the delay to my supervisor rather than waiting, proposed a revised completion timeline, completed the documentation with extra thoroughness, and implemented a personal checklist system to estimate documentation time more accurately for future tasks. R: The completed report was accepted and I received positive feedback on the revised estimation system I shared with the team.",
    keyPoint: "Interviewers value self-awareness, ownership, and learning — not perfection. A failure answer that shows immediate ownership, a fix, and a systemic learning is more impressive than a claimed track record of no mistakes."
  },
  {
    id: 22, category: "Curveball Questions", difficulty: "Hard",
    question: "If you could redesign one Siemens product feature for Syria, what would it be?",
    answer: "A low-bandwidth remote diagnostics and service mode for the Siemens syngo.via and syngo Virtual Cockpit platforms. Syria's internet infrastructure is inconsistent outside Damascus — in Aleppo, Homs, and Lattakia, reliable high-speed connectivity cannot be assumed. Siemens' remote service and Virtual Cockpit systems assume stable broadband; a resilient, low-latency, compressed data mode would dramatically improve ASTE's ability to remotely diagnose equipment issues and support scanning outside the capital, reducing physical service response times.",
    keyPoint: "Show you've thought about local infrastructure constraints, not just global product specifications. Proposing a specific, well-reasoned improvement signals that you think like a market expert, not just a product encyclopedia."
  },
  {
    id: 23, category: "Curveball Questions", difficulty: "Medium",
    question: "What would you do in the first 90 days?",
    answer: "Days 1–30: Complete all product certifications and internal training modules. Shadow at least 3–4 senior sales engineer customer visits across different modality and customer types. Learn ASTE's CRM system, installed base database, and active tender pipeline. Days 31–60: Begin independent customer visits with senior colleague present. Map full territory — build a database of all hospital accounts by governorate, equipment age, and modality gap. Identify top 10 priority accounts by opportunity size and timeline. Days 61–90: Submit a written territory plan with a 6-month pipeline forecast to management. Present initial findings on territory opportunity and competitive landscape.",
    keyPoint: "A written 30-60-90 plan submitted to management signals sales process maturity from day one. Most candidates describe their first 90 days — the best candidates plan to deliver something tangible."
  },
  {
    id: 24, category: "Curveball Questions", difficulty: "Hard",
    question: "Sell me this pen.",
    answer: "Do not pitch immediately. Respond with a question: 'Before I tell you about it — when did you last use a pen, and what were you writing?' Listen carefully to the specific answer. Then pitch directly to the identified need: if they sign contracts in client meetings — 'What you need is something that performs reliably the first time, every time — no clicking, no warming up, no drying out. That's exactly what this delivers.' The demonstration of listening and needs-identification is the answer. Feature-dumping is always wrong.",
    keyPoint: "The right answer always starts with a question. Needs-based selling is the core principle — never lead with features before understanding what the customer actually values."
  },
  {
    id: 25, category: "Curveball Questions", difficulty: "Hard",
    question: "What is the biggest challenge Siemens Healthineers faces in Syria right now?",
    answer: "Three overlapping challenges: First, financing — most Syrian hospitals are cash-constrained or dependent on international reconstruction funding with uncertain timelines; deal cycles are long and unpredictable. Second, infrastructure gaps — many facilities lack the civil works prerequisites (power stability, shielding, HVAC) for advanced imaging installation, requiring ASTE to take on coordination roles beyond equipment supply. Third, workforce reconstruction — there is a shortage of trained radiographers, physicists, and biomedical engineers, making AI-guided and low-training-required systems (myExam Companion, MAGNETOM Free.Max) strategically more valuable than technically superior but complex systems.",
    keyPoint: "Demonstrating awareness of market-level constraints — not just product knowledge — signals genuine commercial thinking. The best sales engineers understand what stands between great technology and actual installed revenue."
  },
  {
    id: 26, category: "Technical Knowledge", difficulty: "Hard",
    question: "Explain what photon-counting CT means and why it matters.",
    answer: "Conventional CT detectors use scintillator crystals that convert X-ray photons to visible light, then photodiodes that convert light to electrical current — an indirect process that introduces electronic noise and blurs photon energy information. Photon-counting detectors (Naeotom Alpha) convert X-ray photons directly to electrical pulses, counting each photon individually and recording its energy level. This eliminates electronic noise at its source and captures spectral data at every scan without any dose penalty. The result: better low-contrast resolution, sharper images at lower doses, and spectral imaging available on every patient as a routine capability — not a premium add-on.",
    keyPoint: "Photon-counting CT is a Siemens exclusive. No competitor has a commercial equivalent. When this comes up, frame it as a full technology generation ahead — not just an incremental improvement."
  },
  {
    id: 27, category: "Sales Scenarios", difficulty: "Medium",
    question: "A radiologist wants a specific feature your system doesn't have. How do you handle it?",
    answer: "First, clarify the clinical need behind the feature request — sometimes the stated feature is not the actual clinical requirement. If it's a genuine gap: be honest about it, never fabricate or over-promise. Then redirect to the broader value: 'That specific feature isn't part of this configuration — let me show you what [alternative feature] delivers for the same clinical workflow, and confirm whether it addresses the underlying need.' If it's a fundamental dealbreaker, qualify whether the customer is genuinely evaluable and focus resources on better-fit accounts.",
    keyPoint: "Never fabricate product capabilities. Losing a deal honestly preserves your reputation; losing it through false promises destroys it. Qualify hard, promise accurately, deliver consistently."
  },
  {
    id: 28, category: "Background & Motivation", difficulty: "Medium",
    question: "How does your clinical engineering background help you in a sales role?",
    answer: "Clinical engineering gives me the credibility to have technical conversations that typical sales profiles cannot: I can discuss ADMIRE iterative reconstruction with a radiologist, explain quench pipe requirements to a BME director, or walk through an SLA with a hospital technical director — all at the correct depth. More importantly, I've been inside hospitals as a technical user, which gives me intuition about how these devices actually fit into clinical workflow, where the real pain points are, and which value propositions will resonate vs. which are theoretical.",
    keyPoint: "Your clinical engineering background is not a liability in sales — it's a force multiplier. Use it to establish technical credibility in the first 5 minutes of every customer interaction."
  }
];

/* ─────────────────────────────── COMPANY INTEL DATA ─────────────────────────── */
const COMPANY_INTEL = {
  aste: {
    founded: "1988", founder: "Moheden Al-Shatta, Damascus, Syria",
    history: "Moheden Al-Shatta served as General Manager of Siemens AG Damascus Branch for 18 years before establishing ASTE as an independent company in 2007. ASTE has operated continuously in Syria since 1988, through all periods of economic and political instability.",
    leadership: [["Salem Al-Shatta", "Chief Healthcare Officer (CHO)"], ["Mohammad Alsheikh Kassem", "Healthcare Technical Manager"]],
    siemensRel: "Approved Siemens Healthineers Partner — engineers trained and certified at Siemens Training Center, Erlangen, Germany",
    model: "Full turnkey: needs assessment → site survey → civil works coordination → equipment installation → application training → after-sales (Managed Equipment Service model)",
    modalities: "CT · MRI · Nuclear Medicine/SPECT · Ultrasound · Digital Radiography · Fluoroscopy · Mammography · Lab Diagnostics",
    moat: "Only authorized Siemens Healthineers service partner in Syria. Local certified engineers with Syrian market experience. Spare parts inventory maintained in-country."
  },
  siemens: {
    hq: "Erlangen, Germany", ceo: "Bernd Montag",
    founded: "Spun off from Siemens AG in 2017; Siemens AG retains ~75% stake",
    employees: "65,000 globally",
    revenue: "FY2024: ~$22 billion total | Imaging: ~$11.8B | Diagnostics: ~$4.4B | Varian (radiation oncology): significant contributor",
    aiPlatforms: [["Deep Resolve", "MRI deep learning reconstruction — up to 50% scan time reduction"], ["myExam Companion", "CT full AI exam guidance system — protocol selection, patient positioning, parameter optimization"], ["ADMIRE", "Advanced CT iterative reconstruction — up to 60% dose reduction"], ["BioMatrix", "Adaptive MRI platform — patient-specific coil tuning and motion management"], ["DryCool", "Helium-free MRI cooling technology — Free.Max and Flow platforms"], ["FAST 3D Camera", "AI-powered CT patient positioning camera — go.Up and go.All"], ["xSPECT Quant", "Quantitative SPECT reconstruction — absolute radiotracer concentrations"]],
    keyStrengths: ["Only vendor with Photon-Counting CT (Naeotom Alpha)", "Only vendor with 80cm bore MRI (MAGNETOM Free.Max)", "Deepest AI integration across all modalities", "Global #1 or #2 in most imaging modalities by installed base"]
  },
  syria: {
    context: "Post-2024 political transition accelerated reconstruction priorities across all infrastructure sectors. Healthcare is a declared priority in international reconstruction funding frameworks.",
    gaps: ["CT and MRI coverage in public hospital network significantly below regional benchmarks", "Lab diagnostics infrastructure scaling — central labs require modernization", "Field hospitals and reconstruction-zone facilities require portable and rugged solutions", "Workforce gaps — shortage of trained radiographers, medical physicists, and biomedical engineers"],
    buyers: ["Syrian Ministry of Health (MOH) — central procurement for public hospital network", "Damascus University Hospital — flagship public institution, reference site potential", "Private hospital chains (Damascus, Aleppo, Lattakia) — faster decision cycles", "Governorate public hospitals — regional infrastructure rebuild", "NGO and international organization-funded facilities — specific procurement protocols"],
    opportunity: "A country rebuilding its healthcare system from the ground up has a generational opportunity to install current-generation technology — not to buy 10-year-old refurbished equipment that will be obsolete in 5 years."
  }
};

/* ─────────────────────────────── TECHTERM COMPONENT ────────────────────────── */
function TechTerm({ termId, children, onOpen }) {
  const ref = useRef(null);
  const normalizedId = termId.toLowerCase();
  const exists = !!TECH_GLOSSARY[normalizedId];
  if (!exists) return <span>{children}</span>;
  return (
    <span
      ref={ref}
      onClick={(e) => { e.stopPropagation(); if (ref.current) onOpen(normalizedId, ref.current.getBoundingClientRect()); }}
      className="cursor-pointer border-b border-dashed border-cyan-400 text-cyan-300 hover:text-cyan-100 transition-colors"
    >{children}</span>
  );
}

/* ─────────────────────────────── TOOLTIP COMPONENT ─────────────────────────── */
function Tooltip({ tooltip, onClose }) {
  if (!tooltip) return null;
  const def = TECH_GLOSSARY[tooltip.termId];
  if (!def) return null;
  const { anchorRect } = tooltip;
  const viewH = window.innerHeight;
  const spaceBelow = viewH - anchorRect.bottom;
  const top = spaceBelow > 240 ? anchorRect.bottom + 8 : anchorRect.top - 8;
  const transform = spaceBelow > 240 ? "none" : "translateY(-100%)";
  const left = Math.min(Math.max(anchorRect.left, 12), window.innerWidth - 300);
  return (
    <div
      style={{ position: "fixed", top, left, transform, zIndex: 9999, width: 290, boxShadow: "0 8px 32px rgba(0,212,255,0.18)" }}
      className="rounded-xl border border-cyan-400/60 bg-[#1a2640] p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="font-bold text-cyan-300 text-sm leading-tight">{def.term}</div>
          <div className="text-xs mt-0.5 px-1.5 py-0.5 rounded-full bg-cyan-900/60 text-cyan-400 inline-block">{def.category}</div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white shrink-0 mt-0.5"><X size={14} /></button>
      </div>
      <p className="text-slate-300 text-xs leading-relaxed mb-2">{def.definition}</p>
      <p className="text-amber-400 text-xs italic leading-relaxed">{def.clinical}</p>
    </div>
  );
}

/* ────────────────────────────────── APP ────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState("catalogue");
  const [tooltip, setTooltip] = useState(null);

  const openTooltip = useCallback((termId, anchorRect) => {
    setTooltip(prev => prev?.termId === termId ? null : { termId, anchorRect });
  }, []);
  const closeTooltip = useCallback(() => setTooltip(null), []);

  useEffect(() => {
    const handler = () => setTooltip(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 font-sans" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-3 py-6">
        {activeTab === "catalogue" && <ProductCatalogue openTooltip={openTooltip} />}
        {activeTab === "playbook" && <SalesPlaybook openTooltip={openTooltip} />}
        {activeTab === "qa" && <InterviewQA />}
        {activeTab === "intel" && <CompanyIntel />}
      </main>
      <Tooltip tooltip={tooltip} onClose={closeTooltip} />
    </div>
  );
}

/* ─────────────────────────────── NAVBAR ─────────────────────────────────────── */
function NavBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "catalogue", label: "Product Catalogue", icon: Layers },
    { id: "playbook", label: "Sales Playbook", icon: Target },
    { id: "qa", label: "Interview Q&A", icon: BookOpen },
    { id: "intel", label: "Company Intel", icon: Building2 },
  ];
  return (
    <nav className="bg-[#0d1428] border-b border-slate-700/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Stethoscope size={14} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">ASTE × Siemens Healthineers</div>
              <div className="text-[10px] text-slate-400 leading-tight">Sales Engineer Interview Prep</div>
            </div>
          </div>
          <div className="flex gap-0.5 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === id
                    ? "bg-cyan-500/15 text-cyan-300 border-b-2 border-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────── PRODUCT CATALOGUE ─────────────────────────── */
const MODALITIES = ["ALL", "CT", "MRI", "Ultrasound", "X-Ray & Fluoroscopy", "Mammography", "Nuclear Medicine", "Lab Diagnostics"];
const MODALITY_ICONS = { CT: Cpu, MRI: Brain, Ultrasound: Activity, "X-Ray & Fluoroscopy": Zap, Mammography: Eye, "Nuclear Medicine": Radio, "Lab Diagnostics": Microscope };

function ProductCatalogue({ openTooltip }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const matchMod = filter === "ALL" || p.modality === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q) || p.features.some(f => f.toLowerCase().includes(q));
    return matchMod && matchSearch;
  }), [filter, search]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(p => { if (!g[p.modality]) g[p.modality] = []; g[p.modality].push(p); });
    return g;
  }, [filtered]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">Product Catalogue</h1>
        <p className="text-slate-400 text-sm">19 Siemens Healthineers devices — complete technical reference with specs, USPs, and competitive positioning</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by product name or keyword..."
            className="w-full bg-[#111827] border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {MODALITIES.map(m => (
          <button key={m} onClick={() => setFilter(m)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === m ? "bg-cyan-500 text-black" : "bg-[#111827] border border-slate-700 text-slate-300 hover:border-cyan-500/50"}`}>
            {m}
          </button>
        ))}
      </div>
      {Object.entries(grouped).map(([modality, products]) => {
        const MIcon = MODALITY_ICONS[modality] || Layers;
        return (
          <div key={modality} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MIcon size={16} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">{modality}</h2>
              <div className="h-px flex-1 bg-emerald-900/40" />
              <span className="text-xs text-slate-500">{products.length} system{products.length > 1 ? "s" : ""}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {products.map(p => (
                <ProductCard key={p.id} product={p} expanded={expanded[p.id]} onToggle={() => setExpanded(e => ({ ...e, [p.id]: !e[p.id] }))} openTooltip={openTooltip} />
              ))}
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500"><Search size={32} className="mx-auto mb-3 opacity-40" /><p>No products match your search.</p></div>
      )}
    </div>
  );
}

const TECH_TERM_MAP = {
  "ADMIRE": "admire", "SAFIRE": "safire", "iMAR": "imar", "Tin Filter": "tin filter",
  "Stellar": "stellar", "StellarInfinity": "stellarinfinity", "Flash Spiral": "flash spiral",
  "myExam Companion": "myexam companion", "myExam Compass": "myexam compass",
  "Deep Resolve": "deep resolve", "DryCool": "drycool", "BioMatrix": "biomatrix",
  "Tim 4G": "tim 4g", "Turbo Suite": "turbo suite", "syngo Virtual Cockpit": "syngo virtual cockpit",
  "IQ•SPECT": "iqspect", "xSPECT Quant": "xspect quant", "Atellica Solution": "atellica solution",
  "Zero Helium Boil-off": "zero helium boil-off", "Dual-Source CT": "dual-source ct",
  "DSCT": "dsct", "Dual-Energy CT": "dual-energy ct", "DECT": "dect",
  "Photon-Counting CT": "photon-counting ct", "PCCT": "pcct",
  "CARE Dose4D": "care dose4d", "BioAcoustic AI": "bioaccoustic ai",
  "FAST 3D Camera": "myexam compass"
};

function renderWithTerms(text, openTooltip) {
  const keys = Object.keys(TECH_TERM_MAP);
  const pattern = new RegExp(`(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "g");
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const termId = TECH_TERM_MAP[part];
    if (termId) return <TechTerm key={i} termId={termId} onOpen={openTooltip}>{part}</TechTerm>;
    return part;
  });
}

function ProductCard({ product: p, expanded, onToggle, openTooltip }) {
  return (
    <div className={`bg-[#111827] border rounded-xl overflow-hidden transition-all ${expanded ? "border-cyan-500/50" : "border-slate-700/60 hover:border-slate-600"}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-bold text-white text-sm leading-tight">{p.name}</h3>
            <p className="text-slate-400 text-xs mt-0.5">{p.subtitle}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-900/50 text-violet-300 shrink-0">{p.modality}</span>
        </div>
        <div className="mt-2 space-y-0.5">
          {p.usps.map((u, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-cyan-300">
              <Zap size={10} className="shrink-0 mt-0.5 text-cyan-400" />
              <span>{renderWithTerms(u, openTooltip)}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 transition-colors text-xs text-slate-300">
        <span>{expanded ? "Hide Specs" : "View Full Specs"}</span>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {expanded && (
        <div className="p-4 border-t border-slate-700/40 space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Specifications</div>
            <table className="w-full text-xs">
              <tbody>
                {p.specs.map(([k, v], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : ""}>
                    <td className="py-1 px-2 text-slate-400 font-medium w-2/5">{k}</td>
                    <td className="py-1 px-2 text-white">{renderWithTerms(v, openTooltip)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Features</div>
            <ul className="space-y-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <Check size={10} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{renderWithTerms(f, openTooltip)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Typical Customer</div>
            <p className="text-xs text-slate-300">{p.customer}</p>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">vs. GE / Philips</div>
            <ul className="space-y-1">
              {p.competitive.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-amber-300">
                  <Award size={10} className="shrink-0 mt-0.5 text-amber-400" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────── SALES PLAYBOOK ─────────────────────────────── */
function SalesPlaybook({ openTooltip }) {
  const [openSection, setOpenSection] = useState(null);
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">Sales Playbook</h1>
        <p className="text-slate-400 text-sm">Commercial knowledge framework — customers, value selling, objections, documents, competitive positioning, and key numbers</p>
      </div>
      <div className="space-y-2">
        {PLAYBOOK_SECTIONS.map(sec => {
          const Icon = sec.icon;
          const isOpen = openSection === sec.id;
          return (
            <div key={sec.id} className={`bg-[#111827] border rounded-xl overflow-hidden transition-all ${isOpen ? "border-violet-500/50" : "border-slate-700/60"}`}>
              <button onClick={() => setOpenSection(isOpen ? null : sec.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-900/50 flex items-center justify-center"><Icon size={16} className="text-violet-300" /></div>
                  <span className="font-semibold text-white text-sm">{sec.title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-5 border-t border-slate-700/40 pt-4">
                  <PlaybookContent content={sec.content} openTooltip={openTooltip} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlaybookContent({ content, openTooltip }) {
  return (
    <div className="space-y-4">
      {content.map((block, i) => {
        if (block.type === "subheading") return <h3 key={i} className="text-xs font-bold text-cyan-400 uppercase tracking-wider pt-1">{block.text}</h3>;
        if (block.type === "list") return (
          <ul key={i} className="space-y-1.5">
            {block.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                <ChevronRight size={10} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>{renderWithTerms(item, openTooltip)}</span>
              </li>
            ))}
          </ul>
        );
        if (block.type === "table") return (
          <div key={i} className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j} className={j === 0 && row.length > 2 ? "bg-slate-700/40" : j % 2 === 0 ? "bg-slate-800/30" : ""}>
                    {row.map((cell, k) => (
                      <td key={k} className={`py-1.5 px-2 border-b border-slate-700/30 ${k === 0 ? "text-slate-300 font-medium" : "text-white"} ${j === 0 && row.length > 2 ? "font-bold text-cyan-300" : ""}`}>
                        {renderWithTerms(String(cell), openTooltip)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        if (block.type === "tip") return (
          <div key={i} className="flex items-start gap-2 bg-amber-900/20 border border-amber-700/40 rounded-lg p-3">
            <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 italic">{block.text}</p>
          </div>
        );
        if (block.type === "objections") return (
          <div key={i} className="space-y-3">
            {block.items.map((item, j) => (
              <div key={j} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40">
                <div className="text-xs font-semibold text-red-400 mb-1.5 flex items-start gap-1.5">
                  <AlertCircle size={10} className="shrink-0 mt-0.5" />{item.objection}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{renderWithTerms(item.response, () => {})}</p>
              </div>
            ))}
          </div>
        );
        return null;
      })}
    </div>
  );
}

/* ─────────────────────────────── INTERVIEW Q&A ─────────────────────────────── */
function InterviewQA() {
  const [category, setCategory] = useState("All");
  const [revealed, setRevealed] = useState({});
  const [mastered, setMastered] = useState({});
  const [randomQ, setRandomQ] = useState(null);

  const filtered = useMemo(() => {
    const pool = category === "All" ? QA_DATA : QA_DATA.filter(q => q.category === category);
    return pool;
  }, [category]);

  const masteredCount = Object.values(mastered).filter(Boolean).length;
  const progress = Math.round((masteredCount / QA_DATA.length) * 100);

  const pickRandom = () => {
    const unmastered = filtered.filter(q => !mastered[q.id]);
    const pool = unmastered.length > 0 ? unmastered : filtered;
    setRandomQ(pool[Math.floor(Math.random() * pool.length)]?.id ?? null);
  };

  const diffColor = (d) => d === "Easy" ? "text-emerald-400 bg-emerald-900/40" : d === "Medium" ? "text-amber-400 bg-amber-900/40" : "text-red-400 bg-red-900/40";

  return (
    <div>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Interview Q&A</h1>
          <p className="text-slate-400 text-sm">{QA_DATA.length} questions across 6 categories — tap Show Answer to reveal, check Mastered when confident</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Mastered</div>
            <div className="text-sm font-bold text-white">{masteredCount} / {QA_DATA.length}</div>
          </div>
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {QA_CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setRandomQ(null); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${category === c ? "bg-violet-600 text-white" : "bg-[#111827] border border-slate-700 text-slate-300 hover:border-violet-500/50"}`}>
            {c} {c !== "All" && <span className="opacity-60">({QA_DATA.filter(q => q.category === c).length})</span>}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-5">
        <button onClick={pickRandom} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-700/40 hover:bg-violet-700/60 border border-violet-600/40 rounded-lg text-xs text-violet-200 transition-colors">
          <RotateCcw size={12} /> Random Question
        </button>
        <button onClick={() => { setMastered({}); setRevealed({}); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/40 rounded-lg text-xs text-slate-300 transition-colors">
          <RotateCcw size={12} /> Reset All
        </button>
      </div>
      <div className="space-y-3">
        {(randomQ ? filtered.filter(q => q.id === randomQ) : filtered).map(q => {
          const isRevealed = revealed[q.id];
          const isMastered = mastered[q.id];
          return (
            <div key={q.id} className={`border rounded-xl overflow-hidden transition-all ${isMastered ? "border-emerald-500/60 bg-emerald-900/10" : "border-slate-700/60 bg-[#111827]"}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{q.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                  </div>
                  <button onClick={() => setMastered(m => ({ ...m, [q.id]: !m[q.id] }))}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg shrink-0 transition-all ${isMastered ? "bg-emerald-600/40 text-emerald-300 border border-emerald-600/60" : "bg-slate-700/40 text-slate-400 border border-slate-600/40 hover:border-emerald-500/50"}`}>
                    <CheckCircle2 size={11} /> {isMastered ? "Mastered" : "Mark Mastered"}
                  </button>
                </div>
                <p className="text-sm font-semibold text-white leading-snug mb-3">{q.question}</p>
                {!isRevealed ? (
                  <button onClick={() => setRevealed(r => ({ ...r, [q.id]: true }))}
                    className="text-xs px-3 py-1.5 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700/40 rounded-lg text-cyan-300 transition-colors">
                    Show Answer
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40">
                      <p className="text-xs text-slate-200 leading-relaxed">{q.answer}</p>
                    </div>
                    <div className="flex items-start gap-2 bg-amber-900/20 border border-amber-700/30 rounded-lg p-2.5">
                      <Star size={11} className="text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-200 italic">{q.keyPoint}</p>
                    </div>
                    <button onClick={() => setRevealed(r => ({ ...r, [q.id]: false }))}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                      Hide Answer
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────── COMPANY INTEL ─────────────────────────────── */
function CompanyIntel() {
  const { aste, siemens, syria } = COMPANY_INTEL;
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">Company Intel</h1>
        <p className="text-slate-400 text-sm">ASTE company profile, Siemens Healthineers corporate reference, Syrian market context, and technology glossary</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* ASTE */}
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-900/50 flex items-center justify-center"><Building2 size={16} className="text-cyan-300" /></div>
            <div><div className="font-bold text-white text-sm">ASTE</div><div className="text-xs text-slate-400">Al-Shatta Technical Engineering</div></div>
          </div>
          <div className="space-y-2 text-xs">
            {[["Founded", aste.founded], ["Founder", aste.founder], ["Restructured", "2007 as independent Siemens Approved Partner"], ["Siemens Relationship", aste.siemensRel], ["Service Model", aste.model], ["Modalities", aste.modalities]].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-slate-400 font-medium w-28 shrink-0">{k}</span>
                <span className="text-slate-200">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-700/40">
              <span className="text-slate-400 font-medium w-28 shrink-0">Leadership</span>
              <div>{aste.leadership.map(([name, role]) => <div key={name}><span className="text-white">{name}</span> <span className="text-slate-400">— {role}</span></div>)}</div>
            </div>
            <div className="mt-3 bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-2.5">
              <div className="flex items-start gap-1.5 text-xs text-cyan-200">
                <Shield size={11} className="text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-cyan-300">ASTE's Moat:</strong> {aste.moat}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Siemens */}
        <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-900/50 flex items-center justify-center"><Globe size={16} className="text-violet-300" /></div>
            <div><div className="font-bold text-white text-sm">Siemens Healthineers</div><div className="text-xs text-slate-400">Corporate Reference</div></div>
          </div>
          <div className="space-y-2 text-xs">
            {[["HQ", siemens.hq], ["CEO", siemens.ceo], ["Origin", siemens.founded], ["Employees", siemens.employees], ["FY2024 Revenue", siemens.revenue]].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-slate-400 font-medium w-28 shrink-0">{k}</span>
                <span className="text-slate-200">{v}</span>
              </div>
            ))}
            <div className="mt-3 pt-2 border-t border-slate-700/40">
              <div className="text-slate-400 font-medium mb-2">AI Platform Brands</div>
              <div className="space-y-1">
                {siemens.aiPlatforms.map(([name, desc]) => (
                  <div key={name} className="flex items-start gap-1.5">
                    <Zap size={9} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span><span className="text-cyan-300 font-medium">{name}</span> <span className="text-slate-400">— {desc}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Syria Market */}
      <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-900/50 flex items-center justify-center"><TrendingUp size={16} className="text-amber-300" /></div>
          <div><div className="font-bold text-white text-sm">Syrian Healthcare Market Context</div><div className="text-xs text-slate-400">Post-2024 reconstruction opportunity</div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-[10px]">Context</div>
            <p className="text-slate-300 leading-relaxed">{syria.context}</p>
            <div className="mt-3 bg-amber-900/20 border border-amber-700/30 rounded-lg p-2.5">
              <p className="text-amber-200 italic">"{syria.opportunity}"</p>
            </div>
          </div>
          <div>
            <div className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-[10px]">Infrastructure Gaps</div>
            <ul className="space-y-1">
              {syria.gaps.map((g, i) => <li key={i} className="flex items-start gap-1.5 text-slate-300"><AlertCircle size={9} className="text-amber-400 shrink-0 mt-0.5" />{g}</li>)}
            </ul>
            <div className="mt-3">
              <div className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-[10px]">Key Buyers</div>
              <ul className="space-y-1">
                {syria.buyers.map((b, i) => <li key={i} className="flex items-start gap-1.5 text-slate-300"><ChevronRight size={9} className="text-cyan-400 shrink-0 mt-0.5" />{b}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Technology Glossary */}
      <TechGlossary />
    </div>
  );
}

function TechGlossary() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const entries = Object.entries(TECH_GLOSSARY);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter(([, def]) => !q || def.term.toLowerCase().includes(q) || def.category.toLowerCase().includes(q) || def.definition.toLowerCase().includes(q));
  }, [search, entries]);

  return (
    <div className="bg-[#111827] border border-slate-700/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-emerald-400" />
          <div className="font-bold text-white text-sm">Technology Glossary</div>
          <span className="text-xs text-slate-500">{entries.length} terms</span>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms..."
            className="bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48" />
        </div>
      </div>
      <div className="space-y-1.5">
        {filtered.map(([key, def]) => (
          <div key={key} className="border border-slate-700/40 rounded-lg overflow-hidden">
            <button onClick={() => setExpanded(e => ({ ...e, [key]: !e[key] }))}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800/60 transition-colors text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-300">{def.term}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-400">{def.category}</span>
              </div>
              {expanded[key] ? <ChevronUp size={12} className="text-slate-500" /> : <ChevronDown size={12} className="text-slate-500" />}
            </button>
            {expanded[key] && (
              <div className="px-3 pb-3 pt-1 border-t border-slate-700/30 space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">{def.definition}</p>
                <p className="text-xs text-amber-400 italic">{def.clinical}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
