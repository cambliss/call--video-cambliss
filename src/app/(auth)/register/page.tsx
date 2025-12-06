import { type Metadata } from "next";
import Link from "next/link";
import { Icons } from "~/components/ui/icons";
import SocialAuthForm from "~/components/social-auth-form";

export const metadata: Metadata = {
  title: "CallSquare - Sign Up",
  description:
    "Create your account today and start connecting with friends, family, and colleagues through seamless video calls.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex h-screen w-screen bg-black text-white">
      {/* Left: Image */}
      <section
        className="hidden lg:flex flex-1 items-center justify-center bg-yellow-100 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/5198240/pexels-photo-5198240.jpeg)`,
        }}
      >
        <div className="w-full h-full bg-black/30 flex items-center justify-center">
          {/* Optionally add a tagline or overlay here */}
        </div>
      </section>
      {/* Right: Register Card */}
      <section className="flex flex-1 items-center justify-center px-4 py-10 bg-black">
        <div className="w-full max-w-md rounded-2xl border-2 border-yellow-400 bg-black/90 p-8 shadow-2xl flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <Link href="/">
              <Icons.logo height={52} style={{ width: "fit-content" }} className="mb-2 text-yellow-400" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-yellow-400 text-center">
              Let&apos;s get started
            </h1>
            <p className="text-yellow-200 text-center">
              Create your account now
            </p>
          </div>
          <SocialAuthForm />
          <p className="text-center text-base text-yellow-200">
            <Link
              href="/login"
              className="hover:text-yellow-400 underline underline-offset-4"
            >
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
