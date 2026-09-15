'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const FacilitatorBridge: React.FC = () => {
  const { isEscalationOpen, setIsEscalationOpen } = useAppStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Section 3(p) TKDL Rejection Response',
    notes: '',
  });

  if (!isEscalationOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsEscalationOpen(false);
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
        >
          <button
            type="button"
            onClick={() => setIsEscalationOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Escalation Dossier Dispatched</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                A registered Ministry of AYUSH empaneled IP Attorney has been alerted. You will receive a callback or email within 24 business hours.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#002147]">Connect with AYUSH IP Facilitator</h3>
                  <p className="text-xs text-slate-600">
                    Pro-bono IP and Patent Attorney Bridge for high-risk statutory triage
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Entity</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vaidya Rajesh Sharma / AyurPharm Labs"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@ayushclinic.in"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Formulation / Dispute Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white"
                  >
                    <option value="Section 3(p) TKDL Rejection Response">Section 3(p) TKDL Rejection Response</option>
                    <option value="Section 3(e) Synergistic Evidence Filing">Section 3(e) Synergistic Evidence Filing</option>
                    <option value="NBA / SBB Access & Benefit Sharing Filing">NBA / SBB Access & Benefit Sharing Filing</option>
                    <option value="Ayurveda-Aahar FSSAI Compliance">Ayurveda-Aahar FSSAI Compliance</option>
                    <option value="International Patent Filing (PCT / US FDA)">International Patent Filing (PCT / US FDA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Summary of Ingredients / Claim</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Provide key herbs, dosage form, or specific rejection notice..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002147] focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Submit for Official IP Facilitation
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
