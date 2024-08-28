import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Topping {
  name: string;
  price: number;
  selectedSizes: {
    small: boolean;
    medium: boolean;
    large: boolean;
    extraLarge: boolean;
  };
}

interface Offer {
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-order-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-entry.component.html',
  styleUrls: ['./order-entry.component.css'],
})
export class OrderEntryComponent {
  pizzaSizes = [
    { name: 'Small', price: 5 },
    { name: 'Medium', price: 7 },
    { name: 'Large', price: 8 },
    { name: 'Extra Large', price: 9 },
  ];

  vegToppings: Topping[] = [
    {
      name: 'Tomatoes',
      price: 1.0,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
    {
      name: 'Onions',
      price: 0.5,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
    {
      name: 'Bell pepper',
      price: 1.0,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
    {
      name: 'Mushrooms',
      price: 1.2,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
    {
      name: 'Pineapple',
      price: 0.75,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
  ];

  nonVegToppings: Topping[] = [
    {
      name: 'Sausage',
      price: 1.0,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
    {
      name: 'Pepperoni',
      price: 2.0,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
    {
      name: 'Barbecue chicken',
      price: 3.0,
      selectedSizes: {
        small: false,
        medium: false,
        large: false,
        extraLarge: false,
      },
    },
  ];

  offers: Offer[] = [
    {
      name: 'Offer 1',
      description: '1 Medium Pizza with 2 toppings = $5',
      price: 5,
    },
    {
      name: 'Offer 2',
      description: '2 Medium Pizzas with 4 toppings each = $9',
      price: 9,
    },
    {
      name: 'Offer 3',
      description: '1 Large Pizza with 4 toppings at 50% off',
      price: 4,
    },
  ];

  selectedSize: { name: string; price: number } | null = null;
  selectedToppings: Topping[] = [];
  selectedOffer: Offer | null = null;

  pizzaQuantity: number = 1;
  totalPrice: number = 0;

  changeQuantity(amount: number) {
    this.pizzaQuantity = Math.max(1, this.pizzaQuantity + amount);
    this.calculateTotalPrice();
  }

  onSizeSelected(size: { name: string; price: number }) {
    this.selectedSize = size;
    this.calculateTotalPrice();
  }

  isMediumOrLargeSelected(): boolean {
    const mediumSelected = this.selectedSize?.name.toLowerCase() === 'medium';
    const largeSelected = this.selectedSize?.name.toLowerCase() === 'large';
    return mediumSelected || largeSelected;
  }

  onToppingSelected(
    topping: Topping,
    size: 'small' | 'medium' | 'large' | 'extraLarge'
  ) {
    topping.selectedSizes[size] = !topping.selectedSizes[size];

    const isSelected = this.selectedToppings.some(
      (t) => t.name === topping.name
    );

    if (isSelected) {
      const index = this.selectedToppings.findIndex(
        (t) => t.name === topping.name
      );
      this.selectedToppings[index] = topping;
    } else {
      this.selectedToppings.push(topping);
    }

    // Remove from selectedToppings if no sizes are selected
    if (
      !topping.selectedSizes.small &&
      !topping.selectedSizes.medium &&
      !topping.selectedSizes.large &&
      !topping.selectedSizes.extraLarge
    ) {
      this.selectedToppings = this.selectedToppings.filter(
        (t) => t.name !== topping.name
      );
    }

    this.calculateTotalPrice();
  }

  onOfferChecked(event: Event, offer: Offer) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked && !this.isOfferApplicable(offer)) {
      // If the offer is not applicable, uncheck the offer
      (event.target as HTMLInputElement).checked = false;
      alert(`Offer "${offer.name}" is not applicable due to the number of toppings.`);
    } else if (isChecked) {
      this.selectedOffer = offer;
      this.calculateTotalPrice();
    } else {
      this.selectedOffer = null;
      this.calculateTotalPrice();
    }
  }

  isOfferApplicable(offer: Offer): boolean {
    if (offer.name === 'Offer 3') {
      const toppingsCount = this.selectedToppings.filter(
        (topping) =>
          topping.selectedSizes.large || topping.selectedSizes.extraLarge
      ).length;

      return toppingsCount <= 4;
    }

    return true; // All other offers are assumed to be applicable if selected
  }

  calculateTotalPrice() {
    const sizePrice = this.selectedSize?.price || 0;
    let toppingsPricePerPizza = 0;
    let offerPrice = 0;
    let regularPrice = 0;

    // Calculate the toppings price per pizza
    this.selectedToppings.forEach((topping) => {
      if (topping.selectedSizes.small) {
        toppingsPricePerPizza += topping.price;
      }
      if (topping.selectedSizes.medium) {
        toppingsPricePerPizza += topping.price;
      }
      if (topping.selectedSizes.large) {
        toppingsPricePerPizza += topping.price;
      }
      if (topping.selectedSizes.extraLarge) {
        toppingsPricePerPizza += topping.price;
      }
    });

    // Calculate the regular price (base price + toppings) multiplied by the quantity
    regularPrice = (sizePrice + toppingsPricePerPizza) * this.pizzaQuantity;

    // Check if an offer is selected
    if (this.selectedOffer) {
      switch (this.selectedOffer.name) {
        case 'Offer 1':
          if (
            this.selectedSize?.name.toLowerCase() === 'medium' &&
            this.areExactlyTwoToppingsSelected()
          ) {
            offerPrice = this.selectedOffer.price;
          } else {
            offerPrice = regularPrice;
          }
          break;

        case 'Offer 2':
          if (
            this.pizzaQuantity === 2 &&
            this.selectedSize?.name.toLowerCase() === 'medium'
          ) {
            const toppingsCount = this.selectedToppings.filter(
              (topping) =>
                topping.selectedSizes.medium || topping.selectedSizes.large
            ).length;

            if (toppingsCount <= 4) {
              offerPrice = this.selectedOffer.price * this.pizzaQuantity; // $9 per pizza
            } else {
              offerPrice = regularPrice;
            }
          } else {
            offerPrice = regularPrice;
          }
          break;

        case 'Offer 3':
          if (this.selectedSize?.name.toLowerCase() === 'large') {
            const toppingsCount = this.selectedToppings.filter(
              (topping) =>
                topping.selectedSizes.large || topping.selectedSizes.extraLarge
            ).length;

            if (toppingsCount <= 4) {
              const basePrice = sizePrice + toppingsPricePerPizza;
              offerPrice = basePrice * 0.5;
              offerPrice *= this.pizzaQuantity;
            } else {
              offerPrice = regularPrice;
            }
          } else {
            offerPrice = regularPrice;
          }
          break;

        default:
          offerPrice = regularPrice;
          break;
      }
    } else {
      offerPrice = regularPrice;
    }

    this.totalPrice = Math.min(offerPrice, regularPrice);
  }

  // Helper method to check if exactly 2 toppings are selected
  private areExactlyTwoToppingsSelected(): boolean {
    const selectedToppingsCount = this.selectedToppings.reduce(
      (count, topping) => {
        if (
          topping.selectedSizes.small ||
          topping.selectedSizes.medium ||
          topping.selectedSizes.large ||
          topping.selectedSizes.extraLarge
        ) {
          count++;
        }
        return count;
      },
      0
    );
    return selectedToppingsCount === 2;
  }
}