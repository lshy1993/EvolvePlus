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
    curMachine: undefined
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
    }
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
    setRecipe(recipe){
      if(this.showhover == 3){
        this.curMachine.setRecipe(recipe);
        this.closeHover();
      }
      else this.player.Craft(recipe);
    },
    openCraft(){
      this.showhover = 4;
    },
    mainLoop(){
      universe.update();
    }
  }
})
