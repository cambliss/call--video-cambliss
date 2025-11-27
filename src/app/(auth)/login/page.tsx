import { type Metadata } from "next";
import Link from "next/link";
import { Icons } from "~/components/ui/icons";
import SocialAuthForm from "~/components/social-auth-form";

export const metadata: Metadata = {
  title: "CallSquare - Connect with Ease",
  description:
    "Sign in to CallSquare and start connecting with your friends, family, and colleagues through seamless video calls.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto grid h-screen w-screen grid-cols-1 lg:grid-cols-2 bg-black text-white" style={{ background: "linear-gradient(135deg, #111 60%, #fff 100%)" }}>
      <section className="relative grid place-items-center p-12">
        <div className="mx-auto -mt-16 flex w-[330px] flex-col justify-center gap-8 sm:w-[370px] bg-black border-2 border-yellow-400 rounded-2xl p-8 shadow-lg">
          <div>
            <Link href="/">
              <Icons.logo height={60} width={60} className="-ml-3 mb-3 text-yellow-400" />
            </Link>
            <h1 className="mb-0.5 text-3xl font-bold tracking-tight text-yellow-400">
              Connect with Cambliss now
            </h1>
            <p className="text-base text-yellow-200">
              Welcome back! Sign in to your Cambliss Videoconferencing account
            </p>
          </div>
          <SocialAuthForm />
          <p className="px-8 text-center text-base text-yellow-200">
            <Link
              href="/register"
              className="hover:text-yellow-400 underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </section>
      <section
        className="hidden bg-yellow-100 bg-cover bg-center bg-no-repeat lg:block"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/4492135/pexels-photo-4492135.jpeg)`,
        }}
      ></section>
    </main>
  );
}
