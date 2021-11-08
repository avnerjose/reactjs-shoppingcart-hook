import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const localStorageCart = localStorage.getItem("@RocketShoes:cart");

    if (localStorageCart) {
      return JSON.parse(localStorageCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productAlreadyExists = cart.find(
        (product) => product.id === productId
      );

      if (!productAlreadyExists) {
        const { data } = await api.get<Product>(`/products/${productId}`);

        if (!data) throw new Error();

        const product = { ...data, amount: 1 } as Product;
        setCart((prev) => [...prev, product]);
        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify([...cart, product])
        );
      } else {
        const { data } = await api.get<Stock>(`/stock/${productId}`);

        if (productAlreadyExists.amount + 1 <= data.amount) {
          const products = cart.map((product) =>
            product.id === productId
              ? { ...product, amount: product.amount + 1 }
              : { ...product }
          ) as Product[];

          setCart(products);
          localStorage.setItem("@RocketShoes:cart", JSON.stringify(products));
        } else toast.error("Quantidade solicitada fora de estoque");
      }
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const product = cart.find((product) => product.id === productId);

      if (product) {
        const filteredData = cart.filter((product) => product.id !== productId);
        setCart(filteredData);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(filteredData));
      } else throw new Error();
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount < 1) return;

      const { data } = await api.get<Stock>(`/stock/${productId}`);

      if (amount <= data.amount) {
        const products = cart.map((product) =>
          product.id === productId
            ? { ...product, amount: amount }
            : { ...product }
        ) as Product[];

        setCart(products);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(products));
      } else toast.error("Quantidade solicitada fora de estoque");
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
