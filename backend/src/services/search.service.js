const meiliClient = require('../config/meilisearch');

const indexProducts = async (products) => {
  const index = meiliClient.index('products');
  
  const formattedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDesc: p.shortDesc,
    basePrice: parseFloat(p.basePrice),
    salePrice: p.salePrice ? parseFloat(p.salePrice) : null,
    category: p.category.name,
    brand: p.brand?.name || 'Generic',
    tags: p.tags.map(t => t.tag),
    stock: p.stock,
    avgRating: parseFloat(p.avgRating),
    image: p.images.find(img => img.isPrimary)?.url
  }));

  await index.addDocuments(formattedProducts);
};

const searchProducts = async ({ q, page = 1, limit = 20, category, brand, minPrice, maxPrice, sort }) => {
  const index = meiliClient.index('products');
  
  const filters = [];
  if (category) filters.push(`category = "${category}"`);
  if (brand) filters.push(`brand = "${brand}"`);
  if (minPrice) filters.push(`salePrice >= ${minPrice} OR basePrice >= ${minPrice}`);
  if (maxPrice) filters.push(`salePrice <= ${maxPrice} OR basePrice <= ${maxPrice}`);

  return await index.search(q, {
    limit,
    offset: (page - 1) * limit,
    filter: filters.join(' AND '),
    sort: sort ? [sort] : ['createdAt:desc']
  });
};

module.exports = { indexProducts, searchProducts };