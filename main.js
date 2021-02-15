var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    baseRes_lv1_key,
    baseRes_lv2_key,
    universe,
    stellar_k: 0,
    planet_k: 0
  },
  created(){
    // TODO: load
    setInterval(this.mainLoop,1000);
  },
  computed:{

  },
  methods:{
    getNum(key){
      let stellar = universe.getStellar(this.stellar_k);
      let star = stellar.getPlanet(this.planet_k);
      let n = star.baseRes[key];
      return simNumber(n);
    },
    mainLoop(){
      universe.update();
    }
  }
})
