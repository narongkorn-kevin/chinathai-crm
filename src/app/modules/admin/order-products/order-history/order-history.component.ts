import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderProductsService } from '../order-products.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';

type OrderListItem = {
    id: number;
    product_name: string;
    product_price: string;
    product_qty: number;
    product_image?: string;
    product_url?: string;
    status?: string;
    note?: string;
};

type OrderItem = {
    id: number;
    code: string;
    total_price: string;
    date: string;
    shipping_type: string;
    payment_term: string;
    china_shipping_fee?: string | null;
    deposit_fee?: string | null;
    status: string;
    order_lists: OrderListItem[];
};

type StatusGroup = {
    status: string;
    orders: OrderItem[];
    rate?: any;
    rate_setting?: any;
};

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    providers: [DatePipe, DecimalPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent implements OnInit, OnDestroy {

    private readonly orderService = inject(OrderProductsService);
    private readonly datePipe = inject(DatePipe);
    private readonly currencyPipe = inject(DecimalPipe);

    protected readonly destroy$ = new Subject<void>();

    readonly loading = signal<boolean>(true);
    readonly errorMessage = signal<string | null>(null);
    readonly statusGroups = signal<StatusGroup[]>([]);
    readonly activeStatusIndex = signal<number>(0);

    readonly statusLabels: Record<string, string> = {
        awaiting_summary: 'รอสรุปคำสั่งซื้อ',
        awaiting_payment: 'รอการชำระเงิน',
        in_progress: 'กำลังดำเนินการ',
        preparing_shipment: 'กำลังจัดเตรียมส่ง',
        shipped: 'จัดส่งแล้ว',
        cancelled: 'ยกเลิก',
    };

    ngOnInit(): void {
        this.fetchOrders();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    formatDate(date: string | null): string {
        if (!date) {
            return '-';
        }
        return this.datePipe.transform(date, 'dd MMM yyyy') ?? date;
    }

    formatCurrency(value: string | number | null | undefined): string {
        if (!value && value !== 0) {
            return '-';
        }
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        return this.currencyPipe.transform(numericValue, '1.2-2');
    }

    selectStatus(index: number): void {
        this.activeStatusIndex.set(index);
    }

    reload(): void {
        this.fetchOrders();
    }

    getActiveGroup(): StatusGroup | null {
        const groups = this.statusGroups();
        if (!groups.length) {
            return null;
        }
        const index = this.activeStatusIndex();
        return groups[index] ?? groups[0];
    }

    private fetchOrders(): void {
        const stored = localStorage.getItem('user');
        if (!stored) {
            this.errorMessage.set('ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่');
            this.loading.set(false);
            return;
        }

        let memberId: number | null = null;
        try {
            const parsed = JSON.parse(stored);
            memberId = parsed?.id ?? null;
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
        }

        if (!memberId) {
            this.errorMessage.set('ไม่สามารถระบุผู้ใช้งานได้ กรุณาเข้าสู่ระบบใหม่');
            this.loading.set(false);
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        this.orderService
            .getOrdersByMember(memberId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    this.loading.set(false);
                    if (!response || !response.data) {
                        this.statusGroups.set([]);
                        return;
                    }
                    this.statusGroups.set(response.data);
                    this.activeStatusIndex.set(0);
                },
                error: (error) => {
                    console.error('Failed to load orders by member', error);
                    this.loading.set(false);
                    this.errorMessage.set('ไม่สามารถโหลดข้อมูลประวัติการสั่งซื้อได้');
                    this.statusGroups.set([]);
                },
            });
    }

    getStatusLabel(status: string): string {
        return this.statusLabels[status] ?? status;
    }

    getStatusCount(statusGroup: StatusGroup): number {
        return statusGroup?.orders?.length ?? 0;
    }
}
