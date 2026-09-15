'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowRight, 
  Stethoscope, 
  Sparkles, 
  ShieldAlert, 
  Leaf, 
  RefreshCw, 
  FileText, 
  Scale, 
  Globe2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const FormulationWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { setSelectedCitation } = useAppStore();

  const recordAnswer = (key: string, value: any, nextStep: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep(nextStep);
  };

  const restartTriage = () => {
    setAnswers({});
    setStep(1);
  };

  // Result generation engine according to FORMULATION_CLASSIFICATION_WIZARD.md
  const renderDiagnosticResult = () => {
    const isFirstSchedule = answers.isFirstSchedule === true;
    const isModified = answers.isModified === true;
    const intendedUse = answers.intendedUse;
    const isPurified = answers.isPurified === true;

    let category = '';
    let statute = '';
    let patentability = '';
    let patentRiskClass = '';
    let absStatus = '';
    let regulator = '';
    let clinicalNorms = '';
    let exportAdvice = '';

    if (isFirstSchedule && !isModified) {
      category = '1. Classical Generic Ayurvedic Medicine';
      statute = 'Drugs & Cosmetics Act 1940 §3(a) & Rule 158-B(1)';
      patentability = 'BARRED UNDER SECTION 3(p) & 3(e). Traditional Knowledge.';
      patentRiskClass = 'text-red-400 bg-red-950/40 border-red-800/60';
      absStatus = 'EXEMPT from prior SBB intimation for Indian entities/healers (BDA 2023). Foreign entities require NBA approval.';
      regulator = 'State AYUSH Licensing Authority (SLA)';
      clinicalNorms = 'No clinical trials required (Classical textual citations sufficient).';
      exportAdvice = 'Export as Dietary Supplement (US DSHEA) or Traditional Herbal Medicinal Product (EU THMPD 30-year rule).';
    } else if (isPurified) {
      category = '3. Phytopharmaceutical Drug (Rule 122-E)';
      statute = 'Drugs & Cosmetics Rules Rule 122-E, Schedule Y-A & CDSCO Norms';
      patentability = 'HIGHLY PATENTABLE. Composition-of-matter for purified fraction with ≥4 bioactive markers. Overcomes Section 3(d).';
      patentRiskClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
      absStatus = 'MANDATORY National Biodiversity Authority (NBA) approval (§6) before patent filing.';
      regulator = 'Central Drugs Standard Control Organization (CDSCO / DCGI)';
      clinicalNorms = 'Full Phase I, II, III randomized controlled trials (RCTs) required.';
      exportAdvice = 'US FDA Botanical Drug Guidance (CDER IND/NDA track) or EU Centralized MAA.';
    } else if (intendedUse === 'food') {
      category = '5. Ayurveda-Aahar (Nutraceutical / Food)';
      statute = 'FSSAI Ayurveda Aahar Regulations, 2022';
      patentability = 'Recipe non-patentable (§3(p)). Protect Brand Name, Trademarks, and Packaging Industrial Designs.';
      patentRiskClass = 'text-amber-400 bg-amber-950/40 border-amber-800/60';
      absStatus = 'Standard SBB notification for commercial procurement of wild biological resources.';
      regulator = 'Food Safety and Standards Authority of India (FSSAI)';
      clinicalNorms = 'Food safety and heavy metals testing. Strictly PROHIBITED from claiming medical cures.';
      exportAdvice = 'Export as Conventional Dietary Supplement with mandatory disclaimer statements.';
    } else if (intendedUse === 'cosmetic') {
      category = '6. Ayurvedic Cosmetic / Topical Care';
      statute = 'Drugs & Cosmetics Rules Part XIII & BIS IS 4707';
      patentability = 'Herbal recipe difficult to patent. Delivery system (micro-emulsions) or industrial applicator designs patentable.';
      patentRiskClass = 'text-purple-400 bg-purple-950/40 border-purple-800/60';
      absStatus = 'Standard SBB compliance for commercial bio-resources.';
      regulator = 'State Licensing Authority (Cosmetics Division)';
      clinicalNorms = 'Dermatological patch safety testing. No systemic therapeutic claims permitted.';
      exportAdvice = 'Compliant with US MoCRA 2022 and EU Cosmetics Regulation (EC No 1223/2009).';
    } else {
      category = '2. Patent or Proprietary (P&P) Ayurvedic Medicine';
      statute = 'Drugs & Cosmetics Act 1940 §3(h) & Rule 158-B(2)';
      patentability = 'CONDITIONAL & HIGH SECTION 3(e) RISK. Must prove synergistic enhanced efficacy beyond mere additive effect.';
      patentRiskClass = 'text-amber-400 bg-amber-950/40 border-amber-800/60';
      absStatus = 'MANDATORY prior intimation and benefit sharing agreement with State Biodiversity Board (SBB).';
      regulator = 'State AYUSH Licensing Authority (SLA)';
      clinicalNorms = 'Pilot safety data, published scientific literature, or clinical trial depending on novel solvent.';
      exportAdvice = 'US FDA NDI notification required if novelty in ingredient processing exists.';
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Statutory Classification Dossier</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            {category}
          </h3>

          <p className="text-xs text-slate-400 font-mono mb-6">
            Statutory Regime: {statute}
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patentability Posture */}
            <div className={`p-4 rounded-xl border ${patentRiskClass}`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Patents Act 1970 Assessment</span>
              </div>
              <p className="text-xs leading-relaxed font-semibold">
                {patentability}
              </p>
            </div>

            {/* Biodiversity / ABS Posture */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-emerald-400">
                <Leaf className="w-4 h-4 flex-shrink-0" />
                <span>Biodiversity Act (BDA 2023) Posture</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {absStatus}
              </p>
            </div>

            {/* Licensing & Clinical Authority */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-blue-400">
                <Stethoscope className="w-4 h-4 flex-shrink-0" />
                <span>Regulator & Clinical Norms</span>
              </div>
              <p className="text-xs font-semibold text-white mb-1">{regulator}</p>
              <p className="text-xs text-slate-400">{clinicalNorms}</p>
            </div>

            {/* Export & International Clearance */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-indigo-400">
                <Globe2 className="w-4 h-4 flex-shrink-0" />
                <span>Export & Global Clearance</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {exportAdvice}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={restartTriage}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start New Diagnostic Triage</span>
            </button>

            <button
              onClick={() => {
                setSelectedCitation({
                  act: 'The Patents Act, 1970',
                  section: 'Section 3(p) & 3(e)',
                  description: 'Statutory exclusions governing traditional knowledge and combinations in Indian patent practice.',
                  jurisdiction: 'IN',
                  url: 'https://www.ipindia.gov.in',
                });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center gap-2 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspect Verbatim Statutes</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6">
      {/* Step Indicator */}
      {step <= 4 && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Statutory Triage Wizard
              </h2>
              <p className="text-xs text-slate-400">
                Step {step} of 3 &bull; Minimal Diagnostic Ladder
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  step >= s ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Question Ladder */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Question 1: Textual Origin
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                Is your formulation recipe drawn directly from an authoritative First Schedule classical text?
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Refers to authoritative texts listed in the First Schedule of the Drugs and Cosmetics Act (e.g. <em>Charaka Samhita</em>, <em>Sushruta Samhita</em>, <em>Ashtanga Hridaya</em>, <em>Ayurvedic Formulary of India (AFI)</em>).
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('isFirstSchedule', true, 2)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">YES &mdash; Exact Classical Recipe</p>
                    <p className="text-xs text-slate-400">Manufactured strictly according to First Schedule textual proportions.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('isFirstSchedule', false, 3)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">NO &mdash; Derived, Modified, or Novel Formulation</p>
                    <p className="text-xs text-slate-400">A new combination, altered ratio, fractionated extract, or novel indication.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Question 2: Classical Formulation Modification
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                Has any ingredient ratio or delivery method been modified from the original classical text?
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                For instance: converting a classical Kwatha into a modern gel-capsule, using a synthetic solvent, or adding modern preservatives.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('isModified', false, 100)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-white">NO &mdash; Pure Classical Formulation</p>
                  <p className="text-xs text-slate-400">Exact First Schedule ingredients, proportions, and standard traditional method.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('isModified', true, 100)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-white">YES &mdash; Modified Delivery / Novel Solvent / Changed Ratio</p>
                  <p className="text-xs text-slate-400">Treated as Patent-or-Proprietary (P&P) Medicine under Rule 158-B(2).</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Question 2: Regulatory Target & Intended Use
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                What is the commercialized regulatory category for this product?
              </h3>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('intendedUse', 'medicinal', 4)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/60 hover:bg-blue-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Therapeutic / Medicinal Treatment</p>
                    <p className="text-xs text-slate-400">Formulated for diagnosis, mitigation, or cure of diseases.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('intendedUse', 'food', 100)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Dietary Health / Ayurveda-Aahar</p>
                    <p className="text-xs text-slate-400">Food supplement governed by FSSAI 2022 Regulations (No cure claims).</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('intendedUse', 'cosmetic', 100)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/60 hover:bg-purple-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Topical Care / Ayurvedic Cosmetic</p>
                    <p className="text-xs text-slate-400">Skincare or haircare governed by D&C Part XIII and BIS IS 4707.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Question 3: Chemical & Scientific Nature
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                Is this a highly purified, fractionated botanical extract containing &ge;4 standardized bioactive markers?
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Complies with CDSCO Phytopharmaceutical Drug guidelines (Rule 122-E & Schedule Y-A).
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('isPurified', true, 100)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-white">YES &mdash; Standardized Fractionated Phytopharmaceutical</p>
                  <p className="text-xs text-slate-400">Purified fraction with &ge;4 quantified chemical markers (CDSCO DCGI route).</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('isPurified', false, 100)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-white">NO &mdash; Multi-Herb Blend / Polyherbal Extract</p>
                  <p className="text-xs text-slate-400">Classified as Patent-or-Proprietary (P&P) Ayurvedic medicine.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 100 && renderDiagnosticResult()}
      </AnimatePresence>
    </div>
  );
};
