import { Car } from "lucide-react";

function Footer() {
  const footerLinks = {
    About: [
      { title: "How it works", href: "#" },
      { title: "Featured", href: "#" },
      { title: "Partnership", href: "#" },
      { title: "Business Relations", href: "#" },
    ],
    Company: [
      { title: "About Us", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Press", href: "#" },
    ],
    Support: [
      { title: "Help Center", href: "#" },
      { title: "Contact Us", href: "#" },
      { title: "FAQ", href: "#" },
      { title: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                CarShowcase
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-slate-500 leading-relaxed">
              Discover the perfect vehicle for every occasion. Browse, compare,
              and find your ideal ride from our curated collection.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} CarShowcase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
