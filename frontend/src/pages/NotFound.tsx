import {HiBookOpen,HiMiniQueueList,} from "react-icons/hi2";
import { LuChevronRight } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

const links = [
  {
    name: "Login",
    href: "/login",
    description: "istersniz buradan login olabilrsiniz .",
    icon: HiBookOpen,
  },
  {
    name: "Ana Sayfa",
    href: "/",
    description: "temiz bir baslangoc icin başa git.",
    icon: HiMiniQueueList,
  },
  
];

export default function NotFound() {
  const { pathname } = useLocation();
  const path = pathname.split("/").filter(Boolean).pop() || "page";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-md">
          <main className="px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
            <div className="text-center">
              <p className="text-4xl font-bold leading-8 text-sky-600">404</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                <span className="text-red-500 underline underline-offset-2 decoration-1 capitalize">
                  {path}
                </span>{" "}
                does not exist
              </h1>
              <p className="mt-2 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
                Sorry, we couldn’t find the {path} page you’re looking for.
              </p>
            </div>

            <div className="mx-auto mt-6 flow-root max-w-lg">
              <h2 className="sr-only">Popular pages</h2>
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-gray-200 flex flex-col"
              >
                {links.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <li
                      key={idx}
                      className="relative flex gap-x-6 py-4 hover:bg-sky-100 px-4 rounded-md transition-colors"
                    >
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-200">
                        <Icon className="h-6 w-6 text-sky-600" aria-hidden="true" />
                      </div>

                      <div className="flex-auto">
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">
                          <Link to={link.href} className="inline-block relative">
                            <span className="absolute inset-0" aria-hidden="true" />
                            {link.name}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {link.description}
                        </p>
                      </div>

                      <div className="flex-none self-center">
                        <LuChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  Go to homepage
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
