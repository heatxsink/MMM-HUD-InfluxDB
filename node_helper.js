const NodeHelper = require('node_helper');
const fetch = require('node-fetch');

module.exports = NodeHelper.create({
    start: function () {
        console.log('Starting helper: ' + this.name);
    },
    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case 'GET_DATA':
                this.getData(payload.config);
                break;
        }
    },
    getData: function (config) {
        let q = "SELECT last(" + config.field + ") FROM " + config.measurement + " WHERE time > now() - 12h";
        let u = config.url + '?q=' + encodeURIComponent(q) + '&db=' + encodeURIComponent(config.db) + '&rp=' + encodeURIComponent(config.rp);
        let h = { 'Content-type': 'application/json', 'Authorization': 'Token ' + config.token };
        fetch(u, { headers: h, method: 'POST', body: '' })
            .then(r => r.json())
            .then(json => {
                let value = json.results[0].series[0].values[0][1];
                this.sendSocketNotification('DATA', { field: config.field, value: value });
            })
            .catch(e => console.error(e));
    }
});
