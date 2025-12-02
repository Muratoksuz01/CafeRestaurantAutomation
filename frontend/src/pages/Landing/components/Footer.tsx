import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo + açıklama */}
        <div>
          <h2 className="text-xl font-bold text-white">CafeSystem</h2>
          <p className="text-sm mt-2 text-gray-400">
            Modern ve hızlı kafe & restoran yönetim sistemi.
          </p>
        </div>

        {/* Linkler */}
        <div>
          <h3 className="font-semibold text-white mb-3">Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
            <li><a href="/menu" className="hover:text-white">Menu</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Sosyal medya */}
        <div>
          <h3 className="font-semibold text-white mb-3">Social</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white"><i className="fa-brands fa-facebook"></i></a>
            <a href="#" className="hover:text-white"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="hover:text-white"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-white"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>

      </div>

      {/* Alt telif hakkı */}
      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} CafeSystem. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
