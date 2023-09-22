const express = require("express");
const db = require("../db/connectDB");
const controller = require("../controllers/controller");


const router = express.Router();

router.get("/region", async (req, res) => {
    try {
        controller.getRegions().then((result) => {
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(500).send("Database connection test failed.");
    }
});

router.get("/:region_code/services/", async (req, res) => {
    let region_code = req.params.region_code;
    try {
        await controller.getAllServicesOfRegion(region_code).then((result) => {
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(500).send("Error", error);
    }
});

router.get("/:region_code/:service_code", async (req, res) => {
    const serviceName = req.params.service_code;
    const region = req.params.region_code;
    let filters = req.query;
    try {
        const results = await controller.getServiceData(region, serviceName, filters);
        for(let i = 0; i < results.length; i++){
            const pricingTerms = await controller.getPricingTerms(results[i].sku);
            results[i].pricingTerms = pricingTerms;
        }
        res.status(200).json({service: results});
    } catch (error) {
        res.status(500).send("Error", error);
    }
});



module.exports = router;