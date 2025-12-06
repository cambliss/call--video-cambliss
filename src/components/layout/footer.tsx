"use client";
import React from "react";
import { Icons } from "../ui/icons";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer
      className="w-full text-yellow-100"
      style={{
        backgroundImage: "url('/footer-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full bg-black/40">
        <div className="container mx-auto max-w-[1400px] px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Logo + Links */}
          <div>
            <Icons.logo
              height={32}
              width="fit-content"
              className="mb-1 opacity-90 p-0"
              style={{ padding: 0, width: "fit-content", height: 72, marginLeft: -40 }}
            />
            <nav className="space-y-2 text-sm">
              <a href="/" className="block hover:text-yellow-400">Home</a>
              <a href="https://www.camblissstudio.com/About-US" className="block hover:text-yellow-400">About Us</a>
              <a href="https://www.camblissstudio.com/Services" className="block hover:text-yellow-400">Services</a>
              <a href="https://www.camblissstudio.com/contact" className="block hover:text-yellow-400">Contact</a>
            </nav>
          </div>

          {/* Column 2: Other Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Other Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="https://www.camblissstudio.com/Gallery" className="block hover:text-yellow-400">Gallery</a>
              <a href="https://www.camblissstudio.com/Careers" className="block hover:text-yellow-400">Careers</a>
              {/* <a href="/shop" className="block hover:text-yellow-400">Shop</a> */}
            </nav>
          </div>

          {/* Column 3: Follow Us */}
          <div>
            <h3 className="text-base font-semibold mb-3">Follow Me</h3>
            <p className="text-xs mb-4 text-yellow-100/80">
              Connect with us on social media
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-yellow-100/40 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition cursor-pointer"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-yellow-100/40 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition cursor-pointer"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-yellow-100/40 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition cursor-pointer"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-base font-semibold mb-3">Contact Us</h3>

            <div className="text-sm space-y-3">
              <p className="flex gap-2">
                <MapPin size={18} className="text-yellow-400" />
                Survey No: 75/2, Balapur(V), Hyderabad, Telangana, 500005
              </p>

              <p className="flex gap-2">
                <Phone size={18} className="text-yellow-400" />
                1800 571 9799
              </p>

              <p className="flex gap-2">
                <Mail size={18} className="text-yellow-400" />
                contact@camblissstudio.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-400/20 py-4">
          <div className="container mx-auto max-w-[1400px] px-4 flex flex-col md:flex-row items-center justify-between text-xs text-yellow-100/80 gap-3">

            <div className="text-center md:text-left">
              © 2025 CAMBLISS All Rights Reserved. <br />
              CIN: U32100TG2018PTC128985
            </div>

            <div className="flex gap-5">
              <a href="https://www.camblissstudio.com/policy-privacy" className="hover:text-yellow-400">Privacy Policy</a>
              <a href="https://www.camblissstudio.com/quality-control" className="hover:text-yellow-400">Quality Control</a>
              <a href="https://www.camblissstudio.com/terms-conditions" className="hover:text-yellow-400">Terms & Conditions</a>
              <a href="https://www.camblissstudio.com/refunds-cancellation" className="hover:text-yellow-400">Refunds & Cancellations</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
