import React from 'react';
import LegalLayout from '../components/layout/LegalLayout';
import { 
  FileCheck, ShieldAlert, UserCircle, Zap, Copyright, Scale 
} from 'lucide-react';

const TermsPage = () => {
  const sections = [
    { id: 'acceptance', title: '1. Acceptance', icon: FileCheck },
    { id: 'disclaimer', title: '2. Clinical Disclaimer', icon: ShieldAlert },
    { id: 'accounts',   title: '3. User Accounts', icon: UserCircle },
    { id: 'usage',      title: '4. Usage Guidelines', icon: Zap },
    { id: 'property',   title: '5. Intellectual Property', icon: Copyright },
    { id: 'liability',  title: '6. Limitation of Liability', icon: Scale },
  ];

  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 15, 2026" sections={sections}>
      <section className="space-y-16">
        
        {/* ── 1. Acceptance ── */}
        <div id="acceptance" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
               <FileCheck size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">1. Acceptance of Terms</h2>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            By accessing and using FluentAI (the "Service"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the platform. These terms apply to all 
            clinicians, patients, and institutional administrators.
          </p>
        </div>

        {/* ── 2. Clinical Disclaimer ── */}
        <div id="disclaimer" className="scroll-mt-32 p-10 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-teal-500/20 transition-all duration-700" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
               <ShieldAlert size={20} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">2. Clinical Disclaimer</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-teal-400 font-black text-xl leading-snug">
              FluentAI is a clinical decision support tool. It is not intended to replace the professional judgment of a licensed Speech-Language Pathologist.
            </p>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              All AI-generated fluency scores and acoustic analytics are provided for informational purposes. They must be reviewed by a qualified professional before being incorporated into a patient's formal treatment plan or diagnostic record.
            </p>
          </div>
        </div>

        {/* ── 3. User Accounts ── */}
        <div id="accounts" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
               <UserCircle size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">3. User Accounts</h2>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            You are responsible for maintaining the security of your account credentials. 
            For clinical users, you must ensure that your account is used in compliance with institutional 
            data security policies and local healthcare privacy laws.
          </p>
        </div>

        {/* ── 4. Usage Guidelines ── */}
        <div id="usage" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
               <Zap size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">4. Usage Guidelines</h2>
          </div>
          
          <div className="grid gap-4">
            {[
              { t: 'No Decompilation', d: 'Reverse engineering or extraction of underlying AI models is strictly prohibited.' },
              { t: 'Ethical Recording', d: 'Audio recordings must only be uploaded with explicit informed consent.' },
              { t: 'Compliance', d: 'System use must adhere to all applicable HIPAA and medical privacy standards.' }
            ].map((item, i) => (
               <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 flex gap-6 group hover:bg-white hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/5 transition-all">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xs font-black shrink-0">{i+1}</div>
                  <div>
                    <p className="font-black text-slate-900 mb-1">{item.t}</p>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.d}</p>
                  </div>
               </div>
            ))}
          </div>
        </div>

        {/* ── 5. Intellectual Property ── */}
        <div id="property" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
               <Copyright size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">5. Intellectual Property</h2>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            The Service, including its proprietary AI models, signal processing algorithms, 
            and visual interface, is the exclusive property of FluentAI Clinical Systems. 
            Unauthorized replication of core analytic logic is a violation of international property laws.
          </p>
        </div>

        {/* ── 6. Limitation of Liability ── */}
        <div id="liability" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
               <Scale size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">6. Limitation of Liability</h2>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            FluentAI shall not be liable for any indirect, incidental, or special damages 
            resulting from clinical reliance on AI-generated analytics. All therapeutic decisions 
            remain the sole responsibility of the treating clinician.
          </p>
        </div>

      </section>
    </LegalLayout>
  );
};

export default TermsPage;
