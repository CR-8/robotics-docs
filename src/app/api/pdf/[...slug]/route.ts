import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const pathname = '/' + (slug || []).join('/');

  console.log('PDF request for pathname:', pathname);

  try {
    // Get the host from the request
    const host = request.headers.get('host');
    if (!host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 400 });
    }

    // Determine protocol (http for localhost, https for production)
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const url = `${protocol}://${host}${pathname}`;

    console.log('Navigating to URL:', url);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });

    // Navigate to the page
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Expand accordions and tabs for PDF generation
    await page.evaluate(() => {
      // Expand all accordions
      const accordions = document.querySelectorAll('[data-accordion-content]');
      accordions.forEach(acc => {
        (acc as HTMLElement).style.display = 'block';
      });

      // Expand all collapsible sections
      const collapsibles = document.querySelectorAll('[data-collapsible-content]');
      collapsibles.forEach(col => {
        (col as HTMLElement).style.display = 'block';
      });

      // Show all tab content
      const tabs = document.querySelectorAll('[data-tabs-content]');
      tabs.forEach(tab => {
        (tab as HTMLElement).style.display = 'block';
      });

      // Remove any hidden classes that might be applied
      const hiddenElements = document.querySelectorAll('.hidden, [hidden]');
      hiddenElements.forEach(el => {
        if (el.classList.contains('hidden')) {
          el.classList.remove('hidden');
        }
        (el as HTMLElement).style.display = 'block';
      });
    });

    // Wait a bit more for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    console.log('PDF generated, size:', pdfBuffer.length);

    await browser.close();

    // Generate filename
    const filename = slug && slug.length > 0
      ? slug.join('-') + '.pdf'
      : 'home.pdf';

    console.log('Returning PDF with filename:', filename);

    // Return PDF as response
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}