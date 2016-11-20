const express = require('express');
const convert = require('color-convert');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Orogin, X-Requested-With, Content-Type, Accept');
    res.failColor = function(){
        console.log('No valid');
       res.send('Invalid color'); 
    }
    next();
})

app.get('/', (req, res) =>{
   let colorValue = req.query.color;
   console.log('Input: ' + colorValue)
   if(!colorValue) {
       res.failColor();
       return;
    }
    colorValue = colorValue.trim();
    if(/^hsl\(.*\)/i.test(colorValue)){
        colorValue = colorValue.replace(/%20/g, '');
        let tempColor = colorValue.replace(/[hsl()]/g, '');
        tempColor = tempColor.split(',');
        for(let i = 1; i < tempColor.length; i++){
            if(!/%/ig.test(tempColor[i])) {res.failColor(); return; }
            tempColor[i] = tempColor[i].replace(/%/g, '');
        }
        if(tempColor.length < 3 || 
        (tempColor[0] > 360 || tempColor[0] < 0) || 
        (tempColor[1] > 100 || tempColor[1] < 0) || 
        (tempColor[2] > 100 || tempColor[2] < 0)) { 
            res.failColor(); return;
        }
        colorValue = convert.hsl.hex(...tempColor);
    
   }

   if(/^rgb\(.*\)/i.test(colorValue)){
       debugger;
       let tempColor =  colorValue.match(/([0-9])?([0-9])?([0-9])/ig);
       if(tempColor.length != 3) { res.failColor(); return;}
       for(let rgb of tempColor){
           rgb = rgb^0;
           if(rgb > 255) {res.failColor(); return;}
       }
       colorValue = convert.rgb.hex(...tempColor);
   }
   
   colorValue = colorValue.replace(/^#/, '');

   if(colorValue.length < 3 || colorValue.length > 6 || (colorValue.length > 3 && colorValue.length < 6)) {res.failColor();return;}
   for(let char of colorValue){
       if(!/[0-9abcdef]/i.test(char)) {res.failColor(); return;}
   }
   if(colorValue.length == 3) {
       let tempColor = '';
       for(let char of colorValue){
           tempColor = tempColor + char + char;
       }
       colorValue = tempColor;
   }
   console.log('Output: '+colorValue.toLowerCase());
   res.send('#' + colorValue.toLowerCase());
   return;
})

app.listen(3000, ()=>{
    console.log('Success! 3000 port run');
});