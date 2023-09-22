# AWS services Pricing.

Ifyou have docker install install the stup is very easy, just run the following command:

```bash
docker compose -f docker-compose.dev.yml up -d
```

It will setup mysql database in your docker system.

example `.env` file
```
PORT=8000
DB_USER_NAME=dev
DB_PASSWORD=password
DATABASE_NAME=aws_pricing
DB_HOST=localhost
```


Then to fill up the database run
```bash
node fetchData.js
```
> You need to have node v16+ installed

It creates tables for each of the services in the database and fill them up with data.
I have though of creating a single table for all the services but it will be harder to retrieve data with attribute filtering, as in that sinario we have to search and filter from the json.
I get to know about JSON Contain function in mysql which is very handy in this case. But I didn't know about it at the time of designing the database.

I have reduce the number of services in the indexList.json file as It take many hours to fetch all the data. So I have only included few services in the indexList.json file. You can add more services to it if you want to fetch more data. also in fetchData.js file there are only two regions included. You can add more regions to it if you want to fetch more data.

> Now for some services that has a lot of fields like ec2, rds, etc. It gitving me some error. I have to increase the max_allowed_packet size in mysql. But I didn't know how to do it in docker for now. So I have to skip those services for now. I will fix it soon.

> Note this process may take a lot of time. As it is fetching files from aws and then parsing them and then inserting them into the database. At the end of data insertion we have to kill the process as it is not exiting on its own `Ctrl + C`. (I will fix it soon.)

I have also created a simple api to get the data from the database. It is a simple express app.
It has only few routes 
1. `/api/regions` which returns all the regions available in the database.

2. `/api/:region_code/services` which returns all the services available in a particular region.
eg: `/api/us-east-1/services`
will return all the services available in us-east-1 region that is stored in our database.

3. `/api/:region_code/:service_name` which returns all the data of a particular service in a particular region.
eg: `/api/us-east-1/AmazonS3`
It can also take query params to filter the data.
any valid attribute of the service can be used as a query param.
adtionally we can also have limit if we want to limit the number of results. or it will by deafult return only 1 result.

eg: `/api/us-east-1/AmazonMemoryDB?limit=10&instanceFamily=Memory optimized`

To start the applicaton run
```bash
node .
```

The app will be available on `localhost:8000`

> I am little rusty in my JS skills so there might be multiple leeks ans error that i have not handlen corectlly but, as there are a lot of dinamic data JS ia a greate choice for this.

Thank You.