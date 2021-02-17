var baseRes_lv1_key = [];
var baseRes_lv2_key = [];
var fuleRes = [];
for(var key in baseResObject){
    let ele = baseResObject[key];
    if(ele.type==Types.ResourceType.Basic) baseRes_lv1_key.push(key);
    if(ele.type==Types.ResourceType.Compound) baseRes_lv2_key.push(key);
    if(ele.heat > 0) fuleRes.push(key);
}

var miner_key = ["伐木机","采矿机","抽水机","油井","轨道采集器"];
var machine_key = ["合成台","熔炉","炼油厂","化工厂"];

var building_key = [
    [],
    [],
    [],
    [],
    []
];
for(var key in buildingObject){
    let ele = buildingObject[key];
    building_key[ele.type-1].push(key);
}
// console.log(building_key);
// var block_key = ["红","蓝","黄","紫","绿","白"];

/** 随机d位字母 */
function rndChar(d){
    let name = "";
    for(var i=0;i<d;i++){
        let code = Math.floor(Math.random()*26)+65;
        name += String.fromCharCode(code);
    }
    return name;
}
/** 随机d位数 */
function rndNum(d){
    let name = "";
    for(var i=0;i<d;i++){
        let code = Math.floor(Math.random()*10);
        name += code.toString();
    }
    return name;
}

function Sample(arr){
    let d = Math.floor(Math.random()*arr.length);
    return arr[d];
}

function simNumber(x){
    let d = Math.log10(x);
    if (d >= 15) return (x/(10**15)).toFixed(1)+"P";
    if (d >= 12) return (x/(10**12)).toFixed(1)+"T";
    if (d >= 9) return (x/(10**9)).toFixed(1)+"G";
    if (d >= 6) return (x/(10**6)).toFixed(1)+"M";
    if (d >= 4) return (x/(10**3)).toFixed(1)+"K";
    return Math.floor(x);
}

// 宇宙
var universe = new Universe(5);
var player = new Player();
