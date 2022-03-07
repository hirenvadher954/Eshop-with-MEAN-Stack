import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoriesService, Category } from "@greenmango/products";
import { MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { timer } from "rxjs";
import { Location } from "@angular/common";

@Component({
  selector: "admin-categories-form",
  templateUrl: "./categories-form.component.html"
})
export class CategoriesFormComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  editmode = false;
  currentCategoryId = "";


  constructor(private messageService: MessageService,
              private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private location: Location,
              private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      icon: ["", Validators.required],
      color: ["#fff"]
    });
  };

  ngOnInit(): void {

    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm["name"].value,
      icon: this.categoryForm["icon"].value,
      color: this.categoryForm["color"].value
    };
    if (this.editmode) {
      this._updateCategory(category);
    } else {
      this._addCategory(category);
    }
  }

  onCancle() {
    this.location.back();
  }

  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category).subscribe({
        next: (category: Category) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Category ${category.name} is created!`
          });
          timer(1000).subscribe(() => this.location.back());
        }, error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Category is not created!"
          });
        }
      }
    );
  }

  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(category).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Category is updated!"
          });
          timer(2000).subscribe(() => this.location.back());

        }
        ,
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Category is not updated!"
          });
        }
      }
    );
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.editmode = true;
        this.currentCategoryId = params["id"];
        this.categoriesService.getCategory(this.currentCategoryId).subscribe((category) => {
          this.categoryForm["name"].setValue(category.name);
          this.categoryForm["icon"].setValue(category.icon);
          this.categoryForm["color"].setValue(category.color);
        });
      }
    });
  }

  get categoryForm() {
    return this.form.controls;
  }
}
