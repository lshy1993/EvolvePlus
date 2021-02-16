var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    // baseRes_lv1_key,
    // baseRes_lv2_key,
    showhover: false,
    opttype: 1,
    bagtype: 1,
    hiddentop: false,
    universe,
    player,
    curStellar: undefined,
    curPlanet: undefined,
    stellar_k: 0,
    planet_k: 0
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
    addBuild(name){
      // 玩家移除
      this.player.bag[name] -= 1;
      // 星球增加
      this.curPlanet.Build(name);
      this.showhover = false;
    },
    removeBuild(name,index){
      // 星球移除
      this.curPlanet.removeBuild(index);
      // 玩家增加
      this.player.bag[name] += 1;
    },
    mainLoop(){
      universe.update();
    }
  }
})
