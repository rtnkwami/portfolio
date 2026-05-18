import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    RouterLinkWithHref,
    RouterLinkActive
  ],
  template:`
    <div class="card flex">
      <p-drawer [(visible)]="visible" header="Atelier">
        <nav>
          @for (item of sidebarItems; track item.label) {
            <a [routerLink]="item.routerLink"
              routerLinkActive="bg-gray-100"
              [routerLinkActiveOptions]="{ exact: true }"
              class="block p-2 rounded hover:bg-gray-100 cursor-pointer">
              <span [class]="item.icon">&nbsp;&nbsp;</span>
              {{ item.label }}
            </a>
          }
        </nav>
      </p-drawer>
      <div class="w-full flex items-center px-4 py-2 border-b border-gray-200 bg-white">
        <p-button (onClick)="visible = true" icon="pi pi-bars" />
      </div>
    </div>

    <main class="p-5">
      <router-outlet />
    </main>
  `,
})
export default class Admin {
  visible: boolean = false;

  sidebarItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/admin'},
    { label: 'Inventory', icon: 'pi pi-box', routerLink: '/admin/inventory' },
    { label: 'Orders', icon: 'pi pi-shopping-cart', routerLink: '/admin/orders' },
    { label: 'Customers', icon: 'pi pi-user', routerLink: '/admin/customers' }
  ]
}
