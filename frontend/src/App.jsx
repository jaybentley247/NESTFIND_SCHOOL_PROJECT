import { Routes, Route } from "react-router-dom";
import PageWrapper from "./components/layout/PageWrapper";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Saved from "./pages/Saved";
import Enquiries from "./pages/Enquiries";
import Messages from "./pages/Messages";
import Payments from "./pages/Payments";
import PaymentResult from "./pages/PaymentResult";
import Dashboard from "./pages/Dashboard";
import AddEditListing from "./pages/AddEditListing";
import Hosts from "./pages/Hosts";
import HostProfile from "./pages/HostProfile";
import NotFound from "./pages/NotFound";

// Route gating follows PRD section 7: /saved and /enquiries need any
// authenticated user; /dashboard* is host-only. /hosts/:id also needs a
// logged-in user, by the project owner's request. The frontend check is a
// UX convenience — real enforcement happens in DRF permissions (PRD page 14).
export default function App() {
  return (
    <Routes>
      <Route element={<PageWrapper />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<PropertyDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/saved" element={<Saved />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/hosts/:id" element={<HostProfile />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/result" element={<PaymentResult />} />
        </Route>

        <Route element={<ProtectedRoute role="host" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/listings/new" element={<AddEditListing />} />
          <Route path="/dashboard/listings/:id/edit" element={<AddEditListing />} />
        </Route>

        <Route path="/hosts" element={<Hosts />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
