let sc;
let imagesArray = ['./img/01.png', './img/02.jpg', './img/03.png', './img/04.png', './img/05.png', './img/06.jpg', './img/07.png'];
 
const imagesArrayLength = imagesArray.length;
let isMobileDevice = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
const scContainer = document.getElementById('js--sc--container')
const mainElement = document.getElementsByTagName('main')[0];
const landscapeElement = document.getElementsByClassName('landscape')[0];
let scratchContainerHeight = window.innerHeight;
let scratchContainerWidth = 0;

/**
 * onWindowResize event handler
 *  Handle Mobile Screen orientation
 */
let onWindowResize =  () => {
    if ( isMobileDevice && window.matchMedia("(orientation: portrait)").matches) {
        newWidth = screen.width;
        newHeight = window.innerHeight;
        // newHeight = screen.height;
        landscapeElement.style.display = "none";
        mainElement.style.display = "block";
    }
  
    
    if ( !isMobileDevice) {
        newWidth = mainElement.offsetWidth;
        newHeight = mainElement.offsetHeight;
    }

    // if mobile landscape 
    if ( isMobileDevice && window.matchMedia("(orientation: landscape)").matches) {
        mainElement.style.display = "none";
        landscapeElement.style.display = "flex";
    }
    else {
        scContainer.style.width = newWidth + "px";
        scContainer.style.height = newHeight + "px";
    
        let ctx = sc.canvas.getContext('2d');
        let tempCanvas = document.createElement('canvas');
        let tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempContext.drawImage(sc.canvas, 0, 0, newWidth, newHeight);
    
        sc.canvas.width = newWidth;
        sc.canvas.height = newHeight;
    
        ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
    }
}

window.addEventListener( 'resize', onWindowResize, false );
 
/**
 * Setup Scratch Card
 * @param {*} frontImgSrc 
 * @param {*} BackgroundImgSrc 
 */
let setupScratchCard = (frontImgSrc, BackgroundImgSrc) => {
    sc = new ScratchCard('#js--sc--container', {
        scratchType: SCRATCH_TYPE.LINE,
        //containerWidth: scContainer.offsetWidth,
        containerWidth: scratchContainerWidth,
        containerHeight: scratchContainerHeight,
        imageForwardSrc: frontImgSrc,
        imageBackgroundSrc: BackgroundImgSrc,
        htmlBackground: '',
        clearZoneRadius: 50,
        nPoints: 0,
        pointSize: 0,
        callback: function () {
        }
    })

    // Init
    sc.init().then(() => {
    }).catch((error) => {
        // image not loaded
        // alert(error.message);
    });
}


/**
 * Next button event handler
 */
document.getElementById('next').addEventListener('click', () => {
    // Take the Canvas' Screenshot and show it on img#screenshotImage
    let viewportWidth = window.innerWidth,
        screenshotImage = new Image(),
        blendedImage = new Image(),
        base64img = sc.canvas.toDataURL();
    screenshotImage.src = base64img;

    // let blendedImage = document.getElementById('blendedImage');
    let scContainer = document.getElementById('js--sc--container');
    let backImage = scContainer.getElementsByTagName('img')[0];
    let blendedCanvas = document.getElementById('blendedCanvas');
    let blendedCanvasCtx = blendedCanvas.getContext('2d');
    let blendedCanvasWidth;
    // let currentCanvas = scContainer.getElementsByTagName('canvas')[0];

    if (isMobileDevice) {
        blendedCanvasWidth = viewportWidth;
    }
    else {
        blendedCanvasWidth = sc.canvas.width;
    }

    blendedCanvas.width = blendedCanvasWidth;
    blendedCanvas.height = scratchContainerHeight;
    blendedCanvasCtx.drawImage(backImage, 0, 0, blendedCanvasWidth, scratchContainerHeight);

    screenshotImage.onload = function(){
        blendedCanvasCtx.drawImage(screenshotImage, 0, 0, blendedCanvasWidth, scratchContainerHeight);
        blendedImage.src = blendedCanvas.toDataURL();

        blendedImage.onload = function() {
            // Remove current elements before restarting scratch
            sc.canvas.remove();
            backImage.remove();

            // Set Canvas element dimensions
            scratchContainerWidth = Math.floor(mainElement.offsetWidth);
            scratchContainerHeight = mainElement.offsetHeight;

            setupScratchCard(blendedImage.src, getRandomImagePath());
        }
    }
});

/**
 * Get Random Image Path
 */
let getRandomImagePath = () => {
    const imagesPosition = Math.floor(Math.random() * imagesArrayLength);
    return imagesArray[imagesPosition];
}

/**
 * pageLoad setup
 */
// pageLoad Dimensions Setup for Desktop Only
if (!isMobileDevice) {
    scratchContainerWidth = mainElement.offsetWidth;
    scContainer.style.width = scratchContainerWidth + "px";
    
    // scratchContainerHeight = mainElement.offsetHeight;
    scratchContainerHeight = scratchContainerWidth*16/9;
    document.getElementsByTagName('body')[0].classList.add('desktop');
}
else {
    document.documentElement.style.backgroundColor = "#dadada";
    scratchContainerWidth = scContainer.offsetWidth;
}
// pageLoad Height for both Desktop and mobile
scContainer.style.height = scratchContainerHeight + "px";

// Run the project on pageLoad
setupScratchCard('../img/portada.png', getRandomImagePath(), scratchContainerWidth, scratchContainerHeight);
if (!isMobileDevice) {
    onWindowResize();
}