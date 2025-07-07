/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';

const badgeCount = 0;

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'customer.info',
        title: 'ข้อมูลลูกค้า',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'customer.info',
                title: 'ข้อมูลลูกค้า',
                type: 'basic',
            },
            {
                id: 'customer.info',
                title: 'ลูกค้า ยอดคงเหลือ',
                type: 'basic',
            },
            {
                id: 'customer.info',
                title: 'การใช้งานลูกค้า',
                type: 'basic',
            },
            {
                id: 'customer.info',
                title: 'อนุมัติที่อยู่ลูกค้า',
                type: 'basic',
            },
        ]
    },
    {
        id: 'sale-order',
        title: 'SO',
        type: 'collapsable',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [
            {
                id: 'sale-order.pr',
                title: 'ใบสั่งซื้อ',
                type: 'basic',
                link: '/follow-up',
                badge: {
                    title: '3',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },

            },
            {
                id: 'sale-order.crm',
                title: 'CRM',
                type: 'basic',
                // link: '/follow-up',
                // badge: {
                //     title: '3',
                //     classes: 'px-2 bg-red-600 text-white rounded-full',
                // },
            },
            {
                id: 'sale-order.claim',
                title: 'เคลม',
                type: 'basic',
                // link: '/follow-up',
                badge: {
                    title: '3',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },
            },
            {
                id: 'sale-order.assign',
                title: 'เปิดบิลฝากส่ง',
                type: 'basic',
                // link: '/follow-up',
                // badge: {
                //     title: '3',
                //     classes: 'px-2 bg-red-600 text-white rounded-full',
                // },
            },
        ]
    },
    {
        id: 'purchase-order',
        title: 'PO',
        type: 'collapsable',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [
            {
                id: 'purchase-order.po',
                title: 'PO',
                type: 'basic',
                // link: '/follow-up',
                badge: {
                    title: '3',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },

            },
            {
                id: 'purchase-order.refund',
                title: 'ร้านค้าคืนเงิน ',
                type: 'basic',
                // link: '/follow-up',
                // badge: {
                //     title: '3',
                //     classes: 'px-2 bg-red-600 text-white rounded-full',
                // },
            },
            {
                id: 'purchase-order.report-refund',
                title: 'รายงานคืนเงิน',
                type: 'basic',
                // link: '/follow-up',

            },
            {
                id: 'sale-order.purchase-report',
                title: 'Purchase Report',
                type: 'basic',
                // link: '/follow-up',
                // badge: {
                //     title: '3',
                //     classes: 'px-2 bg-red-600 text-white rounded-full',
                // },
            },
        ]
    },

    {
        id: 'payment',
        title: 'ชำระเงิน',
        type: 'collapsable',
        icon: 'heroicons_outline:credit-card',
        children: [
            {
                id: 'payment.topup',
                title: 'เติมเงิน',
                type: 'basic',
                // link: '/follow-up',
                badge: {
                    title: '3',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },

            },
            {
                id: 'payment.withdraw',
                title: 'ถอนเงิน ',
                type: 'basic',
                // link: '/follow-up',
                badge: {
                    title: '4',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },
            },
            {
                id: 'payment.statement',
                title: 'รายการเดินบัญชี',
                type: 'basic',
                // link: '/follow-up',

            },
            {
                id: 'payment.statement-transport',
                title: 'รายการเดินบัญชีค่าขนส่ง',
                type: 'basic',
                // link: '/follow-up',
                // badge: {
                //     title: '3',
                //     classes: 'px-2 bg-red-600 text-white rounded-full',
                // },
            },
            {
                id: 'payment.cr-dr',
                title: 'Cr/Dr',
                type: 'basic',
                // link: '/follow-up',
                // badge: {
                //     title: '3',
                //     classes: 'px-2 bg-red-600 text-white rounded-full',
                // },
            },
        ]
    },
    {
        id: 'warehouse',
        title: 'โกดัง',
        type: 'collapsable',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'warehouse.cn',
                title: 'CN',
                type: 'group',
                icon: 'heroicons_outline:bars-3',
                children: [
                    {
                        id: 'warehouse.cn.sign',
                        title: 'เซ็นต์รับสินค้า',
                        type: 'basic',
                        // link: '/follow-up',
                        // badge: {
                        //     title: '3',
                        //     classes: 'px-2 bg-red-600 text-white rounded-full',
                        // },
                    },
                    {
                        id: 'warehouse.cn.receipt-mobile',
                        title: 'Receipt-Mobile',
                        type: 'basic',
                        // link: '/follow-up',
                        // badge: {
                        //     title: '3',
                        //     classes: 'px-2 bg-red-600 text-white rounded-full',
                        // },
                    },
                    {
                        id: 'warehouse.cn.lost-owner',
                        title: 'สินค้าไม่ระบุเจ้าของ',
                        type: 'basic',
                        link: '/follow-up',
                        badge: {
                            title: '3',
                            classes: 'px-2 bg-red-600 text-white rounded-full',
                        },
                    },
                    {
                        id: 'warehouse.cn.pre-receipt',
                        title: 'เตรียมรับเข้าโกดัง',
                        type: 'basic',
                        // link: '/follow-up',
                        badge: {
                            title: '3',
                            classes: 'px-2 bg-yellow-600 text-white rounded-full',
                        },
                    },
                    {
                        id: 'warehouse.cn.cn',
                        title: 'โกดังจีน',
                        type: 'basic',
                        // link: '/follow-up',
                        badge: {
                            title: '3',
                            classes: 'px-2 bg-blue-600 text-white rounded-full',
                        },
                    },
                    {
                        id: 'warehouse.cn.packinglist',
                        title: 'จัดกระสอบเตรียมขึ้นตู้',
                        type: 'basic',
                        // link: '/follow-up',
                        badge: {
                            title: '3',
                            classes: 'px-2 bg-green-600 text-white rounded-full',
                        },
                    },
                ]
                // link: '/follow-up',
                // badge: {
                //     title: '3',
                //     classes: 'px-2 bg-red-600 text-white rounded-full',
                // },
            },
            {
                id: 'warehouse.th',
                title: 'TH',
                type: 'group',
                icon: 'heroicons_outline:archive-box',
                children: [
                    {
                        id: 'warehouse.th.container1',
                        title: 'ตู้คอนเทนเนอร์',
                        type: 'basic',
                    },
                    {
                        id: 'warehouse.th.container2',
                        title: 'ตู้คอนเทนเนอร์ 2',
                        type: 'basic',
                    },
                    {
                        id: 'warehouse.th.th-warehouse',
                        title: 'โกดังไทย',
                        type: 'basic',
                        badge: {
                            title: '405',
                            classes: 'px-2 bg-red-600 text-white rounded-full',
                        },
                    },
                    {
                        id: 'warehouse.th.prepare-shipment',
                        title: 'เตรียมส่งของ',
                        type: 'basic',
                        badge: {
                            title: '35',
                            classes: 'px-2 bg-blue-600 text-white rounded-full',
                        },
                    },
                    {
                        id: 'warehouse.th.prepare-shipment-address',
                        title: 'เตรียมส่งของ ( ปริ้นที่อยู่ )',
                        type: 'basic',
                    },
                    {
                        id: 'warehouse.th.report-shipment',
                        title: 'รายงานส่งของ',
                        type: 'basic',
                    },
                    {
                        id: 'warehouse.th.successful-delivery',
                        title: 'ส่งสำเร็จ',
                        type: 'basic',
                    },
                ],
            }

        ]
    },
    {
        id: 'report',
        title: 'รายงาน',
        type: 'collapsable',
        icon: 'heroicons_outline:truck',
        children: [
            {
                id: 'report.container',
                title: 'ตู้คอนเทนเนอร์',
                type: 'basic',
            },
            {
                id: 'report.box-info',
                title: 'ข้อมูลกล่องพัสดุ',
                type: 'basic',
            },
            {
                id: 'report.kpi',
                title: 'KPI',
                type: 'basic',
            },
            {
                id: 'report.kpi-finder',
                title: 'KPI คนหาของ',
                type: 'basic',
            },
            {
                id: 'report.kpi-customer',
                title: 'KPI ลูกค้า',
                type: 'basic',
            },
            {
                id: 'report.stock-wait',
                title: 'ของค้างสต๊อก',
                type: 'basic',
            },
            {
                id: 'report.kpi-sopo',
                title: 'KPI SO PO',
                type: 'basic',
            },
            {
                id: 'report.extra-charge',
                title: 'รายงานค่าใช้จ่ายเพิ่มเติม',
                type: 'basic',
            },
            {
                id: 'report.commissions',
                title: 'Commissions',
                type: 'basic',
            },
            {
                id: 'report.fix-history',
                title: 'ประวัติการแก้ไขขนส่ง',
                type: 'basic',
            },
            {
                id: 'report.customer-register',
                title: 'Report Customer Register',
                type: 'basic',
            },
            {
                id: 'report.channel',
                title: 'Report Channel',
                type: 'basic',
            },
            {
                id: 'report.po',
                title: 'Report PO',
                type: 'basic',
            },
        ],
    },
    {
        id: 'settings',
        title: 'ตั้งค่า',
        type: 'collapsable',
        icon: 'heroicons_outline:cog-6-tooth',
        children: [
            {
                id: 'settings.user-management',
                title: 'การจัดการผู้ดูแลระบบ',
                type: 'basic',
            },
            {
                id: 'settings.exchange-rate',
                title: 'อัตราค่าแลกเปลี่ยน',
                type: 'basic',
            },
        ],
    }




];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'admin.dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-check',
        link: '/dashboard'
    },
    {
        id: 'self-employee',
        title: 'รายการรวมพัสดุ',
        type: 'collapsable',

        children: [
            {
                id: 'self-employee',
                title: 'รายการพัสดุเข้าคลัง/PO',
                type: 'basic',
                link: '/po',
            },
            {
                id: 'self-employee',
                title: 'พาเลท/Pallet',
                type: 'basic',
                link: '/pallet',
            },
            {
                id: 'self-employee',
                title: 'กระสอบ',
                type: 'basic',
                link: '/sack',
            },
            {
                id: 'self-employee',
                title: 'Shipment',
                type: 'basic',
                link: '/delivery',
            },
            {
                id: 'self-employee',
                title: 'Packing list',
                type: 'basic',
                link: '/lot',
            },
        ],
    },
    {
        id: 'warehouse',
        title: 'โกดังไทย',
        type: 'collapsable',
        icon: 'heroicons_outline:archive-box',

        children: [
            {
                id: 'self-employee',
                title: 'รายการรับเข้า',
                type: 'basic',
                link: '/thai-warehouse',
            },
        ],
    },
    {
        id: 'member',
        title: 'รายการสมาชิก',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        link: '/member'
    },
    // {
    //     id: 'service',
    //     title: 'บริการ',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:folder-arrow-down',
    // },
    // {
    //     id: 'document',
    //     title: 'เอกสาร',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:document-text',
    //     link: '/document'
    // },
    // {
    //     id: 'api',
    //     title: 'API',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:square-3-stack-3d',
    //     link: '/api'
    // },
    {
        id: 'service',
        title: 'บริการ',
        type: 'collapsable',
        icon: 'heroicons_outline:window',
        children: [
            {
                id: 'service-user',
                title: 'เอกสาร',
                type: 'collapsable',

                children: [
                    {
                        id: 'service-user-1',
                        title: 'ใบแจ้งหนี้',
                        type: 'basic',
                        link: '/invoice',

                    },
                    {
                        id: 'service-user-1',
                        title: 'ใบส่งของ',
                        type: 'basic',
                        link: '/delivery-note',
                    },
                ]
            },
        ],
    },
    {
        id: 'application',
        title: 'แอปพลิเคชัน',
        type: 'collapsable',
        icon: 'heroicons_outline:window',
    },
    {
        id: 'setting',
        title: 'ตั้งค่า',
        type: 'collapsable',
        icon: 'heroicons_outline:cog-8-tooth',
        link: '/setting'
    },

    {
        id: 'admin.logout',
        title: 'ออกจากระบบ',
        type: 'basic',
        icon: 'heroicons_outline:arrow-left-on-rectangle',
        link: '/sign-out',
    },
];
