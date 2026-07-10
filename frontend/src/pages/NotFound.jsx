import { Link } from "react-router-dom";
import AmbientBackground from "../components/AmbientBackground";

const NotFound = () => (
  <div className="relative flex min-h-screen items-center justify-center p-4">
    <AmbientBackground />
    <div className="glass-panel max-w-sm bg-white/90 p-10 text-center dark:bg-ink-800/95">
      <p className="font-display text-6xl font-bold text-violet-500">404</p>
      <h1 className="mt-3 font-display text-lg font-semibold">Page not found</h1>
      <p className="mt-1 text-sm text-ink-600/60 dark:text-mist-200/50">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Go home</Link>
    </div>
  </div>
);

export default NotFound;
