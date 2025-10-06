import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            switchMap((navigation) =>
                forkJoin({
                    alipay: this._httpClient.get(environment.apiUrl + '/api/get_alipay_payment').pipe(
                        map((response) => this._extractAwaitingPaymentCount(response)),
                        catchError(() => of(0)),
                    ),
                    orders: this._httpClient.get(environment.apiUrl + '/api/get_orders').pipe(
                        map((response) => ({
                            awaitingSummary: this._extractAwaitingSummaryOrderCount(response),
                            inProgress: this._extractInProgressOrderCount(response),
                        })),
                        catchError(() => of({ awaitingSummary: 0, inProgress: 0 })),
                    ),
                }).pipe(
                    map(({alipay, orders}) =>
                    {
                        this._applyBadgeCount(navigation, 'payment.topup', alipay);
                        this._applyBadgeCount(
                            navigation,
                            'payment.order',
                            orders.inProgress,
                            (item) => item.link === '/order-products',
                        );
                        this._applyBadgeCount(
                            navigation,
                            'sale-order.pr',
                            orders.awaitingSummary,
                        );

                        return navigation;
                    }),
                ),
            ),
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }

    /**
     * Update badge count on all navigation variants for the provided item id.
     */
    private _applyBadgeCount(
        navigation: Navigation,
        targetId: string,
        count: number,
        predicate?: (item: FuseNavigationItem) => boolean,
    ): void
    {
        const navVariants: (keyof Navigation)[] = ['default', 'compact', 'futuristic', 'horizontal'];

        navVariants.forEach((variant) =>
        {
            this._updateBadgeCount(navigation[variant], targetId, count, predicate);
        });
    }

    /**
     * Recursively update the badge count for the desired navigation item.
     */
    private _updateBadgeCount(
        items: FuseNavigationItem[] | undefined,
        targetId: string,
        count: number,
        predicate?: (item: FuseNavigationItem) => boolean,
    ): void
    {
        if ( !items?.length )
        {
            return;
        }

        items.forEach((item) =>
        {
            if ( item.id === targetId )
            {
                if ( predicate && !predicate(item) )
                {
                    // Skip items that don't satisfy the selection predicate.
                    return;
                }

                item.badge = {
                    ...item.badge,
                    title: String(count),
                };
            }

            if ( item.children?.length )
            {
                this._updateBadgeCount(item.children, targetId, count, predicate);
            }
        });
    }

    /**
     * Extract the awaiting payment count from the API response.
     */
    private _extractAwaitingPaymentCount(response: any): number
    {
        const collections = [
            response?.data,
            response?.data?.data,
            response?.results,
            response,
        ];

        const payments = collections.find((candidate) => Array.isArray(candidate)) as any[] | undefined;

        if ( !payments )
        {
            return 0;
        }

        return payments.filter((payment) => payment?.status === 'awaiting_payment').length;
    }

    /**
     * Extract in-progress order count from the API response.
     */
    private _extractInProgressOrderCount(response: any): number
    {
        const collections = [
            response?.data,
            response?.results,
            response,
        ];

        const orders = collections.find((candidate) => Array.isArray(candidate)) as any[] | undefined;

        if ( !orders )
        {
            return 0;
        }

        return orders.filter((order) => order?.status === 'in_progress').length;
    }

    /**
     * Extract awaiting summary count from the API response.
     */
    private _extractAwaitingSummaryOrderCount(response: any): number
    {
        const collections = [
            response?.data,
            response?.results,
            response,
        ];

        const orders = collections.find((candidate) => Array.isArray(candidate)) as any[] | undefined;

        if ( !orders )
        {
            return 0;
        }

        return orders.filter((order) => order?.status === 'awaiting_summary').length;
    }
}
