import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CategoriesService,
  Category,
  Product,
  ProductsService,
} from '@greenmango/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [],
})
export class ProductsFormComponent implements OnInit {
  editmode = false;
  form: FormGroup;
  isSubmitted = false;
  catagories: Category[] = [];
  imageDisplay: string | ArrayBuffer;
  currentProductId: string;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false],
    });
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.catagories = categories;
    });
  }
  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editmode = true;
        this.currentProductId = params['id'];
        this.productsService
          .getProduct(params['id'])
          .subscribe((product: Product) => {
            this.productForm['name'].setValue(product.name);
            this.productForm['category'].setValue(product.category.id);
            this.productForm['brand'].setValue(product.brand);
            this.productForm['price'].setValue(product.price);
            this.productForm['countInStock'].setValue(product.countInStock);
            this.productForm['isFeatured'].setValue(product.isFeatured);
            this.productForm['description'].setValue(product.description);
            this.productForm['richDescription'].setValue(
              product.richDescription
            );
            this.imageDisplay = product.image;
            this.productForm['image'].setValidators([]);
            this.productForm['image'].updateValueAndValidity();
          });
      }
    });
  }
  get productForm() {
    return this.form.controls;
  }
}
