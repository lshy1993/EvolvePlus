class Player{
    constructor(){
        this.bag = {};
        this.init();
    }

    init(){
        for(var key of baseRes_lv1_key){
            this.bag[key] = 0;
        }
        for(var key of baseRes_lv2_key){
            this.bag[key] = 0;
        }
        for(var key of building_key){
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
          console.log(key);
          this.bag[key]+=1;
          resource.curNum-=1;
        }
    }

    SetAuto(resource){
        let resname = resource.name;
        let key = baseResObject[resname].minetype;
        let item;
        if(key == 1) item="采矿机";
        if(key == 2) item="抽水机";
        if(key == 3) item="采集器";
        if( this.bag[item] > 0){
            console.log("已设置"+item);
            resource.isAuto = true;
            this.bag[item] -= 1;
        }else{
          alert(item+" not enough!");
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
        /** 星球的类型 0恒星 1-8不同类型恒心 */
        this.type = 0;
        if(!isfixed) this.type = Math.ceil(Math.random()*8);
        /** 是否是其他星的卫星 */
        this.parent = parent;
        /** 星球的资源 */
        this.baseRes = {};
        /** 剩余可开采资源 */
        // this.remainRes = {};
        /** 矿点 */
        this.mine = [];
        /** 合成台 */
        this.craft = [];
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

    showRes(){
        let d = {};
        for(var key in this.baseRes){
            if(this.baseRes[key]>0) d[key]=simNumber(this.baseRes[key]);
        }
        return d;
    }

    update(){
        // 循环矿产产出
        for(var ele of this.mine){
            let key = ele.name;
            if(ele.isAuto) this.baseRes[key] += ele.mineSpd;
        }
        // 循环资源消耗
        for(var key in this.baseRes){
            // this.baseRes[key] += Math.floor(Math.random()*10);
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
        /** 自动采集所需机器类型 0不可自动采集 1采矿 2抽水*/
        this.mineType = baseResObject[name].minetype;
        /** 剩余数目 */
        this.curNum = Math.ceil(Math.random()*(10**d));
        /** 是否已经在自动采集 */
        this.isAuto = false;
        /** 默认采集速度 */
        this.mineSpd = 1;
    }

}

/** 配方 */
class Recipe{
    constructor(tag, inputs, outputs, time)
    {
        /** 名称标记，暂时用于识别 */
        this.tag = tag;
        /** 输入产物字典 */
        this.inputs = inputs;
        /** 输出产物字典 */
        this.outputs = outputs;
        /** 基础消耗时间 */
        this.time = time;
    }
}

/** 机器 */
class Machine{
    constructor(name, recipes, power)
    {
        /** 名称 */
        this.name = name;
        /** 支持的配方 */
        this.recipes = recipes;
        /** 额定功率 */
        this.power = power;
    }
}