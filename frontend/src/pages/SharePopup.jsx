import React, { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Linkedin, Instagram, MessageCircle } from 'lucide-react';

const SharePopup = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = `${product.title} - $${product.price}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl); // Use the Clipboard API[citation:2]
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Optional: Fallback for older browsers
      // const textArea = document.createElement('textarea');
      // document.body.appendChild(textArea);
      // textArea.value = shareUrl;
      // textArea.select();
      // document.execCommand('copy');
      // document.body.removeChild(textArea);
    }
  };

  const platforms = [
    { id: 'facebook', name: 'FB', icon: Facebook, color: 'bg-blue-600', action: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { id: 'twitter', name: 'X', icon: Twitter, color: 'bg-black', action: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { id: 'linkedin', name: 'IN', icon: Linkedin, color: 'bg-blue-700', action: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { id: 'telegram', name: 'TG', icon: MessageCircle, color: 'bg-blue-500', action: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { id: 'instagram', name: 'IG', icon: Instagram, color: 'bg-gradient-to-r from-purple-600 to-pink-600', action: `#` }, // Instagram has no direct share URL
  ];

  const handlePlatformClick = (action, name) => {
    if (name === 'IG') {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied! You can now paste it into an Instagram story or post.');
    } else {
      window.open(action, '_blank', 'width=550,height=420');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Share</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {/* Platform Icons */}
          <div className="flex justify-center gap-4 mb-8">
            {platforms.map(({ id, name, icon: Icon, color, action }) => (
              <button
                key={id}
                onClick={() => handlePlatformClick(action, name)}
                className={`flex flex-col items-center gap-1 group`}
                title={`Share on ${name}`}
              >
                <div className={`p-3 rounded-xl text-white transition-transform group-hover:scale-110 ${color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs text-gray-600">{name}</span>
              </button>
            ))}
          </div>

          {/* Copy URL Section */}
          <div className="border-t pt-6">
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50 truncate"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 min-w-[80px] justify-center"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Paste this URL anywhere. Platforms will show a preview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;