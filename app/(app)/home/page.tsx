import { redirect } from "next/navigation";
import { getCurrentAppContext } from "@/lib/repositories/app-context";

export default async function HomePage() {
  const context = await getCurrentAppContext();

  redirect(`/rooms/${context.familyId}`);
}
