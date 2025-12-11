import { useEffect, useState } from "react";
import { useGetFoods } from "@/hooks/useGetFoods";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

function Menu() {
  const { foods, getFoods } = useGetFoods();
  const { categories, getCategories } = useGetCategory();

  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getFoods();
    getCategories();
    
  }, []);

  const filteredFoods = foods.filter((f) => {
    const matchCategory = filterCategory === "all" || f.categoryId === filterCategory;
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.price.toString().includes(search);
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">

      {/* FILTER BAR */}
      <div className="flex items-center gap-4">
        <div className="w-56">
          <Select defaultValue="all" onValueChange={(v) => setFilterCategory(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ara..."
          className="w-56"
        />
      </div>

      {/* FOOD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredFoods.map((food) => (
          <div
            key={food._id}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src={`http://localhost:5000/file?path=${food.imgs[0]}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-4 space-y-1">
              <h3 className="font-semibold text-lg">{food.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{food.description}</p>

              <p className="text-red-600 font-medium">
                {categories.find((i) => i._id === food.categoryId)?.name || "Kategori Yok"}
              </p>

              <p className="font-bold text-xl mt-2">{food.price} ₺</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Menu;
