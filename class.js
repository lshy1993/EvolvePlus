class Player{
    constructor(){
        /** 背包 */
        this.bag = {};
        /** 所处星球 */
        this.curPlanet;
        /** 已经研究的科技 */
        this.tech = {};
        /** 已经解锁的配方 */
        this.recipes = {};
        /** 手动研究效率 */
        this.hashSpeed = 100;
        this.curTech;
        this.init();
    }

    init(){
        for(var key in baseResObject){
            this.bag[key] = 100;
        }
        for(var key in buildingObject){
            this.bag[key] = 2;
        }
        for(var key in publicTech){
            this.tech[key] = new Tech(key);
        }
        for(var key of initialRecipe){
            this.recipes[key] = 1;
        }
        console.log("player init");
    }

    showBag(){
        let d = {};
        for(var key in this.bag){
            if(this.bag[key] > 0){
                d[key] = this.bag[key];
            }
        }
        return d;
    }
    hasItem(name){
        return this.bag[name] > 0;
    }

    showTech(){
        let d = [];
        for(var key in publicTech){
            if(this.tech[key].isFinish()) continue;
            if(this.curTech && this.curTech.name == key) continue;
            d.push(key);
        }
        return d;
    }
    /** 科技是否已开启 */
    isTechOn(name){
        let prev = publicTech[name].prev;
        if(!prev) return true;
        return this.tech[prev].isFinish();
    }
    /** 当前的进度 */
    getTechProgress(){
        if(this.curTech===undefined) return 0;
        return this.curTech.progress().toFixed(2);
    }
    /** 开始研究 */
    addTech(name){
        console.log("已开启科技"+name);
        this.curTech = this.tech[name];
    }
    /** 暂停研究 */
    pauseTech(){
        console.log("已暂停科技"+name);
        this.curTech = null;
    }

    Mine(resource){
        if(resource.curNum > 0){
          let key = resource.name;
          this.bag[key]+=1;
          resource.curNum-=1;
        }
    }

    //recipe:object
    Craft(recipe){
        var locked = {};
        var res = this.CraftRecipe2(recipe, 1, locked);
        if(res)
        {
            console.log("comsume:",locked);
            console.log("generate:",recipe.outputs);
            for(var key in locked)
            {
                this.bag[key] -= locked[key];
            }
            for(var ele of recipe.outputs)
            {
                if(this.bag[ele.id] == undefined)
                    this.bag[ele.id] = ele.num;
                else
                    this.bag[ele.id] += ele.num;
            }
        }
        else
        {
            console.log("无法完成合成，请检查是否先通过了CanCraft的check。");
        }
    }

    //item: name
    CraftItem(item)
    {
        var re = item2recipe[item];
        if(re == undefined || re.length <= 0)
            return false;
        for(var recipe of re)
        {
            if(publicRecipe[recipe].type == Types.Recipe.CannotHandmade)
                continue;
            //我们约定每种物品最多一种手搓方案
            if(Craft(recipe))
                return true;
            else
                return false;
        }
        return false;
    }

    //item: name
    CraftItem2(item, num, locked)
    {
        var bagnum=0;
        //剩余可用数目
        if(this.bag[item] > 0)
        {
            bagnum = this.bag[item];
            if(locked[item] > 0)
                bagnum -= locked[item];
        }
        if(bagnum >= num)
        {
            if(locked[item] == undefined)
                locked[item] = num;
            else
                locked[item] += num;
            return true;
        }
        //还需要手搓num个
        num -= bagnum;
        if(locked[item] == undefined)
            locked[item] = bagnum;
        else
            locked[item] += bagnum;
        var re = item2recipe[item];
        if(re == undefined || re.length <= 0)
            return false;
        for(var recipe of re)
        {
            if(publicRecipe[recipe].type == Types.Recipe.CannotHandmade)
                continue;
            //我们约定每种物品最多一种手搓方案
            if(this.CraftRecipe2(publicRecipe[recipe], num, locked))
                return true;
            else
                return false;
        }
        return false;
    }

    //recipe: object
    CraftRecipe2(recipe, num, locked)
    {
        if(recipe.type == Types.Recipe.CannotHandmade)
            return false;
        var initem = recipe.inputs;
        if(initem == undefined || initem.length <= 0)
            return true;
        for(var ele of initem)
        {
            if(!this.CraftItem2(ele.id, ele.num * num, locked))
                return false;
        }
        return true;
    }

    //recipe: object
    canCraft(recipe){
        return this.CanCraftRecipe2(recipe, 1, {});
    }

    //item: name
    canCraftItem(item){
        var re = item2recipe[item];
        if(re == undefined || re.length <= 0)
            return false;
        for(var recipe of re)
        {
            if(publicRecipe[recipe].type == Types.Recipe.CannotHandmade)
                continue;
            //我们约定每种物品最多一种手搓方案
            if(this.CanCraftRecipe(recipe))
                return true;
            else
                return false;
        }
        return false;
    }

    //item: name
    CanCraftItem2(item, num, locked)
    {
        var bagnum=0;
        //剩余可用数目
        if(this.bag[item] > 0)
        {
            bagnum = this.bag[item];
            if(locked[item] > 0)
                bagnum -= locked[item];
        }
        if(bagnum >= num)
        {
            if(locked[item] == undefined)
                locked[item] = num;
            else
                locked[item] += num;
            return true;
        }
        //还需要手搓num个
        num -= bagnum;
        if(locked[item] == undefined)
            locked[item] = bagnum;
        else
            locked[item] += bagnum;
        var re = item2recipe[item];
        if(re == undefined || re.length <= 0)
            return false;
        for(var recipe of re)
        {
            if(publicRecipe[recipe].type == Types.Recipe.CannotHandmade)
                continue;
            //我们约定每种物品最多一种手搓方案
            if(this.CanCraftRecipe2(publicRecipe[recipe], num, locked))
                return true;
            else
                return false;
        }
        return false;
    }

    //recipe: object
    CanCraftRecipe2(recipe, num, locked)
    {
        if(recipe.type == Types.Recipe.CannotHandmade)
            return false;
        var initem = recipe.inputs;
        if(initem == undefined || initem.length <= 0)
            return true;
        for(var ele of initem)
        {
            if(!this.CanCraftItem2(ele.id, ele.num * num, locked))
                return false;
        }
        return true;
    }

    SetMiner(resource){
        let resname = resource.name;
        let key = baseResObject[resname].minetype;
        let item = miner_key[key-1];
        if(this.bag[item] > 0){
            console.log("已设置"+item);
            resource.isAuto += 1;
            // 负数代表消耗
            resource.power = buildingObject[item].power;
            this.bag[item] -= 1;
        }else{
            alert(item+" not enough!");
        }
    }

    RemoveMiner(resource){
        let resname = resource.name;
        let key = baseResObject[resname].minetype;
        let item = miner_key[key-1];
        console.log("已移除"+item);
        resource.isAuto -= 1;
        // resource.power = 0;
        this.bag[item] += 1;
    }

    checkTechEmpty(){
        for(var key of this.curTech.inputs){
            if (this.bag[key] == 0) return true;
        }
        return false;
    }

    update(){
        // 科技更新
        if(this.curTech && this.curTech.useBag){
            if(this.checkTechEmpty()){
                console.log('bag empty');
            }
            else if(this.curTech.cur_t <= 0){
                // 先消耗瓶子
                for(var key of this.curTech.inputs){
                    this.bag[key] -= 1;
                }
                this.curTech.cur_t = this.curTech.time;
                // 增加
                this.curTech.cur_hash += 1;
                if(this.curTech.cur_hash==this.curTech.hash){
                    console.log("科技完成");
                    this.curTech = null;
                }                
            }else{
                this.curTech.cur_t -= 1;
            }
        }
    }
}

/** 宇宙 */
class Universe {
    constructor(stellar_num) {
        this.stellars = [];
        // 恒星系数目
        for(var i=0;i<stellar_num;i++){
            this.stellars.push(new Stellar());
        }
    }

    update(){
        this.stellars.forEach(element => {
            element.update();
        })
    }
    /** 获取恒星系 */
    getStellar(index){
        return this.stellars[index];
    }
}

/** 恒星系 */
class Stellar {
    constructor() {
        this.name = "";
        /** 恒星数目 */
        this.fixnum = 1;
        /** 内部行星(含恒星) */
        this.planets = [];
        this.init();
    }

    init(){
        // 随机星系名
        this.name = rndChar(2);
        // TODO：双星系统

        // 随机生成1-5颗行星
        let star_num = Math.ceil(Math.random()*5);
        for(var i=0;i<star_num;i++){
            if(i == 0){
                this.planets.push(new Planet(this, true));
            }else{
                let parent = this.planets[i-1]; // 默认作为上颗星的卫星
                let flag = Math.floor(Math.random()*100);
                if(flag >= 95 && parent.parent === undefined){
                    this.planets.push(new Planet(this, false, parent));
                }else{
                    this.planets.push(new Planet(this, false));
                }
            }
        }
        console.log("stellar "+this.name+" init");
    }

    update(){
        this.planets.forEach(element => {
            element.update();
        });
    }

    /** 获取行星 */
    getPlanet(index){
        return this.planets[index];
    }
}

/** 行星 */
class Planet{
    constructor(stellar, isfixed, parent) {
        this.stellar = stellar;
        this.name = "";
        /** 是否恒星 */
        this.isfixed = isfixed;
        /** 星球的类型0-8不同类型 */
        this.type = Math.ceil(Math.random()*8);
        /** 是否是其他星的卫星 */
        this.parent = parent;
        /** 星球储存资源 */
        this.baseRes = {};
        /** 矿点 */
        this.mine = [];
        /** 建筑物 */
        this.building = [];
        this.power_all = 0;
        this.power_load = 0;
        this.init();
    }
    
    init(){
        this.name = rndChar(2)+rndNum(4);
        for(var key in baseResObject){
            this.baseRes[key] = 0;
        }
        // 随机资源矿点5-10
        let mine_num = 5+Math.ceil(Math.random()*5);
        for(var i=0;i<mine_num;i++){
            let name = Sample(baseRes_lv1_key);
            // 数量级 6-9次方
            let d = 5+Math.ceil(Math.random()*3);
            this.mine.push(new Mine(name,d));
        }
        console.log("plannet "+this.name+" init");
    }
    /** 显示储存的资源 */
    showRes(){
        let d = {};
        for(var key in this.baseRes){
            if(this.baseRes[key]>0) d[key] = simNumber(Math.floor(this.baseRes[key]));
        }
        return d;
    }
    /** 剩余可开采资源 */
    remainRes(){
        let d = {};
        for(var ele of this.mine){
            let key = ele.name;
            if(d[key]) d[key] += ele.curNum;
            else d[key] = 0;
        }
        return d;
    }
    getPowerLoad(){
        return simNumber(this.power_load);
    }
    getPowerAll(){
        return simNumber(this.power_all);
    }
    /** 电量负荷百分比 */
    getPowerRate(){
        let d = 0;
        if(this.power_all != 0) d = this.power_load/this.power_all*100;
        // let d = Math.min(this.power_load/this.power_all,1)*100;
        return d.toFixed(2);
    }
    /** 更新发电量 */
    updatePower(){
        let powerload = 0;
        let powerall = 0;
        for(var ele of this.building){
            // console.log(ele);
            if(ele.type == 2){
                let out = ele.power;
                // 发电设施
                if(ele.powertype >= 2){
                    // 需要燃料
                    if(!ele.fuel) out = 0;
                    if(ele.restheat <= 0) out = 0;
                    // else if(this.baseRes[ele.fuel] == 0) out = 0;
                }
                powerall += out;
            }else{
                // 其他设施消耗电量
                if(ele.type == 1){
                    ele.loadpower = (this.checkResFull(ele)||this.checkMineEmpty(ele)) ? ele.idlepower : ele.power;
                }
                else if(ele.type == 3){
                    ele.loadpower = ele.recipe && !this.checkMachineEmpty(ele) && !this.checkMachineFull(ele) ? ele.power : ele.idlepower;
                }
                else if(ele.type == 4){
                    ele.loadpower = player.curTech && !this.checkTechEmpty() ? ele.power : ele.idlepower;
                }
                powerload += -ele.loadpower;
            }
        }
        for(var ele of this.mine){
            powerload += -ele.power;
        }
        this.power_all = powerall;
        this.power_load = powerload;
    }

    /** 增加新的建筑 */
    Build(index){
        let type = buildingObject[index].type;
        if(type == 2) this.building.push(new PowerPlant(index));
        else if(type == 4) this.building.push(new TechCenter(index));
        else this.building.push(new Machine(index));
    }

    removeBuild(index){
        this.building.splice(index,1);
        // TODO:返还inputs等
    }

    /** 检测电力状态 */
    checkPower(){
        return this.power_load > this.power_all;
    }
    checkMinerEmpty(mine){
        return mine.curNum == 0;
    }
    checkMinerFull(mine){
        let name = mine.name;
        return this.baseRes[name] >= 1000;
    }
    /** 检测合成缺料 */
    checkMachineEmpty(machine){
        if(!machine.recipe) return false;
        for(var ele of machine.recipe.inputs){
            if(this.baseRes[ele.id]<1) return true;
        }
        return false;
    }
    checkMachineFull(machine){
        if(!machine.recipe) return false;
        for(var ele of machine.recipe.outputs){
            if(this.baseRes[ele.id]>1000) return true;
        }
        return false;
    }
    checkTechEmpty(){
        if(!player.curTech) return false;
        for(var key of player.curTech.inputs){
            if(this.baseRes[key]<1) return true;
        }
        return false;
    }
    /** 检测发电站原料 */
    checkPlantEmpty(plant){
        if(plant.fuel) return this.baseRes[plant.fuel] < 1;
        return true;
    }
    update(){
        if(this.building.length == 0 && this.mine.filter((x)=>x.isAuto).length == 0) return;
        this.updatePower();
        let powerrate = 0;
        if(this.power_load > 0) powerrate = Math.min(this.power_all/this.power_load,1);
        // 循环矿产产出
        for(var ele of this.mine){
            let key = ele.name;
            if(ele.isAuto) this.baseRes[key] += ele.realProduct(powerrate);
        }
        // 循环资源消耗
        for(var ele of this.building){
            if(ele.type == 1){
                this.genpower(ele);
            }else if(ele.type == 3){
                this.consume(ele, powerrate);
            }else if(ele.type == 4){
                if(player.curTech && !player.curTech.useBag) this.tech(powerrate);
            }
        }
    }

    genpower(ele){
        // TODO: 动态计算负载和燃料热值
        if(ele.powertype >= 2){
            console.log(ele.fuel + ele.restheat);
            if(ele.restheat <= 0){
                this.baseRes[ele.fuel] -= 1;
                ele.restheat = baseResObject[ele.fuel].heat;
            }else{
                ele.restheat -= ele.power;
            }
        }
    }

    consume(ele,powerrate){
        let recipe = ele.recipe;
        if(recipe && !this.checkMachineEmpty(ele) && !this.checkMachineFull(ele)){
            if(ele.t < recipe.time){
                // 积累时间
                ele.t += 1*powerrate;
                return;
            }
            ele.t = 0;
            // 产物消耗
            for(var ele of recipe.inputs){
                this.baseRes[ele.id] -= ele.num;
            }
            // 产出增加
            for(var ele of recipe.outputs){
                this.baseRes[ele.id] += ele.num;
            }
        }
    }

    tech(powerrate){
        if(this.checkTechEmpty()){
            console.log('星球科技包不足');
        }
        else if(player.curTech.cur_t <= 0){
            for(var key of player.curTech.inputs){
                this.baseRes[key] -= 1;
            }
            player.curTech.cur_t = player.curTech.time;
            // 增加进度
            player.curTech.cur_hash += 1;
            if(player.curTech.cur_hash >= player.curTech.hash){
                console.log("科技完成");
                player.curTech = null;
            }
        }else{
            player.curTech.cur_t -= 1*powerrate;
        }
    }
}

/** 资源 */
class Resources{
    /**
     * 生成资源
     * @param {*} name 索引名
     */
    constructor(name) {
        let obj = baseResObject[name];
        /** 名字，用于索引 */
        this.name = name;
        /** 是否为基础资源 */
        this.isBasic = obj.type==0;
        /** 是否为稀有资源 */
        this.isRare = obj.type==1;
        /** 是否为合成产物 */
        this.isCompound = obj.type==2;
        /** 热值（大于0则可作燃料） */
        this.heat = obj.heat;
    }
}


/** 矿产 */
class Mine extends Resources{
    /**
     * 生成资源
     * @param {*} name 索引名
     * @param {*} d 数量级
     */
    constructor(name,d) {        
        super(name);
        let obj = baseResObject[name];
        /** 剩余数目 */
        this.curNum = Math.ceil(Math.random()*(10**d));
        /** 自动采集所需机器类型 0不可自动采集 1采矿 2抽水*/
        //这个我觉得可以通过machine设置，比如某个machine支持采集铁、铜、等等
        this.mineType = obj.minetype;
        // 默认一致
        this.power = 0;
        /** 是否已经在自动采集 0无 1以上为采矿机数*/
        //应当像进化一样按采矿机数目来，例如几个木匠常、几个采石场
        this.isAuto = 0;
        /** 默认采集速度 */
        this.mineSpd = 1;
    }
    /** 真实产出 */
    realProduct(rate){
        // console.log(rate);
        let out = this.mineSpd * rate;
        if(this.curNum < this.mineSpd){
            out = this.curNum;            
        }
        this.curNum -= out;
        return out;
    }
}

/** 配方 */
class Recipe{
    constructor(tag, inputs, outputs, time){
        /** 名称标记，暂时用于识别 */
        this.tag = tag;
        /** 输入产物字典数组 */
        this.inputs = dd.inputs;
        /** 输出产物字典数组 */
        this.outputs = dd.outputs;
        /** 基础消耗时间 */
        this.time = dd.time;
    }
}
/** 科技 */
class Tech{
    constructor(name){
        let tech = publicTech[name];
        this.name = name;
        this.inputs = tech.inputs;
        /** 单步消耗时间 */
        this.time = tech.time;
        /** 累计时间 */
        this.cur_t = 0;
        /** 总哈希值 */
        this.hash = tech.count;
        /** 已完成部分 */
        this.cur_hash = 0;
        /** 使用背包搓 */
        this.useBag = false;
    }

    isFinish(){
        return this.cur_hash >= this.hash;
    }

    progress(){
        let t = this.cur_hash/this.hash*100;
        return t;
    }
}

/** 建筑类 */
class Building{
    constructor(name){
        console.log(name);
        let dd = buildingObject[name];
        /** 名称 */
        this.name = name;
        /** 建筑类型 */
        this.type = dd.type;
        /** 是否能升级 */
        this.update = dd.update;
        /** 消耗/生产额定功率，生产为正，消耗为负 */
        this.power = dd.power;
        /** 待机功率，为负，表示消耗 */
        this.idlepower = dd.idlepower;
        /** 实际电量 */
        this.loadpower = this.idlepower;
    }

    isIdle(){
        if (this.type == Types.Build.PowerPlant) return false;
        return this.loadpower == this.idlepower;
    }
}

/** 生产机器 */
class Machine extends Building{
    constructor(name){
        super(name);
        let dd = buildingObject[name];
        /** 支持的配方 */
        this.machinetype = dd.machinetype;
        /** 当前运行配方 */
        this.recipe;
        /** 距离上次生产的时间 */
        this.t = 0;
    }

    setRecipe(recipe){
        console.log("配方已设置");
        this.recipe = recipe;
        this.t = 0;
    }

    progress(){
        let t = this.t/this.recipe.time*100;
        return t.toFixed(2);
    }
}

/** 电力设施 */
class PowerPlant extends Building{
    constructor(name) {
        super(name);
        let dd = buildingObject[name];
        /** 发电类型 0风 1太阳 2火 3核*/
        this.powertype = dd.powertype;
        /** 使用的燃料 */
        this.fuel = undefined;
        /** 剩余热值 */
        this.restheat = 0;
    }

    setFuel(fuel){
        console.log("燃料已设置");
        this.fuel = fuel;
    }

    progress(){
        let t = this.restheat/baseResObject[this.fuel].heat*100;
        return t.toFixed(2);
    }
}

class TechCenter extends Building{
    constructor(name) {
        super(name);
    }
}


/** 科技 */
class Technology{
    constructor(name, recipes, machines, modifiers)
    {
        /** 名称 */
        this.name = name;
        /** 解锁研究配方 */
        this.recipes = recipes;
        /** 解锁机器 */
        this.machines = machines;
        /** 研发后增加的修正buff */
        this.modifiers = modifiers;
    }
}

/** Buff类 */
class Modifier{
    constructor(name)
    {
        /** 名称 */
        this.name = name;
    }

    // interface
    ApplyToUniverse()
    {

    }

    ApplyToStellar()
    {

    }

    ApplyToPlanet()
    {

    }
}