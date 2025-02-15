import React, { useState, useMemo, useEffect } from 'react';
import { FilterBar } from './components/FilterBar';
import { AppList } from './components/AppList';
import { SettingsPanel } from './components/SettingsPanel';
import { InfoPanel } from './components/InfoPanel';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { youviewConfig } from './data';
import { detectPlatform } from './utils/platformDetection';
import { FilterType, EnvType, PlatformType, PpdevSubType, PreprodSubType, AppConfig, NavigationMode, InfoPanelSettings } from './types';
import { Search, Settings, Tv } from 'lucide-react';

const MAX_RECENT_URLS = 5;

function getMostCommon<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const counts = arr.reduce((acc, val) => {
    acc.set(val, (acc.get(val) || 0) + 1);
    return acc;
  }, new Map<T, number>());
  return Array.from(counts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

function getDefaultNavigationMode(): NavigationMode {
  if (/WebMAF|VESTEL|SMART-TV|SmartTV|NETTV|NETCAST|VIERA|BRAVIA|TV\sOS|Tizen|WebOS/i.test(navigator.userAgent)) {
    return 'remote';
  }
  
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('linux')) return 'vim';
  if (platform.includes('win') || platform.includes('mac')) return 'arrows';
  
  return 'arrows';
}

// Get initial showRecent value from localStorage
const getInitialShowRecent = (): boolean => {
  const saved = localStorage.getItem('showRecent');
  return saved !== null ? JSON.parse(saved) : false;
};

// Get initial InfoPanel settings from localStorage
const getInitialInfoPanelSettings = (): InfoPanelSettings => {
  const saved = localStorage.getItem('infoPanelSettings');
  return saved !== null ? JSON.parse(saved) : {
    showDeviceInfo: true,
    showNavigationMode: true,
    showNavigationInstructions: true,
    showPublicIp: true,
    showLocalIp: true
  };
};

// Get initial platform from localStorage or detect it
const getInitialPlatform = (): PlatformType => {
  const saved = localStorage.getItem('platform');
  if (saved) {
    return saved as PlatformType;
  }
  return detectPlatform();
};

function App() {
  const [appFilter, setAppFilter] = useState<FilterType>('all');
  const [envFilter, setEnvFilter] = useState<EnvType>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformType>(getInitialPlatform());
  const [ppdevSubFilter, setPpdevSubFilter] = useState<PpdevSubType>('all');
  const [preprodSubFilter, setPreprodSubFilter] = useState<PreprodSubType>('all');
  const [isFilterBarActive, setIsFilterBarActive] = useState(false);
  const [recentUrls, setRecentUrls] = useState<AppConfig[]>([]);
  const [showRecent, setShowRecent] = useState(getInitialShowRecent());
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navigationMode, setNavigationMode] = useState<NavigationMode>(getDefaultNavigationMode);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [infoPanelSettings, setInfoPanelSettings] = useState<InfoPanelSettings>(getInitialInfoPanelSettings());

  const platformFilters: PlatformType[] = ['all', 'googletv', 'amazon', 'fvp', 'youview', 'freesat', 'vm', 'sky', 'lg'];

  // Save platform selection to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('platform', platformFilter);
  }, [platformFilter]);

  useEffect(() => {
    const storedUrls = localStorage.getItem('recentUrls');
    if (storedUrls) {
      const parsed = JSON.parse(storedUrls) as AppConfig[];
      setRecentUrls(parsed);

      if (parsed.length > 0) {
        const appTypes = parsed.map(item => item.app.type);
        const envTypes = parsed.map(item => item.environment.type);
        const platformBrands = parsed.map(item => item.platform.brand);

        const mostCommonApp = getMostCommon(appTypes);
        const mostCommonEnv = getMostCommon(envTypes);
        const mostCommonPlatform = getMostCommon(platformBrands);

        if (mostCommonApp) setAppFilter(mostCommonApp as FilterType);
        if (mostCommonEnv) setEnvFilter(mostCommonEnv as EnvType);
        // Don't override the platform filter here as it's handled by getInitialPlatform
      }
    }

    const savedMode = localStorage.getItem('navigationMode');
    if (savedMode) setNavigationMode(savedMode as NavigationMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('navigationMode', navigationMode);
  }, [navigationMode]);

  useEffect(() => {
    localStorage.setItem('showRecent', JSON.stringify(showRecent));
  }, [showRecent]);

  useEffect(() => {
    localStorage.setItem('infoPanelSettings', JSON.stringify(infoPanelSettings));
  }, [infoPanelSettings]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSettingsOpen) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      if (event.key === '/') {
        event.preventDefault();
        setSearchMode(true);
      } else if (event.key === 'Escape') {
        setSearchMode(false);
        setSearchQuery('');
      } else if (searchMode) {
        if (event.key === 'Backspace') {
          event.preventDefault();
          setSearchQuery(prev => prev.slice(0, -1));
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          setSearchQuery(prev => prev + event.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchMode, isSettingsOpen]);

  const addToRecentUrls = (item: AppConfig) => {
    setRecentUrls(prev => {
      const filtered = prev.filter(i => i.url !== item.url);
      const updated = [item, ...filtered].slice(0, MAX_RECENT_URLS);
      localStorage.setItem('recentUrls', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCache = () => {
    // Clear all localStorage items
    localStorage.clear();
    
    // Reset all state to default values
    setAppFilter('all');
    setEnvFilter('all');
    setPlatformFilter(detectPlatform()); // Reset to detected platform instead of 'all'
    setPpdevSubFilter('all');
    setPreprodSubFilter('all');
    setRecentUrls([]);
    setShowRecent(false);
    setSearchMode(false);
    setSearchQuery('');
    setNavigationMode(getDefaultNavigationMode());
    setInfoPanelSettings({
      showDeviceInfo: true,
      showNavigationMode: true,
      showNavigationInstructions: true,
      showPublicIp: true,
      showLocalIp: true
    });
    
    // Close settings panel
    setIsSettingsOpen(false);
    
    // Reload the page to ensure a clean state
    window.location.reload();
  };

  const handleInfoPanelSettingChange = (setting: keyof InfoPanelSettings) => {
    setInfoPanelSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const filteredItems = useMemo(() => {
    const itemsWithUrls = youviewConfig.filter(item => item.url);
    
    return itemsWithUrls.filter(item => {
      const matchesApp = appFilter === 'all' || item.app.type === appFilter;
      const matchesEnv = envFilter === 'all' || item.environment.type === envFilter;
      const matchesSubEnv = (() => {
        if (envFilter === 'ppdev' && ppdevSubFilter !== 'all') {
          return item.environment.subType === ppdevSubFilter;
        }
        if (envFilter === 'preprod' && preprodSubFilter !== 'all') {
          return item.environment.subType === preprodSubFilter;
        }
        return true;
      })();

      const matchesPlatform = platformFilter === 'all' || item.platform.brand === platformFilter;
      const matchesSearch = !searchMode || searchQuery === '' || (() => {
        const query = searchQuery.toLowerCase();
        return (
          item.friendlyName.toLowerCase().includes(query) ||
          item.url?.toLowerCase().includes(query) ||
          item.app.type.toLowerCase().includes(query) ||
          item.environment.type.toLowerCase().includes(query) ||
          item.environment.subType?.toLowerCase().includes(query) ||
          item.platform.brand.toLowerCase().includes(query) ||
          item.platform.model?.toLowerCase().includes(query) ||
          item.keyCode?.toString().includes(query)
        );
      })();
      
      return matchesApp && matchesEnv && matchesPlatform && matchesSubEnv && matchesSearch;
    });
  }, [appFilter, envFilter, platformFilter, ppdevSubFilter, preprodSubFilter, searchMode, searchQuery]);

  const { activeIndex, activeRow } = useKeyboardNavigation(
    filteredItems.length + (recentUrls.length > 0 ? recentUrls.length + 1 : 0),
    setAppFilter,
    setEnvFilter,
    setPlatformFilter,
    setPpdevSubFilter,
    setPreprodSubFilter,
    addToRecentUrls,
    navigationMode
  );

  const displayItems = useMemo(() => {
    const result = [];

    if (showRecent && recentUrls.length > 0 && (!searchMode || searchQuery === '')) {
      result.push({ type: 'header', content: 'Recently Opened' });
      result.push(...recentUrls);
    }

    result.push({ 
      type: 'header', 
      content: `All Items (${filteredItems.length})` 
    });
    
    if (filteredItems.length > 0) {
      result.push(...filteredItems);
    } else {
      result.push({
        friendlyName: 'No Results Found',
        app: { type: 'ctv' },
        environment: { type: 'production' },
        platform: { brand: 'default' }
      });
    }

    return result;
  }, [filteredItems, recentUrls, showRecent, searchMode, searchQuery]);

  const buttonClass = (isSelected: boolean) => `
    px-2 py-1 rounded-md text-xs font-medium
    transition-all duration-200 ease-in-out
    ${isSelected 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
      : 'bg-gray-700/50 text-gray-300 hover:bg-indigo-500/80 hover:text-white'
    }
  `;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 relative z-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <h1 className="text-2xl font-bold">UKTV Sideload</h1>
              
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md flex-shrink-0 ${
                searchMode ? 'bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/50' : 'bg-gray-700/50 text-gray-400'
              }`}>
                <Search className="w-4 h-4" />
                <span className="text-sm font-mono min-w-[120px]">
                  {searchMode ? (
                    <>
                      <span className="text-blue-400">/</span>
                      <span>{searchQuery}</span>
                      <span className="animate-pulse ml-0.5">_</span>
                    </>
                  ) : (
                    'Press / to search'
                  )}
                </span>
              </div>
              <InfoPanel
                navigationMode={navigationMode}
                settings={infoPanelSettings}
              />
            </div>

            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-red-400" />
              <div className="flex gap-1.5 flex-wrap">
                {platformFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setPlatformFilter(filter)}
                    className={buttonClass(platformFilter === filter)}
                  >
                    {filter === 'all' ? 'All Platforms' : filter.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors ml-2"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col relative">
        <div className="relative z-10">
          <FilterBar
            appFilter={appFilter}
            envFilter={envFilter}
            platformFilter={platformFilter}
            ppdevSubFilter={ppdevSubFilter}
            preprodSubFilter={preprodSubFilter}
            onAppFilterChange={setAppFilter}
            onEnvFilterChange={setEnvFilter}
            onPlatformFilterChange={setPlatformFilter}
            onPpdevSubFilterChange={setPpdevSubFilter}
            onPreprodSubFilterChange={setPreprodSubFilter}
            isActive={isFilterBarActive}
            activeRow={activeRow}
            activeIndex={activeIndex}
          />
        </div>

        <div className="flex-1 relative z-0">
          <AppList
            items={displayItems}
            activeIndex={activeRow === 'list' ? activeIndex : -1}
          />
        </div>

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          navigationMode={navigationMode}
          onNavigationModeChange={setNavigationMode}
          showRecent={showRecent}
          onToggleRecent={() => setShowRecent(!showRecent)}
          onClearCache={handleClearCache}
          onInfo={() => {}}
          infoPanelSettings={infoPanelSettings}
          onInfoPanelSettingChange={handleInfoPanelSettingChange}
        />
      </div>
    </div>
  );
}

export default App;