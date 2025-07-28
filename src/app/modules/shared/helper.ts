import { ToastrService } from "ngx-toastr";


export function createFileFromBlob(blob: Blob, filename: string = 'download.xlsx') {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function copyToClipboard(headers: string[], rows: any[][], toastr?: ToastrService): void {
  let clipboardData = headers.join('\t') + '\n';

  for (const row of rows) {
    clipboardData += row.map(cell => cell != null ? String(cell) : '').join('\t') + '\n';
  }
  navigator.clipboard.writeText(clipboardData).then(() => {
    toastr?.success('Copied to clipboard!');
  }).catch(err => {
    toastr?.error('Failed to copy:', err);
  });
}/**
 * คำนวณ CBM (Cubic Meters)
 * @param width ความกว้าง (เซนติเมตร)
 * @param length ความยาว (เซนติเมตร)
 * @param height ความสูง (เซนติเมตร)
 * @param quantity จำนวนลัง
 * @returns CBM รวมเป็นจำนวนทศนิยม 6 ตำแหน่ง
 */
function calculateCBM(width: number, length: number, height: number, quantity: number): number {
  const cbmPerBox = (width * length * height) / 1_000_000;
  const totalCBM = cbmPerBox * quantity;
  return parseFloat(totalCBM.toFixed(4));
}

// ตัวอย่างการใช้งาน
const width = 10;     // ซม.
const length = 20;    // ซม.
const height = 10;    // ซม.
const quantity = 10;  // จำนวนลัง

const totalCBM = calculateCBM(width, length, height, quantity);


