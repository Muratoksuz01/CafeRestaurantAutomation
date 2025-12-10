import { RootState } from "@/store";
import { useSelector } from "react-redux";

export function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white shadow-sm z-50 flex items-center px-6 md:px-20 justify-between">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <img src="/logo.png" alt="CafeSystem" className="w-24" />
      </div>

      <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/menu">Menu</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>

      <div className="flex gap-4">
        {user ? (
          <a href="/dashboard" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
            Dashboard
          </a>
        ) : (
          <>
            <a href="/login" className="border px-4 py-2 rounded-lg hover:bg-gray-100">Login</a>
            <a href="/register" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
