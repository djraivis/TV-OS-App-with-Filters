import React from 'react';
import { AppConfig } from '../types';
import { SearchX, Frown, Copy, ExternalLink } from 'lucide-react';

interface AppListProps {
  items: (AppConfig | { type: 'header'; content: string })[];
  activeIndex: number;
}

export function AppList({ items, activeIndex }: AppListProps) {
  let isInRecentSection = false;

  // Function to determine if we're in a web environment
  const isWebEnvironment = () => {
    const isTVEnvironment = /WebMAF|VESTEL|SMART-TV|SmartTV|NETTV|NETCAST|VIERA|BRAVIA|TV\sOS|Tizen|WebOS/i.test(navigator.userAgent);
    return !isTVEnvironment;
  };

  // Function to copy URL to clipboard
  const handleCopyUrl = async (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Function to open URL in new tab
  const handleOpenInNewTab = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 overflow-auto">
      {items.map((item, index) => {
        if ('type' in item && item.type === 'header') {
          isInRecentSection = item.content === 'Recently Opened';
          return (
            <div 
              key={`header-${index}`} 
              className="sticky top-0 px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm text-gray-300 font-semibold text-sm z-10"
            >
              {item.content}
            </div>
          );
        }

        // Special handling for "No Results Found"
        if (item.friendlyName === 'No Results Found') {
          return (
            <div 
              key={index}
              className="flex flex-col items-center justify-center p-8 text-center space-y-4"
            >
              <div className="relative">
                <SearchX className="w-24 h-24 text-gray-600 animate-pulse" />
                <Frown className="w-12 h-12 text-gray-500 absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-400">No Results Found</h3>
                <p className="text-gray-500 text-lg">
                  Try adjusting your filters to find what you're looking for
                </p>
              </div>
            </div>
          );
        }

        const baseClasses = "px-3 py-2 border-b border-gray-700/50 transition-all duration-200 hover:bg-gray-700/50";
        const activeClasses = activeIndex === index ? "bg-blue-600 hover:bg-blue-600" : "";
        const recentClasses = isInRecentSection 
          ? "bg-gradient-to-r from-gray-800/30 to-gray-900/30"
          : "";

        return (
          <div
            key={index}
            data-index={index}
            data-url={item.url}
            data-item={JSON.stringify(item)}
            className={`${baseClasses} ${activeClasses} ${recentClasses} group`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">{item.friendlyName}</h3>
              {item.keyCode && (
                <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300 group-hover:bg-gray-600">
                  Key: {item.keyCode}
                </span>
              )}
            </div>
            {item.url && (
              <div className="mt-1 text-xs text-gray-400 flex items-center gap-4">
                <span className="truncate flex-1">{item.url}</span>
                {isWebEnvironment() && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopyUrl(item.url!, e)}
                      className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-gray-200"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleOpenInNewTab(item.url!, e)}
                      className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-gray-200"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {item.app?.type && (
                  <span className="text-gray-500 uppercase tracking-wider">
                    {item.app.type}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}