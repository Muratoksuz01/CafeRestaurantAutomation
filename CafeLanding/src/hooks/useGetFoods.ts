
import { useState } from 'react';
import axios from 'axios';
// src/hooks/useProducts.ts
type Food ={
  _id:number,
  name:string,
  price:number;
  categoryId:string,
  imgs:string[],
  description:string
}



export function useGetFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getFoods() {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/foods"); 
    //  console.log(res.data.data)
      if (res.data.success && res.data.data) {
        setFoods(res.data.data);
      //  console.log("basrılı");
        
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setFoods([]);

    } finally {
      setLoading(false);
    }
  }
  return { foods, loading, error, setFoods ,getFoods};
}


