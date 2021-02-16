var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    baseRes_lv1_key,
    baseRes_lv2_key,
    universe,
    curStella,
    curPlanet,
    stellar_k: 0,
    planet_k: 0
  },
  created(){
    // TODO: load
    setInterval(this.mainLoop,1000);
  },
  computed:{
    stellarName(){
      if(this.curStella) return this.curStella.name;
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
    },
    getNum(key){
      let n = this.curPlanet.baseRes[key];
      return simNumber(n);
    },
    mainLoop(){
      universe.update();
    }
  }
})
