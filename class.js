class Player{
    constructor(){
        this.bag = {};
        this.curPlanet;
        this.init();
    }

    init(){
        for(var key in baseResObject){
            this.bag[key] = 0;
        }
        for(var key in buildingObject){
            this.bag[key] = 1;
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

    Mine(resource){
        if(resource.curNum > 0){
          let key = resource.name;
          this.bag[key]+=1;
          resource.curNum-=1;
        }
    }

    SetAutoMine(resource){
        if(resource.isAuto) this.RemoveMachine(resource);
        else this.SetMachine(resource);
    }

    SetMachine(resource){
        let resname = resource.name;
        let key = baseResObject[resname].minetype;
        let item;
        if(key == 1) item="采矿机";
        if(key == 2) item="抽水机";
        if(key == 3) item="采集器";
        if(this.bag[item] > 0){
            console.log("已设置"+item);
            resource.isAuto = true;
            // 负数代表消耗
            resource.power = buildingObject[item].power;
            this.bag[item] -= 1;
        }else{
          alert(item+" not enough!");
        }
    }

    RemoveMachine(resource){
        let resname = resource.name;
        let key = baseResObject[resname].minetype;
        let item;
        if(key == 1) item="采矿机";
        if(key == 2) item="抽水机";
        if(key == 3) item="采集器";
        console.log("已移除"+item);
        resource.isAuto = false;
        resource.power = 0;
        this.bag[item] += 1;
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
        this.powerall = 0;
        this.powerload = 0;
        this.init();
    }
    
    init(){
        this.name = rndChar(2)+rndNum(4);
        for(var key of baseRes_lv1_key){
            this.baseRes[key] = 0;
        }
        for(var key of baseRes_lv2_key){
            this.baseRes[key] = 0;
        }
        // 随机资源矿点5-10
        let mine_num = 5+Math.ceil(Math.random()*5);
        for(var i=0;i<mine_num;i++){
            let name = Sample(baseRes_lv1_key);
            // 数量级 6-9次方
            let d = 5+Math.ceil(Math.random()*3);
            this.mine.push(new Resources(name,0,d));
        }
        console.log("plannet "+this.name+" init");
    }
    /** 显示储存的资源 */
    showRes(){
        let d = {};
        for(var key in this.baseRes){
            // if(this.baseRes[key]>0) 
            d[key] = simNumber(this.baseRes[key]);
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

    /** 计算耗电量*/
    getPowerRate(){
        if(this.powerall <= 0) return 0;
        let d = Math.min(this.powerall/this.powerload,1)*100;
        return d.toFixed(2);
    }

    updatePower(){
        let powerload = 0;
        let powerall = 0;
        for(var ele of this.building){
            if(ele.power > 0) powerall += ele.power;
            else powerload += -ele.power;
        }        
        for(var ele of this.mine){
            powerload += -ele.power;
        }
        this.powerall = powerall;
        this.powerload = powerload;
    }

    /** 增加新的建筑 */
    Build(index){
        this.building.push(new Machine(index));
    }

    removeBuild(index){
        this.building.splice(index);
    }

    /** 检测资源运行状态 */
    checkRes(res){
        if(this.powerload > this.powerall) return "电";
        if(res.curNum==0) return "空";
        if(this.baseRes[res.name] >= 1000)return "满";
        return "";
    }
    /** 检测建筑运行状态 */
    checkBuild(build){

    }

    update(){
        this.updatePower();
        let powerrate = this.getPowerRate();
        // 循环矿产产出
        for(var ele of this.mine){
            let key = ele.name;
            if(ele.isAuto) this.baseRes[key] += ele.realProduct(powerrate);
        }
        // 循环资源消耗
        for(var ele of this.building){
            if(ele.t<ele.time){
                // 积累时间
                ele.t += 1*powerrate;
                return;
            }
            ele.t -= ele.time;
            let recipe = ele.recipe;
            if(recipe){
                // 产物消耗
                for(var ele of recipe.inputs){
                    this.baseRes[ele.name] -= ele.num;
                }
                // 产出增加
                for(var key in recipe.outputs){
                    this.baseRes[ele.name] += ele.num;
                }
            }
        }
    }

}

/** 资源 */
class Resources{
    /**
     * 生成资源
     * @param {*} name 索引名
     * @param {*} type 类型 0基础 1珍惜 2合成
     * @param {*} d 数量级
     */
    constructor(name, type, d) {
        /** 名字，用于索引 */
        this.name = name;
        /** 是否为基础资源 */
        this.isBasic = type==0;
        /** 是否为稀有资源 */
        this.isRare = type==1;
        /** 是否为合成产物 */
        this.isCompound = type==2;
        /** 剩余数目 */
        this.curNum = Math.ceil(Math.random()*(10**d));
        /** 自动采集所需机器类型 0不可自动采集 1采矿 2抽水*/
        this.mineType = baseResObject[name].minetype;
        /** 是否已经在自动采集 */
        this.isAuto = false;
        /** 自动采集电量需求 */
        this.power = 0;
        /** 默认采集速度 */
        this.mineSpd = 1;
    }
    /** 真实产出 */
    realProduct(rate){
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
    constructor(tag, inputs, outputs, time)
    {  
        /** 名称标记，暂时用于识别 */
        this.tag = tag;
        /** 输入产物字典 */
        this.inputs = dd.inputs;
        /** 输出产物字典 */
        this.outputs = dd.outputs;
        /** 基础消耗时间 */
        this.time = dd.time;
        /** 距离上次生产的时间 */
        this.t = 0;
    }
}

/** 建筑类机器 */
class Machine{
    constructor(name)
    {
        let dd = buildingObject[name];
        /** 名称 */
        this.name = name;
        /** 建筑类型 */
        this.type = dd.type;
        /** 额定功率 */
        this.power = dd.power;
        /** 是否能升级 */
        this.update = dd.update;
        /** 支持的配方 */
        this.support_recipes = dd.recipes;
        /** 当前运行配方 */
        this.recipe;
    }
}