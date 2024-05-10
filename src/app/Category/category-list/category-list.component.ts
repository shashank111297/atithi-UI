// src/app/components/category-list/category-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Category, MenuItem } from '../../../Models/Category';
import { OrderItem } from '../../../Models/Order';
import { CategoryMenuService } from '../../service/CategoryMenu/categorymenu.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrderDataService } from '../../service/OrderData/order-data.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryMenuService, OrderDataService],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = []; // Array to hold fetched categories
  selectedCategory: Category | undefined;
  orderItems: OrderItem[] = [];
  constructor(
    private categoryService: CategoryMenuService,
    private orderDataService: OrderDataService
  ) {}

  ngOnInit(): void {
    // this.categoryService.getAllCategoryMenu().subscribe((data) => {
    //   this.categories = data; // Assign fetched data to the array
    //   this.selectedCategory = this.categories[0];
    // });

    this.categories = [
      {
        categoryId: '9e64c7e3-6562-4bb3-9ff1-ea1f9325155a',
        categoryName: 'Cakes',
        items: [
          {
            menuId: '77add31a-8536-4e6b-9a13-e878ffda9a55',
            itemName: 'Mojito',
            price: 500.0,
            availability: true,
            imagePath: 'string',
            categoryId: '9e64c7e3-6562-4bb3-9ff1-ea1f9325155a',
          },
          {
            menuId: 'b49fb209-c770-4e78-96a8-d36416379380',
            itemName: 'Gin',
            price: 500.0,
            availability: true,
            imagePath: 'string',
            categoryId: '9e64c7e3-6562-4bb3-9ff1-ea1f9325155a',
          },
        ],
      },
      {
        categoryId: '52895bf5-23f0-421b-a53d-534154d3cc58',
        categoryName: 'Beverages',
        items: [
          {
            menuId: 'c36eba8a-bd38-4a36-a69b-61a56b302fb5',
            itemName: 'Strawberry',
            price: 500.0,
            availability: true,
            imagePath: 'string',
            categoryId: '52895bf5-23f0-421b-a53d-534154d3cc58',
          },
          {
            menuId: 'd83573c6-4875-40e9-9a45-a1795a1d8f78',
            itemName: 'BlackForest',
            price: 500.0,
            availability: true,
            imagePath: 'string',
            categoryId: '52895bf5-23f0-421b-a53d-534154d3cc58',
          },
        ],
      },
    ];
    this.selectedCategory = this.categories[0];
    this.categoryService.setCategories(this.categories);
  }

  // Set the selected category
  selectCategory(category: Category): void {
    this.selectedCategory = category; // Update the selected category
  }

  // Get menu items for the selected category
  getMenuItemsForSelectedCategory(): MenuItem[] {
    return this.selectedCategory ? this.selectedCategory.items : [];
  }

  updateOrderItems(): void {
    this.orderDataService.setOrderItems(this.orderItems);
  }

  selectItem(item: MenuItem): void {
    const existingItem = this.orderItems.find(
      (orderItem) => orderItem.menuItemId === item.menuId
    );

    if (existingItem) {
      existingItem.quantity += 1; // Increase the quantity
    } else {
      // Add the item with a quantity of 1
      this.orderItems.push({ menuItemId: item.menuId, quantity: 1 });
    }
    this.updateOrderItems();
  }

  // Increase the quantity of an order item
  increaseItem(item: MenuItem): void {
    const existingItem = this.orderItems.find(
      (orderItem) => orderItem.menuItemId === item.menuId
    );

    if (existingItem) {
      existingItem.quantity += 1; // Increase by 1
    }
    this.updateOrderItems();
  }

  // Reduce the quantity of an order item
  reduceItem(item: MenuItem): void {
    const existingItem = this.orderItems.find(
      (orderItem) => orderItem.menuItemId === item.menuId
    );

    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1; // Decrease by 1
    } else if (existingItem && existingItem.quantity === 1) {
      this.orderItems = this.orderItems.filter(
        (orderItem) => orderItem.menuItemId !== item.menuId
      ); // Remove the item if quantity is 0
    }
    this.updateOrderItems();
  }

  // Determine whether the "Add" button should be shown
  showAddButton(item: MenuItem): boolean {
    return !this.orderItems.some(
      (orderItem) => orderItem.menuItemId === item.menuId
    );
  }

  // Determine whether the "+" and "-" buttons should be shown
  showIncrementDecrementButtons(item: MenuItem): boolean {
    return !this.showAddButton(item); // Shown when "Add" is not shown
  }

  getItemQuantity(item: MenuItem): number {
    const existingItem = this.orderItems.find(
      (orderItem) => orderItem.menuItemId === item.menuId
    );

    return existingItem ? existingItem.quantity : 0; // Return 0 if not found
  }
}
