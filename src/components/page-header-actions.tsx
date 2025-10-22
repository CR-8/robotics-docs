'use client';

import TTSButton from './tts-button';
import DownloadPDF from './download-pdf';

export default function PageHeaderActions() {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 mb-6 pb-4 border-b">
      <TTSButton />
      <DownloadPDF />
    </div>
  );
}
