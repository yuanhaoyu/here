import hereH5 from './h5';
import hereIp from './ip'

const here = function () {
    let successFnc = null,
        failFnc = null,
        config = {};
    if (typeof arguments[0] === 'function') {
        successFnc = arguments[0];
        if (typeof arguments[1] === 'function') {
            failFnc = arguments[1];
        }
    } else {
        config = arguments[0];
        if (typeof arguments[1] === 'function') {
            successFnc = arguments[1];
            if (typeof arguments[2] === 'function') {
                failFnc = arguments[2];
            }
        }
    }
    hereH5(config,successFnc,failFnc);
    return {
        clear: () => {
            console.log(window['GEO-LOCATION-ID']);
            navigator.geolocation.clearWatch(window['GEO-LOCATION-ID']);
        }
    }
}

window.here = here;
export default here;