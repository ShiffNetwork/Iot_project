const express = require('express');
const parser = require('body-parser');
const bodyParser = require('body-parser');
const influx = require('@influxdata/influxdb-client')
require('dotenv').config();

/** Environment variables **/
const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET


// document.write('<script type="text/javascript" src="index.js"></script>')

// http.createServer((_, res) => {
//     res.write('The server is live');
//     res.end();
// }).listen(4040);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const port = process.env.PORT || 4041;

app.get('/', (_, res) => {
    res.send('test app')
});

app.post('/temperatures', (req, res, next) => {
    const string = JSON.stringify(req.body);
    const sliced = string.slice(11);
    const HexRes = sliced.slice(0, -2);
    const finalRes = parseInt(HexRes, 16) / 10;
    console.log(finalRes);


    /**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
    const influxDB = new influx.InfluxDB({ url, token })

    /**
     * Create a write client from the getWriteApi method.
     * Provide your `org` and `bucket`.
     **/
    const writeApi = influxDB.getWriteApi(org, bucket)

    /**
     * Apply default tags to all points.
     **/
    writeApi.useDefaultTags({ region: 'west' })

    /**
     * Create a point and write it to the buffer.
     **/
    const point1 = new influx.Point('sensor')
        .floatField('temperature', finalRes)
    console.log(` ${point1}`)

    writeApi.writePoint(point1)

    /**
     * Flush pending writes and close writeApi.
     **/
    writeApi.close().then(() => {
        console.log('WRITE FINISHED')
    })
    res.send();
});

app.listen(port, () => {
    console.log(`the server is running on ${port}`);
})