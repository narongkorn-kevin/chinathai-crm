import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { values } from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'classic-layout',
    templateUrl  : './classic.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [FuseLoadingBarComponent, FuseVerticalNavigationComponent, MatButtonModule, MatIconModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, NotificationsComponent, UserComponent, NgIf, RouterOutlet, QuickChatComponent,
                    NgFor, MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
})
export class ClassicLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    branchs = [];
    branchControl = new UntypedFormControl();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
    )
    {
        // this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._fuseNavigationService.getBranch().subscribe({
            next: (resp: any) => {
                this.branchs = resp

                const branchId = localStorage.getItem('branch')
                if (!!branchId) {
                    this.branchControl.setValue(+branchId, {
                        emitEvent: false
                    })
                } else {
                    localStorage.setItem('branch', resp[0].id)
                    this.branchControl.setValue(resp[0].id, {
                        emitEvent: false
                    })
                }
            }
        })
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) =>
            {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this.branchControl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                localStorage.setItem('branch', value)

                const url = this._router.url

                this._router.navigateByUrl('/dashboards', {skipLocationChange: true}).then(() => {
                    this._router.navigate([url]);
                });
            })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
