import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryMenuService } from '../service/CategoryMenu/categorymenu.service';
import { Category, CategoryItems, MenuItem } from '../Models/Category';
import { OrderDataService } from '../service/OrderData/order-data.service';
import { OrderItem } from '../Models/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../service/LocalStorage/localstorage.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  categories: Category[] = []; // Array to hold fetched categories
  selectedCategory: Category | undefined;
  orderItems: OrderItem[] = [];
  isOrderPlaced: boolean = false;
  roomId: string | null = '';
  constructor(
    private categoryService: CategoryMenuService,
    private orderDataService: OrderDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.setRoomNumberInLocalStorage();

    if (this.categoryService.getCategories().length === 0) {
      this.categoryService.getAllCategoryMenu().subscribe((data) => {
        this.categoryService.setCategories(data);
      });
    }

    this.categoryService.category$.subscribe((data) => {
      this.categories = data;
    });

    var orderDetails = this.storageService.getObject('OrderDetails');
    if (orderDetails?.length == 0) {
      this.orderItems = [];
    } else {
      this.orderItems = orderDetails['OrderItems'];
    }
    this.updateOrderItems();
    this.orderDataService.isOrderPlaced$.subscribe((source) => {
      this.isOrderPlaced = source;
    });
  }

  private setRoomNumberInLocalStorage() {
    var roomNumber = this.storageService.getItem('RoomId');
    var params = this.activatedRoute.snapshot.paramMap.get('roomId');
    if (params != null && params != roomNumber) {
      roomNumber = null;
    }
    if (roomNumber === null) {
      this.roomId = params; // when param is null, open a popup to getdetails
      this.storageService.setItem('RoomId', this.roomId);
    } else {
      this.roomId = roomNumber;
      this.router.navigate(['/home/' + this.roomId]);
    }
    this.orderDataService.setRoomId(Number(this.roomId));
  }

  // Set the selected category
  selectCategory(category: Category): void {
    this.selectedCategory = category; // Update the selected category
  }

  // Get menu items for the selected category
  getMenuItemsForSelectedCategory(): MenuItem[] {
    return this.categoryService.getMenuItems();
  }

  getAllCategory(): CategoryItems[] {
    var categoryItems: CategoryItems[] = [];
    this.categoryService.categoryItem$.subscribe((data) => {
      categoryItems = data;
    });
    return categoryItems;
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
  onCategoryClick(item: CategoryItems) {
    var selectedCategoryValue = this.categories.filter(
      (data) => data.categoryId === item.categoryId
    );
    this.categoryService.setSelectedCategories(selectedCategoryValue[0]);
    this.router.navigate(['/item-list']);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault(); // Prevents default scrolling behavior
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += event.deltaY; // Adjust scrolling speed as needed
  }
}
