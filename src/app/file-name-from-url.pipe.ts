import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileNameFromUrl',
    standalone: true
})
export class FileNameFromUrlPipe implements PipeTransform {

    transform(url: string): string {
        if (!url) return ''; // Handle empty input

        try {
            const urlObj = new URL(url); // Create a URL object
            const pathname = urlObj.pathname; // Get the pathname (e.g., "/path/to/myfile.txt")
            const fileName = pathname.split('/').pop(); // Extract the file name

            return fileName || 'No file name found'; // Handle edge cases
        } catch (error) {
            console.error('Invalid URL:', error);
            return 'Invalid URL';
        }
    }

}
