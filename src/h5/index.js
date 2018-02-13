import hereIp from '../ip'

const hereH5 = (config, successFnc, failFnc) => {
    if ('geolocation' in navigator) {
        let geo_options = {};
        if (config.highSwitch) {
            geo_options.enableHighAccuracy = config.highSwitch;
        }
        if (config.timeout) {
            geo_options.timeout = config.timeout;
        }
        if (config.max) {
            geo_options.maximumAge = config.max;
        }
        if (config.watch) {
            const geolocationId = navigator.geolocation.watchPosition((res) => {
                let result = {
                    lng: res.coords.longitude,
                    lat: res.coords.latitude
                }
                successFnc(result);
            }, (err) => {
                console.error(err);
                failFnc("h5-fail");
                // do again 
                hereIp(successFnc, failFnc);
            }, geo_options);
            window['GEO-LOCATION-ID'] = geolocationId;
        } else {
            navigator.geolocation.getCurrentPosition((res) => {
                let result = {
                    lng: res.coords.longitude,
                    lat: res.coords.latitude
                }
                successFnc(result);
            }, (err) => {
                console.error(err);                
                failFnc("h5-fail");
                // do again 
                hereIp(successFnc, failFnc);
            }, geo_options);
        }
    } else {
        return null;
    }
}
export default hereH5