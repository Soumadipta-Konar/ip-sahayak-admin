'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, PhoneCall, Mail, CheckCircle2, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const FacilitatorBridge: React.FC = () => {
  const { isEscalationOpen, setIsEscalationOpen } = useAppStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'P&P Medicine Patentability',
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
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
        >
          <button
            onClick={() => setIsEscalationOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Escalation Dossier Dispatched</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                A registered Ministry of AYUSH empaneled IP Attorney has been alerted. You will receive a callback or email within 24 business hours.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Connect with AYUSH IP Facilitator</h3>
                  <p className="text-xs text-slate-400">
                    Pro-bono IP and Patent Attorney Bridge for high-risk statutory triage
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name / Entity</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vaidya Rajesh Sharma / AyurPharm Labs"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@ayushclinic.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Formulation / Dispute Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Section 3(p) TKDL Rejection Response">Section 3(p) TKDL Rejection Response</option>
                    <option value="Section 3(e) Synergistic Evidence Filing">Section 3(e) Synergistic Evidence Filing</option>
                    <option value="NBA / SBB Access & Benefit Sharing Filing">NBA / SBB Access & Benefit Sharing Filing</option>
                    <option value="Ayurveda-Aahar FSSAI Compliance">Ayurveda-Aahar FSSAI Compliance</option>
                    <option value="International Patent Filing (PCT / US FDA)">International Patent Filing (PCT / US FDA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Summary of Ingredients / Claim</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Provide key herbs, dosage form, or specific rejection notice..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-lg shadow-amber-950"
                  >
                    Submit for Official IP Consultation
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
