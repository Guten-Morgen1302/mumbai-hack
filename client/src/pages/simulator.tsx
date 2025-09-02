import Navigation from "@/components/navigation";
import ScenarioSimulator from "@/components/scenario-simulator";

export default function Simulator() {
  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <ScenarioSimulator />
      </div>
    </div>
  );
}