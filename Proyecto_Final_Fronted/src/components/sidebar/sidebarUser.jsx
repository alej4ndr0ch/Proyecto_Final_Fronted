import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export const SidebarUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const profileLink = {
    href: "/profile",
    label: "Perfil",
    icon: <img
      src="../../assets/LITTLE-CAESARS-LOGO.png"
      alt="Avatar"
      className="h-6 w-6 rounded-full"
    />
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("roleUser");
    navigate("/auth");
  };

  // Menú principal
  const menuItems = [
    {
      title: "Homepage",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      path: "/",
    },
    {
      title: "Productos",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      path: "/ProductList",
    },
    {
      title: "Lapsed",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      path: "/LapsedBranch",
    },
  ];

  // Efecto para cerrar submenús al cambiar de ruta
  useEffect(() => {
    setActiveSubmenu(null);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsTransitioning(true);
    setIsOpen(!isOpen);
    setTimeout(() => setIsTransitioning(false), 300); // Duración de la transición
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // En móvil, forzar el cierre del sidebar si no está hover
      if (window.innerWidth < 768 && !isHovered) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHovered]);

  // Efecto para cerrar el sidebar después de un tiempo sin hover (solo en desktop)
  useEffect(() => {
    let timer;
    if (!isMobile && isOpen && !isHovered) {
      timer = setTimeout(() => {
        setIsOpen(false);
      }, 1000); // 1 segundo después de salir del sidebar
    }
    return () => clearTimeout(timer);
  }, [isHovered, isOpen, isMobile]);

  return (
    <div
      className={`bg-orange-600 text-white h-screen fixed flex flex-col z-50 shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        if (!isMobile) setIsOpen(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo y botón de toggle */}
      <div className="p-4 flex items-center justify-between border-b border-orange-600">
        {isOpen && (
          <div className="flex items-center">
            <div className="bg-white p-1 rounded-lg mr-3 flex items-center justify-center">
              <img
                src="/src/assets/LITTLE-CAESARS-LOGO.png"
                alt="Logo Banco Valmeria"
                className="w-8 h-8 object-contain" // Ajusta el tamaño según necesites
              />
            </div>
            <span className="text-xl font-bold whitespace-nowrap">
              Lapsed Caesar
            </span>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-blue-800 transition"
        >
          {isOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menú principal */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div
                className={`relative rounded-lg transition-all ${
                  (item.path && location.pathname.includes(item.path)) ||
                  (item.submenu &&
                    item.submenu.some((sub) =>
                      location.pathname.includes(sub.path)
                    ))
                    ? "bg-orange-500"
                    : "hover:bg-orange-700"
                }`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else if (item.submenu) {
                      toggleSubmenu(index);
                    }
                  }}
                  className="w-full flex items-center p-3 text-left transition hover:scale-[1.02]"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      (item.path && location.pathname.includes(item.path)) ||
                      (item.submenu &&
                        item.submenu.some((sub) =>
                          location.pathname.includes(sub.path)
                        ))
                        ? "bg-gray-600 text-white"
                        : "bg-gray-900 text-blue-300"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {isOpen && (
                    <span className="ml-3 whitespace-nowrap">{item.title}</span>
                  )}

                  {item.submenu && isOpen && (
                    <div className="ml-auto transition-transform">
                      <svg
                        className={`w-5 h-5 transform ${
                          activeSubmenu === index ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Efecto de hover para el tooltip cuando el sidebar está cerrado */}
                {!isOpen && hoveredItem === index && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-blue-800 rounded-lg shadow-lg z-50 whitespace-nowrap transition-opacity">
                    {item.title}
                    {item.submenu && (
                      <div className="mt-1 ml-2 border-l-2 border-blue-600 pl-2">
                        {item.submenu.map((sub, i) => (
                          <div key={i} className="py-1 text-sm text-blue-200">
                            {sub.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submenú */}
              {item.submenu && isOpen && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeSubmenu === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="pl-2">
                    {item.submenu.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="hover:scale-[1.01] transition-transform"
                      >
                        <button
                          onClick={() => navigate(subItem.path)}
                          className={`w-full flex items-center pl-12 pr-3 py-2 text-sm rounded-lg transition-colors ${
                            location.pathname.includes(subItem.path)
                              ? "bg-orange-600 text-white"
                              : "hover:bg-orange-800 text-blue-200"
                          }`}
                        >
                          {subItem.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer del sidebar */}

      <div className="p-4 border-t border-white">
      </div>
    </div>
  );
};