/**
 * F1 Data Routes – GET endpoints for frontend pages
 *
 * Proxies requests to Ergast API to avoid direct frontend-to-Ergast calls,
 * bypassing CORS and rate issues directly on the client.
 */

const express = require("express");
const axios = require("axios");

const router = express.Router();
const ERGAST_BASE = "https://api.jolpi.ca/ergast/f1";

// GET /api/drivers?season=current
router.get("/drivers", async (req, res) => {
    try {
        const season = req.query.season || "current";
        const { data } = await axios.get(`${ERGAST_BASE}/${season}/driverStandings.json`);
        res.json(data.MRData);
    } catch (err) {
        console.error("Drivers API Error:", err.message);
        res.status(500).json({ error: "Failed to fetch driver standings" });
    }
});

// GET /api/teams?season=current
router.get("/teams", async (req, res) => {
    try {
        const season = req.query.season || "current";
        const { data } = await axios.get(`${ERGAST_BASE}/${season}/constructorStandings.json`);
        res.json(data.MRData);
    } catch (err) {
        console.error("Teams API Error:", err.message);
        res.status(500).json({ error: "Failed to fetch team standings" });
    }
});

// GET /api/races?season=current
router.get("/races", async (req, res) => {
    try {
        const season = req.query.season || "current";
        const { data } = await axios.get(`${ERGAST_BASE}/${season}/results.json?limit=100`);
        res.json(data.MRData);
    } catch (err) {
        console.error("Races API Error:", err.message);
        res.status(500).json({ error: "Failed to fetch race results" });
    }
});

// GET /api/schedule?season=current
router.get("/schedule", async (req, res) => {
    try {
        const season = req.query.season || "current";
        const { data } = await axios.get(`${ERGAST_BASE}/${season}.json?limit=30`);
        res.json(data.MRData);
    } catch (err) {
        console.error("Schedule API Error:", err.message);
        res.status(500).json({ error: "Failed to fetch schedule" });
    }
});

module.exports = router;
