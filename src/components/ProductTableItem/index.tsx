import {
  MdAddCircleOutline,
  MdDelete,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { useCart } from "../../hooks/useCart";
import { Product } from "../../types";
import { formatPrice } from "../../util/format";

interface ProductTableItemProps {
  product: Product;
}

export function ProductTableItem({ product }: ProductTableItemProps) {
  const { removeProduct, updateProductAmount } = useCart();
  const { amount, image, price, title } = product;

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  function handleProductIncrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount + 1 });
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount - 1 });
  }

  return (
    <tr data-testid="product">
      <td>
        <img src={image} alt={title} />
      </td>
      <td>
        <strong>{title}</strong>
        <span>{formatPrice(price)}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={amount <= 1}
            onClick={() => handleProductDecrement(product)}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            onClick={() => handleProductIncrement(product)}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{formatPrice(price * amount)}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={() => handleRemoveProduct(product.id)}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
  );
}
