/**
 * F1 API Service
 *
 * Integrates with the Ergast F1 API and Wikipedia API
 * to fetch real-world Formula 1 data for context enrichment.
 */

const axios = require("axios");

const ERGAST_BASE = "https://api.jolpi.ca/ergast/f1";
const WIKI_API = "https://en.wikipedia.org/w/api.php";

// ─── Ergast F1 API ─────────────────────────────────────────

/**
 * Get race results for a given season (and optionally a specific round).
 * @param {string|number} season  – e.g. "2023"
 * @param {string|number} [round] – e.g. "1" or "last"
 * @returns {Promise<string>} Formatted race result text
 */
async function getRaceResult(season, round) {
    try {
        const path = round
            ? `${ERGAST_BASE}/${season}/${round}/results.json?limit=10`
            : `${ERGAST_BASE}/${season}/results.json?limit=10`;

        const { data } = await axios.get(path, { timeout: 10000 });
        const races = data?.MRData?.RaceTable?.Races;

        if (!races || races.length === 0) {
            return `No race results found for season ${season}${round ? `, round ${round}` : ""}.`;
        }

        return races
            .map((race) => {
                const results = race.Results.map(
                    (r, i) =>
                        `  ${i + 1}. ${r.Driver.givenName} ${r.Driver.familyName} (${r.Constructor.name}) – ${r.status === "Finished" ? r.Time?.time || "Finished" : r.status}`
                ).join("\n");
                return `🏁 ${race.raceName} ${race.season} (Round ${race.round})\n${results}`;
            })
            .join("\n\n");
    } catch (err) {
        console.error("Ergast getRaceResult error:", err.message);
        return "Could not fetch race results from the Ergast API at this time.";
    }
}

/**
 * Get driver standings for a season (defaults to current).
 * @param {string|number} [season="current"]
 * @returns {Promise<string>}
 */
async function getDriverStandings(season = "current") {
    try {
        const { data } = await axios.get(
            `${ERGAST_BASE}/${season}/driverStandings.json`,
            { timeout: 10000 }
        );

        const list =
            data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;

        if (!list || list.length === 0) {
            return `No driver standings found for season ${season}.`;
        }

        const header = `🏆 Driver Standings – ${data.MRData.StandingsTable.StandingsLists[0].season}`;
        const rows = list
            .map(
                (s) =>
                    `  ${s.position}. ${s.Driver.givenName} ${s.Driver.familyName} (${s.Constructors[0]?.name}) – ${s.points} pts | ${s.wins} wins`
            )
            .join("\n");

        return `${header}\n${rows}`;
    } catch (err) {
        console.error("Ergast getDriverStandings error:", err.message);
        return "Could not fetch driver standings from the Ergast API at this time.";
    }
}

/**
 * Get constructor standings for a season (defaults to current).
 * @param {string|number} [season="current"]
 * @returns {Promise<string>}
 */
async function getConstructorStandings(season = "current") {
    try {
        const { data } = await axios.get(
            `${ERGAST_BASE}/${season}/constructorStandings.json`,
            { timeout: 10000 }
        );

        const list =
            data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;

        if (!list || list.length === 0) {
            return `No constructor standings found for season ${season}.`;
        }

        const header = `🏗️ Constructor Standings – ${data.MRData.StandingsTable.StandingsLists[0].season}`;
        const rows = list
            .map(
                (s) =>
                    `  ${s.position}. ${s.Constructor.name} – ${s.points} pts | ${s.wins} wins`
            )
            .join("\n");

        return `${header}\n${rows}`;
    } catch (err) {
        console.error("Ergast getConstructorStandings error:", err.message);
        return "Could not fetch constructor standings from the Ergast API at this time.";
    }
}

// ─── Wikipedia API ─────────────────────────────────────────

/**
 * Search Wikipedia and return an extract for the top result.
 * @param {string} query
 * @returns {Promise<string>}
 */
async function searchWikipedia(query) {
    try {
        // Step 1 – search for the page title
        const searchRes = await axios.get(WIKI_API, {
            timeout: 10000,
            params: {
                action: "query",
                list: "search",
                srsearch: `${query} Formula 1`,
                srlimit: 1,
                format: "json",
                origin: "*",
            },
        });

        const pages = searchRes.data?.query?.search;
        if (!pages || pages.length === 0) return "";

        const title = pages[0].title;

        // Step 2 – get the extract
        const extractRes = await axios.get(WIKI_API, {
            timeout: 10000,
            params: {
                action: "query",
                titles: title,
                prop: "extracts",
                exintro: true,
                explaintext: true,
                format: "json",
                origin: "*",
            },
        });

        const pagesObj = extractRes.data?.query?.pages;
        const page = Object.values(pagesObj)[0];
        const extract = page?.extract;

        if (!extract) return "";

        // Truncate to ~1500 chars to avoid bloating the prompt
        const trimmed =
            extract.length > 1500 ? extract.slice(0, 1500) + "…" : extract;

        return `📖 Wikipedia – ${title}:\n${trimmed}`;
    } catch (err) {
        console.error("Wikipedia search error:", err.message);
        return "";
    }
}

// ─── Intent Detection ──────────────────────────────────────

/**
 * Detect whether the user message likely refers to data we can look up.
 * Returns enrichment context string (may be empty).
 * @param {string} message
 * @returns {Promise<string>}
 */
async function enrichContext(message) {
    const lower = message.toLowerCase();
    const parts = [];

    // Race result patterns – e.g. "who won the 2023 Abu Dhabi GP"
    const raceMatch = lower.match(
        /(?:who won|results?|winner).*?(\d{4}).*?([\w\s]+(?:gp|grand prix|race))/i
    );
    if (raceMatch) {
        const season = raceMatch[1];
        // Try to get last race of that season as a simple heuristic
        const result = await getRaceResult(season, "last");
        parts.push(result);
    }

    // Standings patterns
    if (/driver\s*standing/i.test(lower) || /championship\s*standing/i.test(lower) || /wdc/i.test(lower)) {
        const yearMatch = lower.match(/(\d{4})/);
        const season = yearMatch ? yearMatch[1] : "current";
        parts.push(await getDriverStandings(season));
    }

    if (/constructor\s*standing/i.test(lower) || /team\s*standing/i.test(lower) || /wcc/i.test(lower)) {
        const yearMatch = lower.match(/(\d{4})/);
        const season = yearMatch ? yearMatch[1] : "current";
        parts.push(await getConstructorStandings(season));
    }

    // Wikipedia fallback for history / biography queries
    if (
        /history|biography|career|who is|tell me about/i.test(lower) &&
        !raceMatch
    ) {
        const wikiResult = await searchWikipedia(message);
        if (wikiResult) parts.push(wikiResult);
    }

    return parts.join("\n\n");
}

module.exports = {
    getRaceResult,
    getDriverStandings,
    getConstructorStandings,
    searchWikipedia,
    enrichContext,
};
