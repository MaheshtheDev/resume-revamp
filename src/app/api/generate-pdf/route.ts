import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
    });

    // Create new page
    const page = await browser.newPage();

    // Set viewport to A4 size
    await page.setViewport({
      width: 816, // A4 width in pixels at 96 DPI
      height: 1056, // A4 height in pixels at 96 DPI
    });

    // Construct full HTML with styles
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            /* Reset default styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              color: #000;
            }

            /* Additional custom styles if needed */
            .resume-container {
              padding: 40px;
              max-width: 816px;
              margin: 0 auto;
              background: white;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Set content with custom styles and wait for Tailwind to load
    await page.setContent(fullHtml, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
    });

    // Wait for Tailwind to process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    // Close browser
    await browser.close();

    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
