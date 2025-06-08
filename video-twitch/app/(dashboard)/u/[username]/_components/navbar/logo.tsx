import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-4 hover:opacity-75 transition">
        <div className="p-3 mr-5 shrink-0 lg:mr-0 lg:shrink">
          <Image src="/spooky.svg" alt="Logo" width={45} height={45} />        </div>
        <div className={cn("hidden lg:block", font.className)}>
          <p className="text-lg font-semibold">Twitch</p>
          <p  className="text-xs text-muted-foreground">
            Creator dashboard
          </p>
        </div>
      </div>
    </Link>
  );
};