const fs = require('fs');
const path = require('path');

const environment = process.argv[2] || 'development';
const configPath = path.join(
  process.cwd(),
  'configs',
  'widget',
  `${environment}.json`
);
const envOutputPath = path.join(
  process.cwd(),
  'apps',
  'widget',
  `.env.${environment}`
);

console.log(`📋 Reading config from: ${configPath}`);

if (!fs.existsSync(configPath)) {
  console.error(`❌ Config file not found: ${configPath}`);
  process.exit(1);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const envVars = [];
  envVars.push(`# Generated from ${configPath} at ${new Date().toISOString()}`);
  envVars.push(`VITE_WIDGET_VERSION=${config.version}`);
  envVars.push(`VITE_ENVIRONMENT=${environment}`);

  // Feature flags
  const features = config.features;

  // Language selector
  envVars.push(
    `VITE_FEATURE_LANGUAGE_SELECTOR=${features.languageSelector.enabled}`
  );

  // Accessibility profiles
  envVars.push(
    `VITE_FEATURE_ACCESSIBILITY_PROFILES=${features.accessibilityProfiles.enabled}`
  );

  // Widget controls - convert each control to environment variable
  Object.entries(features.widgetControls).forEach(([key, value]) => {
    const envKey = `VITE_FEATURE_${key.toUpperCase()}`;
    envVars.push(`${envKey}=${value.enabled}`);

    // Add max steps if available
    if (value.maxSteps) {
      envVars.push(`${envKey}_MAX_STEPS=${value.maxSteps}`);
    }
  });

  // Build settings
  if (config.buildSettings) {
    envVars.push(`VITE_BUILD_MINIFY=${config.buildSettings.minify}`);
    envVars.push(`VITE_BUILD_SOURCE_MAP=${config.buildSettings.sourceMap}`);
  }

  // Ensure directory exists
  const envDir = path.dirname(envOutputPath);
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }

  // Write environment file
  fs.writeFileSync(envOutputPath, envVars.join('\n') + '\n');

  console.log(`✅ Generated ${envOutputPath} with ${envVars.length} variables`);

  // Also show the generated variables for debugging
  console.log('\n📋 Generated environment variables:');
  envVars.forEach((line) => {
    if (!line.startsWith('#')) {
      console.log(`  ${line}`);
    }
  });
} catch (error) {
  console.error(`❌ Error parsing config file: ${error.message}`);
  process.exit(1);
}
