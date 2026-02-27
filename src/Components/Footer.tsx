"use client"
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-green-600 to-green-700 text-white mt-20"
    >
      {/* Top Section */}
      <div className="w-[90%] md:w-[80%] mx-auto py-14 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-green-500/40">

        {/* Brand Section */}
        <div>
          <h2 className="text-3xl font-bold mb-4">Snapcart</h2>
          <p className="text-green-100 leading-relaxed text-sm">
            Snapcart is your trusted online grocery destination. 
            Fast delivery, fresh products, and seamless shopping 
            experience — all in one place.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <Facebook className="cursor-pointer hover:scale-110 transition" />
            <Instagram className="cursor-pointer hover:scale-110 transition" />
            <Twitter className="cursor-pointer hover:scale-110 transition" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-green-100">
            <li>
              <Link href="/" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link href="user/cart" className="hover:text-white transition">Cart</Link>
            </li>
            <li>
              <Link href={"user/my-orders" }className="hover:text-white transition">My Orders</Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-green-100 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={18} /> Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} /> +880 17233 35513
            </li>
            <li className="flex items-center gap-3 cursor-pointer">
              <Mail size={18} /> support@snapcart.com
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="text-center py-6 text-sm text-green-100">
        © {new Date().getFullYear()} Snapcart. All rights reserved.
      </div>
    </motion.footer>
  );
}

export default Footer;