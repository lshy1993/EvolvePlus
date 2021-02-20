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
    curStellar: undefined,
    curPlanet: undefined,
    stellar_k: 0,
    planet_k: 0,
    curPowerPlant: undefined,
    curMachine: undefined,
    selectRes: undefined,
    moveNum: 100,
    itemRecipeDetail: undefined
  },
  created(){
    // TODO: load
    this.movePlanet();
    setInterval(this.mainLoop,1000);
  },
  computed:{
    stellarName(){
      if(this.curStellar) return this.curStellar.name;
      else return "";
    },
    planetName(){
      if(this.curPlanet) return this.curPlanet.name;
      else return "";
    },
  },
  methods:{
    movePlanet(){
      this.curStellar = universe.getStellar(this.stellar_k);
      this.curPlanet = this.curStellar.getPlanet(this.planet_k);
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
      this.curPlanet.removeBuild(index);
      // 玩家增加
      this.player.bag[name] += 1;
    },
    openFuel(ele){
      this.showhover = 2;
      this.curPowerPlant = ele;
    },
    setFuel(index){
      this.curPowerPlant.setFuel(index);
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
      this.player.bag[key] += num;
      this.curPlanet.baseRes[key] -= num;
    },
    moveToPlanet(all){
      let key = this.selectRes;
      let num = Math.min(this.moveNum,this.player.bag[key]);
      if(all) num = this.player.bag[key];
      this.player.bag[key] -= num;
      this.curPlanet.baseRes[key] += num;
    },
    machineHint(recipe){
      if(recipe.type==Types.Recipe.CannotHandmade) return '只能在'+machine_key[recipe.place]+'合成';
      return "";
    },
    mainLoop(){
      player.update();
      universe.update();
    }
  }
})
