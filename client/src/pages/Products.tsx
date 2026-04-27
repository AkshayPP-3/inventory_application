import { useState, useEffect } from "react";
import { CircleFadingArrowUpIcon } from "lucide-react";
import AddProductModal from "../components/modals/AddProductModal";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function Products() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = async () => {
		try {
			setError(null);
			const apiUrl = import.meta.env.VITE_API_URL;
			const response = await fetch(`${apiUrl}/api/products`);
			if (!response.ok) {
				throw new Error("Failed to fetch products");
			}
			const data = await response.json();
			setProducts(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred");
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleProductAdded = () => {
		fetchProducts(); // Refetch products after a new one is added
	};

	return (
		<main className="relative min-h-screen overflow-y-auto bg-amber-50 flex flex-col items-center text-center px-6 py-24">

			{/* Background blobs */}
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute -top-20 -left-28 w-96 h-96 rounded-full bg-lime-300 opacity-40 blur-3xl animate-[drift1_8s_ease-in-out_infinite_alternate]" />
				<div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-orange-400 opacity-35 blur-3xl animate-[drift2_10s_ease-in-out_infinite_alternate]" />
				<div className="absolute top-1/2 left-2/3 w-56 h-56 rounded-full bg-violet-300 opacity-30 blur-3xl animate-[drift1_12s_ease-in-out_infinite_alternate-reverse]" />
				<div className="absolute top-1/4 right-10 w-44 h-44 rounded-full bg-sky-300 opacity-35 blur-3xl animate-[drift2_9s_ease-in-out_infinite_alternate]" />
			</div>

			<section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-2 py-4 text-center sm:px-0 sm:py-6">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-black">
					products
				</p>

				<h1 className="mt-3 text-3xl font-extrabold leading-tight text-black sm:text-4xl lg:text-5xl">
					Product Inventory
				</h1>

				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="mt-5 inline-flex items-center gap-2 rounded-full border border-black px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md"
				>
					<CircleFadingArrowUpIcon className="h-4 w-4" />
					Add Product
				</button>

				{products.length === 0 && !error ? (
					<p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-black sm:text-base">
						Keep your grocery products organized in a clean inventory view. Add a
						new product using the button above when you are ready.
					</p>
				) : null}
			</section>

			{error && (
				<div className="relative z-10 mt-8 text-red-600">
					<p>Error: {error}</p>
				</div>
			)}

			<div className="relative z-10 mt-12 grid w-full max-w-7xl gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{products.map((product) => (
					<div
						key={product.id}
						className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200/50 bg-white/40 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/40"
					>
						<div className="aspect-w-3 aspect-h-4 bg-gray-200/50 dark:bg-gray-700/50 sm:aspect-none sm:h-60">
							<img
								src={product.image}
								alt={product.name}
								className="h-full w-full object-cover object-center sm:h-full sm:w-full"
							/>
						</div>
						<div className="flex flex-1 flex-col space-y-2 p-4 text-left">
							<h3 className="text-base font-medium text-gray-900 dark:text-white">
								{product.name}
							</h3>
							<p className="text-lg font-semibold text-gray-900 dark:text-white">
								${product.price.toFixed(2)}
							</p>
						</div>
					</div>
				))}
			</div>

			<AddProductModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onProductAdded={handleProductAdded}
			/>
		</main>
	);
}
