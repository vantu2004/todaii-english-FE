import { Link } from "react-router-dom";
import { useHeaderContext } from "../../hooks/servers/useHeaderContext";
import { ChevronRight } from "lucide-react";

const Header = () => {
  const { header } = useHeaderContext();

  return (
    <header className="z-10 px-6 py-5 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {header.title}
        </h1>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          {header.breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              {item.to ? (
                <Link
                  to={item.to}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.label}
                </span>
              )}

              {index < header.breadcrumb.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
