//
// Loops over the slider's slides
//
let i = 0;
let max = 3;
function clickArrow(direction) {
    if (direction === 'left') {
        if( i > 0) i--
        else i = max;

        document.getElementById('slider-content-wrapper').style.transform =
            'translateX(' + i * 70 * -1 + 'vw)';
    }else {
        if( i < max) i++
        else i = 0;

        document.getElementById('slider-content-wrapper').style.transform =
            'translateX(' + i * 70 * -1 + 'vw)';
    }
}
