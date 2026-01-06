import { getServerSession } from "next-auth/next";
import FullNav from "~/components/layout/full-nav";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <FullNav />
      {children}
    </>
  );
}
