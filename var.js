var baseResObject = {
    "木材":{
        type: 0,
        minetype: 0,
        heat: 1
    },
    "煤":{
        type: 0,
        minetype: 1,
        heat: 2
    },
    "铁矿":{
        type: 0,
        minetype: 1
    },
    "铜矿":{
        type: 0,
        minetype: 1
    },
    "石料":{
        type: 0,
        minetype: 1
    },
    "水":{
        type: 0,
        minetype: 2
    },
    "原油":{
        type: 0,
        minetype: 3,
        heat: 3
    },
    "氢气":{
        type: 0,
        minetype: 4,
        heat: 10
    },
    "可燃冰":{
        type: 0,
        minetype: 4,
        heat: 5
    },
    "硅矿":{
        type: 0,
        minetype: 1
    },
    "铀矿":{
        type: 0,
        minetype: 1
    },
    "氘":{
        type: 0,
        minetype: 0
    },
    "硫":{
        type: 0,
        minetype: 1
    },
    "钛矿":{
        type: 0,
        minetype: 1
    },
    "氦":{
        type: 0,
        minetype: 4
    },
    "铁锭":{
        type: 1,
    },
    "铜锭":{
        type: 1,
    },
    "石材":{
        type: 1,
    },
    "钢":{
        type: 1,
    },
    "钛锭":{
        type: 1,
    },
    "硫酸":{
        type: 0,
        minetype: 2
    },
    "精炼油":{
        type: 1,
        heat: 5
    },
    "蜂窝煤":{
        type: 1,
        heat: 5
    },
    "电路板":{
        type: 1,
    },
    "电池":{
        type: 1,
    },
    "硅片":{
        type: 1,
    },
    "cpu":{
        type: 1,
    }
}

var baseRes_lv1_key = [];
var baseRes_lv2_key = [];
var fuleRes = [];
for(var key in baseResObject){
    let ele = baseResObject[key];
    if(ele.type==0) baseRes_lv1_key.push(key);
    if(ele.type==1) baseRes_lv2_key.push(key);
    if(ele.heat > 0) fuleRes.push(key);
}

var miner_key = ["采矿机","抽水机","油井","轨道采集器"];

var buildingObject = {
    "采矿机":{
        type: 1,
        power: -10,
        idlepower: 1
    },
    "抽水机":{
        type: 1,
        power: -10,
        idlepower: 1
    },
    "油井":{
        type: 1,
        power: -20,
        idlepower: 1
    },
    "轨道采集器":{
        type: 1,
        power: -200,
        idlepower: 1
    },
    "风力发电机":{
        type: 2,
        power: 10,
        ptype: 0,
        idlepower: 0
    },
    "太阳能板":{
        type: 2,
        power: 10,
        ptype: 1,
        idlepower: 0
    },
    "火力发电机":{
        type: 2,
        power: 30,
        ptype: 2,
        idlepower: 0
    },
    "核能发电机":{
        type: 2,
        power: 50,
        ptype: 3,
        idlepower: 0
    },
    "合成台":{
        type: 3,
        power: -10,
        update: "合成台MK2",
        idlepower: 1
    },
    "合成台MK2":{
        type: 3,
        power: -20,
        update: "合成台MK3",
        idlepower: 1
    },
    "合成台MK3":{
        type: 3,
        power: -30,
        idlepower: 1
    },
    "熔炉":{
        type: 3,
        power: -20,
        idlepower: 1
    },
    "炼油厂":{
        type: 3,
        power: -30,
        idlepower: 1
    },
    "化工厂":{
        type: 3,
        power: -50,
        idlepower: 1
    },
    "科技中心":{
        type: 4,
        power: -100,
        idlepower: 1
    },
    "星际物流中心":{
        type: 5,
        power: -200,
        idlepower: 1
    }
};

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

var publicRecipe = [
    {
        inputs: [{id:"铁矿",num:1}],
        outputs: [{id:"铁锭",num:1}],
        time: 5,
        place: 1
    },
    {
        inputs: [{id:"铜矿",num:1}],
        outputs: [{id:"铜锭",num:1}],
        time: 5,
        place: 1
    },
    {
        inputs: [{id:"石料",num:1}],
        outputs: [{id:"石材",num:1}],
        time: 5,
        place: 1
    },
    {
        inputs: [{id:"铁矿",num:3},{id:"煤",num:1}],
        outputs: [{id:"钢",num:1}],
        time: 10,
        place: 1
    },
    {
        inputs: [{id:"钛矿",num:1}],
        outputs: [{id:"钛锭",num:1}],
        time: 5,
        place: 1
    },
    {
        inputs: [{id:"石料",num:2},{id:"精炼油",num:1},{id:"水",num:1}],
        outputs: [{id:"硫酸",num:5}],
        time: 15,
        place: 2
    },
    {
        inputs: [{id:"原油",num:1}],
        outputs: [{id:"精炼油",num:1},{id:"氢气",num:1}],
        time: 15,
        place: 3
    },
    {
        inputs: [{id:"煤",num:1}],
        outputs: [{id:"蜂窝煤",num:1}],
        time: 10,
        place: 2
    },
    {
        inputs: [{id:"铁锭",num:2},{id:"铜锭",num:1}],
        outputs: [{id:"电路板",num:1}],
        time: 15,
        place: 1
    },
    {
        inputs: [{id:"铁锭",num:1},{id:"铜锭",num:1},{id:"硫酸",num:10}],
        outputs: [{id:"电池",num:1}],
        time: 30,
        place: 2
    },
    {
        inputs: [{id:"石料",num:5}],
        outputs: [{id:"硅片",num:1}],
        time: 30,
        place: 1
    },
    {
        inputs: [{id:"硅矿",num:1}],
        outputs: [{id:"硅片",num:1}],
        time: 10,
        place: 1
    }
];

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
    return x;
}

// 宇宙
var universe = new Universe(5);
var player = new Player();
