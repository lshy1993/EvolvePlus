var baseRes_lv1_key = ["木材","煤","铁","铜","石头","水","原油","氢气","可燃冰","硅矿","铀","氘","硫","钛","氦"];
var baseRes_lv2_key = ["铁锭","铜锭","石材","钢","钛锭","硫酸","精炼油","蜂窝煤","电路板","电池","硅片","cpu"];

var baseResObject = {
    "木材":{
        type: 0,
        minetype: 0
    },
    "煤":{
        type: 0,
        minetype: 1
    },
    "铁":{
        type: 0,
        minetype: 1
    },
    "铜":{
        type: 0,
        minetype: 1
    },
    "石头":{
        type: 0,
        minetype: 1
    },
    "水":{
        type: 0,
        minetype: 2
    },
    "原油":{
        type: 0,
        minetype: 2
    },
    "氢气":{
        type: 0,
        minetype: 3
    },
    "可燃冰":{
        type: 0,
        minetype: 3
    },
    "硅矿":{
        type: 0,
        minetype: 1
    },
    "铀":{
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
    "钛":{
        type: 0,
        minetype: 1
    },
    "氦":{
        type: 0,
        minetype: 3
    }
}

var building_key = [
    ["采矿机","抽水机"],
    ["风力发电机","火力发电机","聚变发电机"],
    ["合成台","合成台MK2","合成台MK3","熔炉","炼油厂","化工厂"],
    ["科技中心"],
    ["星际物流中心"]
];

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
    "风力发电机":{
        type: 2,
        power: 10,
        idlepower: 1
    },
    "火力发电机":{
        type: 2,
        power: 10,
        idlepower: 1
    },
    "聚变发电机":{
        type: 2,
        power: 10,
        idlepower: 1
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
