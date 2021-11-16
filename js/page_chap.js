const projets = document.querySelectorAll(".container-gallery-img");
const head = document.getElementsByTagName("nav")[0];

const containerPattern = document.querySelector("#diagonalHatching");
const pattern = [
	"<rect x='0' y='0' width='5' height='5' fill='rgb(255, 255, 255, 0.02)'/>",
	"<circle cx='5' cy='5' r='5' fill='rgb(255, 255, 255, 0.02)'></circle>",
	"<rect x='0' width='10' height='10' y='0' fill='rgb(255, 255, 255, 0.02)'></rect><rect x='10' width='10' height='10' y='10' fill='rgb(255, 255, 255, 0.02)'></rect>",
	"<line x1='4' x2='4' y1='0' y2='10' style='stroke:rgb(255, 255, 255, 0.02); stroke-width:5'/>"
];

function randomPos(){
	let headHeight = head.offsetHeight + parseInt(getComputedStyle(head).marginTop) + parseInt(getComputedStyle(head).marginBottom);
	projets.forEach( (el) => {
		let widthContainer = el.offsetWidth;
		let heightContainer = el.offsetHeight;
		// console.log(widthContainer);
		let randomPosX = Math.random() * (window.innerWidth - widthContainer);
		let randomPosY = Math.random() * ((window.innerHeight - heightContainer) - headHeight) + headHeight;
		//console.log(randomPosX, randomPosY);
		el.style.left = randomPosX + "px";
		el.style.top = randomPosY + "px";
		el.addEventListener('mouseenter', (container) =>{
			projets.forEach( (el) => {
				el.style.zIndex = "0";
				el.querySelector("p").style.backgroundColor = "rgba(0, 0, 0, 0.6)";
				el.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0)";
				el.style.filter = "blur(0.8px)";
			});
			container.target.style.zIndex = "10";
			container.target.style.filter = "blur(0px)";
			container.target.style.boxShadow = "0px 0px 20px rgba(0, 0, 0, 0.8)";
			container.target.querySelector("p").style.backgroundColor = "rgba(0, 0, 0, 1)";

		});
	});
	if(Math.random() > 0.5){
		containerPattern.setAttribute("patternTransform", "rotate(45 0 0)");
	}else{
		containerPattern.setAttribute("patternTransform", "rotate(0 0 0)");
	}
	
	containerPattern.innerHTML = '';
	containerPattern.innerHTML = pattern[Math.floor(Math.random() * pattern.length)];
}

randomPos();

window.addEventListener("click", ()=>{
	randomPos();
});