import { getCategoryList } from "@/lib/db/queries/category";
import CategoryButton from "./category-button";
import { Suspense } from "react";

export default async function Sidebar() {
  const categories = await getCategoryList();

  return (
    <div className="border rounded-lg p-2 text-sm">
      <ul className="space-y-2">
        <Suspense fallback={<div>加载中...</div>}>
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryButton category={category} />
            </li>
          ))}
        </Suspense>
      </ul>
    </div>
  );
}
