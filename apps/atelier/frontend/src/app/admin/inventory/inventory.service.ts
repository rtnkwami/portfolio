import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Category, CreateCategoryDto, UpdateCategoryDto } from 'types';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  addCategory(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      const body: CreateCategoryDto = { name }
      this.http.post<Category>('/categories', body).subscribe((newCategory) => {
        this._categories.update((categories) => [...categories, newCategory])
      });
    }
  }

  loadCategories() {
    if (isPlatformBrowser(this.platformId)){
      this.http.get<Category[]>('/categories').subscribe((data) => {
        this._categories.set(data);
      });
    }
  }

  editCategory(id: string, name: string) {
    if (isPlatformBrowser(this.platformId)){
      const body: UpdateCategoryDto = { name }
      this.http.patch<Category>(`/categories/${id}`, body).subscribe((updated) =>
        this._categories.update((categories) =>
          categories.map((c) => c.id === id ? updated : c)
        )
      )
    }
  }

  deleteCategory(id: string, onConflict: (message: string) => void) {
    if (isPlatformBrowser(this.platformId)){
      this.http.delete<Category>(`/categories/${id}`).pipe(
        catchError((error: HttpErrorResponse) => {
          onConflict?.(error.message)
          return EMPTY;
        })
      ).subscribe(() =>
        this._categories.update((categories) => categories.filter(c => c.id !== id))
      );
    }
  }
}
