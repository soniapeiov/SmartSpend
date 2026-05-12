import TextRecognition from '@react-native-ml-kit/text-recognition';

export interface OCRResult {
  total: string | null;
  date: string | null;
  raw: string;
}

export async function scanReceipt(imagePath: string): Promise<OCRResult> {
  try {
    const result = await TextRecognition.recognize(imagePath);
    const raw = result.text;
 
    // log the raw OCR text for debugging
    console.log('=== RAW OCR TEXT ===');
    console.log(raw);
    console.log('=== END OCR TEXT ===');
    console.log('Extracted total:', extractTotal(raw));
    console.log('Extracted date:', extractDate(raw));

    return {
      total: extractTotal(raw),
      date: extractDate(raw),
      raw,
    };
  } catch (error) {
    console.error('OCR failed:', error);
    throw new Error('Could not process image');
  }
}

function extractTotal(text: string): string | null {
  const lines = text.split('\n');

  // priority 1: direct currency matches (most reliable)
  for (const line of lines) {
    // Matches: 43,65€, €46.00, 10.00e
    const euroMatch = line.match(/€\s*(\d+[,.]\d{2})|(\d+[,.]\d{2})\s*[e€]/i);
    if (euroMatch) {
      const val = euroMatch[1] || euroMatch[2];
      return val.replace(',', '.');
    }
  }

  // priority 2: label-based search
  const labels = [
    /TOTAL\s+A\s+PAGAR/i, 
    /TOTAL\s+PAGO/i, 
    /TOTAL\s*\(IVA/i,
    /VALOR\s+A\s+PAGAR/i,
    /VALOR\s+TOTAL/i,
    /^TOTAL$/i
  ];

  for (let i = 0; i < lines.length; i++) {
    const isLabelPresent = labels.some(label => label.test(lines[i]));
    
    if (isLabelPresent) {
      // check same line first (most common case)
      const sameLine = lines[i].match(/(\d+[,.]\d{2})/);
      if (sameLine) return sameLine[1].replace(',', '.');

      // check next lines
      for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
        if (lines[j].includes(' X ')) continue; // skip lines that look like item lines (ex. "2 X 5.00")
        const match = lines[j].match(/(\d+[,.]\d{2})/);
        if (match) return match[1].replace(',', '.');
      }
    }
  }

  // priority 3: if labels fail, find the largest number with 2 decimals
  const allPrices = text.match(/\d+[,.]\d{2}/g);
  if (allPrices) {
    const numericPrices = allPrices.map(p => parseFloat(p.replace(',', '.')));
    const maxPrice = Math.max(...numericPrices);
    if (maxPrice > 0) return maxPrice.toFixed(2);
  }

  return null;
}

function extractDate(text: string): string | null {
  const dateRegex = /(\d{4}[-/\.]\d{2}[-/\.]\d{2})|(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})/;
  const match = text.match(dateRegex);
  
  if (!match) return null;

  let rawDate = match[0].replace(/[-.]/g, '/'); // standardize separators to /
  const parts = rawDate.split('/');


  // if the first part is 4 digits, it's YYYY/MM/DD -> convert to DD/MM/YYYY
  if (parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return rawDate;
}