import Link from "next/link";
import SiteFooter from "~/components/layout/footer";
import FullNav from "~/components/layout/full-nav";
import { Button } from "~/components/ui/button";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <FullNav>
        <div className="flex gap-x-1.5">
          <Link href={"/login"}>
            <Button
              className="mr-2 hidden rounded-lg font-semibold text-lg px-6 py-2 sm:block bg-white text-black border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              variant="ghost"
              size="lg"
            >
              Sign In
            </Button>
          </Link>
          <Link href={"/register"}>
            <Button
              className="rounded-lg text-lg font-semibold px-6 py-2 bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-white hover:text-yellow-400 transition"
              size="lg"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </FullNav>
      <main className="w-screen flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
