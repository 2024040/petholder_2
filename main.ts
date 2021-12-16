function getTemp() {
    lm60OutAvg = 0
    vref = 0
    for (let index = 0; index < ADC_LOOP_CNT; index++) {
        lm60OutAvg += pins.analogReadPin(AnalogPin.P1)
    }
    lm60OutAvg = Math.idiv(lm60OutAvg, ADC_LOOP_CNT)
    ctemp = (lm60OutAvg - 424) / 6.25
    ctemp = ctemp * -1
    ctemp = ctemp - toffset
    serial.writeNumber(ctemp)
    serial.writeLine("")
}
let ctemp = 0
let vref = 0
let lm60OutAvg = 0
let toffset = 0
let ADC_LOOP_CNT = 0
let REF_LOOP_CNT = 0
let right = 255
ADC_LOOP_CNT = 100
// 誤差調整
toffset = 12
let PixelArray = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)
basic.forever(function () {
    getTemp()
    switch(currentState){
        case tempState.Off:
            PixelArray.clear()
            PixelArray.show()
            break;
        case tempState.COOLfi:
            if(ctemp >= 25){
                for (let e = 0; e < 256; e++) {
                PixelArray.setBrightness(e)
                PixelArray.easeBrightness()
                }
            }else{
                ;
            }
            // PixelArray.showColor(neopixel.rgb(255, 0, 0))
            // PixelArray.show()
            break;
        case tempState.COOLfo:
            for (let h = 0; h < 256; h++) {
                PixelArray.setBrightness(255 - h)
                PixelArray.easeBrightness()
            }
            break;
        case tempState.WARMfi:
            for (let e = 0; e < 256; e++) {
                PixelArray.setBrightness(e)
                PixelArray.easeBrightness()
            }
            break;
        case tempState.WARMfo:
            for (let f = 0; f < 256; f++) {
                PixelArray.setBrightness(255 - f)
                PixelArray.easeBrightness()
            }
            break;

    }
    if(ctemp < 25){
        currentState = tempState.COOLfo
        currentState = tempState.COOLfi
        PixelArray.showColor(neopixel.rgb(0, 0, 255))
        PixelArray.show()
    }else if(ctemp > 26){
        currentState = tempState.WARMfo
        currentState = tempState.WARMfi
        PixelArray.showColor(neopixel.rgb(255, 0, 0))
        PixelArray.show()
    }
})

const enum tempState{
    Off, WARMfi, WARMfo, COOLfi, COOLfo
}

let currentState = tempState.Off