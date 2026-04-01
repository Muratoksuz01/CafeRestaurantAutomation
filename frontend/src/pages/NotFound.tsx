import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import useAuthStore from "../store/useAuthStore"; // Store yolunu kontrol edin
// import noAuthImg from "@/assets/noAuthImg.png";
import  noAuthImg from "@/assets/noAuthİmg.png"
export default function Unauthorized() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout(); // Mevcut oturumu temizle
    navigate("/login",{replace:true}); // Login sayfasına yönlendir
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
        <div>
          {/* Görsel Alanı */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={noAuthImg}// Resmin public klasöründe olduğunu varsayıyorum
                alt="Unauthorized"
                className="h-32 w-32 object-contain"
              />
             
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Erişim Engellendi
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Üzgünüz, bu sayfayı görüntülemek için gerekli yetkilere sahip değilsiniz.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
        
          
          <button
            onClick={handleLogout}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LuLogOut className="h-5 w-5 text-red-300 group-hover:text-white" />
            </span>
            Güvenli Çıkış Yap ve Giriş Ekranına Dön
          </button>
        </div>

        
      </div>
    </div>
  );
}