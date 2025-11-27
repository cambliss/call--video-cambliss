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
    <main className="mx-auto grid h-screen w-screen grid-cols-1 lg:grid-cols-2 bg-black text-white" style={{ background: "linear-gradient(135deg, #111 60%, #fff 100%)" }}>
      <section
        className="hidden bg-yellow-100 bg-cover bg-center bg-no-repeat lg:block"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/5198240/pexels-photo-5198240.jpeg)`,
        }}
      ></section>
      <section className="relative grid place-items-center sm:p-12">
        <div className="mx-auto flex w-[330px] flex-col gap-8 sm:w-[370px] bg-black border-2 border-yellow-400 rounded-2xl p-8 shadow-lg">
          <div>
            <Link href="/">
              <Icons.logo height={30} width={60} className="-ml-3 text-yellow-400" />
            </Link>
            <h1 className="mb-0.5 text-2xl font-bold tracking-tight text-yellow-400">
              Let&apos;s get started
            </h1>
            <p className="text-yellow-200">
              Create your account now 
            </p>
          </div>
          <SocialAuthForm />
          <p className="px-8 text-center text-base text-yellow-200">
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
