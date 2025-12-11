export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6 md:px-20 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold mb-4">
            <img src="/logo.png" alt="CafeSystem" className="h-10" />
            <span>CafeSystem</span>
          </div>
          <p className="text-gray-400 text-sm">
            Elevating dining experiences through exceptional cuisine and warm hospitality.
          </p>
          <div className="flex gap-4 mt-4">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-twitter"></i>
          </div>
        </div>


        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold text-lg mb-4">My Account</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>123 Culinary Street</li>
            <li>Food District, PC 12345</li>
            <li>+1 (555) 123-4567</li>
            <li>info@cafesystem.com</li>
            <li>Mon–Fri: 7AM–11PM</li>
            <li>Sat–Sun: 8AM–12AM</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-gray-600 text-sm mt-10">© 2025 CafeSystem. All rights reserved.</p>
    </footer>
  );
}