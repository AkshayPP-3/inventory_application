import { type FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignInModal from "../modals/SignInModal";
import SignUpModal from "../modals/SignUpModal";

export default function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentTheme, setCurrentTheme] = useState("light");
	const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [isSignUpOpen, setIsSignUpOpen] = useState(false);
	const themeMenuRef = useRef<HTMLDivElement | null>(null);

	const daisyThemes = [
		"light",
		"dark",
		"cupcake",
		"bumblebee",
		"emerald",
		"corporate",
		"synthwave",
		"retro",
		"cyberpunk",
		"valentine",
		"halloween",
		"garden",
		"forest",
		"aqua",
		"lofi",
		"pastel",
		"fantasy",
		"wireframe",
		"black",
		"luxury",
		"dracula",
		"cmyk",
		"autumn",
		"business",
		"acid",
		"lemonade",
		"night",
		"coffee",
		"winter",
		"dim",
		"nord",
		"sunset",
	];

	useEffect(() => {
		const token = localStorage.getItem("token");
		setIsLoggedIn(Boolean(token));
	}, []);

	const handleAuthSuccess = () => {
		const token = localStorage.getItem("token");
		setIsLoggedIn(Boolean(token));
		navigate("/");
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const themeToApply = savedTheme || "light";
		setCurrentTheme(themeToApply);
		document.documentElement.setAttribute("data-theme", themeToApply);
	}, []);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (!themeMenuRef.current) return;
			if (!themeMenuRef.current.contains(event.target as Node)) {
				setIsThemeMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	const handleSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		navigate("/products");
	};

	const handleThemeChange = (theme: string) => {
		setCurrentTheme(theme);
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
		setIsThemeMenuOpen(false);
	};

	const isCurrentPath = (path: string) => location.pathname === path;

	const navLinkClass = (path: string) =>
		`px-2 py-1 text-sm font-medium transition ${
			isCurrentPath(path)
				? "text-black"
				: "text-stone-500 hover:text-black"
		}`;

	return (
		<>
		<header className="sticky top-0 z-20 bg-[#93ff96] text-black shadow-md">
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
				<button
					type="button"
					onClick={() => navigate("/")}
					className="text-black font-bold tracking-wide"
				>
					FreshStock
				</button>

				<ul className="hidden items-center gap-5 md:flex">
					<li>
						<button
							type="button"
							onClick={() => navigate("/")}
							className={navLinkClass("/")}
						>
							Home
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={() => navigate("/products")}
							className={navLinkClass("/products")}
						>
							Products
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={() => navigate("/categories")}
							className={navLinkClass("/categories")}
						>
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
						className="h-9 rounded-md bg-lime-400 px-4 text-sm font-semibold text-emerald-900 transition hover:bg-white/25"
					>
						Search
					</button>
				</form>

				<div ref={themeMenuRef} className="relative">
					<button
						type="button"
						onClick={() => setIsThemeMenuOpen((open) => !open)}
						className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-medium text-black shadow-sm transition hover:bg-neutral-100"
						aria-haspopup="menu"
						aria-expanded={isThemeMenuOpen}
						title="Theme menu"
					>
						Theme
						<span aria-hidden="true">▼</span>
					</button>
					{isThemeMenuOpen ? (
						<ul
							className="absolute right-0 top-full z-30 mt-2 max-h-72 w-52 overflow-y-auto rounded-lg bg-white p-2 text-sm text-slate-800 shadow-xl"
							role="menu"
						>
							{daisyThemes.map((theme) => (
								<li key={theme}>
									<button
										type="button"
										onClick={() => handleThemeChange(theme)}
										className={`w-full rounded-md px-3 py-2 text-left capitalize transition ${
											currentTheme === theme
												? "bg-emerald-100 font-semibold text-emerald-800"
												: "hover:bg-slate-100"
										}`}
										role="menuitem"
									>
										{theme}
									</button>
								</li>
							))}
						</ul>
					) : null}
				</div>

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
							onClick={() => setIsSignUpOpen(true)}
							className="h-9 rounded-md bg-white px-3 text-sm font-medium text-black transition hover:bg-white/25"
						>
							Sign Up
						</button>
						<button
							type="button"
							onClick={() => setIsSignInOpen(true)}
							className="h-9 rounded-md bg-white px-3 text-sm font-medium text-black transition hover:bg-white/25"
						>
							Sign In
						</button>
					</div>
				)}
			</nav>
		</header>

		<SignInModal
			isOpen={isSignInOpen}
			onClose={() => setIsSignInOpen(false)}
			onSuccess={handleAuthSuccess}
		/>
		<SignUpModal
			isOpen={isSignUpOpen}
			onClose={() => setIsSignUpOpen(false)}
			onSuccess={handleAuthSuccess}
		/>
		</>
	);
}
