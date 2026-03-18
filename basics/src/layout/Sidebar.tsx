import { NavLink } from "react-router-dom";

const links = [
  { label: "Effects", path: "/effects" },
  { label: "Effect Event", path: "/effect-event" },
  { label: "Transition vs Deferred", path: "/transition-vs-deferred" },
  { label: "Transition", path: "/transition" },
  { label: "Deferred", path: "/deferred" },
  { label: "Optimistic", path: "/optimistic" },
  { label: "Form Actions", path: "/form-actions" },
  { label: "use()", path: "/use" },
  { label: "Activity", path: "/activity" },
  { label: "View Transition", path: "/view-transition" },
  { label: "Fragment Ref", path: "/fragment-ref" },
  { label: "Imperative", path: "/imperative" },
  { label: "Owner Stack", path: "/owner-stack" },
  { label: "Error Boundary", path: "/error-boundary" },
];

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold">React 19</h1>
        <p className="text-xs text-gray-500">Feature Playground</p>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t text-xs text-gray-400">
        React 19.2 Demo
      </div>
    </div>
  );
}
