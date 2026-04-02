// webcam.js
let stream;


const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const uploadBtn = document.getElementById('uploadBtn');
const alphaUp = document.getElementById('alphaUp');
const alphaDown = document.getElementById('alphaDown');
let alphaTimer;

uploadBtn.addEventListener('click', () => fileInput.click());

let alpha = 0.5;
alphaUp.addEventListener('mousedown', (e) => { 
	if(!stream){
		startWebcam(true);
	}
	clearTimeout(alphaTimer);
	e.preventDefault();
	alphaTimer = setInterval(()=>{
		alpha+=0.05; alpha = Math.min(alpha, 1);
		preview.style.opacity = alpha;
	}, 100)
	
 });
alphaDown.addEventListener('mousedown', (e) => { 
	if(!stream){
		startWebcam(false);
	}
	clearTimeout(alphaTimer);

	e.preventDefault();
	alphaTimer = setInterval(()=>{

	alpha-=0.05; alpha = Math.max(alpha, 0);
	preview.style.opacity = alpha;
	console.log(alpha)
	}, 100);
});
preview.style.opacity = alpha;


fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
	const reader = new FileReader();

	reader.onload = function(e) {
	  preview.src = e.target.result;
	};

	reader.readAsDataURL(file);
  }
});
	
	
// --- DRAG (mouse + touch) ---
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Mouse
preview.addEventListener('mousedown', (e) => {
	e.preventDefault();
  isDragging = true;
  offsetX = e.clientX - preview.offsetLeft;
  offsetY = e.clientY - preview.offsetTop;
});

document.addEventListener('mousemove', (e) => {
	e.preventDefault();
	
  if (isDragging) {
    preview.style.left = (e.clientX - offsetX) + 'px';
    preview.style.top = (e.clientY - offsetY) + 'px';
  }
});

document.addEventListener('mouseup', () => {	
	clearTimeout(alphaTimer);

  isDragging = false;
});

// Touch
preview.addEventListener('touchstart', (e) => {
	e.preventDefault();
	
  if (e.touches.length === 1) {
    isDragging = true;
    offsetX = e.touches[0].clientX - preview.offsetLeft;
    offsetY = e.touches[0].clientY - preview.offsetTop;
  }
});

preview.addEventListener('touchmove', (e) => {
	e.preventDefault();
	
  if (e.touches.length === 1 && isDragging) {
    preview.style.left = (e.touches[0].clientX - offsetX) + 'px';
    preview.style.top = (e.touches[0].clientY - offsetY) + 'px';
  }
});

// --- PINCH TO ZOOM ---
let initialDistance = 0;
let initialWidth = 300;

preview.addEventListener('touchstart', (e) => {
	e.preventDefault();
	
  if (e.touches.length === 2) {
    isDragging = false;

    initialDistance = getDistance(e.touches);
    initialWidth = preview.offsetWidth;
  }
});

preview.addEventListener('touchmove', (e) => {
	e.preventDefault();
	
  if (e.touches.length === 2) {
    const newDistance = getDistance(e.touches);
    const scale = newDistance / initialDistance;

    preview.style.width = (initialWidth * scale) + 'px';
  }
});

// Helper: distance between two fingers
function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Reset drag on touch end
preview.addEventListener('touchend', () => {
  isDragging = false;
});




async function startWebcam(a) {
  try {
    const video = document.getElementById('webcam');
	video.width = window.innerWidth;
	video.height = window.innerHeight;
	
	try{
		if(a){
			stream = await navigator.mediaDevices.getUserMedia({
			  video: {
				facingMode: { exact: "environment" }
			  },
			  audio: false
			});
		}else{
			stream = await navigator.mediaDevices.getUserMedia({
			  video: true,
			  audio: false
			});
		}
	}catch{
		stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
	}

    video.srcObject = stream;
  } catch (err) {
    console.error("Error accessing webcam:", err);
  }
}