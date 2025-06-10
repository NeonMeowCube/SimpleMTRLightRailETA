var station = 260;
var response_json = "";
var decode = "";
var result = "";
var ReloadDelay = 10000; // 3 seconds

window.GetETA = GetETA;
function getSelectedStation() {
    var stationSelect = document.getElementById('station');
    return parseInt(stationSelect.value);
}
// Function to decode and expand the JSON data
function decodeJson(data) {
    // Store the JSON data as formatted text
    response_json = JSON.stringify(data, null, 2);
    console.log("Extracted JSON Text:");
    console.log(response_json);
    formatSchedule(data);
}
function formatSchedule(data) {
    if (!data || !data.platform_list)
        return;
    
    result = ""; // Clear previous results
    
    console.log("\n=== Light Rail Schedule ===");
    console.log("System Time: ".concat(data.system_time, "\n"));
    result = result + "System Time: " + data.system_time + "<br>";
    
    data.platform_list.forEach(function (platform) {
        console.log("Platform ".concat(platform.platform_id, ":"));
        result = result + "Platform " + platform.platform_id + ":<br>";
        if (platform.route_list && platform.route_list.length > 0) {
            platform.route_list.forEach(function (route) {
                console.log("  ".concat(route.route_no, " - ").concat(route.dest_ch, " - ").concat(route.time_ch, "\n"));
                // console.log(`    Status: ${route.arrival_departure === 'D' ? 'Departing' : 'Arriving'}`);
                console.log('    ----------------\n');
                result = result + route.route_no + " - " + route.dest_ch + " - " + route.time_ch + "<br>";
                result = result + '    ----------------<br>';
            });
        }
        else {
            console.log('  No scheduled trains');
            result = result + '是日列車服務已經中止<br>';
        }
        console.log('');
    });
    
    // Changed: Use innerHTML instead of textContent to render HTML tags
    document.getElementById('text').innerHTML = result;
    setTimeout(() => GetETA(station), ReloadDelay);


}

// Fetch section
function GetETA(station_id) {
    station = station_id || getSelectedStation() || station; // Use the provided station_id or the selected one
    if (station < 0) {
        console.error("Invalid station ID");
        return;
    }
    console.log("Fetching ETA for station ID: ".concat(station));
    result = "";
    // Fetch the JSON data from the API
    fetch("https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=".concat(station))
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Couldn't fetch api!!");
        }
        return response.json(); // Parse the response as JSON
    })
        .then(function (data) { return decodeJson(data); }) // Pass the data to the decodeJson function
        .catch(function (error) { return console.error(error); });
}