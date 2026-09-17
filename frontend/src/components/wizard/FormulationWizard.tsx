'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  MessageSquare,
  Building2,
  Printer
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ClassificationResult } from '@/lib/types';

export const FormulationWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { setSelectedCitation, setClassificationState } = useAppStore();

  const recordAnswer = (key: string, value: any, nextStep: number) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);
    setStep(nextStep);

    if (nextStep === 100) {
      calculateAndCommitDossier(updatedAnswers);
    }
  };

  const restartTriage = () => {
    setAnswers({});
    setStep(1);
  };

  const calculateAndCommitDossier = async (ans: Record<string, any>) => {
    const isFirstSchedule = ans.isFirstSchedule === true;
    const isModified = ans.isModified === true;
    const intendedUse = ans.intendedUse;
    const isPurified = ans.isPurified === true;

    // Send state to backend /classify endpoint (Task 3 from notes.txt)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      await fetch(`${apiBase}/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_first_schedule: isFirstSchedule,
          is_modified: isModified,
          intended_use: intendedUse === 'food' ? 'food' : 'medicinal',
          is_purified: isPurified,
        }),
      });
    } catch (e) {
      // Graceful fallback to client deterministic evaluation if backend route is offline
    }

    let category = '';
    let statute = '';
    let patentability = '';
    let absStatus = '';
    let regulator = '';
    let clinicalNorms = '';
    let exportAdvice = '';
    let riskType: ClassificationResult['section_3_risk'] = 'CONDITIONAL_SEC_3E';

    if (isFirstSchedule && !isModified) {
      category = '1. Classical Generic Ayurvedic Medicine';
      statute = 'Drugs & Cosmetics Act 1940 §3(a) & Rule 158-B(1)';
      patentability = 'STATUTORILY BARRED UNDER SECTION 3(p) & 3(e). Protected as Traditional Knowledge.';
      absStatus = 'EXEMPT from prior SBB intimation for Indian entities/healers (BDA 2023 §7). Foreign entities require NBA clearance (§6).';
      regulator = 'State AYUSH Licensing Authority (SLA)';
      clinicalNorms = 'No clinical trial required. Textual citations from First Schedule authoritative books sufficient.';
      exportAdvice = 'Export as Dietary Supplement (US DSHEA) or Traditional Herbal Medicinal Product (EU THMPD 30-year rule).';
      riskType = 'HIGH_BAR_SEC_3P';
    } else if (isPurified) {
      category = '3. Phytopharmaceutical Drug (Rule 122-E)';
      statute = 'Drugs & Cosmetics Rules Rule 122-E, Schedule Y-A & CDSCO Norms';
      patentability = 'HIGHLY PATENTABLE. Composition-of-matter for purified fraction with ≥4 bioactive markers. Overcomes Section 3(d).';
      absStatus = 'MANDATORY National Biodiversity Authority (NBA) approval (§6) before applying for patent grant.';
      regulator = 'Central Drugs Standard Control Organization (CDSCO / DCGI)';
      clinicalNorms = 'Full Phase I, II, III randomized controlled clinical trials (RCTs) required.';
      exportAdvice = 'US FDA Botanical Drug Guidance (CDER IND/NDA track) or EU Centralized MAA.';
      riskType = 'PATENTABLE_SEC_3D';
    } else if (intendedUse === 'food') {
      category = '5. Ayurveda-Aahar (Nutraceutical / Food)';
      statute = 'FSSAI Ayurveda Aahar Regulations, 2022';
      patentability = 'Recipe non-patentable (§3(p)). Protect Brand Name, Trademarks, and Packaging Industrial Designs.';
      absStatus = 'Standard SBB notification for commercial procurement of wild biological resources.';
      regulator = 'Food Safety and Standards Authority of India (FSSAI)';
      clinicalNorms = 'Food safety and heavy metals testing. Strictly PROHIBITED from claiming therapeutic cures.';
      exportAdvice = 'Export as Conventional Dietary Supplement with mandatory disclaimer statements.';
      riskType = 'NOT_APPLICABLE';
    } else if (intendedUse === 'cosmetic') {
      category = '6. Ayurvedic Cosmetic / Topical Care';
      statute = 'Drugs & Cosmetics Rules Part XIII & BIS IS 4707';
      patentability = 'Herbal recipe difficult to patent. Delivery system (micro-emulsions) or industrial applicator designs patentable.';
      absStatus = 'Standard SBB compliance for commercial bio-resources.';
      regulator = 'State Licensing Authority (Cosmetics Division)';
      clinicalNorms = 'Dermatological patch safety testing. No systemic therapeutic claims permitted.';
      exportAdvice = 'Compliant with US MoCRA 2022 and EU Cosmetics Regulation (EC No 1223/2009).';
      riskType = 'NOT_APPLICABLE';
    } else {
      category = '2. Patent or Proprietary (P&P) Ayurvedic Medicine';
      statute = 'Drugs & Cosmetics Act 1940 §3(h) & Rule 158-B(2)';
      patentability = 'CONDITIONAL & HIGH SECTION 3(e) RISK. Must prove synergistic enhanced efficacy beyond mere additive effect.';
      absStatus = 'MANDATORY prior intimation and benefit sharing agreement with State Biodiversity Board (SBB).';
      regulator = 'State AYUSH Licensing Authority (SLA)';
      clinicalNorms = 'Pilot safety data, published scientific literature, or clinical trial depending on novel solvent.';
      exportAdvice = 'US FDA NDI notification required if novelty in ingredient processing exists.';
      riskType = 'CONDITIONAL_SEC_3E';
    }

    const dossier: Partial<ClassificationResult> = {
      category,
      title: category,
      statute,
      authority: regulator,
      patentability,
      patentRiskDescription: patentability,
      section_3_risk: riskType,
      abs_posture: absStatus,
      clinical_requirements: clinicalNorms,
      export_clearance: { summary: exportAdvice },
    };

    setClassificationState(dossier);
  };

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
      patentRiskClass = 'text-red-800 bg-red-50 border-red-200';
      absStatus = 'EXEMPT from prior SBB intimation for Indian entities/healers (BDA 2023). Foreign entities require NBA approval.';
      regulator = 'State AYUSH Licensing Authority (SLA)';
      clinicalNorms = 'No clinical trials required (Classical textual citations sufficient).';
      exportAdvice = 'Export as Dietary Supplement (US DSHEA) or Traditional Herbal Medicinal Product (EU THMPD 30-year rule).';
    } else if (isPurified) {
      category = '3. Phytopharmaceutical Drug (Rule 122-E)';
      statute = 'Drugs & Cosmetics Rules Rule 122-E, Schedule Y-A & CDSCO Norms';
      patentability = 'HIGHLY PATENTABLE. Composition-of-matter for purified fraction with ≥4 bioactive markers. Overcomes Section 3(d).';
      patentRiskClass = 'text-emerald-800 bg-emerald-50 border-emerald-200';
      absStatus = 'MANDATORY National Biodiversity Authority (NBA) approval (§6) before patent filing.';
      regulator = 'Central Drugs Standard Control Organization (CDSCO / DCGI)';
      clinicalNorms = 'Full Phase I, II, III randomized controlled trials (RCTs) required.';
      exportAdvice = 'US FDA Botanical Drug Guidance (CDER IND/NDA track) or EU Centralized MAA.';
    } else if (intendedUse === 'food') {
      category = '5. Ayurveda-Aahar (Nutraceutical / Food)';
      statute = 'FSSAI Ayurveda Aahar Regulations, 2022';
      patentability = 'Recipe non-patentable (§3(p)). Protect Brand Name, Trademarks, and Packaging Industrial Designs.';
      patentRiskClass = 'text-amber-800 bg-amber-50 border-amber-200';
      absStatus = 'Standard SBB notification for commercial procurement of wild biological resources.';
      regulator = 'Food Safety and Standards Authority of India (FSSAI)';
      clinicalNorms = 'Food safety and heavy metals testing. Strictly PROHIBITED from claiming medical cures.';
      exportAdvice = 'Export as Conventional Dietary Supplement with mandatory disclaimer statements.';
    } else if (intendedUse === 'cosmetic') {
      category = '6. Ayurvedic Cosmetic / Topical Care';
      statute = 'Drugs & Cosmetics Rules Part XIII & BIS IS 4707';
      patentability = 'Herbal recipe difficult to patent. Delivery system (micro-emulsions) or industrial applicator designs patentable.';
      patentRiskClass = 'text-purple-800 bg-purple-50 border-purple-200';
      absStatus = 'Standard SBB compliance for commercial bio-resources.';
      regulator = 'State Licensing Authority (Cosmetics Division)';
      clinicalNorms = 'Dermatological patch safety testing. No systemic therapeutic claims permitted.';
      exportAdvice = 'Compliant with US MoCRA 2022 and EU Cosmetics Regulation (EC No 1223/2009).';
    } else {
      category = '2. Patent or Proprietary (P&P) Ayurvedic Medicine';
      statute = 'Drugs & Cosmetics Act 1940 §3(h) & Rule 158-B(2)';
      patentability = 'CONDITIONAL & HIGH SECTION 3(e) RISK. Must prove synergistic enhanced efficacy beyond mere additive effect.';
      patentRiskClass = 'text-amber-800 bg-amber-50 border-amber-200';
      absStatus = 'MANDATORY prior intimation and benefit sharing agreement with State Biodiversity Board (SBB).';
      regulator = 'State AYUSH Licensing Authority (SLA)';
      clinicalNorms = 'Pilot safety data, published scientific literature, or clinical trial depending on novel solvent.';
      exportAdvice = 'US FDA NDI notification required if novelty in ingredient processing exists.';
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Statutory Classification Complete &bull; Case Dossier Generated</span>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#002147] text-xs font-bold border border-blue-200 flex items-center gap-1.5 shadow-2xs transition-colors print:hidden"
              title="Save or Print Statutory Dossier as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-blue-700" />
              <span>Download PDF Dossier</span>
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#002147] mb-1">
            {category}
          </h3>

          <p className="text-xs text-slate-500 font-mono mb-6">
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
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-emerald-800">
                <Leaf className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Biodiversity Act (BDA 2023) Posture</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {absStatus}
              </p>
            </div>

            {/* Licensing & Clinical Authority */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-blue-900">
                <Stethoscope className="w-4 h-4 flex-shrink-0 text-blue-700" />
                <span>Regulator & Clinical Norms</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mb-1">{regulator}</p>
              <p className="text-xs text-slate-600">{clinicalNorms}</p>
            </div>

            {/* Export & International Clearance */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-indigo-900">
                <Globe2 className="w-4 h-4 flex-shrink-0 text-indigo-700" />
                <span>Export & Global Clearance</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {exportAdvice}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <button
              type="button"
              onClick={restartTriage}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start New Diagnostic Triage</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCitation({
                    act: 'The Patents Act, 1970',
                    section: 'Section 3(p) & 3(e)',
                    description: 'Statutory exclusions governing traditional knowledge and combinations in Indian patent practice.',
                    jurisdiction: 'IN',
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-300"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Statute Inspector</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002147] text-xs font-bold border border-blue-300 shadow-2xs flex items-center gap-2 transition-all"
                title="Download or Print Statutory Dossier as PDF"
              >
                <Printer className="w-4 h-4 text-blue-700" />
                <span>Download / Print PDF</span>
              </button>

              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Proceed to Bhashini AI Copilot with this Case Dossier &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6">
      {/* Header Description */}
      <div className="mb-6 text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 mb-2">
          Step 1: Statutory Formulation Classification
        </span>
        <h2 className="text-2xl font-black text-[#002147]">
          Ayurvedic Product Triage Wizard
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">
          Answer 3 quick statutory questions to determine whether your product is barred under Section 3(p) or patentable under Section 3(d).
        </p>
      </div>

      {/* Step Indicator */}
      {step <= 4 && (
        <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-[#002147]">
              <Sparkles className="w-4 h-4 text-[#002147]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#002147] uppercase tracking-wider">
                Question {step} of 3
              </p>
              <p className="text-[11px] text-slate-500">
                Diagnostic Decision Tree
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-10 rounded-full transition-colors ${
                  step >= s ? 'bg-[#002147]' : 'bg-slate-200'
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
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Question 1: Textual Origin
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Is your formulation recipe drawn directly from an authoritative First Schedule classical text?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Refers to authoritative texts listed in the First Schedule of the Drugs and Cosmetics Act (e.g. <em>Charaka Samhita</em>, <em>Sushruta Samhita</em>, <em>Ashtanga Hridaya</em>, <em>Ayurvedic Formulary of India (AFI)</em>).
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('isFirstSchedule', true, 2)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">YES &mdash; Exact Classical Recipe</p>
                    <p className="text-xs text-slate-500">Manufactured strictly according to First Schedule textual proportions.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('isFirstSchedule', false, 3)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-200">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">NO &mdash; Derived, Modified, or Novel Formulation</p>
                    <p className="text-xs text-slate-500">A new combination, altered ratio, fractionated extract, or novel indication.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Question 2: Classical Formulation Modification
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Has any ingredient ratio or delivery method been modified from the original classical text?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                For instance: converting a classical Kwatha into a modern gel-capsule, using a synthetic solvent, or adding modern preservatives.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('isModified', false, 100)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">NO &mdash; Pure Classical Formulation</p>
                  <p className="text-xs text-slate-500">Exact First Schedule ingredients, proportions, and standard traditional method.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('isModified', true, 100)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 hover:bg-amber-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">YES &mdash; Modified Delivery / Novel Solvent / Changed Ratio</p>
                  <p className="text-xs text-slate-500">Treated as Patent-or-Proprietary (P&P) Medicine under Rule 158-B(2).</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Question 2: Regulatory Target & Intended Use
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                What is the commercialized regulatory category for this product?
              </h3>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('intendedUse', 'medicinal', 4)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Therapeutic / Medicinal Treatment</p>
                    <p className="text-xs text-slate-500">Formulated for diagnosis, mitigation, or cure of diseases.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('intendedUse', 'food', 100)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 hover:bg-amber-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Dietary Health / Ayurveda-Aahar</p>
                    <p className="text-xs text-slate-500">Food supplement governed by FSSAI 2022 Regulations (No cure claims).</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('intendedUse', 'cosmetic', 100)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-600 hover:bg-purple-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Topical Care / Ayurvedic Cosmetic</p>
                    <p className="text-xs text-slate-500">Skincare or haircare governed by D&C Part XIII and BIS IS 4707.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Question 3: Chemical & Scientific Nature
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Is this a highly purified, fractionated botanical extract containing &ge;4 standardized bioactive markers?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Complies with CDSCO Phytopharmaceutical Drug guidelines (Rule 122-E & Schedule Y-A).
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => recordAnswer('isPurified', true, 100)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">YES &mdash; Standardized Fractionated Phytopharmaceutical</p>
                  <p className="text-xs text-slate-500">Purified fraction with &ge;4 quantified chemical markers (CDSCO DCGI route).</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => recordAnswer('isPurified', false, 100)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 hover:bg-amber-50/50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">NO &mdash; Multi-Herb Blend / Polyherbal Extract</p>
                  <p className="text-xs text-slate-500">Classified as Patent-or-Proprietary (P&P) Ayurvedic medicine.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 100 && renderDiagnosticResult()}
      </AnimatePresence>
    </div>
  );
};
