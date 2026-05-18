import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs'
import { CategoryForm } from "./components/category.component";
import { CategoryTable } from "./components/category-table.component";

@Component({
  selector: 'app-inventory',
  imports: [TabsModule, CategoryForm, CategoryTable],
  styles: `
    :host ::ng-deep .p-tablist-tab-list {
      justify-content: center;
    }
  `,
  template: `
    <p-tabs value="0">
      <p-tablist>
        <p-tab value="0">Categories</p-tab>
        <p-tab value="1">Products</p-tab>
        <p-tab value="2">Catalog</p-tab>
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel value="0">
          <div class="flex gap-4">
            <div class="w-1/3">
              <category-form />
            </div>
            <div class="w-2/3">
              <category-table />
            </div>
          </div>
        </p-tabpanel>
        <p-tabpanel value="1">
          <!-- products content -->
        </p-tabpanel>
        <p-tabpanel value="2">
          <!-- catalog content -->
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>
  `,
})
export default class Inventory {}
