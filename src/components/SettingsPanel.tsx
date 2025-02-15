import React from 'react';
import { NavigationMode, InfoPanelSettings } from '../types';
import { 
  X, 
  Settings, 
  Keyboard, 
  ArrowBigRight, 
  Radio, 
  History, 
  Trash2, 
  Info,
  ChevronRight,
  Monitor,
  Globe,
  Network
} from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  navigationMode: NavigationMode;
  onNavigationModeChange: (mode: NavigationMode) => void;
  showRecent: boolean;
  onToggleRecent: () => void;
  onClearCache: () => void;
  onInfo: () => void;
  infoPanelSettings: InfoPanelSettings;
  onInfoPanelSettingChange: (setting: keyof InfoPanelSettings) => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  navigationMode,
  onNavigationModeChange,
  showRecent,
  onToggleRecent,
  onClearCache,
  onInfo,
  infoPanelSettings,
  onInfoPanelSettingChange
}: SettingsPanelProps) {
  const infoPanelOptions = [
    { key: 'showDeviceInfo' as const, label: 'Device Information', icon: <Monitor className="w-4 h-4" /> },
    { key: 'showNavigationMode' as const, label: 'Navigation Information', icon: <Keyboard className="w-4 h-4" /> },
    { key: 'showPublicIp' as const, label: 'IP Information', icon: <Globe className="w-4 h-4" /> }
  ];

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-200">
          <Settings className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
        {/* Navigation Mode Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Navigation Mode</h3>
          <div className="space-y-2">
            {(['vim', 'arrows', 'remote'] as NavigationMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => onNavigationModeChange(mode)}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-all ${
                  navigationMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {mode === 'vim' && <Keyboard className="w-4 h-4" />}
                  {mode === 'arrows' && <ArrowBigRight className="w-4 h-4" />}
                  {mode === 'remote' && <Radio className="w-4 h-4" />}
                  <span className="font-medium capitalize">{mode} Mode</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  navigationMode === mode ? 'rotate-90' : ''
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Info Panel</h3>
          <div className="space-y-2">
            {infoPanelOptions.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'showNavigationMode') {
                    // Toggle both navigation mode and instructions together
                    onInfoPanelSettingChange('showNavigationMode');
                    onInfoPanelSettingChange('showNavigationInstructions');
                  } else if (key === 'showPublicIp') {
                    // Toggle both IP settings together
                    onInfoPanelSettingChange('showPublicIp');
                    onInfoPanelSettingChange('showLocalIp');
                  } else {
                    onInfoPanelSettingChange(key);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-all ${
                  (key === 'showNavigationMode' 
                    ? infoPanelSettings.showNavigationMode && infoPanelSettings.showNavigationInstructions
                    : key === 'showPublicIp'
                      ? infoPanelSettings.showPublicIp && infoPanelSettings.showLocalIp
                      : infoPanelSettings[key])
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Options</h3>
          <div className="space-y-2">
            <button
              onClick={onToggleRecent}
              className={`w-full flex items-center justify-between p-3 rounded-md transition-all ${
                showRecent
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="w-4 h-4" />
                <span className="font-medium">Show Recent</span>
              </div>
            </button>
            <button
              onClick={onClearCache}
              className="w-full flex items-center justify-between p-3 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Clear Cache</span>
              </div>
            </button>
            <button
              onClick={onInfo}
              className="w-full flex items-center justify-between p-3 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4" />
                <span className="font-medium">Information</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}