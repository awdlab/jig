/**
 * Icon Generation Script
 *
 * This script automatically converts SVG files from the default-icons directory
 * into TypeScript files that can be imported by the icon system.
 *
 * Usage:
 *   npx tsx tools/generate-icons.ts          # Generate TS files from SVGs
 *   npx tsx tools/generate-icons.ts --clean  # Clean output directory first
 *
 * What it does:
 * 1. Reads all .svg files from packages/controls/src/icon/default-icons/
 * 2. Converts each SVG to a TypeScript file that exports the SVG as a string
 * 3. Generates an index.ts file that exports all icons with dynamic imports
 *
 * Output: packages/controls/src/icon/default-icons/ts/
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ICONS_DIR = path.join(
  __dirname,
  '..',
  'packages',
  'controls',
  'src',
  'icon',
  'default-icons'
);
const TS_OUTPUT_DIR = path.join(DEFAULT_ICONS_DIR, 'ts');

/**
 * Converts an SVG file name to a valid TypeScript identifier
 */
function svgNameToTsName(svgFileName: string): string {
  return svgFileName.replace('.svg', '');
}

/**
 * Reads SVG content and converts it to a TypeScript export
 */
function convertSvgToTs(svgContent: string): string {
  // Escape single quotes and clean up the SVG content
  const escapedContent = svgContent.replace(/'/g, "\\'").replace(/\r?\n/g, '').trim();

  return `export default '${escapedContent}';\n`;
}

/**
 * Generates TypeScript files from SVG files
 */
function generateTsFiles(): string[] {
  const iconNames: string[] = [];

  // Check if source directory exists
  if (!fs.existsSync(DEFAULT_ICONS_DIR)) {
    throw new Error(`Source directory does not exist: ${DEFAULT_ICONS_DIR}`);
  }

  // Ensure output directory exists
  if (!fs.existsSync(TS_OUTPUT_DIR)) {
    fs.mkdirSync(TS_OUTPUT_DIR, { recursive: true });
  }

  // Read all SVG files from the default-icons directory
  const files = fs.readdirSync(DEFAULT_ICONS_DIR);
  const svgFiles = files.filter(file => file.endsWith('.svg'));

  if (svgFiles.length === 0) {
    console.warn('No SVG files found in the source directory.');
    return iconNames;
  }

  console.log(`Found ${svgFiles.length} SVG files to convert...`);

  for (const svgFile of svgFiles) {
    try {
      const svgPath = path.join(DEFAULT_ICONS_DIR, svgFile);
      const svgContent = fs.readFileSync(svgPath, 'utf-8');

      if (!svgContent.trim()) {
        console.warn(`Skipping empty file: ${svgFile}`);
        continue;
      }

      const iconName = svgNameToTsName(svgFile);
      const tsContent = convertSvgToTs(svgContent);

      const tsFilePath = path.join(TS_OUTPUT_DIR, `${iconName}.ts`);
      fs.writeFileSync(tsFilePath, tsContent);

      iconNames.push(iconName);
      console.log(`Generated: ${iconName}.ts`);
    } catch (error) {
      console.error(`Error processing ${svgFile}:`, error);
      throw error;
    }
  }

  return iconNames;
}

/**
 * Generates the index.ts file that exports all icons
 */
function generateIndexFile(iconNames: string[]): void {
  const imports = iconNames
    .map(iconName => `  ${iconName}: () => import('./${iconName}').then(module => module.default),`)
    .join('\n');

  const indexContent = `export const DEFAULT_ICONS = {\n${imports}\n};\n`;

  const indexPath = path.join(TS_OUTPUT_DIR, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);

  console.log('Generated: index.ts');
}

/**
 * Main function to generate all icon TypeScript files
 */
function generateIcons(): void {
  console.log('Starting icon generation...');
  console.log(`Source directory: ${DEFAULT_ICONS_DIR}`);
  console.log(`Output directory: ${TS_OUTPUT_DIR}`);

  try {
    // Clean output directory
    if (fs.existsSync(TS_OUTPUT_DIR)) {
      console.log('Cleaning output directory...');
      const files = fs.readdirSync(TS_OUTPUT_DIR);
      for (const file of files) {
        if (file.endsWith('.ts')) {
          fs.unlinkSync(path.join(TS_OUTPUT_DIR, file));
        }
      }
    }

    const iconNames = generateTsFiles();

    if (iconNames.length > 0) {
      generateIndexFile(iconNames);

      console.log(`\n✅ Successfully generated ${iconNames.length} icon files!`);
      console.log('Generated files:');
      iconNames.forEach(name => console.log(`  - ${name}.ts`));
      console.log('  - index.ts');
    } else {
      console.log('\n⚠️ No icons were generated.');
    }
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    generateIcons();
  }
}

export { generateIcons };
