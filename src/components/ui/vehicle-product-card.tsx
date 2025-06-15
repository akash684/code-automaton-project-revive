
import React from "react";

type VehicleProductCardProps = {
  imageUrl: string;
  name: string;
  price: number;
  stock: number;
  status: "in" | "out";
  category: string;
  compatible: string[];
  onBuy?: () => void;
};

export const VehicleProductCard: React.FC<VehicleProductCardProps> = ({
  imageUrl,
  name,
  price,
  stock,
  status,
  category,
  compatible,
  onBuy,
}) => {
  return (
    <div className="w-[250px] bg-[#0d111c] rounded-2xl shadow-lg flex flex-col overflow-hidden border border-[#161b26] relative font-sans hover:shadow-xl transition-shadow duration-200">
      {/* Tags row */}
      <div className="absolute flex gap-2 left-4 top-4 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold 
            ${status === "in" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
          `}
        >
          {status === "in" ? "In Stock" : "Out of Stock"}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-800 text-white">
          {category}
        </span>
      </div>
      {/* Product image */}
      <div className="flex items-center justify-center h-44 w-full bg-[#111524] mt-2 mb-0">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="h-32 object-contain drop-shadow-lg"
          style={{ maxWidth: "80%" }}
          loading="lazy"
        />
      </div>
      {/* Details */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-2 mt-2">
        {/* Name */}
        <div className="text-lg font-bold text-white mb-2 leading-snug">{name}</div>
        {/* Compatible pills */}
        <div className="flex flex-wrap gap-2 mb-2">
          {compatible.map((type) => (
            <span
              key={type}
              className="bg-[#23283c] text-gray-100 rounded-full px-3 py-0.5 text-xs font-semibold"
            >
              {type}
            </span>
          ))}
        </div>
        {/* Price */}
        <div className="text-2xl font-extrabold text-blue-400 mb-1">
          ₹{new Intl.NumberFormat("en-IN").format(price)}
        </div>
        {/* Stock count */}
        <div className="text-sm text-gray-400 mb-4">Stock: {stock}</div>
        {/* Buy button */}
        <button
          className={`
            w-full py-3 rounded-2xl font-bold text-lg 
            bg-gradient-to-r from-purple-600 to-blue-600 text-white 
            shadow-md transition-all
            hover:from-purple-700 hover:to-blue-700
            disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
          `}
          onClick={onBuy}
          disabled={status !== "in" || stock === 0}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
