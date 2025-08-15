// Temporary compatibility shim for old /entity/* links
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/search"); // send users to Marketplace instead of 404
}
