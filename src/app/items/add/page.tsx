import { redirect } from "next/navigation";

// rubric-এর canonical path /items/add — Mistiri-তে এটা repair request তৈরি।
// আসল (protected) পেজে পাঠিয়ে দিই, যাতে এক জায়গায় logic থাকে।
export default function ItemsAddPage() {
  redirect("/repair/add");
}
