import Link from 'next/link';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return {
      href,
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
    };
  });

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href}>
            <div className="flex items-center">
              {index !== 0 && (
                <FiChevronRight className="w-6 h-6 text-gray-400" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2"
              >
                {breadcrumb.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}