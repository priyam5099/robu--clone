import { ShoppingCart } from 'lucide-react';

// This is the rulebook that tells TypeScript exactly what data is allowed to be passed in!
interface ProductProps {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

// We attach the rulebook here with ": ProductProps"
export default function ProductCard({ name, price, category, imageUrl }: ProductProps) {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.15)] hover:-translate-y-2 hover:border-rose-100 cursor-pointer flex flex-col">
      
      {/* Image Container with Hover Zoom & Reveal */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-6">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hidden "Add to Cart" Button that slides up on hover */}
        <div className="absolute bottom-3 right-3 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="bg-rose-600 text-white p-2.5 rounded-full shadow-lg hover:bg-rose-700 hover:scale-110 transition-transform active:scale-95">
            <ShoppingCart size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{category}</span>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-3 group-hover:text-rose-600 transition-colors leading-snug">{name}</h3>
        
        <div className="mt-auto">
          <span className="text-lg font-extrabold text-black tracking-tight">₹{price.toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
}