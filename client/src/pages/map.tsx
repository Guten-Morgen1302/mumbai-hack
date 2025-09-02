import Navigation from "@/components/navigation";
import MumbaiMap from "@/components/mumbai-map";

export default function Map() {
  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <MumbaiMap />
      </div>
    </div>
  );
}