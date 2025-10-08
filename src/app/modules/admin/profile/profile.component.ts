import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ProfileService } from './profile.service';
import { Subject, takeUntil } from 'rxjs';

type MemberDetail = {
    transport_thai_master_id?: number | null;
    ever_imported_from_china?: string | null;
    order_quantity?: string | null;
    frequent_importer?: string | null;
    need_transport_type?: string | null;
    additional_requests?: string | null;
    comp_name?: string | null;
    comp_tax?: string | null;
    comp_phone?: string | null;
    cargo_name?: string | null;
    cargo_website?: string | null;
    cargo_image?: string | null;
    order_quantity_in_thai?: string | null;
    avaliable_time?: string | null;
};

type ShippingAddress = {
    id?: number;
    name?: string;
    phone?: string;
    address?: string;
    province?: string;
    district?: string;
    sub_district?: string;
    postal_code?: string;
    is_default?: boolean;
    [key: string]: any;
};

type MemberProfile = {
    id: number;
    code: string;
    member_type: string;
    importer_code: string;
    fname: string;
    lname: string;
    phone: string;
    birth_date: string | null;
    gender: string | null;
    referrer: string | null;
    address: string | null;
    province: string | null;
    district: string | null;
    sub_district: string | null;
    postal_code: string | null;
    email: string | null;
    line_id: string | null;
    created_at: string | null;
    updated_at: string | null;
    detail?: MemberDetail | null;
    ship_address?: ShippingAddress[] | null;
};

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
    private readonly profileService = inject(ProfileService);
    private readonly destroy$ = new Subject<void>();

    readonly loading = signal<boolean>(true);
    readonly errorMessage = signal<string | null>(null);
    readonly profile = signal<MemberProfile | null>(null);
    readonly shippingAddresses = computed<ShippingAddress[]>(() => {
        const data = this.profile();
        if (!data?.ship_address) {
            return [];
        }
        return Array.isArray(data.ship_address) ? data.ship_address : [];
    });

    readonly fullName = computed(() => {
        const data = this.profile();
        if (!data) return '-';
        return `${data.fname ?? ''} ${data.lname ?? ''}`.trim() || '-';
    });

    readonly fullAddress = computed(() => {
        const data = this.profile();
        if (!data) {
            return '-';
        }
        const parts = [
            data.address,
            data.sub_district,
            data.district,
            data.province,
            data.postal_code,
        ].filter(Boolean);
        return parts.length ? parts.join(' ') : '-';
    });

    ngOnInit(): void {
        this.loadProfile();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    reload(): void {
        this.loadProfile();
    }

    private loadProfile(): void {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            this.errorMessage.set('ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่');
            this.loading.set(false);
            return;
        }

        let memberId: number | null = null;
        try {
            const parsed = JSON.parse(storedUser);
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

        this.profileService
            .getProfile(memberId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    this.loading.set(false);
                    const data = response?.data ?? null;
                    if (!data) {
                        this.profile.set(null);
                        this.errorMessage.set('ไม่พบข้อมูลสมาชิก');
                        return;
                    }
                    if (!Array.isArray(data.ship_address)) {
                        data.ship_address = [];
                    }
                    this.profile.set(data);
                },
                error: (error) => {
                    console.error('Failed to load profile', error);
                    this.loading.set(false);
                    this.errorMessage.set('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ในขณะนี้');
                    this.profile.set(null);
                },
            });
    }

    getMemberTypeColor(memberType: string | null | undefined): string {
        if (!memberType) {
            return 'bg-slate-100 text-slate-600';
        }
        if (memberType.includes('ตัวแทน')) {
            return 'bg-purple-100 text-purple-600';
        }
        if (memberType.includes('นิติบุคคล')) {
            return 'bg-blue-100 text-blue-600';
        }
        return 'bg-green-100 text-green-600';
    }

    hasDetail(detailKey: keyof MemberDetail): boolean {
        const detail = this.profile()?.detail;
        if (!detail) {
            return false;
        }
        const value = detail[detailKey];
        return value !== null && value !== undefined && value !== '';
    }
}
