import { type FormEvent, useEffect, useState } from "react";

type NavbarProps = {
	currentPage: "home" | "products";
	onNavigate: (page: "home" | "products") => void;
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDarkTheme, setIsDarkTheme] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		setIsLoggedIn(Boolean(token));
	}, []);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const prefersDark = savedTheme === "dark";
		setIsDarkTheme(prefersDark);
		document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
	}, []);

	const handleSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onNavigate("products");
	};

	const handleThemeToggle = () => {
		const nextIsDark = !isDarkTheme;
		setIsDarkTheme(nextIsDark);
		const nextTheme = nextIsDark ? "dark" : "light";
		document.documentElement.setAttribute("data-theme", nextTheme);
		localStorage.setItem("theme", nextTheme);
	};

	const navLinkClass = (page: "home" | "products") =>
		`px-2 py-1 text-sm font-medium transition ${
			currentPage === page
				? "text-lime-300"
				: "text-white/90 hover:text-lime-200"
		}`;

	return (
		<header className="sticky top-0 z-20 bg-emerald-700 text-white shadow-md">
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
				<button
					type="button"
					onClick={() => onNavigate("home")}
					className="text-lg font-bold tracking-wide"
				>
					FreshStock
				</button>

				<ul className="hidden items-center gap-5 md:flex">
					<li>
						<button
							type="button"
							onClick={() => onNavigate("home")}
							className={navLinkClass("home")}
						>
							Home
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={() => onNavigate("products")}
							className={navLinkClass("products")}
						>
							Products
						</button>
					</li>
					<li>
						<button type="button" className="px-2 py-1 text-sm font-medium text-white/90 hover:text-lime-200">
							Categories
						</button>
					</li>
				</ul>

				<form onSubmit={handleSearch} className="ml-auto hidden items-center gap-2 md:flex">
					<input
						type="text"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search"
						className="h-9 w-64 rounded-md bg-white px-3 text-sm text-slate-800 outline-none"
					/>
					<button
						type="submit"
						className="h-9 rounded-md bg-lime-400 px-4 text-sm font-semibold text-emerald-900 transition hover:bg-lime-300"
					>
						Search
					</button>
				</form>

				<label className="hidden items-center gap-2 text-xs font-medium md:flex" title="Toggle theme">
					<span className="text-white/90">Theme</span>
					<input
						type="checkbox"
						className="toggle toggle-sm border-white/50 bg-white/20"
						checked={isDarkTheme}
						onChange={handleThemeToggle}
					/>
				</label>

				{isLoggedIn ? (
					<button
						type="button"
						aria-label="Open user details"
						title="User details"
						className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white"
					>
						U
					</button>
				) : (
					<div className="ml-2 hidden items-center gap-2 md:flex">
						<button
							type="button"
							className="h-9 rounded-md bg-white/15 px-3 text-sm font-medium text-white transition hover:bg-white/25"
						>
							Sign Up
						</button>
						<button
							type="button"
							className="h-9 rounded-md bg-slate-900 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
						>
							Sign In
						</button>
					</div>
				)}
			</nav>
		</header>
	);
}
