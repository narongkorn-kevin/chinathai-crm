import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
    ],
})
export class PaginationComponent implements OnInit, OnChanges {
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    @Input() totalItems: number = 0;
    @Input() initialPage: number = 1;
    @Input() initialItemsPerPage: number = 20;

    @Output() pageChange = new EventEmitter<{
        page: number;
        itemsPerPage: number;
    }>();

    currentPage: number = 1;
    itemsPerPage: number = 20;
    totalPages: number = 0;
    startItem: number = 0;
    endItem: number = 0;

    ngOnInit(): void {
        this.currentPage = this.initialPage;
        this.itemsPerPage = this.initialItemsPerPage;
        this.calculatePagination();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['totalItems']) {
            this.calculatePagination();
        }
    }

    calculatePagination(): void {
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        this.endItem = Math.min(
            this.startItem + this.itemsPerPage - 1,
            this.totalItems
        );
    }

    goToFirstPage(): void {
        if (this.currentPage !== 1) {
            this.currentPage = 1;
            this.calculatePagination();
            this.emitPageChange();
        }
    }

    goToPreviousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.calculatePagination();
            this.emitPageChange();
        }
    }

    goToNextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.calculatePagination();
            this.emitPageChange();
        }
    }

    goToLastPage(): void {
        if (this.currentPage !== this.totalPages) {
            this.currentPage = this.totalPages;
            this.calculatePagination();
            this.emitPageChange();
        }
    }

    onItemsPerPageChange(): void {
        this.currentPage = 1; // Reset to first page when changing items per page
        this.calculatePagination();
        this.emitPageChange();
    }

    emitPageChange(): void {
        this.pageChange.emit({
            page: this.currentPage,
            itemsPerPage: this.itemsPerPage,
        });
    }
}
