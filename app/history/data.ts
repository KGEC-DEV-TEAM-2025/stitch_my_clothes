interface Product {
  image: string;
  productId: string | number;
  fabric: string;
  price: number;
  color?: string;
}

const products: Product[] = [
  {
      image: "/fab1.webp",
      productId: "TSHIRT001",
      fabric: "/fab1.webp",
      price: 25,
      color: "#0000FF",
  },
  {
      image: "/fab6.jpg",
      productId: 1001,
      fabric: "/fab6.jpg",
      price: 50,
      color: "#284B63",
  },
  {
      image: "/fab5.webp",
      productId: "DRESS001",
      fabric: "/fab5.webp",
      price: 120,
      color: "#FF69B4",
  },
  {
      image: "/fab1.webp",
      productId: "JACKET001",
      fabric: "/fab1.webp",
      price: 180,
      color: "#000000",
  },
  {
      image: "/fab4.webp",
      productId: "SKIRT001",
      fabric: "/fab4.webp",
      price: 45,
      color: "#F5F5DC",
  },
  {
      image: "/fab5.webp",
      productId: "SHIRT001",
      fabric: "/fab5.webp",
      price: 30,
      color: "#0000FF",
  },
  {
      image: "/fab1.webp",
      productId: 1002,
      fabric: "/fab1.webp",
      price: 70,
      color: "#808080",
  },
  {
      image: "/fab3.webp",
      productId: "SWEATER001",
      fabric: "/fab3.webp",
      price: 60,
      color: "#FFFDD0",
  },
  {
      image: "/fab4.webp",
      productId: "BLOUSE001",
      fabric: "/fab4.webp",
      price: 40,
      color: "#FFFFFF",
  },
  {
      image: "/fab3.webp",
      productId: "SHORTS001",
      fabric: "/fab3.webp",
      price: 20,
      color: "#F0E68C",
  },
];

export default Product;
export { products };