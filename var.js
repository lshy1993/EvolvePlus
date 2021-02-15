var baseRes_lv1_key = ["木材","煤","铁","铜","石头","水","原油","氢气","可燃冰","硅矿","铀","氘","硫","钛","氦"];
var baseRes_lv2_key = ["铁锭","铜锭","石材","钢","钛锭","硫酸","精炼油","蜂窝煤","电路板","电池","硅片","cpu"];


function simNumber(x){
    let d = Math.log10(x);
    if (d >= 9) return (x/(10**9)).toFixed(1)+"G";
    if (d >= 6) return (x/(10**6)).toFixed(1)+"M";
    if (d >= 4) return (x/(10**3)).toFixed(1)+"K";
    return x;
}
  
// 宇宙
var universe = new Universe(5);
