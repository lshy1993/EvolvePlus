//预置定义，包括资源、机器、配方、科技、修正
//enum
var Types = {};
Types.ResourceType = {
    Basic:0,
    Rare:1, 
    Compound:2
};
Types.MineType = {
    None:0,
    Lumbering:1,
    Mining:2,
    PumpingWater:3,
    PumpingOil:4,
    OrbitCollection:5
};
var baseResObject = {};
/*
type:资源类型
heat:资源热值
minetype:采集机器类型
*/
baseResObject["木材"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Lumbering, heat:1.2e7};
baseResObject["煤"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:2e7};
baseResObject["铁矿"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:0};
baseResObject["铜矿"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:0};
baseResObject["石料"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:0};
baseResObject["水"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.PumpingWater, heat:0};
baseResObject["原油"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.PumpingOil, heat:4.4e7};
baseResObject["氢气"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.PumpingOil, heat:1.4e8};
baseResObject["可燃冰"] = {type: Types.ResourceType.Basic, minetype: Types.OrbitCollection, heat:7.5e6};
baseResObject["硅矿"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:0};
baseResObject["铀矿"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:0};
baseResObject["氘"] = {type: Types.ResourceType.Basic, minetype: Types.None, heat:7e7};
baseResObject["硫矿"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:0};
baseResObject["钛矿"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.Mining, heat:0};
baseResObject["氦气"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.OrbitCollection, heat:0};
baseResObject["硫酸"] = {type: Types.ResourceType.Basic, minetype: Types.MineType.PumpingOil, heat:0};

baseResObject["铁锭"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["铜锭"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["石材"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["钢"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["钛锭"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["精炼油"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:4.4e7};

baseResObject["蜂窝煤"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:3.2e7};
baseResObject["电路板"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["电池"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["硅片"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["cpu"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["蓝科技包"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["红科技包"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["黄科技包"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["紫科技包"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["绿科技包"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};
baseResObject["白科技包"] = {type: Types.ResourceType.Compound, minetype: Types.MineType.None, heat:0};

//配方
var publicRecipe = {};
/*
type:是否可以手搓
place:合成建筑
inputs:输入产物字典数组{id, num}
outputs:输出产物字典数组{id, num}
time:基础合成时间
*/
Types.Recipe = {
    CanHandmade: 0,
    CannotHandmade: 1
};
Types.Machine = {
    Furnace: 0,
    Crafter: 1,
    Refinery: 2,
    ChemicalPlant:3
}
publicRecipe["炼铁"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Furnace,
    inputs: [{id:"铁矿",num:1}],
    outputs: [{id:"铁锭",num:1}],
    time: 1,
};
publicRecipe["炼钢"] = {
    type: Types.Recipe.CannotHandmade,
    place: Types.Machine.Furnace,
    inputs: [{id:"铁锭",num:3}],
    outputs: [{id:"钢",num:1}],
    time: 3,
};
publicRecipe["炼铜"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Furnace,
    inputs: [{id:"铜矿",num:1}],
    outputs: [{id:"铜锭",num:1}],
    time: 1,
};
publicRecipe["炼石"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Furnace,
    inputs: [{id:"石料",num:1}],
    outputs: [{id:"石材",num:1}],
    time: 1,
};
publicRecipe["炼钛"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Furnace,
    inputs: [{id:"钛矿",num:1}],
    outputs: [{id:"钛锭",num:1}],
    time: 2,
};
publicRecipe["硫酸合成"] = {
    type: Types.Recipe.CannotHandmade,
    place: Types.Machine.ChemicalPlant,
    inputs: [{id:"石料",num:2},{id:"精炼油",num:1},{id:"水",num:1}],
    outputs: [{id:"硫酸",num:5}],
    time: 15,
};
publicRecipe["原油裂解"] = {
    type: Types.Recipe.CannotHandmade,
    place: Types.Machine.Refinery,
    inputs: [{id:"原油",num:1}],
    outputs: [{id:"精炼油",num:0.7},{id:"氢气",num:0.1}],
    time: 3
};
publicRecipe["煤炭加工"] = {
    type: Types.Recipe.Canhandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"煤",num:3}],
    outputs: [{id:"蜂窝煤",num:2}],
    time: 2
};
publicRecipe["电路板"] = {
    type: Types.Recipe.Canhandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"铁锭",num:1},{id:"铜锭",num:2}],
    outputs: [{id:"电路板",num:2}],
    time: 1
};
publicRecipe["电池"] = {
    type: Types.Recipe.Canhandmade,
    place: Types.Machine.ChemicalPlant,
    inputs: [{id:"铁锭",num:1},{id:"铜锭",num:1},{id:"硫酸",num:10}],
    outputs: [{id:"电池",num:1}],
    time: 15
};
publicRecipe["炼硅"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Furnace,
    inputs: [{id:"硅矿",num:1}],
    outputs: [{id:"硅片",num:1}],
    time: 2,
};
publicRecipe["沙里淘硅"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Furnace,
    inputs: [{id:"石料",num:5}],
    outputs: [{id:"硅片",num:1}],
    time: 20,
};
//发电标记
// publicRecipe["核能发电"] = {
//     inputs: [{id:"铀燃料",num:1}],
// }
// publicRecipe["核聚变发电"] = {
//     inputs: [{id:"氘燃料",num:1}],
// }
//machines
publicRecipe["伐木机"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"石料",num:5}],
    outputs: [{id:"伐木机",num:1}],
    time: 1,
};
publicRecipe["采矿机"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"铁锭",num:5}, {id:"电路板",num:5}],
    outputs: [{id:"采矿机",num:1}],
    time: 1,
};
publicRecipe["抽水机"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"铁锭",num:5}, {id:"电路板",num:5}],
    outputs: [{id:"抽水机",num:1}],
    time: 1,
};
publicRecipe["油井"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"钢",num:5}, {id:"石材",num:5}, {id:"电路板",num:5}],
    outputs: [{id:"油井",num:1}],
    time: 1,
};
publicRecipe["风力发电机"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"铁锭",num:5}, {id:"电路板",num:5}],
    outputs: [{id:"风力发电机",num:1}],
    time: 1,
};
publicRecipe["太阳能板"] = {
    type: Types.Recipe.CanHandmade,
    place: Types.Machine.Crafter,
    inputs: [{id:"铁锭",num:5}, {id:"电路板",num:5},{id:"硅片", num:5}],
    outputs: [{id:"太阳能板",num:1}],
    time: 1,
};

var initialRecipe=["炼铁","炼铜","炼石","炼钛","煤炭加工","电路板","沙里淘硅","伐木机","采矿机","抽水机","油井","风力发电机","太阳能板"];

var supportRecipe = [[],[],[],[]];
var item2recipe={};
for(var key in publicRecipe)
{
    let ele = publicRecipe[key];
    console.log(ele.place);
    supportRecipe[ele.place].push(key);
    var item = ele.outputs;
    if(item != undefined && item.length > 0)
    {
        for(var it of item)
        {
            var id = it.id;
            if(item2recipe[id] == undefined)
                item2recipe[id] = [];
            item2recipe[id].push(key);
        }
    }
}
console.log(supportRecipe);

//科技
var publicTech = {};
/*
inputs:单次消耗的瓶子
time:单次所需时间
count:总研发次数
recipes:解锁配方
machines:解锁机器
modifiers:解锁修正buff
infinity:无限升级科技，为数字则为最大升级次数，-1为无限，0或undefined为无
requirements:前置科技
*/
publicTech["高级冶炼"] = {
    inputs:["蓝科技包"],
    time:2,
    count:20,
    recipes:["炼钢"]
};

//建筑
var buildingObject = {};
Types.Build = {
    Gather: 1,
    PowerPlant: 2,
    Facotry: 3,
    Tech: 4,
    Transportation: 5
}
/*
type: 1采集 2发电 3合成 4科技 5物流
recipes: 支持的配方
power: 生产电力，消耗则为负
needfuel: 发电设备
idlepower: 输入原料不足时，待机电力，消耗一样为负
update: 下一级升级
speed: 速度加成
*/
buildingObject["伐木机"] = {
    type: Types.Build.Gather,
    power: -4.2e5,
    idlepower: -1.5e4,
    speed: 1
};
buildingObject["采矿机"] = {
    type: Types.Build.Gather,
    power: -4.2e5,
    idlepower: -1.5e4,
    speed: 1
};
buildingObject["抽水机"] = {
    type: Types.Build.Gather,
    power: -4.2e5,
    idlepower: -1.5e4,
    speed: 1
};
buildingObject["油井"] = {
    type: Types.Build.Gather,
    power: -1e6,
    idlepower: -2e4,
    speed: 1
};
buildingObject["轨道采集器"] = {
    type: Types.Build.Gather,
    power: -1e7,
    idlepower: -2e6,
    speed: 1
};

buildingObject["风力发电机"] = {
    type: Types.Build.PowerPlant,
    power: 4e5,
    powertype: 0
};
buildingObject["太阳能板"] = {
    type: Types.Build.PowerPlant,
    power: 1e6,
    powertype: 1
};
buildingObject["火力发电机"] = {
    type: Types.Build.PowerPlant,
    power: 1e6,
    powertype: 2
};
buildingObject["核能发电机"] = {
    type: Types.Build.PowerPlant,
    power: 1e6,
    powertype: 3,
    recipes: ["核能发电","核聚变发电"]
};

buildingObject["合成台"] = {
    type: Types.Build.Facotry,
    power: -4e5,
    idlepower: -2e4,
    machinetype: Types.Machine.Crafter,
    update: "合成台MK2",
    speed: 1
};
buildingObject["合成台MK2"] = {
    type: Types.Build.Facotry,
    power: -8e5,
    idlepower: -3e4,
    machinetype: Types.Machine.Crafter,
    update: "合成台MK3",
    speed: 1.5
};
buildingObject["合成台MK3"] = {
    type: Types.Build.Facotry,
    power: -1.2e6,
    idlepower: -3e4,
    machinetype: Types.Machine.Crafter,
    speed: 2
};

buildingObject["熔炉"] = {
    type: Types.Build.Facotry,
    power: -8e5,
    idlepower: -2e4,
    machinetype: Types.Machine.Furnace,
    speed: 1
};

buildingObject["炼油厂"] = {
    type: Types.Build.Facotry,
    power: -8e5,
    idlepower: -2e4,
    machinetype: Types.Machine.Refinery,
    speed: 1
};

buildingObject["化工厂"] = {
    type: Types.Build.Facotry,
    power: -8e5,
    idlepower: -2e4,
    machinetype: Types.Machine.ChemicalPlant,
    speed: 1
};

buildingObject["科技中心"] = {
    type: Types.Build.Tech,
    power: -1e6,
    idlepower: -1e4,
    speed: 1
};

buildingObject["星际物流中心"] = {
    type: Types.Build.Transportation,
    power: -1e7,
    idlepower: -2e4,
    speed: 1
};
