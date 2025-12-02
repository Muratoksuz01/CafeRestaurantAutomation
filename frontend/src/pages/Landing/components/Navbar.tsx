import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, User, X } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-semibold">
          LOGO
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-purple-600 transition">Home</Link>
          <Link to="/about" className="hover:text-purple-600 transition">About</Link>
          <Link to="/contact" className="hover:text-purple-600 transition">Contact</Link>
          <Link to="/menuler" className="hover:text-purple-600 transition">Menuler</Link>

        </nav>

        {/* Right */}
        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger  asChild>
              <Button variant="outline"><User /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="start">
              <DropdownMenuItem className="hover:bg-gray-200">
                <Link to="/login" className="  text-black">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-200">
                <Link to="/register" className="  text-black">Register</Link>

              </DropdownMenuItem>
             
              
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-sm border-t">
          <nav className="flex flex-col gap-4 p-4">
            <Link onClick={() => setOpen(false)} to="/">Home</Link>
            <Link onClick={() => setOpen(false)} to="/about">About</Link>
            <Link onClick={() => setOpen(false)} to="/contact">Contact</Link>
            <Link onClick={() => setOpen(false)} to="/menuler">Menuler</Link>

            <Link
              onClick={() => setOpen(false)}
              to="/login"
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md text-center"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
