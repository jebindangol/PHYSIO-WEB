import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Navbar = () => {
  const router = useRouter();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 100;

      setVisible(visible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <div className={`fixed z-10 top-0 w-screen transition-transform duration-1000 delay-200 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="w-[96%] mx-auto rounded-b-lg shadow-lg bg-white">
        <div className="flex justify-between py-4 items-center px-5">
          <Link href="/">
            <div className="flex items-center gap-5">
              <img src="/logo.png" className="w-10" />
              <img src="/name.png" className="h-10" />
            </div>
          </Link>
          <div className="flex gap-4 text-lg font-light">
            <Link href="/" onClick={() => (window.location.href = "/")}>
              <div
                className={`nav-link ${
                  router.pathname === "/" ? "active" : ""
                }`}
              >
                Home
              </div>
            </Link>
            <div>|</div>
            <Link
              href="/services"
              onClick={() => (window.location.href = "/services")}
            >
              <div
                className={`nav-link ${
                  router.pathname === "/services" || router.pathname.startsWith("/services/") ? "active" : ""
                }`}
              >
                Services
              </div>
            </Link>
            <div>|</div>
            <Link
              href="/library"
              onClick={() => (window.location.href = "/library")}
            >
              <div className={`nav-link ${
                  router.pathname === "/library" || router.pathname.startsWith("/library/") ? "active" : ""
                }`}>Library</div>
            </Link>
            <div>|</div>
            <Link
              href="/gallery"
              onClick={() => (window.location.href = "/gallery")}
            >
              <div className={`nav-link ${
                  router.pathname === "/gallery" || router.pathname.startsWith("/gallery/") ? "active" : ""
                }`}>Gallery</div>
            </Link>
            <div>|</div>
            <Link
              href="/blogs"
              onClick={() => (window.location.href = "/blogs")}
            >
              <div className={`nav-link ${
                  router.pathname === "/blogs" || router.pathname.startsWith("/blogs/") ? "active" : ""
                }`}>Blog</div>
            </Link>
          </div>
          <div>
            <Link
              href="/appointment"
              onClick={() => (window.location.href = "/appointment")}
            >
              <button className="text-white p-3 rounded-md button shadow-xl w-60">
                Get an Appointment
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
