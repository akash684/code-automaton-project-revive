
import { render } from '@testing-library/react';
import * as rtl from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { WishlistItemCard, getDetailPath } from '@/components/WishlistItemCard';
import type { WishlistItem } from '@/types';

// Test vehicle details navigation
describe('WishlistItemCard', () => {
  it('Details button navigates to correct vehicle route', () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });

    const mockVehicle: WishlistItem = {
      id: "uuid-1",
      user_id: "user-1",
      item_type: "vehicle",
      item_uuid: "uuid-1",
      product_id: 0,
      created_at: new Date().toISOString(),
      product: {
        name: "Mock Car",
        price: 99000,
        image_url: "/car.jpg",
        in_stock: true,
      },
    };

    render(
      <BrowserRouter>
        <WishlistItemCard item={mockVehicle} view="grid" />
      </BrowserRouter>
    );
    const btn = rtl.screen.getByTestId('details-btn');
    rtl.fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/vehicles/uuid-1");
  });

  it('Displays correct price and image', () => {
    const mockItem: WishlistItem = {
      id: "id2",
      user_id: "user-2",
      item_type: "product",
      item_uuid: "prod-3",
      product_id: 3,
      created_at: new Date().toISOString(),
      product: {
        name: "Fancy",
        price: 12345,
        image_url: "/some.jpg",
        in_stock: false,
      },
    };
    render(
      <BrowserRouter>
        <WishlistItemCard item={mockItem} view="list" />
      </BrowserRouter>
    );
    expect(rtl.screen.getByText("₹12,345")).toBeInTheDocument();
    expect(rtl.screen.getByAltText("Fancy")).toHaveAttribute("src", "/some.jpg");
  });

  it('Renders fallback image and price correctly', () => {
    const mockItem: WishlistItem = {
      id: "id3",
      user_id: "user-3",
      item_type: "accessory",
      item_uuid: "acc-1",
      product_id: 7,
      created_at: new Date().toISOString(),
      product: {
        name: "Lamp",
        price: undefined as any,
        image_url: "",
        in_stock: true,
      },
    };
    render(
      <BrowserRouter>
        <WishlistItemCard item={mockItem} view="list" />
      </BrowserRouter>
    );
    expect(rtl.screen.getByText("--")).toBeInTheDocument();
    expect(rtl.screen.getByAltText("Lamp")).toHaveAttribute("src", "/placeholder.png");
  });
});

