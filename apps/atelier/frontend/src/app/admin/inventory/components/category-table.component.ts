import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InplaceModule } from 'primeng/inplace';
import { FormsModule } from '@angular/forms';
import { InventoryService } from "../inventory.service";
import { CardModule } from "primeng/card";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'category-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FormsModule,
    InplaceModule,
    InputTextModule,
    TableModule,
    CardModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-confirm-dialog />
    <p-card>
      <p-table [value]="inventory.categories()">
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="2" class="text-center text-muted">No categories present</td>
          </tr>
        </ng-template>
        <ng-template #header>
          <tr>
            <th>Name</th>
            <th style="width: 6rem"></th>
          </tr>
        </ng-template>
        <ng-template #body let-category>
          <tr>
            <td>
              <p-inplace>
                <ng-template #display>
                  {{ category.name }}
                </ng-template>
                <ng-template #content let-closeCallback="closeCallback">
                  <span class="inline-flex items-center gap-2">
                    <input pInputText [(ngModel)]="category.name" autofocus />
                    <p-button icon="pi pi-check" (onClick)="editCategory(category.id, category.name)" text severity="success" />
                    <p-button icon="pi pi-times" (onClick)="closeCallback($event)" text severity="danger" />
                  </span>
                </ng-template>
              </p-inplace>
            </td>
            <td>
              <span class="inline-flex gap-2">
                <p-button icon="pi pi-trash" text severity="danger" (onClick)="deleteCategory(category.id)" />
              </span>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class CategoryTable implements OnInit {
  inventory = inject(InventoryService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.inventory.loadCategories();
  }

  editCategory(id: string, name: string) {
    this.inventory.editCategory(id, name);
  }

  deleteCategory(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.inventory.deleteCategory(id, (message) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
        })
      }
    })
  }
}
