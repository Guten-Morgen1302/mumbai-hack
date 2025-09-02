import Navigation from "@/components/navigation";
import AdminDashboard from "@/components/admin-dashboard";

export default function Dashboard() {
  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <AdminDashboard />
      </div>
    </div>
  );
}