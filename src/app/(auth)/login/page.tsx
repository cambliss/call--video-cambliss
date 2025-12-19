import { type Metadata } from "next";
import Link from "next/link";
import { Icons } from "~/components/ui/icons";
import SocialAuthForm from "~/components/social-auth-form";

export const metadata: Metadata = {
  title: "Cambliss video meet - Connect with Ease",
  description:
    "Sign in cambliss and start connecting with your friends, family, and colleagues through seamless video calls.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex h-screen w-screen bg-black text-white">
      {/* Left: Login Card */}
      <section className="flex flex-1 items-center justify-center px-4 py-10 bg-black">
        <div className="w-full max-w-md rounded-2xl border-2 border-yellow-400 bg-black/90 p-8 shadow-2xl flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <Link href="/">
              <Icons.logo height={52} style={{ width: "fit-content" }} className="mb-2 text-yellow-400" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-yellow-400 text-center">
              Connect with Cambliss
            </h1>
            <p className="text-base text-yellow-200 text-center">
              Welcome back! Sign in to your Cambliss Videoconferencing account
            </p>
          </div>
          <SocialAuthForm />
          <p className="text-center text-base text-yellow-200">
            <Link
              href="/register"
              className="hover:text-yellow-400 underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </section>
      {/* Right: Image */}
      <section
        className="hidden lg:flex flex-1 items-center justify-center bg-yellow-100 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/4492135/pexels-photo-4492135.jpeg)`,
        }}
      >
        <div className="w-full h-full bg-black/30 flex items-center justify-center">
          {/* Optionally add a tagline or overlay here */}
        </div>
      </section>
    </main>
  );
}
