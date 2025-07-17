/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';

const badgeCount = 0;

var langues = localStorage.getItem('lang'); //th en cn

const menuTitles = {
    dashboard: { th: "Dashboard", en: "Dashboard", cn: "仪表板" },

    self_employee: { th: "รายการรวมพัสดุ", en: "Package List", cn: "包裹列表" },
    delivery_orders: { th: "รายการพัสดุเข้าคลัง/PO", en: "Warehouse/PO Parcels", cn: "仓库/PO 包裹" },
    pallet: { th: "พาเลท/Pallet", en: "Pallet", cn: "托盘" },
    sack: { th: "กระสอบ", en: "Sack", cn: "袋子" },
    delivery: { th: "Shipment", en: "Shipment", cn: "货运" },
    lot: { th: "Packing list", en: "Packing List", cn: "装箱单" },

    warehouse: { th: "โกดังไทย", en: "Thai Warehouse", cn: "泰国仓库" },
    thai_warehouse: { th: "รายการรับเข้า", en: "Inbound List", cn: "入库清单" },

    member: { th: "รายการสมาชิก", en: "Member List", cn: "会员列表" },
    member_user: { th: "สมาชิก", en: "Member", cn: "会员" },
    agent_group: { th: "Agent group", en: "Agent Group", cn: "代理组" },
    sack_month: { th: "เปิดกระสอบรายเดือน", en: "Monthly Sack Opening", cn: "每月开袋" },
    member_group: { th: "กลุ่มลูกค้า", en: "Customer Group", cn: "客户组" },
    paperless: { th: "ผู้นำเข้า Paperless", en: "Paperless Importer", cn: "无纸化进口商" },
    shipping_rates: { th: "เรทราคาค่าส่ง", en: "Shipping Rates", cn: "运费率" },

    service: { th: "บริการ", en: "Service", cn: "服务" },
    serviceUser: { th: "ฝากสั่งสินค้า", en: "Place an Order", cn: "代订商品" },
    orderList: { th: "รายการฝากสั่งสินค้า", en: "Order List", cn: "订单列表", },
    shippingPayment: { th: "รายการชำระค่าขนส่ง", en: "Shipping Payment List", cn: "运输付款列表", },
    serviceDeposit: { th: "ฝากชำระสินค้า", en: "Deposit Payment", cn: "商品支付" },
    serviceAlipay: { th: "เติม Alipay", en: "Top up Alipay", cn: "充值支付宝" },
    serviceImport: { th: "นำเข้าถูกต้อง", en: "Correct Import", cn: "正确导入" },
    reportIncorrectParcel: { th: "แจ้งข้อมูลพัสดุผิด", en: "Report Incorrect Parcel", cn: "报告错误包裹" },
    serviceDocument: { th: "เอกสาร", en: "Documents", cn: "文件" },
    serviceInvoice: { th: "ใบแจ้งหนี้", en: "Invoice", cn: "发票" },
    serviceDeliveryNote: { th: "ใบส่งของ", en: "Delivery Note", cn: "送货单" },
    serviceAccount: { th: "บัญชี", en: "Account", cn: "账户" },
    serviceTransport: { th: "บริการขนส่ง", en: "Transport Services", cn: "运输服务" },
    serviceCustomerDatabase: { th: "ฐานข้อมูลลูกค้าทางบัญชี", en: "Accounting Customer Database", cn: "会计客户数据库" },

    application: { th: "แอปพลิเคชัน", en: "Application", cn: "应用程序" },
    contentManagement: { th: "การจัดการเนื้อหา", en: "Content Management", cn: "内容管理" },
    articles: { th: "บทความ", en: "Articles", cn: "文章" },
    manual: { th: "คู่มือการใช้งาน", en: "User Manual", cn: "用户手册" },
    aboutUs: { th: "เกี่ยวกับเรา", en: "About Us", cn: "关于我们" },
    advertisement: { th: "โฆษณาติดขอบ", en: "Side Advertisements", cn: "侧边广告" },
    linkToStore: { th: "เชื่อมโยงไปยังร้านค้า", en: "Link to Store", cn: "链接到商店" },
    homeBanner: { th: "แบนเนอร์หน้าแรก", en: "Home Banner", cn: "主页横幅" },
    mallBanner: { th: "แบนเนอร์หน้า Mall", en: "Mall Banner", cn: "商城横幅" },
    wallet: { th: "วอลเล็ท", en: "Wallet", cn: "钱包" },
    expenseRecord: { th: "บันทึกการใช้จ่าย", en: "Expense Record", cn: "消费记录" },
    pointRecord: { th: "บันทึกคะแนน", en: "Point Record", cn: "积分记录" },
    customerSupport: { th: "ติดต่อกับลูกค้า", en: "Customer Support", cn: "客户支持" },
    reportProblem: { th: "แจ้งปัญหา", en: "Report a Problem", cn: "报告问题" },

    setting: { th: "ตั้งค่า", en: "Settings", cn: "设置" },
    warehouseManagement: { th: "การจัดการที่อยู่โกดัง", en: "Warehouse Management", cn: "仓库管理" },
    chineseWarehouse: { th: "โกดังจีน", en: "Chinese Warehouse", cn: "中国仓库" },
    thaiWarehouse: { th: "โกดังไทย", en: "Thai Warehouse", cn: "泰国仓库" },
    transportManagement: { th: "การจัดการขนส่ง", en: "Transport Management", cn: "运输管理" },
    transportList: { th: "รายชื่อขนส่งในไทย", en: "Transport List in Thailand", cn: "泰国运输列表" },
    routePath: { th: "สายรถ", en: "Route Path", cn: "路线" },
    transportType: { th: "ประเภทการขนส่ง", en: "Transport Type", cn: "运输类型" },
    shippingRates: { th: "อัตราค่าส่ง", en: "Shipping Rates", cn: "运输费用" },
    newsManagement: { th: "ข่าว", en: "News", cn: "新闻" },
    newsCategory: { th: "ประเภทข่าว", en: "News Categories", cn: "新闻分类" },
    newsList: { th: "ข่าว", en: "News List", cn: "新闻列表" },
    exchangeRate: { th: "อัตราแลกเปลี่ยน", en: "Exchange Rate", cn: "汇率" },
    feeRate: { th: "อัตราค่าธรรมเนียม", en: "Fee Rate", cn: "费用率" },
    packagingFormat: { th: "รูปแบบบรรจุภัณฑ์", en: "Packaging Format", cn: "包装格式" },
    userManagement: { th: "ผู้ใช้งาน", en: "User Management", cn: "用户管理" },
    userList: { th: "รายชื่อผู้ใช้งาน", en: "User List", cn: "用户列表" },
    departmentManagement: { th: "แผนก", en: "Departments", cn: "部门" },
    positionManagement: { th: "ตำแหน่ง", en: "Positions", cn: "职位" },
    productManagement: { th: "การจัดการสินค้า", en: "Product Management", cn: "产品管理" },
    productCategory: { th: "ประเภทสินค้า", en: "Product Categories", cn: "产品类别" },
    importProductType: { th: "ประเภทสินค้าสำหรับนำเข้า", en: "Import Product Types", cn: "进口产品类型" },
    generalInformation: { th: "ข้อมูลทั่วไป", en: "General Information", cn: "一般信息" },
    faq: { th: "FAQ", en: "FAQ", cn: "常见问题" },
    survey: { th: "แบบสอบถาม", en: "Survey", cn: "调查问卷" },
    service_setting: { th: "บริการ", en: "Service", cn: "服务" },
    feeCategory: { th: "ประเภทค่าธรรมเนียม", en: "Fee Categories", cn: "费用类别" },
    fee: { th: "ค่าธรรมเนียม", en: "Fee", cn: "费用" },
    manualCategory: { th: "ประเภทคู่มือ", en: "Manual Categories", cn: "手册分类" },
    companySettings: { th: "ตั้งค่าข้อมูลบริษัท", en: "Company Settings", cn: "公司设置" },
    appSettings: { th: "ตั้งค่าแอปพลิเคชัน", en: "App Settings", cn: "应用程序设置" },
    benefits: { th: "สิทธิประโยชน์", en: "Benefits", cn: "福利" },
    problemTopic: { th: "หัวข้อแจ้งปัญหา", en: "Problem Topics", cn: "问题主题" },
    problemsByTopic: { th: "รายการปัญหาตามหัวข้อ", en: "Problems by Topic", cn: "按主题列出的问题" },
    bankAccounts: { th: "บัญชีธนาคาร", en: "Bank Accounts", cn: "银行账户" },

    logout: { th: "ออกจากระบบ", en: "Logout", cn: "登出" },
};

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
                link: '/sale-order',
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
                link: '/claim',
                badge: {
                    title: '3',
                    classes: 'px-2 bg-red-600 text-white rounded-full',
                },
            },
            {
                id: 'sale-order.assign',
                title: 'เปิดบิลฝากส่ง',
                type: 'basic',
                link: '/order-request',
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
                link: '/purchase-order',
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
                        link: '/lot',
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
        id: 'setting',
        title: menuTitles.setting[langues],
        type: 'collapsable',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'setting-faq',
                title: menuTitles.warehouseManagement[langues],
                type: 'collapsable',
                children: [
                    {
                        id: 'faq-1',
                        title: menuTitles.chineseWarehouse[langues],
                        type: 'basic',
                        link: '/stores',
                    },
                    {
                        id: 'faq-1',
                        title: menuTitles.thaiWarehouse[langues],
                        type: 'basic',
                        link: '/setting/thai-warehouse',
                    },
                ],
            },
            {
                id: 'setting-faq',
                title: menuTitles.transportManagement[langues],
                type: 'collapsable',
                children: [
                    {
                        id: 'faq-1',
                        title: menuTitles.transportList[langues],
                        type: 'basic',
                        link: '/transport',
                    },
                    {
                        id: 'faq-1',
                        title: menuTitles.routePath[langues],
                        type: 'basic',
                        link: '/route-path',
                    },
                    {
                        id: 'faq-1',
                        title: menuTitles.transportType[langues],
                        type: 'basic',
                        link: '/transport-type',
                    },
                    {
                        id: 'setting-rate',
                        title: menuTitles.shippingRates[langues],
                        type: 'basic',
                        link: '/rate',
                    },
                ],
            },
            {
                id: 'setting-faq',
                title: menuTitles.newsManagement[langues],
                type: 'collapsable',
                children: [
                    {
                        id: 'setting-category-news',
                        title: menuTitles.newsCategory[langues],
                        type: 'basic',
                        link: '/category-news',
                    },
                    {
                        id: 'setting-news',
                        title: menuTitles.newsList[langues],
                        type: 'basic',
                        link: '/news',
                    },
                ],
            },
            {
                id: 'setting-faq',
                title: menuTitles.exchangeRate[langues],
                type: 'basic',
                link: '/exchange-rate',
            },
            {
                id: 'setting-faq',
                title: menuTitles.feeRate[langues],
                type: 'basic',
                link: '/fee-rate',
            },
            {
                id: 'setting-packaging',
                title: menuTitles.packagingFormat[langues],
                type: 'basic',
                link: '/packaging',
            },
            {
                id: 'setting-faq',
                title: menuTitles.userManagement[langues],
                type: 'collapsable',
                children: [
                    {
                        id: 'setting-question',
                        title: menuTitles.userList[langues],
                        type: 'basic',
                        link: '/user',
                    },
                    {
                        id: 'setting-department',
                        title: menuTitles.departmentManagement[langues],
                        type: 'basic',
                        link: '/department',
                    },
                    {
                        id: 'setting-position',
                        title: menuTitles.positionManagement[langues],
                        type: 'basic',
                        link: '/position',
                    },
                ],
            },
            {
                id: 'setting-item',
                title: menuTitles.productManagement[langues],
                type: 'collapsable',
                children: [
                    {
                        id: 'setting-category-product',
                        title: menuTitles.productCategory[langues],
                        type: 'basic',
                        link: '/category-product',
                    },
                    {
                        id: 'product-type-import',
                        title: menuTitles.importProductType[langues],
                        type: 'basic',
                        link: '/product-type-import',
                    },
                ],
            },
            {
                id: 'setting-other',
                title: menuTitles.generalInformation[langues],
                type: 'collapsable',
                children: [
                    {
                        id: 'setting-faq',
                        title: menuTitles.faq[langues],
                        type: 'basic',
                        link: '/faq',
                    },
                    {
                        id: 'setting-question',
                        title: menuTitles.survey[langues],
                        type: 'basic',
                        link: '/question-master',
                    },
                    {
                        id: 'setting-question',
                        title: menuTitles.service_setting[langues],
                        type: 'basic',
                        link: '/service',
                    },
                    {
                        id: 'setting-category-fee',
                        title: menuTitles.feeCategory[langues],
                        type: 'basic',
                        link: '/category-fee',
                    },
                    {
                        id: 'setting-fee',
                        title: menuTitles.fee[langues],
                        type: 'basic',
                        link: '/fee',
                    },
                    {
                        id: 'category-manual',
                        title: menuTitles.manualCategory[langues],
                        type: 'basic',
                        link: '/category-manual',
                    },
                    {
                        id: 'setting-company',
                        title: menuTitles.companySettings[langues],
                        type: 'basic',
                        link: '/setting-company',
                    },
                    {
                        id: 'setting-app',
                        title: menuTitles.appSettings[langues],
                        type: 'basic',
                        link: '/setting-app',
                    },
                    {
                        id: 'benefits',
                        title: menuTitles.benefits[langues],
                        type: 'basic',
                        link: '/setting-benefits',
                    },
                    {
                        id: 'setting-problem-topic',
                        title: menuTitles.problemTopic[langues],
                        type: 'basic',
                        link: '/problem-topic',
                    },
                    {
                        id: 'setting-problem-by-topic',
                        title: menuTitles.problemsByTopic[langues],
                        type: 'basic',
                        link: '/problem-by-topic',
                    },
                    {
                        id: 'setting-bank',
                        title: menuTitles.bankAccounts[langues],
                        type: 'basic',
                        link: '/bank',
                    },
                ],
            },
        ],
    },




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
