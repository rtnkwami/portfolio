import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InventoryService } from "../inventory.service";

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    FormsModule
  ],
  template: `
    <div class="mb-4 p-2 flex items-center">
      <p-card [style]="{ width: '20rem', overflow: 'hidden' }">
          <ng-template #title> Add a Category </ng-template>
            <div class="flex flex-col gap-2 pb-8 pt-8">
              <label for="name">Name</label>
              <input pInputText id="name" type="text" [(ngModel)]="name" />
            </div>
          <ng-template #footer>
              <div class="flex gap-4 mt-1">
                  <p-button label="Clear"
                    severity="secondary"
                    class="w-full"
                    [outlined]="true"
                    styleClass="w-full"
                    (onClick)="name=''"
                  />
                  <p-button
                    label="Add"
                    class="w-full"
                    styleClass="w-full"
                    [disabled]="!name"
                    (onClick)="createCategory()"
                  />
              </div>
          </ng-template>
      </p-card>
    </div>
  `
})
export class CategoryForm {
  inventory = inject(InventoryService);
  name: string = '';

  createCategory() {
    this.inventory.addCategory(this.name);
    this.name = '';
  }
}
