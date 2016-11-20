const express = require('express');
const convert = require('color-convert');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Orogin, X-Requested-With, Content-Type, Accept');
    res.failColor = function(){
       res.send('Invalid color'); 
    }
    next();
})


app.get('/', (req, res) =>{
  debugger;
   let colorValue = req.query.color;
   console.log('Input: ' + colorValue)
   if(!colorValue) {
       res.send('Invalid color');
       console.log('No valid, empty\n');
       return;
    }
    colorValue = colorValue.trim();
    if(/^hsl\(.*\)/i.test(colorValue)){
        debugger;
        colorValue = colorValue.replace(/%20/g, '');
        let tempColor = colorValue.match(/\(.*\)/i);
        tempColor = tempColor[0].replace(/[()]/g, '');
        //tempColor = tempColor.replace(/%/g, '');
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
       
       let tempColor =  colorValue.match(/([0-9])?([0-9])?([0-9])/ig);
       if(tempColor.length < 3) { res.failColor(); return;}
       colorValue = '';
       for(let rgb of tempColor){
           rgb = rgb^0;
           if(rgb > 255) {res.failColor(); return;}
           let colorHex = rgb.toString(16);
           if(colorHex.length < 2 ) colorHex = colorHex + colorHex;
           colorValue = colorValue + colorHex;
       }
   }
   
   if(colorValue[0] == '#') colorValue = colorValue.slice(1);
   if(colorValue.length < 3 || colorValue.length > 6 || (colorValue.length > 3 && colorValue.length < 6)) {res.send('Invalid color');console.log('No valid, length \n'); return;}
   for(let char of colorValue){
       if(!/[0-9abcdef]/i.test(char)) {res.send('Invalid color');console.log('No valid, char test \n'); return;}
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