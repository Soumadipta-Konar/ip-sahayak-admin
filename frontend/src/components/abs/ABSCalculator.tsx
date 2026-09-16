'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Leaf, Info } from 'lucide-react';

export const ABSCalculator: React.FC = () => {
  const [turnover, setTurnover] = useState<number>(25000000); // 2.5 Crore default
  const [entityType, setEntityType] = useState<'INDIAN_AYUSH' | 'INDIAN_COMMERCIAL' | 'FOREIGN'>('INDIAN_COMMERCIAL');
  const [isCultivated, setIsCultivated] = useState<boolean>(false);

  // NBA Benefit Sharing Regulations calculation
  const calculateABS = () => {
    if (entityType === 'INDIAN_AYUSH') {
      return {
        rate: '0% (Statutory Exemption)',
        amount: 0,
        status: 'EXEMPT under BDA (Amendment) Act 2023',
        description: 'Codified traditional knowledge users and AYUSH registered vaidyas/practitioners are exempt from prior SBB intimation and ABS fee sharing.',
      };
    }

    if (isCultivated) {
      return {
        rate: '0% (Cultivated Bio-resource Exemption)',
        amount: 0,
        status: 'EXEMPT from ABS Fee under 2023 Amendments',
        description: 'Cultivated medicinal plants with authentic cultivation certificates are exempt from ABS benefit-sharing levies.',
      };
    }

    // Commercial turnover slabs under NBA regulations:
    let rate = 0;
    let rateStr = '';

    if (turnover <= 10000000) {
      rate = 0.001;
      rateStr = '0.1%';
    } else if (turnover <= 30000000) {
      rate = 0.002;
      rateStr = '0.2%';
    } else {
      rate = 0.005;
      rateStr = '0.5%';
    }

    const calculatedAmount = turnover * rate;

    return {
      rate: rateStr,
      amount: calculatedAmount,
      status: entityType === 'FOREIGN' ? 'Mandatory National Biodiversity Authority (NBA) Approval (§6)' : 'Mandatory State Biodiversity Board (SBB) Intimation',
      description: `Subject to ${rateStr} benefit sharing on ex-factory annual commercial sales of biological resources.`,
    };
  };

  const result = calculateABS();

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            <Calculator className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#002147]">
              NBA / SBB Access & Benefit Sharing (ABS) Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Compute statutory benefit-sharing liability under the Biological Diversity (Amendment) Act, 2023
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Annual Ex-Factory Commercial Turnover (in INR ₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-bold">₹</span>
              <input
                type="number"
                value={turnover}
                onChange={(e) => setTurnover(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              ₹ {turnover.toLocaleString('en-IN')} ({ (turnover / 10000000).toFixed(2) } Crore)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Applicant Legal Entity Category
              </label>
              <select
                value={entityType}
                onChange={(e: any) => setEntityType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white"
              >
                <option value="INDIAN_COMMERCIAL">Indian Commercial Manufacturer (MSME / Pvt Ltd)</option>
                <option value="INDIAN_AYUSH">Ayurvedic Practitioner / Codified Healer (Individual)</option>
                <option value="FOREIGN">Foreign Entity / NRI / Non-Indian Control</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Biological Resource Provenance
              </label>
              <select
                value={isCultivated ? 'true' : 'false'}
                onChange={(e) => setIsCultivated(e.target.value === 'true')}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white"
              >
                <option value="false">Wild Harvested Bio-Resource (Forest / Open Source)</option>
                <option value="true">Certified Cultivated Medicinal Plant (Exempt)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculation Result */}
        <motion.div
          layout
          className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Statutory ABS Liability Rate</span>
              <p className="text-2xl font-black text-emerald-800 font-mono">{result.rate}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimated Annual Benefit Sharing</span>
              <p className="text-2xl font-black text-[#002147] font-mono">
                ₹ {result.amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>{result.status}</span>
            </div>
            <p className="text-slate-600">{result.description}</p>
          </div>
        </motion.div>

        {/* Regulatory Citation Notice */}
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">Statutory Governing Provisions:</p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
            <li>Biological Diversity (Amendment) Act, 2023 &bull; Sections 3, 6, 7.</li>
            <li>Guidelines on Access to Biological Resources and Associated Knowledge and Benefits Sharing Regulations.</li>
            <li>Commercial sales up to ₹1 Cr = 0.1%, ₹1–3 Cr = 0.2%, Above ₹3 Cr = 0.5%.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
