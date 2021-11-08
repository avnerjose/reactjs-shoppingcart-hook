import { MdAddShoppingCart } from "react-icons/md";
import { useCart } from "../../hooks/useCart";
import { Container } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  priceFormatted: string;
  image: string;
}

interface ProductListItemProps {
  product: Product;
}

interface CartItemsAmount {
  [key: number]: number;
}

export function ProductListItem({ product }: ProductListItemProps) {
  const { id, image, priceFormatted, title } = product;
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = { ...sumAmount };
    newSumAmount[product.id] = product.amount;

    return newSumAmount;
  }, {} as CartItemsAmount);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <Container>
      <img src={image} alt={title} />
      <strong>{title}</strong>
      <span>{priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => handleAddProduct(id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {cartItemsAmount[id] || 0}
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </Container>
  );
}
