const fs = require("fs");
const path = require("path");
const db = require(__dirname+"/api/db/connectDB");

const download = require('download');


const HostUrl = "https://pricing.us-east-1.amazonaws.com"
console.log(path.join(__dirname, "indexList.json"));

//read the indexList.json file
const ProductObject = JSON.parse(fs.readFileSync(path.join(__dirname, "indexList.json"), "utf-8")).offers;


// I have hardcoded the regeions for now as I do not want to 
// download all the index files from all the regeions
const Regeions = {
    "US East (N. Virginia)" : "us-east-1",
    // "AWS GovCloud (US)" : "us-gov-west-1",
    "Asia Pacific (Mumbai)" : "ap-south-1",
    // "Asia Pacific (Osaka-Local)" : "ap-northeast-3",
    // "Asia Pacific (Seoul)" : "ap-northeast-2",
    // "Asia Pacific (Singapore)" : "ap-southeast-1",
    // "Asia Pacific (Sydney)" : "ap-southeast-2",
    // "Asia Pacific (Tokyo)" : "ap-northeast-1",
    // "Canada (Central)" : "ca-central-1",
    // "EU (Frankfurt)" : "eu-central-1",
    // "EU (Ireland)" : "eu-west-1",
    // "EU (London)" : "eu-west-2",
    // "EU (Paris)" : "eu-west-3",
    // "South America (Sao Paulo)" : "sa-east-1",
    // "US East (Ohio)" : "us-east-2",
    // "US West (N. California)" : "us-west-1",
    // "US West (Oregon)" : "us-west-2"
}

let isFinished = false;
async function downloadIndexFile(Name, Regeion) {
    console.log("Downloading Index file of " + Name + " in " + Regeion + "regeion");
    const FileURL = "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/" + Name + "/current/" + Regeion + "/index.json";
    const filePath = __dirname+"/indexFiles/"+Name+"-"+Regeion+".json"
    await download(FileURL,__dirname+"/indexFiles")
    .then(data => {
        fs.writeFileSync(__dirname+"/indexFiles/"+Name+"-"+Regeion+".json", data);
    }).then(() => {
        //delete the file
        fs.unlinkSync(__dirname+"/indexFiles/index.json");
        console.log('Download Completed');
    })
    return filePath;
}

/*
    This function is used to Create the Product table
    if it not exist
*/
async function createTable(productName, attributes) {
    // creating the SQL query
    var sql = "CREATE TABLE IF NOT EXISTS "+ productName +" (`id` INT NOT NULL AUTO_INCREMENT, `sku` VARCHAR(255) NOT NULL, `region` VARCHAR(255) NOT NULL"
    for(const a of attributes) {
        sql += ", " + a + " VARCHAR(255) ";
    }
    sql += ", PRIMARY KEY (`id`));";
    // call to execute the query
    console.log(sql);
    await db.executeQuery(sql, null);
}

async function fillProductsTables(productName, products, regeion) {
    // list the attributes
    let attributes = [];

    for (const sku in products) {
        // if(i > 10) break;
        // if(attributes.length >= 15) break;
        if (products.hasOwnProperty(sku)) {
          const product = products[sku];
          const productAttributes = product.attributes;
    
          for (const attribute in productAttributes) {
            if (productAttributes.hasOwnProperty(attribute) && !attributes.includes(attribute) && attribute != "group") {
              attributes.push(attribute);
              console.log("New attribute found: " + attribute);
            }
          }
        }

    }
    console.log("Attributes list: " + attributes);
    // create the table if it not exist
    await createTable(productName, attributes);

    // insert the products
    for(const key in products) {
        var sql = "INSERT INTO "+ productName +" (`sku`, `region`";
        for(const a of attributes) {
            sql += ", `" + a + "`";
        }
        sql += ") VALUES ('" + key + "', '" + regeion + "'";
        for(const a of attributes) {
            // if the value is undefined, insert null
            if(products[key].attributes[a] == undefined) {
                sql += ", NULL";
                continue;
            }

            sql += ", '" + products[key].attributes[a] + "'";
        }
        sql += ");";

        // call to execute the query
        db.executeQuery(sql, null);
    }

    console.log("Products table filled");
}

async function fillTermsTable(terms) {

    for(const sku in terms) {
        const offerTerm = terms[sku][Object.keys(terms[sku])[0]]; // Get the first key dynamically
        const offerTermCode = offerTerm.offerTermCode;
        const priceDimensionsKey = Object.keys(offerTerm.priceDimensions)[0]; // Get the priceDimensions key dynamically
        const description = offerTerm.priceDimensions[priceDimensionsKey].description;
        const unit = offerTerm.priceDimensions[priceDimensionsKey].unit;
        const pricePerUnitUSD = offerTerm.priceDimensions[priceDimensionsKey].pricePerUnit.USD;
            
        // console.log(`SKU: ${sku}`);
        // console.log(`Offer Term Code: ${offerTermCode}`);
        // console.log(`Description: ${description}`);
        // console.log(`Unit: ${unit}`);
        // console.log(`Price Per Unit (USD): ${pricePerUnitUSD}`);

        var sql = "INSERT INTO `pricing_terms` (`sku`, `offer_term_code`, `unit`, `price_per_unit`, `description`)";
        sql += "VALUES ('" + sku + "', '" + offerTermCode + "', '" + unit + "', '" + pricePerUnitUSD + "', '" + description + "');";

        // call to execute the query
        db.executeQuery(sql, null);
    }
    console.log("Terms table filled");

}

for(const regeion in Regeions){
    for(const serviceName in ProductObject){

        // restricted to only two services for now remove the if condition to download all the services
        // if(serviceName != "AmazonS3"){
        //     continue;
        // }
        downloadIndexFile(serviceName,Regeions[regeion]).then((filePath) => {
            const serviceJson = JSON.parse(fs.readFileSync(path.join(filePath), "utf-8"));
            db.executeQuery("INSERT INTO region_service (`service_code`, `region_code`) VALUES ('" + serviceJson.offerCode + "', '" + Regeions[regeion] + "');", null);
            fillProductsTables(serviceJson.offerCode, serviceJson.products, Regeions[regeion]);
            fillTermsTable(serviceJson.terms.OnDemand);
        });
    }
}




