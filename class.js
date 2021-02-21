class Player {
    constructor() {
        /** 背包 */
        this.bag = {};
        /** 所处星球 */
        this.curPlanet;
        /** 已经研究的科技 */
        this.tech = {};
        /** 已经解锁的配方 */
        this.recipes = {};

        /** 当前正在研究的科技队列 */
        this.curTech = [];
        /** 正在手搓的配方队列 */
        this.curRecipe = [];
        /** 燃烧仓库 */
        this.curFuel = [];

        /** 手动研究效率 */
        this.hashSpeed = 100;
        /** 能量 */
        this.energyTotal = 1e8;
        this.energy = 0;
        /** 燃烧效率 */
        this.fuelEfficiency = 1e6;
        this.researchOn = true;
        this.init();
    }

    init() {
        for (var key in baseResObject) {
            if (baseResObject[key].type == Types.ResourceType.Basic) {
                this.bag[key] = 10;
            } else {
                this.bag[key] = 10;
            }
        }
        for (var key in buildingObject) {
            this.bag[key] = 1;
        }
        for (var key in publicTech) {
            this.tech[key] = new Tech(key);
        }
        for (var key of initialRecipe) {
            this.recipes[key] = 1;
        }
        console.log("player init");
    }

    showBag() {
        let d = {};
        for (var key in this.bag) {
            if (this.bag[key] > 0) {
                d[key] = this.bag[key];
            }
        }
        return d;
    }
    hasItem(name) {
        return this.bag[name] > 0;
    }

    showTech() {
        let d = [];
        for (var key in publicTech) {
            if (this.tech[key].isFinish()) continue;
            // 已在等待队列则不显示
            if (this.isTechQueue(key)) continue;
            d.push(key);
        }
        return d;
    }
    /** 科技是否在队列中 */
    isTechQueue(key){
        for(var tech of this.curTech){
            if(tech.name == key) return true;
        }
        return false;
    }
    /** 科技是否已开启 */
    isTechOn(name) {
        let prev = publicTech[name].prev;
        if (!prev) return true;
        return this.tech[prev].isFinish();
    }
    getTechName(){
        if(this.curTech[0] === undefined) return "";
        return this.curTech[0].name;
    }
    /** 当前的进度 */
    getTechProgress() {
        if (this.curTech[0] === undefined) return 0;
        return this.curTech[0].progress().toFixed(2);
    }
    /** 开始研究 */
    addTech(name) {
        console.log("已开启科技" + name);
        this.curTech.push(this.tech[name]);
    }
    /** 暂停研究 */pause
    pauseTech() {
        this.researchOn = !this.researchOn;
        console.log(this.researchOn?"已继续":"已暂停");
    }
    /** 取消研究 */
    cancelTech(i){
        let tech = this.curTech[i];
        console.log("已取消科技" + tech.name);
        this.curTech.splice(i,1);
    }

    addFuel(name,num){
        for(var i=0;i<num;i++) this.curFuel.push(new Fuel(name));
    }
    showFuel(){
        let t = this.energy / this.energyTotal * 100;
        return t.toFixed(2);
    }

    Mine(resource) {
        if (resource.curNum > 0) {
            let key = resource.name;
            this.bag[key] += 1;
            resource.curNum -= 1;
        }
    }

    /**
     * 搓东西供ui调用
     * @param {string} item 道具名
     */
    CraftItem(item) {
        var recipelist = item2recipe[item];
        if (recipelist == undefined || recipelist.length <= 0) alert("没有对应的配方无法合成");
        for (var recipe of recipelist) {
            if (publicRecipe[recipe].type == Types.Recipe.CanHandmade) break;
        }
        // 我们约定每种物品最多一种手搓方案
        this.Craft(recipe);
    }

    /**
     * 按照配方搓
     * @param {string} name 配方名
     */
    Craft(name) {
        var locked = {};
        var extragen = {};
        var queue = [];
        let recipe = new Recipe(name);
        // 附上时间戳
        let echo = new Date().getTime();
        recipe.echo = echo;
        recipe.num = 1;
        var res = this.CraftRecipe2(recipe, locked, queue, echo, extragen);
        if (res) {
            console.log("comsume:", locked);
            console.log("extra generate:", extragen);
            console.log("queue:", queue);
            // console.log("echo:", echo);
            // 预先消耗资源
            for (var key in locked) {
                this.bag[key] -= locked[key];
            }
            // 加入等待队列
            this.curRecipe = this.curRecipe.concat(queue);
        } else {
            console.log(name, "无法合成，请检查是否先通过了CanCraft的check。");
        }
    }

    /**
     * 递归搓东西
     * @param {string} item 物品
     * @param {Number} num 数量
     * @param {Object} locked 目前已消耗的总资源
     * @param {Array} queue 合成队列
     * @param {string} echo 队列标识
     * @param {Object} extralock 本次合成锁定的现成物品数
     * @param {Object} extragen 累计额外合成的物品
     */
    CraftItem2(item, num, locked, queue, echo, extralock, extragen) {
        var bagnum = 0;
        //剩余可用数目
        if (this.bag[item] > 0) {
            bagnum = this.bag[item];
            if (locked[item] > 0)
                bagnum -= locked[item];
            if (extragen[item] > 0)
                bagnum += extragen[item];
        }
        if (bagnum >= num) {
            if (locked[item] == undefined)
                locked[item] = num;
            else
                locked[item] += num;
            extralock[item] = num;
            return true;
        }
        //还需要手搓num个
        if (bagnum > 0) {
            num -= bagnum;
            if (locked[item] == undefined)
                locked[item] = bagnum;
            else
                locked[item] += bagnum;
            extralock[item] = bagnum;
        }
        // 获取合成该物体的配方（仅有一种途径）
        var re = item2recipe[item];
        if (re == undefined || re.length <= 0)
            return false;
        for (var recipe of re) {
            if (publicRecipe[recipe].type == Types.Recipe.CannotHandmade)
                continue;
            //我们约定每种物品最多一种手搓方案
            var op = publicRecipe[recipe].outputs;
            var numperrecipe = 1;
            for (var i = 0; i < op.length; i++) {
                if (op[i].id == item)
                    numperrecipe = op[i].num;
            }
            var num2 = Math.ceil(num / numperrecipe);
            let subrecipe = new Recipe(recipe);
            subrecipe.echo = echo;
            subrecipe.num = num2;
            if (this.CraftRecipe2(subrecipe, locked, queue, echo, extragen)) {
                for (var i = 0; i < op.length; i++) {
                    if (extragen[op[i].id] == undefined)
                        extragen[op[i].id] = op[i].num * num2;
                    else
                        extragen[op[i].id] += op[i].num * num2;
                }
                extragen[item] -= num;
                return true;
            } else
                return false;
        }
        return false;
    }

    /**
     * 递归制作配方的原料
     * @param {Recipte} recipe 配方类
     * @param {Object} locked 目前已消耗的总资源
     * @param {Array} queue 队列
     * @param {string} echo 标签
     * @param {Object} extragen 目前累计额外生成的总资源
     */
    CraftRecipe2(recipe, locked, queue, echo, extragen) {
        if (recipe.type == Types.Recipe.CannotHandmade)
            return false;
        var initem = recipe.inputs;
        if (initem == undefined || initem.length <= 0)
            return true;
        let num = recipe.num;
        for (var ele of initem) {
            if (!this.CraftItem2(ele.id, ele.num * num, locked, queue, echo, recipe.locked, extragen))
                return false;
        }
        queue.push(recipe);
        return true;
    }

    /**
     * 是否可以合成1个
     * @param {string} recipe
     */
    CanCraft(recipe) {
        return this.CanCraftRecipe2(recipe, 1, {});
    }

    /**
     * 是否可以合成1个
     * @param {string} item
     */
    CanCraftItem(item) {
        var re = item2recipe[item];
        if (re == undefined || re.length <= 0)
            return false;
        for (var recipe of re) {
            if (publicRecipe[recipe].type == Types.Recipe.CannotHandmade)
                continue;
            //我们约定每种物品最多一种手搓方案
            if (this.CanCraftRecipe(recipe))
                return true;
            else
                return false;
        }
        return false;
    }

    /**
     * 是否可以合成num个
     * @param {string} item
     * @param {number} num
     * @param {Object} locked 合成过程中锁定的物品
     * @param {Object} extragen 合成过程中新增的额外产物
     */
    CanCraftItem2(item, num, locked, extragen) {
        var bagnum = 0;
        //剩余可用数目
        if (this.bag[item] > 0) {
            bagnum = this.bag[item];
            if (locked[item] > 0)
                bagnum -= locked[item];
            if (extragen[item] > 0)
                bagnum += extragen[item];
        }
        if (bagnum >= num) {
            if (locked[item] == undefined)
                locked[item] = num;
            else
                locked[item] += num;
            return true;
        }
        //还需要手搓num个
        if (bagnum > 0) {
            num -= bagnum;
            if (locked[item] == undefined)
                locked[item] = bagnum;
            else
                locked[item] += bagnum;
        }
        var re = item2recipe[item];
        if (re == undefined || re.length <= 0)
            return false;
        for (var recipe of re) {
            if (publicRecipe[recipe].type == Types.Recipe.CannotHandmade)
                continue;
            //我们约定每种物品最多一种手搓方案
            var op = publicRecipe[recipe].outputs;
            var numperrecipe = 1;
            for (var i = 0; i < op.length; i++) {
                if (op[i].id == item)
                    numperrecipe = op[i].num;
            }
            var num2 = Math.ceil(num / numperrecipe);
            if (this.CanCraftRecipe2(publicRecipe[recipe], num2, locked, extragen)) {
                for (var i = 0; i < op.length; i++) {
                    if (extragen[op[i].id] == undefined)
                        extragen[op[i].id] = op[i].num * num2;
                    else
                        extragen[op[i].id] += op[i].num * num2;
                }
                extragen[item] -= num;
                return true;
            } else
                return false;
        }
        return false;
    }

    /**
     * recipe: object
     * @param {*} recipe 
     * @param {*} num 
     * @param {*} locked 
     */
    CanCraftRecipe2(recipe, num, locked, extragen) {
        if (recipe.type == Types.Recipe.CannotHandmade)
            return false;
        var initem = recipe.inputs;
        if (initem == undefined || initem.length <= 0)
            return true;
        for (var ele of initem) {
            if (!this.CanCraftItem2(ele.id, ele.num * num, locked, extragen))
                return false;
        }
        return true;
    }

    CancelRecipe(recipe) {
        let echo = recipe.echo;
        let start = -1;
        console.log("当前", this.curRecipe);
        for (var index in this.curRecipe) {
            if (start == -1) {
                if (this.curRecipe[index].echo == echo) start = index;
            } else if (this.curRecipe[index].echo != echo) break;
        }
        console.log("取消配方", echo, start, index);
        for (var ele of this.curRecipe.splice(start, index - start + 1)) {
            // 遍历返还资源
            for (var item in ele.locked) {
                this.bag[item] += ele.locked[item];
                console.log("return back", item, ele.locked[item]);
            }
        }
        console.log("取消后", this.curRecipe);
    }

    SetMiner(resource) {
        let resname = resource.name;
        let key = baseResObject[resname].minetype;
        let item = miner_key[key - 1];
        if (this.bag[item] > 0) {
            console.log("已设置" + item);
            resource.isAuto += 1;
            // 负数代表消耗
            resource.power = buildingObject[item].power;
            this.bag[item] -= 1;
        } else {
            alert(item + " not enough!");
        }
    }

    RemoveMiner(resource) {
        let resname = resource.name;
        let key = baseResObject[resname].minetype;
        let item = miner_key[key - 1];
        console.log("已移除" + item);
        resource.isAuto -= 1;
        // resource.power = 0;
        this.bag[item] += 1;
    }

    checkTechEmpty(tech) {
        for (var key of tech.inputs) {
            if (this.bag[key] == 0) return true;
        }
        return false;
    }

    addEnergy(heat){
        this.energy += heat;
        this.energy = Math.min(this.energyTotal,this.energy);
    }

    update() {
        // console.log("player update");
        // 科技更新
        if (this.researchOn && this.curTech[0] && this.curTech[0].useBag) {
            if (this.checkTechEmpty(this.curTech[0])) {
                console.log('bag empty');
            } else if (this.curTech[0].cur_t <= 0) {
                // 先消耗瓶子
                for (var key of this.curTech[0].inputs) {
                    this.bag[key] -= 1;
                }
                this.curTech[0].cur_t = this.curTech[0].time;
                // 增加
                this.curTech[0].cur_hash += 1;
                if (this.curTech[0].cur_hash == this.curTech[0].hash) {
                    console.log("科技完成");
                    this.curTech.pop(0);
                }
            } else {
                console.log(this.curTech[0].cur_t);
                this.curTech[0].cur_t -= 1;
            }
        }
        // 燃烧仓库
        if(this.curFuel[0]){
            let fuel = this.curFuel[0];
            if(fuel.curHeat <= 0) this.curFuel.pop(0);
            else{
                let delta = Math.min(fuel.curHeat,this.fuelEfficiency);
                fuel.curHeat -= delta;
                this.addEnergy(delta);
            }
        }
        // 更新合成队列
        if (this.curRecipe) {
            let recipe = this.curRecipe[0];
            if (!recipe) return;
            if (recipe.isFinish()) {
                for (var ele of recipe.inputs) {
                    var num = ele.num;
                    if (ele.id in recipe.locked) {
                        num -= recipe.locked[ele.id];
                        if (num >= 0)
                            recipe.locked[ele.id] = 0;
                        else {
                            recipe.locked[ele.id] -= ele.num;
                            num = 0;
                        }
                    }
                    //这里应该是有的，否则不正常
                    this.bag[ele.id] -= num;
                }
                for (var ele of recipe.outputs) {
                    if (ele.id in this.bag)
                        this.bag[ele.id] += ele.num;
                    else
                        this.bag[ele.id] = ele.num;
                }
                recipe.num -= 1;
                if (recipe.num <= 0)
                    this.curRecipe.shift();
            } else recipe.t += 1;
        }
    }
}

/** 宇宙 */
class Universe {
    constructor(stellar_num) {
        this.stellars = [];
        // 恒星系数目
        for (var i = 0; i < stellar_num; i++) {
            this.stellars.push(new Stellar());
        }
    }

    update() {
        this.stellars.forEach(element => {
            element.update();
        })
    }
    /** 获取恒星系 */
    getStellar(index) {
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

    init() {
        // 随机星系名
        this.name = rndChar(2);
        // TODO：双星系统

        // 随机生成1-5颗行星
        let star_num = Math.ceil(Math.random() * 5);
        for (var i = 0; i < star_num; i++) {
            if (i == 0) {
                this.planets.push(new Planet(this, true));
            } else {
                let parent = this.planets[i - 1]; // 默认作为上颗星的卫星
                let flag = Math.floor(Math.random() * 100);
                if (flag >= 95 && parent.parent === undefined) {
                    this.planets.push(new Planet(this, false, parent));
                } else {
                    this.planets.push(new Planet(this, false));
                }
            }
        }
        console.log("stellar " + this.name + " init");
    }

    update() {
        this.planets.forEach(element => {
            element.update();
        });
    }

    /** 获取行星 */
    getPlanet(index) {
        return this.planets[index];
    }
}

/** 行星 */
class Planet {
    constructor(stellar, isfixed, parent) {
        this.stellar = stellar;
        this.name = "";
        /** 是否恒星 */
        this.isfixed = isfixed;
        /** 星球的类型0-8不同类型 */
        this.type = Math.ceil(Math.random() * 8);
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

    init() {
        this.name = rndChar(2) + rndNum(4);
        for (var key in baseResObject) {
            this.baseRes[key] = 0;
        }
        // 固定铁铜矿煤矿
        for (var i = 0; i < 5; i++) {
            let name = baseRes_lv1_key[i];
            // 数量级 7次方
            this.mine.push(new Mine(name, 7));
        }
        // 随机资源矿点0-5个
        let mine_num = Math.ceil(Math.random() * 5);
        for (var i = 0; i < mine_num; i++) {
            let name = Sample(baseRes_lv1_key);
            // 数量级 6-9次方
            let d = 5 + Math.ceil(Math.random() * 3);
            this.mine.push(new Mine(name, d));
        }
        console.log("plannet " + this.name + " init");
    }
    /** 显示储存的资源 */
    showRes() {
        let d = {};
        for (var key in this.baseRes) {
            if (this.baseRes[key] > 0) d[key] = simNumber(Math.floor(this.baseRes[key]));
        }
        return d;
    }
    /** 剩余可开采资源 */
    remainRes() {
        let d = {};
        for (var ele of this.mine) {
            let key = ele.name;
            if (d[key]) d[key] += ele.curNum;
            else d[key] = 0;
        }
        return d;
    }
    getPowerLoad() {
        return simNumber(this.power_load);
    }
    getPowerAll() {
        return simNumber(this.power_all);
    }
    /** 电量负荷百分比 */
    getPowerRate() {
        let d = 0;
        if (this.power_all != 0) d = this.power_load / this.power_all * 100;
        // let d = Math.min(this.power_load/this.power_all,1)*100;
        return d.toFixed(2);
    }
    /** 更新发电量 */
    updatePower() {
        let powerload = 0;
        let powerall = 0;
        for (var ele of this.building) {
            // console.log(ele);
            if (ele.type == Types.Build.PowerPlant) {
                let out = ele.power;
                // 发电设施
                if (ele.powertype >= 2) {
                    // 需要燃料
                    if (!ele.fuel) out = 0;
                    if (ele.restheat <= 0) out = 0;
                    // else if(this.baseRes[ele.fuel] == 0) out = 0;
                }
                powerall += out;
            } else {
                // 其他设施消耗电量
                if (ele.type == Types.Build.PowerPlant) {
                    ele.loadpower = (this.checkResFull(ele) || this.checkMineEmpty(ele)) ? ele.idlepower : ele.power;
                } else if (ele.type == Types.Build.Facotry) {
                    ele.loadpower = ele.recipe && !this.checkMachineEmpty(ele) && !this.checkMachineFull(ele) ? ele.power : ele.idlepower;
                } else if (ele.type == Types.Build.Tech) {
                    ele.loadpower = player.researchOn && player.curTech[0] && !this.checkTechEmpty() ? ele.power : ele.idlepower;
                }
                powerload += -ele.loadpower;
            }
        }
        for (var ele of this.mine) {
            powerload += -ele.power;
        }
        this.power_all = powerall;
        this.power_load = powerload;
    }

    /** 增加新的建筑 */
    Build(index) {
        let type = buildingObject[index].type;
        if (type == 2) this.building.push(new PowerPlant(index));
        else if (type == 4) this.building.push(new TechCenter(index));
        else this.building.push(new Machine(index));
    }

    removeBuild(index) {
        this.building.splice(index, 1);
        // TODO:返还inputs等
    }

    /** 检测电力状态 */
    checkPower() {
        return this.power_load > this.power_all;
    }
    checkMinerEmpty(mine) {
        return mine.curNum == 0;
    }
    checkMinerFull(mine) {
        let name = mine.name;
        return this.baseRes[name] >= 1000;
    }
    /** 检测合成缺料 */
    checkMachineEmpty(machine) {
        if (!machine.recipe) return false;
        for (var ele of machine.recipe.inputs) {
            if (this.baseRes[ele.id] < 1) return true;
        }
        return false;
    }
    checkMachineFull(machine) {
        if (!machine.recipe) return false;
        for (var ele of machine.recipe.outputs) {
            if (this.baseRes[ele.id] > 1000) return true;
        }
        return false;
    }
    checkTechEmpty() {
        if(player.curTech[0]) return player.checkTechEmpty();
        return false;
    }
    /** 检测发电站原料 */
    checkPlantEmpty(plant) {
        if (plant.fuel) return this.baseRes[plant.fuel] < 1;
        return true;
    }
    update() {
        if (this.building.length == 0 && this.mine.filter((x) => x.isAuto).length == 0) return;
        this.updatePower();
        let powerrate = 0;
        if (this.power_load > 0) powerrate = Math.min(this.power_all / this.power_load, 1);
        // 循环矿产产出
        for (var ele of this.mine) {
            let key = ele.name;
            if (ele.isAuto) this.baseRes[key] += ele.realProduct(powerrate);
        }
        // 循环资源消耗
        for (var ele of this.building) {
            // console.log(ele);
            if (ele.type == 2) {
                this.genpower(ele);
            } else if (ele.type == 3) {
                this.consume(ele, powerrate);
            } else if (ele.type == 4) {
                if (player.curTech && !player.curTech.useBag) this.tech(powerrate);
            }
        }
    }

    genpower(ele) {
        // TODO: 动态计算负载和燃料热值
        if (ele.powertype >= 2) {
            if(ele.fuelname === undefined || this.baseRes[ele.fuelname]==0) return;
            if(ele.fuel === undefined || ele.fuel.curHeat <= 0){
                // 添加一个新的
                console.log("添加", ele.fuelname);
                this.baseRes[ele.fuelname] -= 1;
                ele.fuel = new Fuel(ele.fuelname);
            }
            else{
                let delta = Math.min(ele.fuel.curHeat, ele.power);
                ele.fuel.curHeat -= delta;
            }
        }
    }

    consume(ele, powerrate) {
        let recipe = ele.recipe;
        if (recipe && !this.checkMachineEmpty(ele) && !this.checkMachineFull(ele)) {
            if (recipe.t < recipe.time) {
                // 积累时间
                recipe.t += 1 * ele.efficiency * powerrate;
                return;
            }
            // 完成配方
            recipe.t = 0;
            // 产物消耗
            for (var ele of recipe.inputs) {
                this.baseRes[ele.id] -= ele.num;
            }
            // 产出增加
            for (var ele of recipe.outputs) {
                this.baseRes[ele.id] += ele.num;
            }
        }
    }

    tech(powerrate) {
        if (this.checkTechEmpty()) {
            console.log('星球科技包不足');
        } else if (player.curTech.cur_t <= 0) {
            for (var key of player.curTech.inputs) {
                this.baseRes[key] -= 1;
            }
            player.curTech.cur_t = player.curTech.time;
            // 增加进度
            player.curTech.cur_hash += 1;
            if (player.curTech.cur_hash >= player.curTech.hash) {
                console.log("科技完成");
                player.curTech = null;
            }
        } else {
            player.curTech.cur_t -= 1 * powerrate;
        }
    }
}

/** 资源 */
class Resources {
    /**
     * 生成资源
     * @param {*} name 索引名
     */
    constructor(name) {
        let obj = baseResObject[name];
        /** 名字，用于索引 */
        this.name = name;
        /** 是否为基础资源 */
        this.isBasic = obj.type == 0;
        /** 是否为稀有资源 */
        this.isRare = obj.type == 1;
        /** 是否为合成产物 */
        this.isCompound = obj.type == 2;
        /** 热值（大于0则可作燃料） */
        this.heat = obj.heat;
    }
}


/** 矿产 */
class Mine extends Resources {
    /**
     * 生成资源
     * @param {*} name 索引名
     * @param {*} d 数量级
     */
    constructor(name, d) {
        super(name);
        let obj = baseResObject[name];
        /** 剩余数目 */
        this.curNum = Math.ceil(Math.random() * (10 ** d));
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
    realProduct(rate) {
        // console.log(rate);
        let out = this.mineSpd * rate;
        if (this.curNum < this.mineSpd) {
            out = this.curNum;
        }
        this.curNum -= out;
        return out;
    }
}

class Fuel extends Resources {
    constructor(name){
        super(name);
        // 当前剩余热值
        this.curHeat = this.heat;
    }
    progress(){
        let t = this.curHeat/this.heat*100;
        return t.toFixed(2);
    }
}

/** 配方 */
class Recipe {
    constructor(name) {
        let dd = publicRecipe[name];
        if (!dd) console.log(name);
        /** 名称标记，暂时用于识别 */
        this.tag = name;
        /** 输入产物字典数组 */
        this.inputs = dd.inputs;
        /** 输出产物字典数组 */
        this.outputs = dd.outputs;
        /** 基础消耗时间 */
        this.time = dd.time;
        /** 制作数量 */
        this.num = 0;
        /** 制作标记 */
        this.echo;
        /** 进度 */
        this.t = 0;
        /** 锁定的背包物品，这是对于合成num个recipe总的而言的 */
        this.locked = {};
    }

    isFinish() {
        return this.t >= this.time;
    }

    progress(p = 100) {
        let t = this.t / this.time * p;
        return t.toFixed(2);
    }
}
/** 科技 */
class Tech {
    constructor(name) {
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

    isFinish() {
        return this.cur_hash >= this.hash;
    }

    progress() {
        let t = this.cur_hash / this.hash * 100;
        return t;
    }
}

/** 建筑类 */
class Building {
    constructor(name) {
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

    isIdle() {
        if (this.type == Types.Build.PowerPlant) return false;
        return this.loadpower == this.idlepower;
    }
}

/** 生产机器 */
class Machine extends Building {
    constructor(name) {
        super(name);
        let dd = buildingObject[name];
        /** 支持的配方 */
        this.machinetype = dd.machinetype;
        /** 基础生产效率 */
        this.efficiency = dd.speed;
        /** 当前运行配方 */
        this.recipe;
        /** 距离上次生产的时间 */
        // this.t = 0;
    }

    setRecipe(name) {
        console.log("配方已设置");
        this.recipe = new Recipe(name);
    }

    progress() {
        if (!this.recipe) return 0;
        return this.recipe.progress();
    }
}

/** 电力设施 */
class PowerPlant extends Building {
    constructor(name) {
        super(name);
        let dd = buildingObject[name];
        /** 发电类型 0风 1太阳 2火 3核*/
        this.powertype = dd.powertype;
        /** 使用的燃料 */
        this.fuelname = undefined;        
        this.fuel = undefined;

        /** 燃烧效率 */
        this.fuelEfficiency = 1e6;
    }

    setFuel(name) {
        console.log("已设置目标燃料",name);
        this.fuelname = name;
    }

    progress() {
        if(this.fuel) return this.fuel.progress();
        return 0;
    }
}

class TechCenter extends Building {
    constructor(name) {
        super(name);
    }
}


/** 科技 */
class Technology {
    constructor(name, recipes, machines, modifiers) {
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
class Modifier {
    constructor(name) {
        /** 名称 */
        this.name = name;
    }

    // interface
    ApplyToUniverse() {

    }

    ApplyToStellar() {

    }

    ApplyToPlanet() {

    }
}