import { FuseNavigationItem } from '@fuse/components/navigation';

const createNavigationItems = (): FuseNavigationItem[] => [
    {
        id: 'order.create',
        title: 'สั่งสินค้า',
        type: 'basic',
        icon: 'heroicons_outline:shopping-bag',
        link: '/order-products/create',
    },
    {
        id: 'profile',
        title: 'โปรไฟล์',
        type: 'basic',
        icon: 'heroicons_outline:user-circle',
        link: '/profile',
    },
    {
        id: 'order.history',
        title: 'ประวัติการสั่งสินค้า',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/order-products',
    },
    {
        id: 'sign-out',
        title: 'ออกจากระบบ',
        type: 'basic',
        icon: 'heroicons_outline:arrow-right-on-rectangle',
        link: '/sign-out',
    },
];

export const defaultNavigation: FuseNavigationItem[] = createNavigationItems();
export const compactNavigation: FuseNavigationItem[] = createNavigationItems();
export const futuristicNavigation: FuseNavigationItem[] = createNavigationItems();
export const horizontalNavigation: FuseNavigationItem[] = createNavigationItems();
