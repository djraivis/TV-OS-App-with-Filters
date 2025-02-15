import { useEffect, useState } from 'react';
import { FilterType, EnvType, PlatformType, PpdevSubType, PreprodSubType, AppConfig, NavigationMode } from '../types';

interface NavigationState {
  activeIndex: number;
  activeRow: 'list' | 'apps' | 'environments' | 'platforms' | 'subenv';
}

const handleNavigation = (url: string, event: KeyboardEvent) => {
  // Check if we're in a TV environment
  const isTVEnvironment = /WebMAF|VESTEL|SMART-TV|SmartTV|NETTV|NETCAST|VIERA|BRAVIA|TV\sOS|Tizen|WebOS/i.test(navigator.userAgent);

  // If Shift or Ctrl is pressed, open in new tab (browser only)
  if (!isTVEnvironment && (event.shiftKey || event.ctrlKey)) {
    window.open(url, '_blank');
    return;
  }

  if (isTVEnvironment) {
    try {
      // Try to use the TV's native navigation if available
      if (window.location.href.includes('youview')) {
        // YouView specific navigation
        window.location.replace(url);
      } else if ((window as any).tizen) {
        // Samsung Tizen TV
        (window as any).tizen.application.launch(url);
      } else if ((window as any).webOS) {
        // LG WebOS
        (window as any).webOS.launch(url);
      } else {
        // Fallback for other TV platforms
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to navigate:', error);
      // Fallback to standard navigation
      window.location.href = url;
    }
  } else {
    // Standard web browser navigation
    window.location.href = url;
  }
};

export function useKeyboardNavigation(
  itemCount: number,
  onAppFilterChange: (filter: FilterType) => void,
  onEnvFilterChange: (filter: EnvType) => void,
  onPlatformFilterChange: (filter: PlatformType) => void,
  onPpdevSubFilterChange?: (filter: PpdevSubType) => void,
  onPreprodSubFilterChange?: (filter: PreprodSubType) => void,
  onNavigate?: (item: AppConfig) => void,
  mode: NavigationMode = 'vim'
) {
  const [state, setState] = useState<NavigationState>({
    activeIndex: 0,
    activeRow: 'list'
  });

  const appFilters: FilterType[] = ['all', 'ctv', 'tal'];
  const envFilters: EnvType[] = ['all', 'ppdev', 'preprod', 'production'];
  const platformFilters: PlatformType[] = ['all', 'googletv', 'amazon', 'fvp', 'youview', 'freesat', 'vm', 'sky', 'lg'];
  const ppdevSubFilters: PpdevSubType[] = ['all', 'primary', 'secondary', 'tertiary', 'quaternary', 'devtools'];
  const preprodSubFilters: PreprodSubType[] = ['all', 'uktv', 'partners', 'playground', 'suitest'];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isVimMode = mode === 'vim';
      const isArrowMode = mode === 'arrows';
      const isRemoteMode = mode === 'remote';

      // Handle navigation based on mode
      const handleUp = () => {
        event.preventDefault();
        setState(prev => {
          if (prev.activeRow === 'list') {
            return { ...prev, activeRow: 'platforms', activeIndex: 0 };
          } else if (prev.activeRow === 'platforms') {
            return { ...prev, activeRow: 'subenv', activeIndex: 0 };
          } else if (prev.activeRow === 'subenv') {
            return { ...prev, activeRow: 'environments', activeIndex: 0 };
          } else if (prev.activeRow === 'environments') {
            return { ...prev, activeRow: 'apps', activeIndex: 0 };
          }
          return prev;
        });
      };

      const handleDown = () => {
        event.preventDefault();
        setState(prev => {
          if (prev.activeRow === 'apps') {
            return { ...prev, activeRow: 'environments', activeIndex: 0 };
          } else if (prev.activeRow === 'environments') {
            return { ...prev, activeRow: 'subenv', activeIndex: 0 };
          } else if (prev.activeRow === 'subenv') {
            return { ...prev, activeRow: 'platforms', activeIndex: 0 };
          } else if (prev.activeRow === 'platforms') {
            return { ...prev, activeRow: 'list', activeIndex: 0 };
          }
          return prev;
        });
      };

      const handleLeft = () => {
        event.preventDefault();
        setState(prev => {
          let newIndex = Math.max(0, prev.activeIndex - 1);
          return { ...prev, activeIndex: newIndex };
        });
      };

      const handleRight = () => {
        event.preventDefault();
        setState(prev => {
          let maxIndex: number;
          switch (prev.activeRow) {
            case 'apps':
              maxIndex = appFilters.length - 1;
              break;
            case 'environments':
              maxIndex = envFilters.length - 1;
              break;
            case 'platforms':
              maxIndex = platformFilters.length - 1;
              break;
            case 'subenv':
              maxIndex = ppdevSubFilters.length - 1;
              break;
            case 'list':
              maxIndex = itemCount - 1;
              break;
          }
          let newIndex = Math.min(maxIndex, prev.activeIndex + 1);
          return { ...prev, activeIndex: newIndex };
        });
      };

      if (isVimMode) {
        switch (event.key.toLowerCase()) {
          case 'j':
            handleDown();
            break;
          case 'k':
            handleUp();
            break;
          case 'h':
            handleLeft();
            break;
          case 'l':
            handleRight();
            break;
          case 'g':
            event.preventDefault();
            setState(prev => ({ ...prev, activeIndex: 0 }));
            break;
          case 'G':
            event.preventDefault();
            setState(prev => {
              let maxIndex: number;
              switch (prev.activeRow) {
                case 'apps':
                  maxIndex = appFilters.length - 1;
                  break;
                case 'environments':
                  maxIndex = envFilters.length - 1;
                  break;
                case 'platforms':
                  maxIndex = platformFilters.length - 1;
                  break;
                case 'subenv':
                  maxIndex = ppdevSubFilters.length - 1;
                  break;
                case 'list':
                  maxIndex = itemCount - 1;
                  break;
              }
              return { ...prev, activeIndex: maxIndex };
            });
            break;
        }
      } else if (isArrowMode || isRemoteMode) {
        switch (event.key) {
          case 'ArrowUp':
            handleUp();
            break;
          case 'ArrowDown':
            handleDown();
            break;
          case 'ArrowLeft':
            handleLeft();
            break;
          case 'ArrowRight':
            handleRight();
            break;
          case 'Home':
            if (isArrowMode) {
              event.preventDefault();
              setState(prev => ({ ...prev, activeIndex: 0 }));
            }
            break;
          case 'End':
            if (isArrowMode) {
              event.preventDefault();
              setState(prev => {
                let maxIndex: number;
                switch (prev.activeRow) {
                  case 'apps':
                    maxIndex = appFilters.length - 1;
                    break;
                  case 'environments':
                    maxIndex = envFilters.length - 1;
                    break;
                  case 'platforms':
                    maxIndex = platformFilters.length - 1;
                    break;
                  case 'subenv':
                    maxIndex = ppdevSubFilters.length - 1;
                    break;
                  case 'list':
                    maxIndex = itemCount - 1;
                    break;
                }
                return { ...prev, activeIndex: maxIndex };
              });
            }
            break;
        }
      }

      // Common handlers for all modes
      if (event.key === 'Enter' || (isRemoteMode && event.key === ' ')) {
        if (state.activeRow === 'list') {
          const selectedElement = document.querySelector(`[data-index="${state.activeIndex}"]`);
          const selectedUrl = selectedElement?.getAttribute('data-url');
          if (selectedUrl) {
            const itemData = JSON.parse(selectedElement?.getAttribute('data-item') || '{}');
            if (onNavigate && itemData.url) {
              onNavigate(itemData);
            }
            handleNavigation(selectedUrl, event);
          }
        } else if (state.activeRow === 'apps') {
          onAppFilterChange(appFilters[state.activeIndex]);
        } else if (state.activeRow === 'environments') {
          onEnvFilterChange(envFilters[state.activeIndex]);
        } else if (state.activeRow === 'platforms') {
          onPlatformFilterChange(platformFilters[state.activeIndex]);
        } else if (state.activeRow === 'subenv') {
          if (onPpdevSubFilterChange && onPreprodSubFilterChange) {
            const currentEnv = envFilters[state.activeIndex];
            if (currentEnv === 'ppdev') {
              onPpdevSubFilterChange(ppdevSubFilters[state.activeIndex]);
            } else if (currentEnv === 'preprod') {
              onPreprodSubFilterChange(preprodSubFilters[state.activeIndex]);
            }
          }
        }
      }

      // Number keys for direct selection (only in Vim mode)
      if (isVimMode) {
        const num = parseInt(event.key);
        if (!isNaN(num) && num >= 0 && num < itemCount && state.activeRow === 'list') {
          setState(prev => ({ ...prev, activeIndex: num }));
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    itemCount,
    state,
    mode,
    onAppFilterChange,
    onEnvFilterChange,
    onPlatformFilterChange,
    onPpdevSubFilterChange,
    onPreprodSubFilterChange,
    onNavigate,
    appFilters,
    envFilters,
    platformFilters,
    ppdevSubFilters,
    preprodSubFilters
  ]);

  return {
    ...state,
    onNavigate: handleNavigation
  };
}