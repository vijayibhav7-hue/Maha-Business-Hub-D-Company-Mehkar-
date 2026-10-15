import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Share2, Printer, Sparkles, MessageSquare, Download, Layers } from 'lucide-react';

interface CampaignAssetsModalProps {
  onClose: () => void;
}

export const CampaignAssetsModal: React.FC<CampaignAssetsModalProps> = ({ onClose }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const PROMO_TEMPLATES = [
    {
      title: 'स्थानिक बाजारपेठ प्रचार संदेश (Village WhatsApp Groups)',
      text: `🚩 *आपला बाजार, आपले दुकानदार, आता डिजिटल!* 🚩\n\nनमस्कार मेहकर व लोणार वासियांनो! आता आपल्या परिसरातील सर्व नामांकित दुकानांच्या दैनिक सवलती आणि डिस्काउंट कूपन मिळवा तुमच्या मोबाईलवर!\n\n✅ ५G मोबाईलवर मोफत टेम्पर्ड ग्लास\n✅ कापड दुकानांवर १५% सवलत\n✅ खते व कृषी साहित्यावर विशेष डिस्काउंट\n\n📲 आताच महा बिझनेस हब (D COMPANY) ॲपला भेट द्या आणि कूपन क्लेम करा:\nhttps://maha-business-hub-d-company-mehkar.vercel.app/`,
    },
    {
      title: 'दुकानदार ऑनबोर्डिंग व्हॉट्सॲप निमंत्रण (Merchant Invitation)',
      text: `🏪 *मेहकर व लोणार मधील सर्व व्यापारी बांधवांसाठी खूशखबर!* 🏪\n\nतुमचे दुकान आता ऑनलाईन करा D COMPANY सोबत!\n\n✨ AI रील्स आणि व्हॉट्सॲप पोस्टर्स\n📍 Google Maps वर दुकानाचे लोकेशन\n🎫 ग्राहकांसाठी डिजिटल शॉपिंग पास कूपन्स\n\nअधिक माहितीसाठी संपर्क करा:\n📱 D COMPANY Mehkar: 9607636444\n📧 dcompany1410@gmail.com`,
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                D COMPANY Campaign Assets
              </span>
              <h2 className="text-xl font-black text-white">प्रचार साहित्य व डिजिटल अॅसेट्स</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Counter Standee Concept */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>१. काउंटर अकॅक्रेलिक D-QR स्टँडी संकल्पना</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Print Ready Concept
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Standee Preview Card */}
              <div className="bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-5 rounded-2xl shadow-lg text-center space-y-3 border-4 border-slate-900">
                <div className="text-[10px] font-black uppercase tracking-widest bg-slate-950 text-amber-400 px-2.5 py-1 rounded-md inline-block">
                  D COMPANY MEHKAR
                </div>
                <h4 className="font-black text-lg text-slate-950">स्कॅन करा व कूपन मिळवा!</h4>
                <div className="bg-white p-3 rounded-xl inline-block shadow-md mx-auto border-2 border-slate-950">
                  <div className="w-24 h-24 bg-slate-900 text-amber-400 font-mono text-xs flex items-center justify-center rounded-lg text-center font-bold p-2">
                    [SHOP D-QR CODE HERE]
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-900">
                  Maha Business Hub · Mehkar & Lonar
                </p>
              </div>

              {/* Specs & Description */}
              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900">वैशिष्ट्ये व छपाई माहिती:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>उंच दर्जाचा ५ मिमी अकॅक्रेलिक बोर्ड</li>
                  <li>वॉटरप्रूफ आणि ड्युरेबल फिनिशिंग</li>
                  <li>डायनॅमिक QR कोड - काउंटरवर ग्राहकांसाठी थेट स्कॅनिंग</li>
                  <li>दुकानदाराच्या दैनंदिन ऑफर्स थेट बदलण्याची सोय</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://wa.me/919607636444?text=Hello%20D%20Company!%20I%20want%20to%20order%20Counter%20D-QR%20Standee."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>स्टँडीची ऑर्डर द्या (₹499)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Ready WhatsApp Broadcast Templates */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>२. व्हॉट्सॲप ब्रॉडकास्ट व सोशल मीडिया मेसेज टेम्पलेट्स</span>
            </h3>

            <div className="space-y-3">
              {PROMO_TEMPLATES.map((tmpl, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">{tmpl.title}</h4>
                    <button
                      onClick={() => handleCopy(tmpl.text, idx)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIdx === idx ? 'कॉपी झाले!' : 'मेसेज कॉपी करा'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-sans text-slate-700 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                    {tmpl.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Brand Info Footer */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <strong className="font-bold block">D COMPANY, MEHKAR</strong>
              <span className="text-slate-600 text-[11px]">अधिकृत डिजिटल पार्टनर · संपर्क: 9607636444 · dcompany1410@gmail.com</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs shrink-0"
            >
              बंद करा
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
