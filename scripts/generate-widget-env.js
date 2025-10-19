const fs = require('fs');
const path = require('path');

const environment = process.argv[2] || 'production';
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

  envVars.push(`VITE_WIDGET_VERSION=${config.version || '1.0.0'}`);

  // Feature flags
  const features = config.features;

  // Main features
  envVars.push(
    `VITE_FEATURE_LANGUAGE_SELECTOR=${features.language_selector.enabled}`
  );
  envVars.push(
    `VITE_FEATURE_ACCESSIBILITY_PROFILES=${features.accessibility_profiles.enabled}`
  );

  // Widget controls - convert each control to environment variable
  Object.entries(features.widget_controls).forEach(([key, value]) => {
    const envKey = `VITE_FEATURE_${key.toUpperCase()}`;
    envVars.push(`${envKey}=${value.enabled}`);
  });

  // Ensure directory exists
  const envDir = path.dirname(envOutputPath);
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }

  // Write environment file
  fs.writeFileSync(envOutputPath, envVars.join('\n') + '\n');

  console.log(`✅ Generated ${envOutputPath} with ${envVars.length} variables`);
  console.log('\n📋 Generated environment variables:');
  envVars.slice(1).forEach((line) => console.log(`  ${line}`));
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
