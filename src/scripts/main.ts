import { getSVGs, Loading } from "./utilities/util";
import { Fullpage, FullpageOptions } from "./libraries/Fullpage";
import Axios from "axios";
declare var Swiper:any;

const swiperField = new Swiper('.company-field .swiper-container', {
	
	slidesPerGroup: 1,
	loop: true,
	loopFillGroupWithBlank: true,
	pagination: {
	  el: '.company-field .swiper-pagination',
	  clickable: true,
	},
	navigation: {
	  nextEl: '.company-field .swiper-button-next',
	  prevEl: '.company-field .swiper-button-prev',
	},
	breakpoints: {
		0:{
			slidesPerView: 2,
            spaceBetweenSlides: 0
		},
        575.98: {
            slidesPerView: 2,
            spaceBetweenSlides: 0
        },
        767.98: {
            slidesPerView: 3,
            spaceBetweenSlides: 0
		},
		1024:{
			slidesPerView: 4,
            spaceBetweenSlides: 0
		},
		1359.98:{
			slidesPerView: 4,
            spaceBetweenSlides: 0
		}
    }
});

const swiperProject = new Swiper('.company-project .project-wrap .swiper-container', {
	slidesPerView: 3,
	grabCursor: true,
	centeredSlides:true,
	slidesPerGroup: 1,
	loop: true,
	loopFillGroupWithBlank: true,
	pagination: {
	  el: '.project-wrap .swiper-pagination',
	  clickable: true,
	},
	navigation: {
	  nextEl: '.project-wrap .swiper-button-next',
	  prevEl: '.project-wrap .swiper-button-prev',
	},
	autoplay: {
		delay: 2000,
	  },
	  breakpoints: {
		// when window width is >= 320px
		0:{
			slidesPerView: 1,
			spaceBetweenSlides: 5
		},
        575.98: {
			slidesPerView: 2,
            spaceBetweenSlides: 5
        },
        767.98: {
			slidesPerView: 2,
            spaceBetweenSlides: 5
		},
		1024:{
			slidesPerView: 3,
            spaceBetweenSlides: 5
		},
		1359.98:{
			slidesPerView: 3,
            spaceBetweenSlides: 5
		}

	}
  });


const swiperStatement = new Swiper('.company-statement .statement-wrap .swiper-container', {
	slidesPerGroup: 1,
	loop: true,
	loopFillGroupWithBlank: true,
      pagination: {
        el: '.company-statement .swiper-pagination',
		clickable: true,
	  },

	  navigation:{
		  nextEl:'.company-statement .swiper-button-next',
		  prevEl: '.company-statement .swiper-button-prev',
	  },
	  breakpoints: {
		// when window width is >= 320px
		0:{
			slidesPerView:1,
			spaceBetweenSlides: 5
		},
        575.98: {
			slidesPerView: 2,
            spaceBetweenSlides: 5
        },
        767.98: {
			slidesPerView: 2,
            spaceBetweenSlides: 5
		},
		1024:{
			slidesPerView: 3,
            spaceBetweenSlides: 5
		},
		1359.98:{
			slidesPerView: 4,
            spaceBetweenSlides: 5
		}

	}
  });

const swiperNews = new Swiper('.company-news .swiper-container', {
	loop: true,
	slidesPerGroup: 1,
	loopFillGroupWithBlank: true,
      pagination: {
        el: '.company-news .swiper-pagination',
		clickable: true,
	  },

	  navigation:{
		  nextEl:'.company-news .swiper-button-next',
		  prevEl: '.company-news .swiper-button-prev',
	  },
	  breakpoints:{
	  0:{
		slidesPerView: 2,
		spaceBetweenSlides: 10 
	},
	575.98: {
		slidesPerView: 2,
		spaceBetweenSlides: 10                    
	},
	767.98: {
		slidesPerView: 2,
		spaceBetweenSlides: 10
	},
	1024:{
		spaceBetween: 20,
	slidesPerView: 2.5,
	}
}
  });

  const listTab = new Swiper('.list-tab .swiper-container', {
	spaceBetween: 10,
	// slidesPerView: 3,
	loop: true,
	slidesPerGroup: 1,
	loopFillGroupWithBlank: true,
      pagination: {
        el: '.list-tab .swiper-pagination',
		clickable: true,
	  },

	  navigation:{
		  nextEl:'.company-news .swiper-button-next',
		  prevEl: '.company-news .swiper-button-prev',
	  }
  });

const swiperPartner = new Swiper('.company-partner .swiper-container', {
	loop: true,
	slidesPerGroup: 1,
	loopFillGroupWithBlank: true,
      pagination: {
        el: '.company-partner .swiper-pagination',
		clickable: true,
	  },

	  navigation:{
		  nextEl:'.company-partner .swiper-button-next',
		  prevEl: '.company-partner .swiper-button-prev',
	  },
	  breakpoints:{
	  0:{
		slidesPerView: 3,
		spaceBetweenSlides: 5
	},
	575.98: {
		slidesPerView: 4,
		spaceBetweenSlides: 5
	},
	767.98: {
		slidesPerView: 5,
		spaceBetweenSlides: 5
	},
	1024:{
		slidesPerView: 6,
		spaceBetweenSlides: 5
	}
}
});

document.addEventListener("DOMContentLoaded", async () => {
	getSVGs(".svg");
	Loading();

	
	const toggleClick = document.getElementById("toggle-click")
	const headerMenu = document.getElementById("header-menu")
	toggleClick.addEventListener("click", () =>{
		let data = headerMenu.getAttribute('data-type')
		console.log(data)
		if( data == "false"){
			headerMenu.style.transform = "translateX(0)"
			toggleClick.classList.add("active")
			headerMenu.dataset.type = "true"
			headerMenu.style.opacity = "1"
		}else{
			headerMenu.style.transform = "translateX(-100%)"
			toggleClick.classList.remove("active")
			headerMenu.dataset.type = "false"
			headerMenu.style.opacity = "0"
		}

	})

	const headerLogoDestop = document.getElementById("header-logo-destop")
	const header = document.getElementById("header")
	const headerSocial = document.getElementById("header-social")
	window.onscroll = () => {myFunction()};
	function myFunction() {
  		if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
			// header.style.backgroundColor = "white"
			headerLogoDestop.classList.add("header-logo-destop-srcoll")
			header.classList.add("container-fluid-srcoll")
			headerSocial.classList.add("header-social-srcoll") 
  		} else {
			// header.style.backgroundColor = "transparent"
			// header.style.color = "white"
			headerLogoDestop.classList.remove("header-logo-destop-srcoll")
			header.classList.remove("container-fluid-srcoll") 
			headerSocial.classList.remove("header-social-srcoll") 
  		}
	}
});

