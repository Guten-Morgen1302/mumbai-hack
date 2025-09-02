import Navigation from "@/components/navigation";
import PatientAdvisory from "@/components/patient-advisory";

export default function Advisory() {
  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <PatientAdvisory />
      </div>
    </div>
  );
}