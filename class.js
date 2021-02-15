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
        this.planets = [];
        // 随机生成行星含恒
        let star_num = Math.floor(Math.random()*5);
        for(var i=0;i<star_num;i++){
            this.planets.push(new Planet());
        }
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
    constructor() {
        this.name = "ddd";
        /**星球的资源 */
        this.baseRes = {};
        /** 剩余可开采资源 */
        this.remainRes = {};
        // 资源增长率
        this.init();
    }
    
    init(){
        console.log("plannet init");
        for(var key of baseRes_lv1_key){
            this.baseRes[key] = 0;
        }
        for(var key of baseRes_lv2_key){
            this.baseRes[key] = 0;
        }
    }

    update(){
        // 循环矿产产出
        // 循环资源
        for(var key in this.baseRes){
            this.baseRes[key] += Math.floor(Math.random()*10);
        }
    }

}