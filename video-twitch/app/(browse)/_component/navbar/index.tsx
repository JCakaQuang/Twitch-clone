import { Logo } from "./logo";
import { Search } from "./search"

export const Navbar = () => {
    return (
        <div>
            <nav className="fixed top-0 w-full h-20 z[-49] bg-[#252731] px-2
            lg:px-4 flex justify-bettween items-center shadow-sm">
                <Logo />
                <Search />
            </nav>
        </div>
    );
};