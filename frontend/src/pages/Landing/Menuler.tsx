import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

function Menuler() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.log("Bir dosya seçmelisiniz");
      return;
    }

    const formData = new FormData();

    formData.append("imgs", file); // tek dosya

    setLoading(true);
    try {
      const res = await axiosInstance.post("http://localhost:5000/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Yemek oluşturuldu:", res.data);

      // reset form
      setName("");
      setPrice("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.log("Hata:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Menuler</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
       
        <input type="file" onChange={handleChangeFile} accept="image/*" />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
        >
          {loading ? "Yükleniyor..." : "Gönder"}
        </button>
      </form>

      {file && (
        <div>
          <p>Seçilen Dosya:</p>
          <p>{file.name}</p>
        </div>
      )}
    </div>
  );
}

export default Menuler;
