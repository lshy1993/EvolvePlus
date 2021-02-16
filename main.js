var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    baseRes_lv1_key,
    baseRes_lv2_key,
    opttype: 1,
    hiddentop: false,
    universe,
    player,
    curStellar: undefined,
    curPlanet: undefined,
    stellar_k: 0,
    planet_k: 0,    
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
    mainLoop(){
      universe.update();
    }
  }
})
