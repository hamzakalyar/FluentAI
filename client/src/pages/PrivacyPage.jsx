import React from 'react';
import LegalLayout from '../components/layout/LegalLayout';
import { 
  Database, Activity, ShieldCheck, Share2, Fingerprint, Mail, Lock, Server, Shield
} from 'lucide-react';

const PrivacyPage = () => {
  const sections = [
    { id: 'collection', title: '1. Data Collection', icon: Database },
    { id: 'usage',      title: '2. Data Usage', icon: Activity },
    { id: 'security',   title: '3. Security Standards', icon: ShieldCheck },
    { id: 'sharing',    title: '4. Third-Party Sharing', icon: Share2 },
    { id: 'rights',     title: '5. Your Rights', icon: Fingerprint },
    { id: 'contact',    title: '6. Contact Security', icon: Mail },
  ];

  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 15, 2026" sections={sections}>
      <section className="space-y-16">
        
        {/* ── Privacy Mandate Hero ── */}
        <div className="p-10 bg-teal-600 rounded-[40px] text-white shadow-2xl shadow-teal-500/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <Shield className="text-teal-200" size={20} />
                 <h3 className="text-teal-100 font-black text-xs uppercase tracking-[0.3em]">Privacy Mandate</h3>
              </div>
              <p className="text-2xl font-black leading-tight max-w-2xl">
                FluentAI is built on a "Privacy First" architecture. We adhere to strict HIPAA standards for PHI and ensure your voice data is encrypted at the highest institutional grade.
              </p>
           </div>
        </div>

        {/* ── 1. Data Collection ── */}
        <div id="collection" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
               <Database size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">1. Data Inventory</h2>
          </div>
          
          <div className="grid gap-4">
            {[
              { t: 'Account Identity', d: 'Professional credentials, institutional affiliation, and contact metadata.', icon: Server },
              { t: 'Acoustic Streams', d: 'Audio recordings provided for high-precision waveform analysis.', icon: Activity },
              { t: 'Clinical Metadata', d: 'AI-extracted metrics such as syllable rate and pause intervals.', icon: Fingerprint }
            ].map((item, i) => (
               <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white flex items-start gap-6 hover:border-teal-100 hover:shadow-lg hover:shadow-teal-900/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                     <item.icon size={18} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 mb-1">{item.t}</p>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.d}</p>
                  </div>
               </div>
            ))}
          </div>
        </div>

        {/* ── 2. Data Usage ── */}
        <div id="usage" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
               <Activity size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">2. Purpose of Processing</h2>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed font-medium mb-6">
            We process data exclusively for clinical assessment purposes. This includes generating 
            fluency reports, providing real-time practice feedback, and facilitating 
            longitudinal progress tracking for Speech-Language Pathologists.
          </p>
        </div>

        {/* ── 3. Security Standards (The Matrix) ── */}
        <div id="security" className="scroll-mt-32 p-10 bg-slate-900 rounded-[40px] text-white shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
               <ShieldCheck size={20} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">3. Security Matrix</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
             {[
                { t: 'At-Rest Encryption', d: 'Clinical data is stored using AES-256 institutional standards.', icon: Lock },
                { t: 'In-Transit Security', d: 'All data streams utilize TLS 1.3 encrypted tunnels.', icon: Activity },
                { t: 'Access Control', d: 'Multi-factor authentication and RBAC for institutional users.', icon: Shield },
                { t: 'Regulatory Compliance', d: 'HIPAA and SOC2 Type II compliant data centers.', icon: ShieldCheck }
             ].map(item => (
                <div key={item.t} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/40 transition-colors">
                   <item.icon size={16} className="text-teal-400 mb-4" />
                   <p className="font-black text-white text-sm mb-2">{item.t}</p>
                   <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.d}</p>
                </div>
             ))}
          </div>
        </div>

        {/* ── 4. Sharing & Rights ── */}
        <div className="grid md:grid-cols-2 gap-8">
          <div id="sharing" className="scroll-mt-32 p-8 rounded-[32px] border border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3 mb-6">
               <Share2 size={18} className="text-teal-600" />
               <h2 className="text-xl font-black text-slate-900 tracking-tight">4. Third-Party Policy</h2>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              We do not monetize your acoustic data. Information is only shared with authorized medical institutions or primary clinicians as part of an active treatment plan.
            </p>
          </div>

          <div id="rights" className="scroll-mt-32 p-8 rounded-[32px] border border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3 mb-6">
               <Fingerprint size={18} className="text-teal-600" />
               <h2 className="text-xl font-black text-slate-900 tracking-tight">5. User Agency</h2>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              You maintain the right to audit your clinical recordings, correct diagnostic metadata, or request permanent deletion of your profile and voice data.
            </p>
          </div>
        </div>

        {/* ── 6. Contact ── */}
        <div id="contact" className="scroll-mt-32 flex items-center justify-between p-10 bg-white border border-slate-200 rounded-[32px] shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Security Questions?</h2>
            <p className="text-slate-500 text-sm font-medium">Contact our Data Protection Officer</p>
          </div>
          <a href="mailto:privacy@fluentai.clinic" className="px-6 py-3 rounded-xl bg-teal-50 text-teal-600 font-black text-sm hover:bg-teal-600 hover:text-white transition-all">
             privacy@fluentai.clinic
          </a>
        </div>

      </section>
    </LegalLayout>
  );
};

export default PrivacyPage;
