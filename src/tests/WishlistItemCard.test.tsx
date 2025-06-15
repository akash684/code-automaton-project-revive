
import { render, screen, fireEvent } from "@testing-library/react";
import { WishlistItemCard, getDetailPath } from "@/components/WishlistItemCard";
import { BrowserRouter } from "react-router-dom";

test("Details button navigates to correct vehicle route", () => {
  const mockNavigate = vi.fn();
  vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  const mockVehicle = {
    id: "test-id",
    item_type: "vehicle",
    item_uuid: "uuid-1",
    product_id: undefined,
    created_at: "",
    product: {
      name: "Test Car",
      price: 90000,
      image_url: "/placeholder.png",
      in_stock: true,
    },
  };

  render(
    <BrowserRouter>
      <WishlistItemCard item={mockVehicle} view="grid" />
    </BrowserRouter>
  );

  const btn = screen.getByTestId("details-btn");
  fireEvent.click(btn);
  expect(mockNavigate).toHaveBeenCalledWith("/vehicles/uuid-1");
});

test("Displays correct price and image", () => {
  const item = {
    id: "id2",
    item_type: "product",
    item_uuid: "3",
    product_id: 3,
    created_at: "",
    product: {
      name: "Fancy",
      price: 12345,
      image_url: "/some.jpg",
      in_stock: false,
    },
  };
  render(
    <BrowserRouter>
      <WishlistItemCard item={item} view="list" />
    </BrowserRouter>
  );
  expect(screen.getByText("₹12,345")).toBeInTheDocument();
  expect(screen.getByAltText("Fancy")).toHaveAttribute("src", "/some.jpg");
});
