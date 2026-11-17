import { Heart, ArrowUpRight, ShoppingCart } from 'lucide-react';
import styles from './ProductCard.module.css';

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onDetails,
  onAddToCart,
}) {
  return (
    <article className={styles.card}>
      <button
        className={styles.favoriteButton}
        onClick={() => onToggleFavorite(product)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={20}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>

      <img
        className={styles.image}
        src={product.thumbnail}
        alt={product.title}
      />

      <div className={styles.content}>
        <span className={styles.category}>
          {product.category.replaceAll('-', ' ')}
        </span>

        <h3>{product.title}</h3>

        <div className={styles.info}>
          <strong>${product.price.toFixed(2)}</strong>
          <span>★ {product.rating.toFixed(1)}</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.detailsButton}
            onClick={() => onDetails(product.id)}
          >
            Details <ArrowUpRight size={16} />
          </button>

          <button
            className={styles.cartButton}
            onClick={() => onAddToCart(product)}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;