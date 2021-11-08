import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";
import { ProductListItem } from "../../components/ProductListItem";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get<ProductFormatted[]>("/products");
      const formattedProducts = data.map((product) => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      })) as ProductFormatted[];
      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  return (
    <ProductList>
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </ProductList>
  );
};

export default Home;
