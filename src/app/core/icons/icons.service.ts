import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class IconsService {
    /**
     * Constructor
     */
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        const domSanitizer = inject(DomSanitizer);
        const matIconRegistry = inject(MatIconRegistry);

        // Register icon sets
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
        matIconRegistry.addSvgIconSetInNamespace('mat_outline', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg'));
        matIconRegistry.addSvgIconSetInNamespace('mat_solid', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-solid.svg'));
        matIconRegistry.addSvgIconSetInNamespace('feather', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg'));
        matIconRegistry.addSvgIconSetInNamespace('heroicons_outline', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg'));
        matIconRegistry.addSvgIconSetInNamespace('heroicons_solid', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg'));
        matIconRegistry.addSvgIconSetInNamespace('heroicons_mini', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-mini.svg'));
        iconRegistry.addSvgIcon(
            'save_money',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/hugeicons_save-money-dollar.svg')
        );
        iconRegistry.addSvgIcon(
            'change',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/change.svg')
        );
        iconRegistry.addSvgIcon(
            'vector',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/vector.svg')
        );
    }
}
