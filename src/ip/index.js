// ip 定位目前采用的是腾讯的定位服务api,请在key后面更换自己的key
const SERVER_URL = '//apis.map.qq.com/ws/location/v1/ip?key=WTWBZ-ODOCK-MLJJ4-A2OUS-BVSJJ-LXBNS';
const hereIp = (successFnc, failFnc) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", SERVER_URL ,true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            let res = JSON.parse(xmlhttp.responseText);
            if (res.status === 0) {
                successFnc(Object.assign({}, res.result.location))
            } else {
                failFnc('fail-api-res');           
            }
        } else {
            failFnc('fail-api-res');
        }
    }
}

export default hereIp;