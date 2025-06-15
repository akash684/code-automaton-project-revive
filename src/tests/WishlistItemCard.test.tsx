
import { render, screen, fireEvent } from '@testing-library/react'; // Fixed imports
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { WishlistItemCard, getDetailPath } from '@/components/WishlistItemCard';

// Test vehicle details navigation
describe('WishlistItemCard', () => {
  it('Details button navigates to correct vehicle route', () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });

    const mockVehicle: import('@/types').WishlistItem = {
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
    const btn = screen.getByTestId('details-btn');
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/vehicles/uuid-1");
  });

  it('Displays correct price and image', () => {
    const mockItem: import('@/types').WishlistItem = {
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
    expect(screen.getByText("₹12,345")).toBeInTheDocument();
    expect(screen.getByAltText("Fancy")).toHaveAttribute("src", "/some.jpg");
  });
});

