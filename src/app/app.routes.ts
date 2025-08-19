import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },

        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'dashboards', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes') },
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes') },
            { path: 'user', loadChildren: () => import('app/modules/admin/user/user.routes') },
            { path: 'branch', loadChildren: () => import('app/modules/admin/branch/page.routes') },
            { path: 'banner', loadChildren: () => import('app/modules/admin/banner/banner.routes') },
            { path: 'member', loadChildren: () => import('app/modules/admin/member/member.routes') },
            { path: 'panel', loadChildren: () => import('app/modules/admin/panel/page.routes') },
            { path: 'category', loadChildren: () => import('app/modules/admin/category/page.routes') },
            { path: 'product', loadChildren: () => import('app/modules/admin/product/page.routes') },
            { path: 'report', loadChildren: () => import('app/modules/admin/report/report.routes') },
            { path: 'store', loadChildren: () => import('app/modules/admin/store/page.routes') },
            { path: 'promotion', loadChildren: () => import('app/modules/admin/promotion/page.routes') },
            { path: 'unit', loadChildren: () => import('app/modules/admin/unit/page.routes') },
            { path: 'profile', loadChildren: () => import('app/modules/admin/profile/profile.routes') },
            { path: 'shift', loadChildren: () => import('app/modules/admin/shift/shift.routes') },
            { path: 'credit', loadChildren: () => import('app/modules/admin/credit/credit.routes') },
            { path: 'device', loadChildren: () => import('app/modules/admin/device/page.routes') },
            { path: 'faq', loadChildren: () => import('app/modules/admin/faq/page.routes') },
            { path: 'department', loadChildren: () => import('app/modules/admin/department/page.routes') },
            { path: 'position', loadChildren: () => import('app/modules/admin/position/page.routes') },
            { path: 'category-news', loadChildren: () => import('app/modules/admin/category-news/page.routes') },
            { path: 'news', loadChildren: () => import('app/modules/admin/news/page.routes') },
            { path: 'question-master', loadChildren: () => import('app/modules/admin/question-master/page.routes') },
            { path: 'service', loadChildren: () => import('app/modules/admin/service/page.routes') },
            { path: 'tap-log', loadChildren: () => import('app/modules/admin/tap-log/page.routes') },
            { path: 'order', loadChildren: () => import('app/modules/admin/order/order.routes') },
            { path: 'role', loadChildren: () => import('app/modules/admin/rightinfo/page.routes') },
            { path: 'po', loadChildren: () => import('app/modules/admin/stock/po/page.routes') },
            { path: 'po-detail', loadChildren: () => import('app/modules/admin/stock/po/po_detail/page.routes') },
            { path: 'po-edit', loadChildren: () => import('app/modules/admin/stock/po/po_edit/page.routes') },
            { path: 'pallet', loadChildren: () => import('app/modules/admin/stock/pallet/page.routes') },
            { path: 'pallet-detail', loadChildren: () => import('app/modules/admin/stock/pallet/pallet_detail/page.routes') },
            { path: 'pallet-edit', loadChildren: () => import('app/modules/admin/stock/pallet/pallet_edit/page.routes') },
            { path: 'pallet-form', loadChildren: () => import('app/modules/admin/stock/pallet/pallet_form/page.routes') },
            { path: 'sack', loadChildren: () => import('app/modules/admin/stock/sack/page.routes') },
            // { path: 'sack-detail', loadChildren: () => import('app/modules/admin/stock/sack/sack_detail/page.routes')},
            // { path: 'sack-edit', loadChildren: () => import('app/modules/admin/stock/sack/sack_edit/page.routes')},
            { path: 'delivery', loadChildren: () => import('app/modules/admin/stock/delivery/page.routes') },
            // { path: 'delivery-detail', loadChildren: () => import('app/modules/admin/stock/delivery/delivery_detail/page.routes')},
            // { path: 'delivery-edit', loadChildren: () => import('app/modules/admin/stock/delivery/delivery_edit/page.routes')},
            { path: 'lot', loadChildren: () => import('app/modules/admin/stock/lot/page.routes') },
            // { path: 'lot-detail', loadChildren: () => import('app/modules/admin/stock/lot_/lot_detail/page.routes')},
            { path: 'stores', loadChildren: () => import('app/modules/admin/stores/page.routes') },
            { path: 'category-product', loadChildren: () => import('app/modules/admin/category_product/page.routes') },
            { path: 'rate', loadChildren: () => import('app/modules/admin/rate/page.routes') },
            { path: 'transport', loadChildren: () => import('app/modules/admin/transport/page.routes') },
            { path: 'order-products', loadChildren: () => import('app/modules/admin/order-products/order-products.routes') },
            { path: 'delivery_orders', loadChildren: () => import('app/modules/admin/delivery_orders/delivery_orders.routes') },
            { path: 'product-type-import', loadChildren: () => import('app/modules/admin/product-type-import/page.routes') },
            { path: 'category-fee', loadChildren: () => import('app/modules/admin/category-fee/page.routes') },
            { path: 'fee', loadChildren: () => import('app/modules/admin/fee/page.routes') },
            { path: 'category-manual', loadChildren: () => import('app/modules/admin/category-manual/page.routes') },
            { path: 'manual', loadChildren: () => import('app/modules/admin/manual/page.routes') },
            { path: 'alipay', loadChildren: () => import('app/modules/admin/aliplay/alipay.routes') },
            { path: 'deposit-pay-products', loadChildren: () => import('app/modules/admin/deposit-pay-products/page.routes') },
            { path: 'setting-company', loadChildren: () => import('app/modules/admin/setting-company/page.routes') },
            // { path: 'chat', loadChildren: () => import('app/modules/admin/chat/chat.routes')},
            { path: 'chat', loadChildren: () => import('app/modules/admin/chat/page.routes') },
            { path: 'problem-topic', loadChildren: () => import('app/modules/admin/problem-topic/page.routes') },
            { path: 'problem-by-topic', loadChildren: () => import('app/modules/admin/problem-by-topic/page.routes') },
            { path: 'problem-report', loadChildren: () => import('app/modules/admin/problem-report/page.routes') },
            { path: 'setting-app', loadChildren: () => import('app/modules/admin/setting-app/page.routes') },
            { path: 'problem-topic', loadChildren: () => import('app/modules/admin/problem-topic/page.routes') },
            { path: 'problem-by-topic', loadChildren: () => import('app/modules/admin/problem-by-topic/page.routes') },
            { path: 'import-product-order', loadChildren: () => import('app/modules/admin/import-product-order/import-product-order.routes') },
            { path: 'profile', loadChildren: () => import('app/modules/admin/profile/profile.routes') },
            { path: 'help-good-lost', loadChildren: () => import('app/modules/admin/help-good-lost/page.routes') },
            { path: 'profile', loadChildren: () => import('app/modules/admin/profile/profile.routes') },
            { path: 'thai-warehouse', loadChildren: () => import('app/modules/admin/thai-warehouse/page.routes') },
            { path: 'delivery-note', loadChildren: () => import('app/modules/admin/delivery-note/page.routes') },
            { path: 'invoice', loadChildren: () => import('app/modules/admin/invoice/page.routes') },
            { path: 'vendor', loadChildren: () => import('app/modules/admin/vendor/vendor.routes') },
            { path: 'advert', loadChildren: () => import('app/modules/admin/advert/advert.routes') },
            { path: 'packaging', loadChildren: () => import('app/modules/admin/packaging/packaging.routes') },
            { path: 'transport-type', loadChildren: () => import('app/modules/admin/transport-type/transport-type.routes') },
            { path: 'route-path', loadChildren: () => import('app/modules/admin/route-path/route-path.routes') },
            { path: 'setting', loadChildren: () => import('app/modules/admin/setting/setting.routes') },
            { path: 'home-banner', loadChildren: () => import('app/modules/admin/home-banner/home-banner.routes') },
            { path: 'expense-record', loadChildren: () => import('app/modules/admin/expense-record/expense-record.routes') },
            { path: 'point-record', loadChildren: () => import('app/modules/admin/point-record/point-record.routes') },
            { path: 'articles', loadChildren: () => import('app/modules/admin/article/article.routes') },
            { path: 'claim', loadChildren: () => import('app/modules/admin/claim/page.routes') },
            { path: 'customer', loadChildren: () => import('app/modules/admin/customer/customer.routes') },
            { path: 'follow-up', loadChildren: () => import('app/modules/admin/follow-up/follow-up.routes') },
            { path: 'sale-order', loadChildren: () => import('app/modules/admin/sale-order/page.routes') },
            { path: 'delivery-form', loadChildren: () => import('app/modules/admin/delivery-form/page.routes') },
            { path: 'order-request', loadChildren: () => import('app/modules/admin/order-request/order-request.routes') },
            { path: 'purchase-order', loadChildren: () => import('app/modules/admin/purchase-order/page.routes') },
            { path: 'fee-rate', loadChildren: () => import('app/modules/admin/fee-rate/fee-rate.routes') },
            { path: 'exchange-rate', loadChildren: () => import('app/modules/admin/exchange-rate/exchange-rate.routes') },
            { path: 'shipping-rates', loadChildren: () => import('app/modules/admin/shipping-rates/page.routes') },
        ]
    }
];
