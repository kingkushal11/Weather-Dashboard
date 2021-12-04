var apikey = "82ccbfcc5db7584829b51304b0040048"
var btnEl = $("#searchbtn");
function searchcity() {
    var search = $("#search");
    var searchval = search.val();
    console.log(searchval);

    var links = "https://api.openweathermap.org/data/2.5/weather?q=" + searchval + "&appid=" + apikey;
    fetch(links).then(function (res) {
        return res.json();
    }).then(function (data) {
        console.log(data);
        var link = "https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&appid=" + apikey;
        fetch(link).then(function(res){
            return res.json();
        }).then(function(info){
            console.log(info);

        })
    })
}
btnEl.click(searchcity);
