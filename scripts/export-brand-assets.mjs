// Export the existing brand artwork; do not redraw the Clinaza logo.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const directory = fileURLToPath(new URL('../public/', import.meta.url));
const source = process.argv[2] ? resolve(process.argv[2]) : join(directory, 'assets/clinaza-logo.jpg');

for (const [size, name] of [
  [16, 'favicon-16x16.png'],
  [32, 'favicon-32x32.png'],
  [96, 'favicon-96x96.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192x192.png'],
  [512, 'icon-512x512.png'],
]) {
  execFileSync('sips', ['-s', 'format', 'png', '-z', String(size), String(size), source, '--out', join(directory, name)], { stdio: 'ignore' });
}

const png = readFileSync(join(directory, 'favicon-32x32.png'));
// An ICO directory entry containing PNG artwork, supported since Windows Vista.
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(header.length, 18);
writeFileSync(join(directory, 'favicon.ico'), Buffer.concat([header, png]));

const brand = readFileSync(join(directory, 'icon-512x512.png'));
// Preserve legacy URLs while removing their unrelated artwork.
for (const name of ['logo.png', 'logo_crm.png', 'logo_generated.png']) {
  copyFileSync(join(directory, 'icon-512x512.png'), join(directory, name));
}
// A self-contained image also works when the SVG is loaded as a favicon.
writeFileSync(join(directory, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="clinaza-logo-title"><title id="clinaza-logo-title">Clinaza official logo</title><image width="512" height="512" href="data:image/png;base64,${brand.toString('base64')}"/></svg>\n`);

console.log('Exported Clinaza favicons, app icons, and legacy logo assets.');
