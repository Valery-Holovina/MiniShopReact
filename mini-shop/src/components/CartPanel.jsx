
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import styles from './CartPanel.module.css';

function CartPanel({ cart, onClose, onUpdateQuantity, onRemove }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section
        className={styles.panel}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className={styles.header}>
          <div>
            <ShoppingCart size={22} />
            <h2>Your cart ({totalItems})</h2>
          </div>

          <button onClick={onClose} aria-label="Close cart">
            <X />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className={styles.empty}>
            Your shopping cart is empty.
          </p>
        ) : (
          <>
            <div className={styles.items}>
              {cart.map((item) => (
                <article key={item.id} className={styles.item}>
                  <img src={item.thumbnail} alt={item.title} />

                  <div className={styles.itemInfo}>
                    <h3>{item.title}</h3>
                    <p>${item.price.toFixed(2)}</p>

                    <div className={styles.quantity}>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <button
                    className={styles.removeButton}
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Total:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <p>Shopping cart demonstration — no payment required.</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default CartPanel;
