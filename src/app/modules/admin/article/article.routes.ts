import { Routes } from '@angular/router';
import { ArticleComponent } from './article.component';
import { ArticleLayaoutComponent } from './article-layaout.component';
import { ArticleCategoryComponent } from './category/article-category.component';

export default [
    {
        path: '',
        component: ArticleLayaoutComponent,
        children: [
            {
                path: 'article',
                component: ArticleComponent,
            },
            {
                path: 'category',
                component: ArticleCategoryComponent,
            },
        ]
    },
] as Routes;
