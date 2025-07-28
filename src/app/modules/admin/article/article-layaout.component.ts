import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'asha-article-layaout',
    standalone: true,
    imports: [TranslocoModule, RouterOutlet, RouterLink],
    template: `
        <div class="flex flex-col w-full">
            <div class="flex flex-row gap-4 p-4 pb-0">
                <a
                    class="bg-white rounded p-4"
                    [routerLink]="['article']"
                    routerLinkActive="text-primary"
                >
                    <div class="text-2xl font-bold">{{ 'article.article' | transloco }}</div>
                </a>
                <a
                    class="bg-white rounded p-4"
                    [routerLink]="['category']"
                    routerLinkActive="text-primary"
                >
                    <div class="text-2xl font-bold">{{ 'article.category' | transloco }}</div>
                </a>
            </div>
            <router-outlet></router-outlet>
        </div>
    `,
    styles: ``,
})
export class ArticleLayaoutComponent {}
