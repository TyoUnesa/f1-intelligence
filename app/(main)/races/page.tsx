'use client';

import { useEffect, useState } from 'react';
import { BarChart3, MapPin } from 'lucide-react';

interface RaceResult {
    round: string;
    raceName: string;
    Circuit: {
        circuitName: string;
        Location: {
            locality: string;
            country: string;
        };
    };
    date: string;
    Results: Array<{
        position: string;
        Driver: { givenName: string; familyName: string };
        Constructor: { name: string };
        Time?: { time: string };
        status: string;
    }>;
}

export default function RacesPage() {
    const [races, setRaces] = useState<RaceResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [season, setSeason] = useState('current');
    const [expandedRace, setExpandedRace] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRaces() {
            setLoading(true);
            try {
                const res = await fetch(`/api/races?season=${season}`);
                const data = await res.json();
                const list = data?.RaceTable?.Races || [];
                setRaces(list);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchRaces();
    }, [season]);

    const toggleExpand = (round: string) => {
        setExpandedRace(expandedRace === round ? null : round);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card px-8 py-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Race History & Results</h1>
                        <p className="text-sm text-muted-foreground">{season === 'current' ? 'Current Season' : season + ' Season'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="bg-input border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none"
                    >
                        <option value="current">Current Season</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2009">2009</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 max-w-4xl mx-auto space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : races.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                        No races found for this season.
                    </div>
                ) : (
                    races.map((race) => (
                        <div key={race.round} className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/50">
                            <button
                                onClick={() => toggleExpand(race.round)}
                                className="w-full px-6 py-5 flex items-center justify-between bg-card hover:bg-muted/30 transition-colors text-left"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 text-center border-r border-border pr-6">
                                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider block mb-1">Round</span>
                                        <span className="text-2xl font-extrabold text-foreground">{race.round}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground mb-1">{race.raceName}</h2>
                                        <div className="flex items-center text-sm text-muted-foreground gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {race.Circuit.circuitName}, {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-medium text-foreground bg-muted px-3 py-1 rounded-full mb-2 inline-block">
                                        {new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="text-primary text-sm font-semibold tracking-wide">
                                        {expandedRace === race.round ? 'HIDE RESULTS' : 'VIEW RESULTS'}
                                    </div>
                                </div>
                            </button>

                            {/* Expanded Results Table */}
                            {expandedRace === race.round && (
                                <div className="border-t border-border bg-background p-4 animate-in slide-in-from-top-2 duration-200">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-muted-foreground uppercase">
                                            <tr>
                                                <th className="px-4 py-2 font-semibold">POS</th>
                                                <th className="px-4 py-2 font-semibold">Driver</th>
                                                <th className="px-4 py-2 font-semibold">Team</th>
                                                <th className="px-4 py-2 font-semibold text-right">Time/Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {race.Results?.slice(0, 10).map((result) => (
                                                <tr key={result.position} className="border-t border-border/50 hover:bg-muted/50">
                                                    <td className="px-4 py-3 font-bold text-foreground">{result.position}</td>
                                                    <td className="px-4 py-3 font-medium text-foreground">{result.Driver.givenName} {result.Driver.familyName}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{result.Constructor.name}</td>
                                                    <td className="px-4 py-3 text-right text-muted-foreground font-mono">
                                                        {result.status === 'Finished' ? (result.Time?.time || 'Finished') : result.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {race.Results?.length > 10 && (
                                        <div className="text-center mt-3 text-xs text-muted-foreground italic">
                                            Showing top 10 finishers.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
