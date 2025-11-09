import { Outlet, Link } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div className="client-layout">
      <header>
        <h1>Client App</h1>
        <nav>
          <Link to="/client/dashboard">Dashboard</Link>
          <Link to="/client/profile">Profile</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>© 2025 Todaii English</footer>
    </div>
  );
}
