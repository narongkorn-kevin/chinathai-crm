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
        id: 'follow-up',
        title: 'Case Follow up',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [
            {
                id: 'case-follow-up',
                title: 'รายการ Follow up',
                type: 'basic',
                link: '/follow-up',
                badge: {
                    title: '3',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },

            },
        ]
    },
    {
        id: 'sale',
        title: 'รายการฝากสั่งซื้อ',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [
            {
                id: 'sale-list',
                title: 'รายการฝากสั่งซื้อ',
                type: 'basic',
                badge: {
                    title: '2',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },
                link: '/order/approve',
            },
            {
                id: 'sale-list-assign',
                title: 'รายการฝากสั่งสินค้าที่รับผิดชอบ',
                type: 'basic',
                ...(badgeCount > 0 && {
                    badge: {
                        title: String(badgeCount),
                        classes: 'px-2 bg-red-600 text-white rounded-full',
                    },
                }),
                link: '/order/admin',
            },
            {
                id: 'sale-claim',
                title: 'เคลมออร์เดอร์',
                type: 'basic',
                link: '/claim',
                badge: {
                    title: '3',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },
            },
        ]
    },
    {
        id: 'approve',
        title: 'รายการอนุมัติ',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [
            {
                id: 'approve-payment',
                title: 'การชำระเงินของลูกค้า',
                type: 'basic',
                // link: '/member',
            },
            {
                id: 'approve-refound-bank',
                title: 'คืนเงินเข้าบัญชีลูกค้า',
                type: 'basic',
                // link: '/member',
            },
            {
                id: 'approve-refound-wallet',
                title: 'คืนเงินเข้า Wallet ลูกค้า',
                type: 'basic',
                // link: '/member',
            },
            {
                id: 'approve-topup-wallet',
                title: 'เติมเงินเข้า Wallet ลูกค้า',
                type: 'basic',
                // link: '/member',
            },
            {
                id: 'transaction-list',
                title: 'รายการ Transaction ทั้งหมด',
                type: 'basic',
                // link: '/member',
            },
        ]
    },
    {
        id: 'warehouse-china',
        title: 'โกดังจีน',
        type: 'group',
        children: [
            {
                id: 'po-china-list',
                title: 'รายการสินค้าทั้งหมดจากจีน',
                type: 'basic',
                link: 'delivery_orders'
            },
            {
                id: 'po-wait-list',
                title: 'รายการรอสินค้าเข้าโกดังจีน',
                type: 'basic',
            },
            {
                id: 'po-in-list',
                title: 'รายการรับเข้าโกดัง (รอออก)',
                type: 'basic',
            },
            {
                id: 'po-wait-thai-list',
                title: 'รายการสินค้ารอเข้าไทย',
                type: 'basic',
            },

        ]
    },
    {
        id: 'warehouse-thai',
        title: 'โกดังไทย',
        type: 'group',
        children: [
            {
                id: 'in-thai',
                title: 'BKK Scan-in',
                type: 'basic',
                link: 'thai-warehouse'
            },
            {
                id: 'track-check',
                title: 'ตรวจสอบข้อมูลแทรค',
                type: 'basic',
            },
            {
                id: 'item-in-thai',
                title: 'สินค้าในคลังทั้งหมด',
                type: 'basic',
            },
            {
                id: 'no-owner',
                title: 'สินค้าไม่มีเจ้าของ',
                type: 'basic',
            }, {
                id: 'find-owner',
                title: 'แจ้งหาพัสดุไม่มีรหัส-ไม่มีสถานะ',
                type: 'basic',
            },

        ]
    },
    {
        id: 'delivery',
        title: 'การจัดส่ง',
        type: 'group',
        children: [
            {
                id: 'scan-out-customer',
                title: 'แสกนของออก-ลูกค้ารับสินค้าเอง',
                type: 'basic',
            },
            {
                id: 'scan-out-history',
                title: 'ประวัติการแสกนออก',
                type: 'basic',
            },
            {
                id: 'delivery-list',
                title: 'รายการจัดส่งสินค้า',
                type: 'basic',
            },
        ]
    },
    {
        id: 'report',
        title: 'การจัดส่ง',
        type: 'group',
        children: [
            {
                id: 'packing-list',
                title: 'Packing List',
                type: 'basic',
            },

        ]
    },
    {
        id: 'setting',
        title: 'การจัดส่ง',
        type: 'group',
        children: [
            {
                id: 'setting-standard',
                title: 'ตั้งค่าข้อมูลมาตราฐาน',
                type: 'basic',
            },
            {
                id: 'setting-payment-time',
                title: 'กำหนดเวลาการชำระเงินค่าสินค้า',
                type: 'basic',
            },
            {
                id: 'setting-warehouse-location',
                title: 'ที่อยู่คลัง',
                type: 'basic',
            },
            {
                id: 'setting-service-rate',
                title: 'อัตราค่าบริการ',
                type: 'basic',
            },
            {
                id: 'setting-exchange-rate',
                title: 'อัตราแลกเปลี่ยน',
                type: 'basic',
            },
            {
                id: 'setting-bank-account',
                title: 'บัญชีธนาคาร',
                type: 'basic',
            },
            {
                id: 'setting-shipping',
                title: 'การจัดส่งสินค้า',
                type: 'basic',
            },
            {
                id: 'setting-notifications',
                title: 'ข้อความแจ้งเตือน',
                type: 'basic',
            },
            {
                id: 'setting-users',
                title: 'จัดการผู้ใช้งานระบบ',
                type: 'basic',
            },
            {
                id: 'setting-glossary',
                title: 'คลังคำศัพท์(จีน/อังกฤษ/ไทย)',
                type: 'basic',
            },
            {
                id: 'setting-announcement',
                title: 'ข้อความประกาศ',
                type: 'basic',
            },
            {
                id: 'setting-terms',
                title: 'เงื่อนไขการให้บริการ',
                type: 'basic',
            },
            {
                id: 'setting-manual',
                title: 'คู่มือการใช้งาน',
                type: 'basic',
            },
            {
                id: 'setting-faq',
                title: 'คำถามที่พบบ่อย',
                type: 'basic',
            },
            {
                id: 'setting-news',
                title: 'ข่าวสาร',
                type: 'basic',
            },
            {
                id: 'setting-banner',
                title: 'แบนเนอร์',
                type: 'basic',
            },
        ]
    },

    // {
    //     id: 'self-employee',
    //     title: 'รายการรวมพัสดุ',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:archive-box',
    //     children: [
    //         {
    //             id: 'self-employee',
    //             title: 'รายการพัสดุเข้าคลัง/PO',
    //             type: 'basic',
    //             // link: '/po',
    //             link: '/delivery_orders',
    //         },
    //         {
    //             id: 'self-employee',
    //             title: 'พาเลท/Pallet',
    //             type: 'basic',
    //             link: '/pallet',
    //         },
    //         {
    //             id: 'self-employee',
    //             title: 'กระสอบ',
    //             type: 'basic',
    //             link: '/sack',
    //         },
    //         {
    //             id: 'self-employee',
    //             title: 'Shipment',
    //             type: 'basic',
    //             link: '/delivery',
    //         },
    //         {
    //             id: 'self-employee',
    //             title: 'Packing list',
    //             type: 'basic',
    //             link: '/lot',
    //         },
    //     ],
    // },
    // {
    //     id: 'warehouse',
    //     title: 'โกดังไทย',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:archive-box',
    //     children: [
    //         {
    //             id: 'thai-warehouse',
    //             title: 'รายการรับเข้า',
    //             type: 'basic',

    //             link: '/thai-warehouse'
    //         },
    //     ]
    // },
    // {
    //     id: 'member',
    //     title: 'รายการสมาชิก',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:user-group',
    //     children: [
    //         {
    //             id: 'member-user',
    //             title: 'สมาชิก',
    //             type: 'basic',
    //             link: '/member',

    //         },
    //         {
    //             id: 'member-agent',
    //             title: 'Agent group',
    //             type: 'basic',


    //         },
    //         {
    //             id: 'member-agent',
    //             title: 'เปิดกระสอบรายเดือน',
    //             type: 'basic',


    //         },
    //         {
    //             id: 'member-agent',
    //             title: 'กลุ่มลูกค้า',
    //             type: 'basic',


    //         },
    //         {
    //             id: 'member-agent',
    //             title: 'ผู้นำเข้า Paperless',
    //             type: 'basic',


    //         },
    //         {
    //             id: 'member-agent',
    //             title: 'เรทราคาค่าส่ง',
    //             type: 'basic',


    //         },
    //     ]
    // },
    // {
    //     id: 'service',
    //     title: 'บริการ',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:user-group',
    //     children: [
    //         {
    //             id: 'service-user',
    //             title: 'ฝากสั่งสินค้า',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'service-user-1',
    //                     title: 'รายการฝากสั่งสินค้า',
    //                     type: 'basic',
    //                     link: '/order-products',

    //                 },
    //                 {
    //                     id: 'service-user-1',
    //                     title: 'รายการชำระค่าขนส่ง',
    //                     type: 'basic',
    //                     link: '/order-products',

    //                 },
    //             ]
    //         },
    //         {
    //             id: 'service-user',
    //             title: 'ฝากชำระสินค้า',
    //             type: 'basic',
    //             link: '/deposit-pay-products',
    //         },
    //         {
    //             id: 'service-user',
    //             title: 'เติม Alipay',
    //             type: 'basic',
    //             link: '/aliplay',
    //         },
    //         {
    //             id: 'service-user',
    //             title: 'นำเข้าถูกต้อง',
    //             type: 'basic',
    //             link: '/import-product-order'
    //         },
    //         {
    //             id: 'service-user',
    //             title: 'เอกสาร',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'service-user-1',
    //                     title: 'ใบแจ้งหนี้',
    //                     type: 'basic',
    //                     link: '/invoice',

    //                 },
    //                 {
    //                     id: 'service-user-1',
    //                     title: 'ใบส่งของ',
    //                     type: 'basic',
    //                     link: '/delivery-note',
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'service-user',
    //             title: 'บัญชี',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'service-user-1',
    //                     title: 'บริการขนส่ง',
    //                     type: 'basic',

    //                 },
    //                 {
    //                     id: 'service-user-1',
    //                     title: 'ฐานข้อมูลลูกค้าทางบัญชี',
    //                     type: 'basic',

    //                 },
    //             ]
    //         },
    //     ]
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
    // {
    //     id: 'application',
    //     title: 'แอปพลิเคชัน',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:window',
    //     children: [
    //         {
    //             id: 'application-1',
    //             title: 'การจัดการเนื้อหา',
    //             type: 'collapsable',
    //             children: [
    //                 {
    //                     id: 'application-2',
    //                     title: 'บทความ',
    //                     type: 'basic',
    //                     link: '/articles/article'
    //                 },
    //                 {
    //                     id: 'application-2',
    //                     title: 'คู่มือการใช้งาน',
    //                     type: 'basic',
    //                     link: '/manual',
    //                 },
    //                 {
    //                     id: 'application-2',
    //                     title: 'เกี่ยวกับเรา',
    //                     type: 'basic',

    //                 },
    //                 {
    //                     id: 'application-2',
    //                     title: 'โฆษณาติดขอบ',
    //                     type: 'basic',
    //                     link: '/advert'

    //                 },
    //                 {
    //                     id: 'application-2',
    //                     title: 'เชื่อมโยงไปยังร้านค้า',
    //                     type: 'basic',
    //                     link: '/vendor'
    //                 },
    //                 {
    //                     id: 'application-3',
    //                     title: 'แบนเนอร์หน้าแรก',
    //                     type: 'basic',
    //                     link: '/home-banner'
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'application-2',
    //             title: 'วอลเล็ท',
    //             type: 'collapsable',
    //             children: [
    //                 {
    //                     id: 'application-3',
    //                     title: 'บันทึกการใช้จ่าย',
    //                     type: 'basic',
    //                     link: '/expense-record',
    //                 },
    //                 {
    //                     id: 'application-4',
    //                     title: 'บันทึกคะแนน',
    //                     type: 'basic',
    //                     link: '/point-record',
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'application-2',
    //             title: 'แจ้งข้อมูลพัสดุผิด',
    //             type: 'basic',
    //             link: '/help-good-lost'
    //         },
    //         {
    //             id: 'application-2',
    //             title: 'ติดต่อกับลูกค้า',
    //             type: 'basic',
    //             link: '/chat',
    //         },
    //     ]
    // },
    // {
    //     id: 'setting',
    //     title: 'ตั้งค่า',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:cog-8-tooth',
    //     children: [
    //         {
    //             id: 'setting-faq',
    //             title: 'การจัดการที่อยู่โกดัง',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'faq-1',
    //                     title: 'โกดังจีน',
    //                     type: 'basic',
    //                     link: '/stores'
    //                 },
    //                 {
    //                     id: 'faq-1',
    //                     title: 'โกดังไทย',
    //                     type: 'basic',
    //                     link: '/setting/thai-warehouse'
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'setting-faq',
    //             title: 'การจัดการขนส่ง',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'faq-1',
    //                     title: 'รายชื่อขนส่งในไทย',
    //                     type: 'basic',

    //                     link: '/transport'
    //                 },
    //                 {
    //                     id: 'faq-1',
    //                     title: 'สายรถ',
    //                     type: 'basic',
    //                     link: '/route-path'
    //                 },
    //                 {
    //                     id: 'faq-1',
    //                     title: 'ประเภทการขนส่ง',
    //                     type: 'basic',
    //                     link: '/transport-type'
    //                 },
    //                 {
    //                     id: 'setting-rate',
    //                     title: 'อัตราค่าส่ง',
    //                     type: 'basic',
    //                     link: '/rate',
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'setting-faq',
    //             title: 'ข่าว',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'setting-category-news',
    //                     title: 'ประเภทข่าว',
    //                     type: 'basic',

    //                     link: '/category-news',
    //                 },
    //                 {
    //                     id: 'setting-news',
    //                     title: 'ข่าว',
    //                     type: 'basic',

    //                     link: '/news',
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'setting-faq',
    //             title: 'อัตราแลกเปลี่ยน',
    //             type: 'basic',

    //         },
    //         {
    //             id: 'setting-faq',
    //             title: 'อัตราค่าธรรมเนียม',
    //             type: 'basic',

    //         },
    //         {
    //             id: 'setting-packaging',
    //             title: 'รูปแบบบรรจุภัณฑ์',
    //             type: 'basic',
    //             link: '/packaging'
    //         },
    //         {
    //             id: 'setting-faq',
    //             title: 'ผู้ใช้งาน',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'setting-question',
    //                     title: 'รายชื่อผู้ใช้งาน',
    //                     type: 'basic',

    //                     link: '/user',
    //                 },
    //                 {
    //                     id: 'setting-department',
    //                     title: 'แผนก',
    //                     type: 'basic',

    //                     link: '/department',
    //                 },
    //                 {
    //                     id: 'setting-position',
    //                     title: 'ตำแหน่ง',
    //                     type: 'basic',

    //                     link: '/position',
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'setting-item',
    //             title: 'การจัดการสินค้า',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'setting-category-product',
    //                     title: 'ประเภทสินค้า',
    //                     type: 'basic',
    //                     link: '/category-product',
    //                 },
    //                 {
    //                     id: 'product-type-import',
    //                     title: 'ประเภทสินค้าสำหรับนำเข้า',
    //                     type: 'basic',

    //                     link: '/product-type-import'
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'setting-other',
    //             title: 'ข้อมูลทั่วไป',
    //             type: 'collapsable',

    //             children: [
    //                 {
    //                     id: 'setting-faq',
    //                     title: 'FAQ',
    //                     type: 'basic',
    //                     link: '/faq',
    //                 },

    //                 {
    //                     id: 'setting-question',
    //                     title: 'แบบสอบถาม',
    //                     type: 'basic',
    //                     link: '/question-master',
    //                 },
    //                 {
    //                     id: 'setting-question',
    //                     title: 'บริการ',
    //                     type: 'basic',
    //                     link: '/service',
    //                 },
    //                 {
    //                     id: 'setting-category-fee',
    //                     title: 'ประเภทค่าธรรมเนียม',
    //                     type: 'basic',
    //                     link: '/category-fee',
    //                 },
    //                 {
    //                     id: 'setting-fee',
    //                     title: 'ค่าธรรมเนียม',
    //                     type: 'basic',
    //                     link: '/category-fee',
    //                 },
    //                 {
    //                     id: 'setting-category-manual',
    //                     title: 'ประเภทคู่มือ',
    //                     type: 'basic',
    //                     link: '/category-manual',
    //                 },
    //                 {
    //                     id: 'setting-category-manual',
    //                     title: 'ตั้งค่าข้อมูลบริษัท',
    //                     type: 'basic',
    //                     link: '/setting-company',
    //                 },
    //                 {
    //                     id: 'setting-category-manual',
    //                     title: 'ตั้งค่าแอปพลิเคชัน',
    //                     type: 'basic',
    //                     link: '/setting-app',
    //                 },
    //                 {
    //                     id: 'setting-problem-topic',
    //                     title: 'หัวข้อแจ้งปัญหา',
    //                     type: 'basic',
    //                     link: '/problem-topic',
    //                 },
    //                 {
    //                     id: 'setting-problem-by-topic',
    //                     title: 'รายการปัญหาตามหัวข้อ',
    //                     type: 'basic',
    //                     link: '/problem-by-topic',
    //                 },
    //                 {
    //                     id: 'setting-problem-by-topic',
    //                     title: 'แจ้งปัญหา',
    //                     type: 'basic',
    //                     link: '/problem-report',
    //                 },
    //             ]
    //         },

    //     ],
    // },
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
