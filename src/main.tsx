
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "@fontsource-variable/manrope/wght.css";
  import "./styles/index.css";
  import "./styles/object-cover.css";
  import "./styles/sidebar-minimal.css";
  import "./styles/object-detail-tweaks.css";
  import "./styles/dashboard-tags-tweaks.css";
  import "./styles/contractor-logos.css";
  import "./styles/data-table-alignment.css";
  import "./styles/settings-pagination.css";
import "./styles/tags-adaptive.css";
import "./styles/responsive-audit.css";

  createRoot(document.getElementById("root")!).render(<App />);
