# UKTV Sideload Documentation

## Overview
UKTV Sideload is a modern web application designed to manage and access various UKTV applications across different platforms and environments. It provides an intuitive interface with advanced filtering, navigation, and information display capabilities.

## Core Features

### 1. Platform Management
- **Auto-Platform Detection**
  - Automatically detects TV OS platform (Android TV, Fire TV, Freeview Play, YouView, etc.)
  - Defaults to "All Platforms" on desktop devices
  - Saves detected platform in localStorage
  - Allows manual override of platform selection

### 2. Navigation System
- **Multiple Navigation Modes**
  - Vim Mode: Uses vim-style keyboard shortcuts (j/k, h/l, g/G)
  - Arrow Mode: Uses standard arrow keys and Home/End
  - Remote Mode: Optimized for TV remote controls
- **Auto-Detection**
  - Automatically selects appropriate navigation mode based on device
  - Configurable through settings

### 3. Information Panel
- **Dynamic Information Display**
  - Device Information
  - Navigation Mode & Instructions
  - IP Information (Local & Public)
- **Rotating Display**
  - Auto-rotates information every 3 seconds
  - Configurable through settings panel

### 4. Filtering System
- **Application Types**
  - CTV (Connected TV)
  - TAL (TV Application Layer)
- **Environments**
  - Production
  - PPDEV (Development)
  - Preprod (Pre-production)
- **Sub-environments**
  - PPDEV: Primary, Secondary, Tertiary, Quaternary, DevTools
  - Preprod: UKTV, Partners, Playground, Suitest
- **Platforms**
  - Google TV
  - Amazon
  - Freeview Play (FVP)
  - YouView
  - Freesat
  - Virgin Media (VM)
  - Sky
  - LG

### 5. Recent Items
- **History Tracking**
  - Maintains list of recently accessed items
  - Maximum of 5 recent items
  - Persists across sessions
- **Quick Access**
  - Optional recent items section
  - Toggle through settings

### 6. Search Functionality
- **Real-time Search**
  - Keyboard shortcut (/) to activate
  - Searches across all fields:
    - Friendly names
    - URLs
    - Application types
    - Environments
    - Platforms
    - Key codes

### 7. Settings Management
- **Persistent Settings**
  - All settings saved to localStorage
  - Survives page reloads
- **Configurable Options**
  - Navigation mode
  - Information display preferences
  - Recent items visibility
- **Cache Management**
  - Clear cache functionality
  - Resets all settings to defaults
  - Removes stored history

### 8. User Interface
- **Modern Design**
  - Clean, intuitive interface
  - Responsive layout
  - Dark theme
- **Keyboard Navigation**
  - Full keyboard support
  - Mode-specific shortcuts
  - Quick access keys

### 9. Platform-Specific Features
- **TV-Optimized Interface**
  - Remote-friendly navigation
  - Large, clear buttons
  - Optimized for TV displays
- **Browser Features**
  - Copy URL functionality
  - Open in new tab option
  - Keyboard shortcuts

## Technical Features

### 1. State Management
- Local storage for persistence
- React state for UI
- Efficient state updates

### 2. Performance
- Optimized rendering
- Efficient filtering
- Smooth animations

### 3. Error Handling
- Graceful fallbacks
- Error boundaries
- Network error handling

### 4. Security
- Safe URL handling
- Input sanitization
- Secure IP detection

## Future Considerations
- Theme customization
- Additional platform support
- Enhanced search capabilities
- Performance optimizations
- Accessibility improvements