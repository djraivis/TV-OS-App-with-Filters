import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { NavigationMode, InfoPanelSettings } from '../types';

interface InfoPanelProps {
  navigationMode: NavigationMode;
  settings: InfoPanelSettings;
}

export function InfoPanel({ navigationMode, settings }: InfoPanelProps) {
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0);
  const [publicIp, setPublicIp] = useState<string>('');
  const [localIp, setLocalIp] = useState<string>('');

  // Fetch public IP address
  useEffect(() => {
    if (settings.showPublicIp) {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => setPublicIp(data.ip))
        .catch(() => setPublicIp('Not available'));
    }
  }, [settings.showPublicIp]);

  // Get local IP using WebRTC
  useEffect(() => {
    if (settings.showLocalIp) {
      const getLocalIp = async () => {
        try {
          const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
          });

          pc.createDataChannel('');

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(event.candidate.candidate);
              if (ipMatch && ipMatch[1]) {
                const ip = ipMatch[1];
                // Only use private IP addresses
                if (ip.startsWith('10.') || ip.startsWith('192.168.') || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) {
                  setLocalIp(ip);
                  pc.close();
                }
              }
            }
          };

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          // Set a timeout to close the connection if no candidate is found
          setTimeout(() => {
            if (!localIp) {
              pc.close();
              setLocalIp('Not available');
            }
          }, 5000);
        } catch (err) {
          console.error('Failed to get local IP:', err);
          setLocalIp('Not available');
        }
      };

      getLocalIp();
    }
  }, [settings.showLocalIp]);

  const getNavigationInstructions = () => {
    switch (navigationMode) {
      case 'vim':
        return 'j/k (up/down), h/l (left/right), g/G (start/end), / (search)';
      case 'arrows':
        return '↑/↓ (up/down), ←/→ (left/right), Home/End';
      case 'remote':
        return 'Channel ▲/▼ (up/down), Volume ◄/► (left/right)';
    }
  };

  const infoItems = [
    ...(settings.showDeviceInfo ? [{
      icon: '🖥️',
      content: `Device: ${navigator.userAgent.split(') ')[0]})`
    }] : []),
    ...((settings.showNavigationMode || settings.showNavigationInstructions) ? [{
      icon: '⌨️',
      content: `${navigationMode.charAt(0).toUpperCase() + navigationMode.slice(1)} Mode: ${getNavigationInstructions()}`
    }] : []),
    ...((settings.showPublicIp || settings.showLocalIp) ? [{
      icon: '🌐',
      content: `IP: ${[
        settings.showLocalIp && localIp ? `Local ${localIp}` : '',
        settings.showPublicIp && publicIp ? `Public ${publicIp}` : ''
      ].filter(Boolean).join(' • ')}`
    }] : [])
  ];

  // Reset currentInfoIndex if it's out of bounds
  useEffect(() => {
    if (currentInfoIndex >= infoItems.length) {
      setCurrentInfoIndex(0);
    }
  }, [infoItems.length, currentInfoIndex]);

  // Auto-rotate information every 3 seconds
  useEffect(() => {
    if (infoItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentInfoIndex((prev) => (prev + 1) % Math.max(1, infoItems.length));
    }, 3000);

    return () => clearInterval(interval);
  }, [infoItems.length]);

  if (infoItems.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-md text-sm text-gray-300">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>No information to display</span>
      </div>
    );
  }

  const currentInfo = infoItems[currentInfoIndex % infoItems.length];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-md text-sm text-gray-300">
      <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="flex-shrink-0">{currentInfo.icon}</span>
        <span className="truncate">{currentInfo.content}</span>
      </div>
    </div>
  );
}