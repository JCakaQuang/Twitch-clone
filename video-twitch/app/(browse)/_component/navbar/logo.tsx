import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const Logo = () => {
  return (
    <Link href="/" className="block">
      <div
        className={cn(
          "flex flex-col items-start p-4",
          font.className
        )}
      >
        {/* Logo */}
        <div className="mb-1">
          <Image
            src="/spooky.svg"
            alt="Gamehub"
            height={40}
            width={40}
            priority
          />
        </div>

        {/* Text below logo */}
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Gamehub</p>
          <p className="text-xs text-gray-400">Play & Stream</p>
        </div>
      </div>
    </Link>
  );
};
