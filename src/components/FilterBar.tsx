import React from 'react';
import { FilterType, EnvType, PlatformType, PpdevSubType, PreprodSubType } from '../types';
import { Filter, Layers, Settings, Grid, Tags } from 'lucide-react';

interface FilterBarProps {
  appFilter: FilterType;
  envFilter: EnvType;
  platformFilter: PlatformType;
  ppdevSubFilter?: PpdevSubType;
  preprodSubFilter?: PreprodSubType;
  onAppFilterChange: (filter: FilterType) => void;
  onEnvFilterChange: (filter: EnvType) => void;
  onPlatformFilterChange: (filter: PlatformType) => void;
  onPpdevSubFilterChange?: (filter: PpdevSubType) => void;
  onPreprodSubFilterChange?: (filter: PreprodSubType) => void;
  isActive: boolean;
  activeRow: 'list' | 'apps' | 'environments' | 'platforms' | 'subenv';
  activeIndex: number;
}

export function FilterBar({
  appFilter,
  envFilter,
  platformFilter,
  ppdevSubFilter = 'all',
  preprodSubFilter = 'all',
  onAppFilterChange,
  onEnvFilterChange,
  onPlatformFilterChange,
  onPpdevSubFilterChange,
  onPreprodSubFilterChange,
  isActive,
  activeRow,
  activeIndex
}: FilterBarProps) {
  const buttonClass = (isSelected: boolean, isActive: boolean, isAll: boolean = false) => `
    px-2 py-1 rounded-md text-xs font-medium
    transition-all duration-200 ease-in-out
    ${isAll ? 'text-xs' : 'text-sm'}
    ${isSelected 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
      : isActive
        ? 'bg-blue-500/90 text-white shadow-md shadow-blue-400/10'
        : isAll
          ? 'bg-gray-600/50 text-gray-300 hover:bg-indigo-500/80 hover:text-white'
          : 'bg-gray-700/90 text-gray-200 hover:bg-indigo-500/80 hover:text-white hover:shadow-md hover:scale-105'
    }
  `;

  const appFilters: FilterType[] = ['all', 'ctv', 'tal'];
  const envFilters: EnvType[] = ['all', 'ppdev', 'preprod', 'production'];
  const ppdevSubFilters: PpdevSubType[] = ['all', 'primary', 'secondary', 'tertiary', 'quaternary', 'devtools'];
  const preprodSubFilters: PreprodSubType[] = ['all', 'uktv', 'partners', 'playground', 'suitest'];

  return (
    <div 
      className={`flex items-start gap-4 p-3 transition-colors duration-200 ${
        isActive ? 'bg-gray-700' : 'bg-gray-800'
      }`}
    >
      <Filter className="w-4 h-4 mt-1" />
      
      <div className="space-y-2 w-full">
        <div className="flex flex-wrap items-center gap-3">
          {/* Apps section */}
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex gap-1.5">
              {appFilters.map((filter, index) => (
                <button
                  key={filter}
                  onClick={() => onAppFilterChange(filter)}
                  className={buttonClass(
                    appFilter === filter,
                    activeRow === 'apps' && activeIndex === index,
                    filter === 'all'
                  )}
                >
                  {filter === 'all' ? 'All Apps' : filter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

          {/* Environments section */}
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-green-400" />
            <div className="flex gap-1.5">
              {envFilters.map((filter, index) => (
                <button
                  key={filter}
                  onClick={() => onEnvFilterChange(filter)}
                  className={buttonClass(
                    envFilter === filter,
                    activeRow === 'environments' && activeIndex === index,
                    filter === 'all'
                  )}
                >
                  {filter === 'all' ? 'All Environments' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          {(envFilter === 'ppdev' || envFilter === 'preprod') && (
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
          )}

          {/* Conditional Sub-environment filters */}
          {envFilter === 'ppdev' && onPpdevSubFilterChange && (
            <div className="flex items-center gap-2">
              <Grid className="w-3.5 h-3.5 text-purple-400" />
              <div className="flex gap-1.5">
                {ppdevSubFilters.map((filter, index) => (
                  <button
                    key={filter}
                    onClick={() => onPpdevSubFilterChange(filter)}
                    className={buttonClass(
                      ppdevSubFilter === filter,
                      activeRow === 'subenv' && activeIndex === index,
                      filter === 'all'
                    )}
                  >
                    {filter === 'all' ? 'All Types' : filter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {envFilter === 'preprod' && onPreprodSubFilterChange && (
            <div className="flex items-center gap-2">
              <Tags className="w-3.5 h-3.5 text-yellow-400" />
              <div className="flex gap-1.5">
                {preprodSubFilters.map((filter, index) => (
                  <button
                    key={filter}
                    onClick={() => onPreprodSubFilterChange(filter)}
                    className={buttonClass(
                      preprodSubFilter === filter,
                      activeRow === 'subenv' && activeIndex === index,
                      filter === 'all'
                    )}
                  >
                    {filter === 'all' ? 'All Types' : filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}