const db = require("../db/connectDB");
const { get } = require("../router/route");

async function getRegions() {
    console.log("getRegions");
    try {
        const result = await db.executeQuery("SELECT * FROM region;", null);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function getAllServicesOfRegion(region_code) {
    try {
        const result = await db.executeQuery("SELECT service_code FROM region_service WHERE region_code = ?;", [region_code]);
        return result.map((service) => service.service_code);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getServiceData(region_code, service_code, filters) {
    let sqlQuery = "SELECT * FROM "+ service_code +" WHERE region = ? ";
    let values = [region_code];
    for(let key in filters){
        if(key == "region" || key == "limit") continue;
        sqlQuery += "AND "+ key +" = ? ";
        values.push(filters[key]);
    }
    if(filters.limit) sqlQuery += "LIMIT "+ filters.limit +";";
    else sqlQuery += "LIMIT 1;";
    try {
        const result = await db.executeQuery(sqlQuery, values);
        //remove the region column and everything that is null
        result.forEach((service) => {
            delete service.region;
            for(let key in service){
                if(service[key] == null) delete service[key];
            }
        });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getPricingTerms(sku) {
    let sqlQuery = "SELECT description, unit, price_per_unit FROM pricing_terms WHERE sku = ?;";
    try {
        const result = await db.executeQuery(sqlQuery, [sku]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


module.exports = {
    getRegions, 
    getAllServicesOfRegion, 
    getServiceData, 
    getPricingTerms
}