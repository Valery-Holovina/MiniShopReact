
const BASE_URL = 'https://dummyjson.com';

export async function getProducts(search = '', category = '') {
  let url = `${BASE_URL}/products?limit=0`;

  if (search.trim()) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=0`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${category}?limit=0`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  const data = await response.json();

  return {
    products: data.products,
    total: data.total,
  };
}


export async function getCategories() {
  const response = await fetch(`${BASE_URL}/products/category-list`);

  if (!response.ok) {
    throw new Error('Failed to load categories');
  }

  return response.json();
}


export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error('Failed to load product');
  }

  return response.json();
}
