'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface TeamStanding {
    position: string;
    points: string;
    wins: string;
    Constructor: {
        name: string;
        nationality: string;
    };
}

export default function TeamsPage() {
    const [standings, setStandings] = useState<TeamStanding[]>([]);
    const [loading, setLoading] = useState(true);
    const [season, setSeason] = useState('current');

    useEffect(() => {
        async function fetchTeams() {
            setLoading(true);
            try {
                const res = await fetch(`/api/teams?season=${season}`);
                const data = await res.json();
                const list = data?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
                setStandings(list);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTeams();
    }, [season]);

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card px-8 py-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Trophy className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Constructor Standings</h1>
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
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : standings.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                        No standings found for this season.
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-center w-20">POS</th>
                                    <th className="px-6 py-4 font-semibold">Constructor</th>
                                    <th className="px-6 py-4 font-semibold text-center w-24">Wins</th>
                                    <th className="px-6 py-4 font-semibold text-right w-24">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.map((std, idx) => (
                                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 text-center font-bold text-lg text-foreground">
                                            {std.position}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground text-base">
                                                {std.Constructor.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {std.Constructor.nationality}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-muted-foreground">
                                            {std.wins}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-primary text-base">
                                            {std.points}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
