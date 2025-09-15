export const VOICE_NAVIGATION_CONSTANTS = {
  // Timeouts
  SPEECH_TIMEOUT: 5000,
  HIGHLIGHT_DURATION: 10000,
  
  // Zoom settings
  ZOOM_STEP: 0.1,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 3.0,
  
  // Scroll settings
  SCROLL_DISTANCE: 300,
  
  // Speech settings
  SPEECH_RATE: 0.9,
  
  // Storage keys
  VOICE_NAV_INDEX_KEY: 'voice-nav-index',
  
  // CSS classes
  VOICE_HIGHLIGHT_CLASS: 'voice-highlight',
  VOICE_HIGHLIGHT_STYLE_ID: 'voice-highlight-style',
  
  // DOM selectors
  HOST_SELECTOR: '#web-extension-accessibility',
  WIDGET_SELECTOR: '#widget-root',
} as const;
