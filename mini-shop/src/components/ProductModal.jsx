
import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductById } from '../services/productApi';
import styles from './ProductModal.module.css';

function ProductModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError('');
      setProduct(null);
      setImageIndex(0);

      try {
        const data = await getProductById(productId);

        if (!ignore) {
          setProduct(data);
        }
      } catch {
        if (!ignore) {
          setError('Could not load product details.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [productId]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  function changeImage(direction) {
    if (!product?.images?.length) return;

    setImageIndex((current) => {
      const total = product.images.length;
      return (current + direction + total) % total;
    });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Product details"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={22} />
        </button>

        {loading && <p>Loading product details...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && product && (
          <div className={styles.content}>
            <div className={styles.gallery}>
              <img
                src={product.images?.[imageIndex] || product.thumbnail}
                alt={product.title}
                className={styles.mainImage}
              />

              {product.images?.length > 1 && (
                <div className={styles.imageControls}>
                  <button onClick={() => changeImage(-1)} aria-label="Previous image">
                    <ChevronLeft />
                  </button>

                  <span>
                    {imageIndex + 1} / {product.images.length}
                  </span>

                  <button onClick={() => changeImage(1)} aria-label="Next image">
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.details}>
              <span className={styles.category}>
                {product.category.replaceAll('-', ' ')}
              </span>

              <h2>{product.title}</h2>

              <p>{product.description}</p>

              <div className={styles.price}>
                ${product.price.toFixed(2)}
              </div>

              <p>Rating: ★ {product.rating}</p>
              <p>Discount: {product.discountPercentage}%</p>
              <p>Brand: {product.brand || 'Not specified'}</p>
              <p>Stock: {product.stock}</p>
              <p>Availability: {product.availabilityStatus}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductModal;
