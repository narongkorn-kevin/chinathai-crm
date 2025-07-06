export function removeEmpty(obj: any) {
  Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
      } else if (obj[key] === null || obj[key] === '') {
          delete obj[key];
      }
  });
  return obj;
}

export function createFileFromBlob(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url);
}

export function getFileNameFromUrl(urlString) {
    const url = new URL(urlString);
    const pathname = url.pathname;
    const fileName = pathname.split('/').pop();

    // Handle edge case where URL ends with a slash
    return fileName || "No file name found";
}
