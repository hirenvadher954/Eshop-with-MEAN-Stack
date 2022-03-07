import { Component, OnInit } from "@angular/core";
import { CategoriesService, Category } from "@greenmango/products";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable } from "rxjs";

@Component({
  selector: "admin-categories-list",
  templateUrl: "./categories-list.component.html",
  styles: []
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService,
              private router: Router,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this._getCategories();
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: "Do you want to Delete this Category?",
      header: "Delete Category",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).subscribe({
            next: () => {
              this._getCategories();
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Category is deleted!"
              });
            },
            error: () => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Category is not deleted!"
              });
            }
          }
        );
      }
    });
  }

  updateCategory(categoryid: string): void {
    this.router.navigateByUrl(`categories/form/${categoryid}`).then();
  }

  private _getCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(this.categories);
    });
    
  }
}
