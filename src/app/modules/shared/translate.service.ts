// translation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from 'environments/environment';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private cache = new Map<string, string>(); // แคชค่าที่เคยแปล

  constructor(
    private http: HttpClient,
    private transloco: TranslocoService // ✅ เพิ่มเข้ามา
) {}

  translate(text: string, from = 'zh-CN', to?: string) {
    const targetLang = to || this.transloco.getActiveLang(); // ใช้ภาษาปัจจุบันจากระบบ Transloco
    const key = `${from}->${targetLang}:${text}`;
    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }

    return this.http.post<any>(environment.apiUrl + '/api/translate', {
      text, from, to
    }).pipe(
      map(res => {
        console.log(res, 'res');
        
        const translated = res?.translated || text;
        console.log(translated, 'translated');
        this.cache.set(key, translated);
        return translated;
      })
    );
  }
}
