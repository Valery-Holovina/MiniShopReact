
import { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Sun, Moon } from 'lucide-react';

import { getProducts, getCategories } from './services/productApi';

import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartPanel from './components/CartPanel';

import useLocalStorage from './hooks/useLocalStorage';


const PRODUCTS_PER_PAGE = 12;

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('default');

  const [page, setPage] = useState(1);
  const [activeView, setActiveView] = useState('catalog');

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [favorites, setFavorites] = useLocalStorage(
    'mini-shop-favorites',
    []
  );

  const [cart, setCart] = useLocalStorage(
    'mini-shop-cart',
    []
  );

  const [theme, setTheme] = useLocalStorage(
    'mini-shop-theme',
    'light'
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Could not load categories:', error);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError('');
      setProducts([]);

      try {
        const data = await getProducts(search, category);

        if (!ignore) {
          setProducts(data.products);
        }
      } catch {
        if (!ignore) {
          setError('Could not load products. Please try again.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [search, category, retry]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;

      case 'title':
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, sort]);

  const displayedProducts =
    activeView === 'favorites'
      ? sortedProducts.filter((product) =>
          favorites.some((favorite) => favorite.id === product.id)
        )
      : sortedProducts;

  const totalPages = Math.max(
    1,
    Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)
  );

  const currentProducts = displayedProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );


  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function clearSearch() {
    setSearch('');
    setPage(1);
  }


  function handleCategory(event) {
    setCategory(event.target.value);
    setPage(1);
  }


  function handleSort(event) {
    setSort(event.target.value);
    setPage(1);
  }


  function toggleFavorite(product) {
    setFavorites((previous) => {
      const exists = previous.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return previous.filter(
          (item) => item.id !== product.id
        );
      }

      return [...previous, product];
    });
  }

  function isFavorite(productId) {
    return favorites.some(
      (item) => item.id === productId
    );
  }


  function addToCart(product) {
    setCart((previous) => {
      const exists = previous.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true);
  }

  function updateCartQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((previous) =>
      previous.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  function removeFromCart(productId) {
    setCart((previous) =>
      previous.filter((item) => item.id !== productId)
    );
  }

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function toggleTheme() {
    setTheme((previous) =>
      previous === 'light' ? 'dark' : 'light'
    );
  }

  function changeView(view) {
    setActiveView(view);
    setPage(1);
  }

  return (
    <div className={`app ${theme}-theme`}>
      <header className="mainHeader">
        <div>
          <h1>Mini Shop</h1>
          <p>Find products you love.</p>
        </div>

        <div className="headerActions">
          <button
            className="themeButton"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}

            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>

          <button
            className="cartHeaderButton"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            Cart ({cartCount})
          </button>
        </div>
      </header>

      <nav className="viewNavigation">
        <button
          className={activeView === 'catalog' ? 'active' : ''}
          onClick={() => changeView('catalog')}
        >
          All products
        </button>

        <button
          className={activeView === 'favorites' ? 'active' : ''}
          onClick={() => changeView('favorites')}
        >
          Favorites ({favorites.length})
        </button>
      </nav>

      <section className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
        />

        <button onClick={clearSearch}>
          Clear search
        </button>

        <select
          value={category}
          onChange={handleCategory}
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll('-', ' ')}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={handleSort}
        >
          <option value="default">Default sorting</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
          <option value="title">Name: A-Z</option>
        </select>
      </section>

      <main>
        {loading && (
          <p className="loadingMessage">
            Loading products...
          </p>
        )}

        {!loading && error && (
          <div className="errorMessage">
            <p>{error}</p>

            <button
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && displayedProducts.length === 0 && (
          <p className="emptyMessage">
            {activeView === 'favorites'
              ? 'You have no favorite products yet.'
              : 'No products found.'}
          </p>
        )}

        {!loading && !error && displayedProducts.length > 0 && (
          <>
            <p className="productCount">
              Showing {currentProducts.length} of{' '}
              {displayedProducts.length} products
            </p>

            <div className="products">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onDetails={setSelectedProductId}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((value) => value - 1)
                }
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((value) => value + 1)
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      {selectedProductId !== null && (
        <ProductModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}

    
      {isCartOpen && (
        <CartPanel
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
        />
      )}
    </div>
  );
}

export default App;






