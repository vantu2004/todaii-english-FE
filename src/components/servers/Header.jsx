import { Link } from "react-router-dom";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import { ChevronRight } from "lucide-react";

const Header = () => {
  const { header } = useHeaderContext();

  return (
    <header className="z-10 px-6 py-5 bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
      <div className="container">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          {header.title}
        </h1>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          {header.breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              {item.to ? (
                <Link
                  to={item.to}
                  className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-900 dark:text-white font-medium">
                  {item.label}
                </span>
              )}

              {index < header.breadcrumb.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
