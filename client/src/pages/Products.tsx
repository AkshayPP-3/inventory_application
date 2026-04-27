import { CircleFadingArrowUpIcon } from "lucide-react";

export default function Products() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-amber-50 flex flex-col items-center justify-center text-center px-6 py-24">

			{/* Background blobs */}
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute -top-20 -left-28 w-96 h-96 rounded-full bg-lime-300 opacity-40 blur-3xl animate-[drift1_8s_ease-in-out_infinite_alternate]" />
				<div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-orange-400 opacity-35 blur-3xl animate-[drift2_10s_ease-in-out_infinite_alternate]" />
				<div className="absolute top-1/2 left-2/3 w-56 h-56 rounded-full bg-violet-300 opacity-30 blur-3xl animate-[drift1_12s_ease-in-out_infinite_alternate-reverse]" />
				<div className="absolute top-1/4 right-10 w-44 h-44 rounded-full bg-sky-300 opacity-35 blur-3xl animate-[drift2_9s_ease-in-out_infinite_alternate]" />
			</div>

			<section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-2 py-4 text-center sm:px-0 sm:py-6">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-black">
					products
				</p>

				<h1 className="mt-3 text-3xl font-extrabold leading-tight text-black sm:text-4xl lg:text-5xl">
					Products
				</h1>

				<button
					type="button"
					className="mt-5 inline-flex items-center gap-2 rounded-full border border-black px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md"
				>
					<CircleFadingArrowUpIcon className="h-4 w-4" />
					Add Product
				</button>

				<p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-black sm:text-base">
					Keep your grocery products organized in a clean inventory view. Add a
					new product using the button above when you are ready.
				</p>
			</section>
		</main>
	);
}
