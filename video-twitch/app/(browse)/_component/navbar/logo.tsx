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
      <div className="flex items-center space-x-2 p-4">
        {/* Logo - sử dụng file spooky.png */}
        <Image
          src="/spooky.svg" // hoặc "/spooky.svg" nếu bạn có định dạng SVG
          alt="Gamehub"
          height={50}
          width={50}
          priority
        />

        {/* Text bên phải logo */}
        <span className="!text-white font-semibold text-base leading-none">
          Play & Stream
        </span>
      </div>
    </Link>
  );
};

