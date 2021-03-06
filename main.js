var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    showhover: 0,
    opttype: 1,
    bagtype: 1,
    hiddentop: false,
    universe,
    player,
    curPlanet: undefined,
    stellar_k: 0,
    planet_k: 0,
    curPowerPlant: undefined,
    curMachine: undefined,
    selectRes: undefined,
    moveNum: 1,
    itemRecipeDetail: undefined,
    selectStellar: 0,
    // selectPlanet: 0,
    t: 0,
    maxrad: 0
  },
  created(){
    // TODO: load
    this.movePlanet();
    setInterval(this.mainLoop,1000);
  },
  computed:{
    stellarName(){
      let stellar = universe.getStellar(this.stellar_k);
      if(stellar) return stellar.name;
      else return "";
    },
    planetName(){
      if(this.curPlanet) return this.curPlanet.name;
      else return "";
    },
  },
  methods:{
    movePlanet(){
      let curStellar = universe.getStellar(this.stellar_k);
      this.selectStellar = this.stellar_k;
      this.maxrad = curStellar.maxrad();
      this.curPlanet = curStellar.getPlanet(this.planet_k);
      console.log("move to planet "+this.curPlanet.name);
    },
    closeHover(){
      this.showhover = 0;
    },
    addBuild(name){
      // 玩家移除
      this.player.bag[name] -= 1;
      // 星球增加
      this.curPlanet.Build(name);
      this.closeHover();
    },
    removeBuild(name,index){
      // 星球移除
      this.curPlanet.RemoveBuild(index);
      // 玩家增加
      this.player.bag[name] += 1;
    },
    openFuel(ele){
      this.showhover = 2;
      this.curPowerPlant = ele;
    },
    setFuel(name){
      this.curPowerPlant.setFuel(name);
      this.closeHover();
    },
    openRecipe(ele){
      this.showhover = 3;
      this.curMachine = ele;
    },
    setRecipe(name){
      this.curMachine.setRecipe(name);
      this.closeHover();
    },
    setCraft(item){
      // let recipename = item2recipe[item][0];
      this.player.CraftItem(item);
    },
    openCraft(showall){
      this.showhover = showall ? 5 : 4;
    },
    getMachineRecipe(){
      let d = this.curMachine.machinetype;
      return supportRecipe[d];
    },
    addTech(name){
      this.player.addTech(name);
      this.$forceUpdate();
    },
    pauseTech(){
      this.player.pauseTech();
      this.$forceUpdate();
    },
    openRes(name){
      this.showhover = 6;
      this.selectRes = name;
    },
    moveToBag(all){
      let key = this.selectRes;
      let num = Math.min(this.moveNum,this.curPlanet.baseRes[key]);
      if(all) num = this.curPlanet.baseRes[key];
      this.player.AddStorage(key,num);
      this.curPlanet.RemoveStorage(key,num);
      console.log(key, 'move to bag', num);
      this.$forceUpdate();
    },
    moveToPlanet(all){
      let key = this.selectRes;
      let num = Math.min(this.moveNum, this.player.bag[key]);
      if(all) num = this.player.bag[key];
      this.player.RemoveStorage(key,num);
      this.curPlanet.AddStorage(key,num);
      console.log(key, 'move to planet', num);
      this.$forceUpdate();
    },
    moveAllToPlanet(){
      let dic = this.player.showBag();
      for(var key in dic){
        let num = this.player.bag[key];
        this.player.RemoveStorage(key,num);
        this.curPlanet.AddStorage(key,num);
      }
      this.$forceUpdate();
    },
    machineHint(recipe){
      if(recipe.type==Types.Recipe.CannotHandmade) return '只能在'+machine_key[recipe.place]+'合成';
      return "";
    },
    showStellar(index){
      this.selectStellar = index;
      this.t = universe.t;
      this.maxrad = universe.stellars[index].maxrad();
      console.log(this.maxrad);
    },
    mainLoop(){
      player.update();
      universe.update();
    }
  }
})
