export const test_data = {
    '/data/country_analyze': (function() {
        var n = {};
        var total = {died: 0, cured: 0, confirmed: 0};
        var data = [];
        for(let i=0; i<30; i++){
            n.died = parseInt(Math.random()*100);
            n.cured = parseInt(Math.random()*100);
            n.confirmed = parseInt(Math.random()*100);
            total.died += n.died;
            total.cured += n.cured;
            total.confirmed += n.confirmed;
            data.push({
                date: '2020-3-' + i,
                new: {...n},
                total: {...total}
            });
        }
        return {population: 100000, data: data};
    })(),

    '/data/search': (function() {
        var n = {};
        var total = {died: 0, cured: 0, confirmed: 0};
        var data = [];
        for(let i=0; i<30; i++){
            n.died = parseInt(Math.random()*100);
            n.cured = parseInt(Math.random()*100);
            n.confirmed = parseInt(Math.random()*100);
            total.died += n.died;
            total.cured += n.cured;
            total.confirmed += n.confirmed;
            data.push({
                date: '2020-3-' + i,
                total_confirmed: total.confirmed,
                total_cured: total.cured,
                total_died: total.died
            });
        }
        return {population: 100000, data: data};
    })(),
};


// WEBPACK FOOTER //
// ./src/assets/test_data.js