/**
 * Widget Injection Script
 *
 * This script injects your accessibility widget into any website.
 * Run this in the browser console or use as a bookmarklet.
 */

(function () {
  // Configuration
  const WIDGET_URL = 'http://127.0.0.1:8081/dist/widget/widget.js';
  const WIDGET_ID = 'web-extension-accessibility';

  // Check if widget is already loaded
  if (document.getElementById(WIDGET_ID)) {
    console.log('Widget is already loaded on this page');
    return;
  }

  // Create and inject the script
  const script = document.createElement('script');
  script.src = WIDGET_URL;
  script.defer = true;
  script.onload = function () {
    console.log('Accessibility widget loaded successfully!');
  };
  script.onerror = function () {
    console.error(
      'Failed to load widget. Make sure the server is running at:',
      WIDGET_URL
    );
  };

  // Inject the script
  document.head.appendChild(script);

  console.log('Injecting accessibility widget...');
})();
