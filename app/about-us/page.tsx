import { redirect } from "next/navigation";

/** Redirige /about-us a la página oficial Nosotros en /zx-line */
export default function AboutUsPage() {
  redirect("/zx-line");
}
