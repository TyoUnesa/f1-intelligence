import Link from 'next/link';
import { MessageCircle, Users, Trophy, BarChart3, Zap, ArrowRight, Activity, CalendarDays } from 'lucide-react';

export default function HomeDashboard() {
    return (
        <div className="flex-1 overflow-y-auto p-8 bg-background">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Welcome to F1 Intelligence</h1>
                    <p className="text-lg text-muted-foreground">Your ultimate companion for Formula 1 statistics, history, and AI-powered insights.</p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Ask F1 AI"
                        description="Chat directly with our advanced AI assistant about anything F1 related."
                        icon={MessageCircle}
                        href="/chat"
                        color="bg-primary/10 text-primary"
                    />
                    <FeatureCard
                        title="Driver Standings"
                        description="Check the current World Drivers' Championship standings and points."
                        icon={Users}
                        href="/drivers"
                        color="bg-blue-500/10 text-blue-500"
                    />
                    <FeatureCard
                        title="Constructor Standings"
                        description="Follow the battle for the World Constructors' Championship."
                        icon={Trophy}
                        href="/teams"
                        color="bg-amber-500/10 text-amber-500"
                    />
                    <FeatureCard
                        title="Race History"
                        description="Look back at race results from the current season and history."
                        icon={BarChart3}
                        href="/races"
                        color="bg-purple-500/10 text-purple-500"
                    />
                    <FeatureCard
                        title="Technical Analysis"
                        description="Deep dive into car aerodynamics, ground effect, and technology."
                        icon={Zap}
                        href="/technical"
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <div className="p-6 rounded-2xl border border-border bg-card/50 flex flex-col items-center justify-center text-center space-y-2">
                        <Activity className="w-8 h-8 text-muted-foreground mb-2" />
                        <h3 className="font-semibold text-foreground">More features coming soon</h3>
                        <p className="text-sm text-muted-foreground">Live telemetry and more</p>
                    </div>
                </div>

                {/* Quick Stats / Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                    <div className="p-6 rounded-2xl border border-border bg-card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-primary" />
                            Latest Season
                        </h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Formula 1 brings the fastest cars and the greatest drivers to circuits around the globe.
                                Use the sidebar to navigate through the latest standings, race results, and our AI assistant.
                            </p>
                            <Link href="/races" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                                View Race Calendar <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-primary" />
                            Try asking the AI:
                        </h2>
                        <ul className="space-y-3">
                            <li className="p-3 bg-muted rounded-lg text-sm text-foreground">"Who won the 2021 Abu Dhabi Grand Prix?"</li>
                            <li className="p-3 bg-muted rounded-lg text-sm text-foreground">"Explain how DRS works."</li>
                            <li className="p-3 bg-muted rounded-lg text-sm text-foreground">"Compare Lewis Hamilton and Michael Schumacher."</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

function FeatureCard({ title, description, icon: Icon, href, color }: any) {
    return (
        <Link href={href} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </Link>
    );
}
