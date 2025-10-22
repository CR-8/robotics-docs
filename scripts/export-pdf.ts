import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { source } from '../src/lib/source.js';

const browser = await puppeteer.launch();
const outDir = 'pdfs';

// Automatically get all documentation pages
const urls = source.getPages().map((page) => page.url);

console.log(`\nExporting ${urls.length} documentation pages to PDF...\n`);

async function exportPdf(pathname: string) {
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000' + pathname, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    
    // Wait for any animations or dynamic content to settle
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pdfPath = path.join(
      outDir, 
      pathname.slice(1).replaceAll('/', '-') + '.pdf'
    );
    
    await page.pdf({
      path: pdfPath,
      width: 950,
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    
    console.log(`✓ PDF generated successfully for ${pathname}`);
  } catch (error) {
    console.error(`✗ Failed to generate PDF for ${pathname}:`, error);
  } finally {
    await page.close();
  }
}

// Create output directory
await fs.mkdir(outDir, { recursive: true });

// Export PDFs in parallel (but limit concurrency to avoid overwhelming the server)
const concurrencyLimit = 3;
for (let i = 0; i < urls.length; i += concurrencyLimit) {
  const batch = urls.slice(i, i + concurrencyLimit);
  await Promise.all(batch.map(exportPdf));
}

await browser.close();
console.log('\n✓ All PDFs generated successfully!');
