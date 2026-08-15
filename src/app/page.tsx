import { getAllContentItems, getAllCreators } from "@/services/firestore";
import { Navbar } from "@/components/Navbar";
import { DashboardOverview } from "@/components/DashboardOverview";

export const revalidate = 0;

export default async function DashboardPage() {
  const items = await getAllContentItems();
  const creators = await getAllCreators();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <DashboardOverview items={items} creators={creators} />
      </main>
    </div>
  );
}
