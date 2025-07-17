// translation.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { TranslationService } from './translate.service';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'translateText',
  pure: false ,// จำเป็นต้องใช้ false เพื่อให้ async pipe ทำงานใน *ngFor
  standalone: true // ✅ เพิ่มบรรทัดนี้
})
export class TranslateTextPipe implements PipeTransform {
  private cache = new Map<string, Observable<string>>();

  constructor(
    private translationService: TranslationService,
    private translocoService: TranslocoService
  ) {}

  transform(value: string, from: string = 'zh-CN', to: string = 'th'): Observable<string> {
    const key = `${from}->${to}:${value}`;
  
    if (!this.cache.has(key)) {
      const translation$ = this.translationService.translate(value, from, to).pipe(
        tap(res => {
          console.log('[translateText pipe] Raw API response:', res); // 🔍 ดู response ที่แท้จริง
        }),
        map(res => res || value), // ✅ ดึงค่าที่แปล
        tap(translated => {
          console.log('[translateText pipe] Final translated:', translated); // 🔍 ดูค่าที่จะเอาไปแสดง
        })
      );
      this.cache.set(key, translation$);
    }
  
    return this.cache.get(key)!;
  }
}
