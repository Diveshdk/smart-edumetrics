import { LucideBook, LucideBarChart3, LucideUsers, LucideBrain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            CO-PO Mapping System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intelligent Course Outcome and Program Outcome mapping powered by AI
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <FeatureCard
            icon={<LucideBook className="w-8 h-8" />}
            title="CO Management"
            description="Upload and manage course outcomes with ease using AI-powered extraction"
          />
          <FeatureCard
            icon={<LucideBarChart3 className="w-8 h-8" />}
            title="PO Mapping"
            description="Automated mapping of COs to POs using advanced NLP algorithms"
          />
          <FeatureCard
            icon={<LucideUsers className="w-8 h-8" />}
            title="Student Analytics"
            description="Track and analyze student performance across outcomes"
          />
          <FeatureCard
            icon={<LucideBrain className="w-8 h-8" />}
            title="AI Insights"
            description="Get intelligent recommendations for curriculum improvement"
          />
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
