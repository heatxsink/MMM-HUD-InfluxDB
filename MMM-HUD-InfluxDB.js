Module.register('MMM-HUD-InfluxDB', {
    defaults: {
        displayName: '',
        token: '',
        url: '',
        db: '',
        rp: '',
        measurement: '',
        field: '',
        interval: 5000,
        width: '400px'
    },
    valueElement: null,
    getScripts: function () {
        return [
            "https://moment.github.io/luxon/global/luxon.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"
        ];
    },
    getStyles: function () {
        return [
            "MMM-HUD-InfluxDB.css"
        ];
    },
    start: function () {
        this.config = Object.assign({}, this.defaults, this.config);
        Log.info('Starting module: ' + this.name);
        this.scheduleUpdate();
    },
    getDom: function () {
        var wrapper = document.createElement('div');
        wrapper.className = "wrapper";
        wrapper.style.width = this.config.width;
        if (this.config.displayName != '') {
            var displayNameFieldElement = document.createElement('div');
            displayNameFieldElement.classList.add("displayName", "normal", "small");
            displayNameFieldElement.innerText = this.config.displayName;
            wrapper.append(displayNameFieldElement);
        }
        this.valueElement = document.createElement("div");
        this.valueElement.classList.add("value", "normal", "medium");
        this.valueElement.innerText = "23234";
        wrapper.append(this.valueElement);
        return wrapper;
    },
    scheduleUpdate: function () {
        setInterval(() => {
            this.getData();
        }, this.config.interval);
        this.getData();
    },
    getData: function () {
        this.sendSocketNotification('GET_DATA', { config: this.config });
    },
    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case 'DATA':
                if (payload.field === this.config.field) {
                    let value = numeral(payload.value).format("0.00");
                    this.valueElement.innerHTML = value;
                }
                break;
        }
    }
});
