import React, { useState } from 'react';
import { Send, MessageSquare, Users, Sparkles, Check, Copy, X, Megaphone, Shield } from 'lucide-react';
import { Business, Customer, Lead } from '../types';

interface WhatsAppCampaignCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  shops: Business[];
  customers: Customer[];
  leads: Lead[];
}

export const WhatsAppCampaignCenterModal: React.FC<WhatsAppCampaignCenterModalProps> = ({
  isOpen,
  onClose,
  shops,
  customers,
  leads,
}) => {
  const [targetAudience, setTargetAudience] = useState<'CUSTOMERS' | 'MERCHANTS' | 'LEADS'>('CUSTOMERS');
  const [campaignType, setCampaignType] = useState<'OFFERS' | 'FESTIVAL' | 'RENEWAL' | 'CUSTOM'>('OFFERS');
  const [customMsg, setCustomMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Broadcast Copy based on selected target & campaign
  let generatedMsg = '';
  if (campaignType === 'OFFERS') {
    generatedMsg = `🚩 *महा बिझनेस हब — विशेष ऑफर अलर्ट!* 🚩\n\nनमस्कार! मेहकर व परिसरातील सर्वोत्कृष्ट दुकानांमधील आजच्या खास सवलत ऑफर्स आणि डिस्काउंट कूपन उपलब्ध आहेत.\n\n👉 *तुमचा शॉपिंग पास व कूपन येथे पहा:* https://maha-business-hub-d-company-mehkar.vercel.app/\n\nD COMPANY, मेहकर`;
  } else if (campaignType === 'FESTIVAL') {
    generatedMsg = `✨ *सण व उत्सवाच्या हार्दिक शुभेच्छा!* ✨\n\nदिवाळी व लग्नसराईच्या निमित्ताने महा बिझनेस हबवरील सहभागी दुकानांमध्ये मिळवा तब्बल ५०% पर्यंत सूट आणि मोफत भेटवस्तू!\n\nआजच तुमच्या जवळच्या दुकानाला भेट द्या.\n\nडी कंपनी ग्रोथ पार्टनर, मेहकर | फोन: ९६०७६३६४४४`;
  } else if (campaignType === 'RENEWAL') {
    generatedMsg = `📢 *डी कंपनी - डिजिटल पॅकेज नूतनीकरण (Renewal Alert)* 📢\n\nसस्नेह नमस्कार! आपल्या दुकानाचे डिजिटल मार्केटिंग आणि महा बिझनेस हब लिस्टिंग नूतनीकरणाची मुदत जवळ आली आहे.\n\nआपला व्यवसाय ऑनलाईन चालू ठेवण्यासाठी आणि ग्राहकांपर्यंत पोहोचण्यासाठी आजच नूतनीकरण करा.\n\nसंपर्क: ९६०७६३६४४४ / dcompany1410@gmail.com`;
  } else {
    generatedMsg = customMsg || `नमस्कार! महा बिझनेस हब, मेहकर तर्फे विशेष संदेश...`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchBroadcast = () => {
    // Open WhatsApp Web/App with message
    const encoded = encodeURIComponent(generatedMsg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto font-marathi">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              व्हॉट्सॲप डिजिटल कॅम्पेन व ब्रॉडकास्ट सेंटर
            </h2>
            <p className="text-xs text-gray-500">
              ग्राहक आणि दुकानदारांना १-क्लिकमध्ये मराठी प्रमोशनल मेसेज पाठवा.
            </p>
          </div>
        </div>

        {/* Target Audience Tabs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              कोणाला मेसेज पाठवायचा आहे? (Target Audience)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTargetAudience('CUSTOMERS')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                  targetAudience === 'CUSTOMERS'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>नोंदणीकृत ग्राहक ({customers.length})</span>
              </button>

              <button
                onClick={() => setTargetAudience('MERCHANTS')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                  targetAudience === 'MERCHANTS'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>सहभागी दुकानदार ({shops.length})</span>
              </button>

              <button
                onClick={() => setTargetAudience('LEADS')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                  targetAudience === 'LEADS'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>कूपन दावेदार ({leads.length})</span>
              </button>
            </div>
          </div>

          {/* Campaign Preset Choice */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              मोहिमेचा प्रकार निवडा (Campaign Type)
            </label>
            <select
              value={campaignType}
              onChange={(e) => setCampaignType(e.target.value as any)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="OFFERS">🔥 नवीन ऑफर्स आणि कूपन अपडेट्स</option>
              <option value="FESTIVAL">✨ सण व उत्सव विशेष मोहिमा</option>
              <option value="RENEWAL">⏰ दुकानदार नूतनीकरण (Renewal Alert)</option>
              <option value="CUSTOM">✍️ कस्टम मेसेज (Custom Message)</option>
            </select>
          </div>

          {campaignType === 'CUSTOM' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                तुमचा कस्टम मराठी मेसेज लिहा:
              </label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="येथे तुमचा मेसेज लिहा..."
                className="w-full h-24 p-3 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Message Preview Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                मेसेज प्रिव्ह्यू (WhatsApp Ready Copy):
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'कॉपी झाले!' : 'कॉपी करा'}
              </button>
            </div>
            <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans bg-white p-2.5 rounded-lg border border-emerald-100">
              {generatedMsg}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              रद्द करा
            </button>
            <button
              onClick={handleLaunchBroadcast}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              व्हॉट्सॲप उघडा व मेसेज पाठवा (Broadcast Now)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
