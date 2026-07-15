import { redirect } from "next/navigation";

// rubric-এর canonical path /items/manage — Mistiri-তে এটা নিজের repair request
// ব্যবস্থাপনা (View/Delete)। আসল (protected) পেজে পাঠিয়ে দিই।
export default function ItemsManagePage() {
  redirect("/repair/my");
}
