'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DownloadPDF() {
  const downloadPDF = async () => {
    // Get the current pathname and construct API URL
    const pathname = window.location.pathname;
    const timestamp = Date.now(); // Add timestamp to prevent caching
    const apiUrl = `/api/pdf${pathname}?t=${timestamp}`;

    console.log('Opening PDF in new tab:', apiUrl);

    // Open in new tab to trigger download dialog
    window.open(apiUrl, '_blank');
  };

  return (
    <Button
      onClick={downloadPDF}
      variant="outline"
      size="sm"
      className="gap-2"
      aria-label="Download as PDF"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
}
