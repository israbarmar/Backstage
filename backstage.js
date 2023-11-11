
const d = document;
const body = d.body;
const articleIndividual = d.querySelectorAll('.articles_sections .images');
const links = d.querySelectorAll('.go_to a');
const article = d.querySelectorAll('.articles')
const colors = ['pink', 'white', 'light-blue', 'orange', 'yellow', 'blue', 'red'];
const footerPage = d.querySelector('.footer'); 
const first_a = d.querySelectorAll('.change_a');
const pink_a = d.querySelectorAll('.text_pink');
let indexBodyColor = 0;

/*1) Function for the change of style in the links when the article is changed.*/

function markLinks(){

  links.forEach((link)=>{
    link.classList.remove('fondo');
  })
  links[indexBodyColor].classList.add('fondo');
  storeIndexBodyColor();
}

/*2) Example function to update the URL each time the article is changed.*/
function changeLink(){
  const newURL = `#index${links.length - indexBodyColor}`;
  history.pushState(null, null, newURL); 
  storeIndexBodyColor();
}

/*3) Function for each article to scroll according to the position of the clicked link*/
links.forEach((link, index) => {
  link.addEventListener('click', (event) => {    

    event.preventDefault();
    article.forEach((articlex)=>{
      articlex.classList.add('move');
      body.classList.remove(...colors);
      body.classList.add(colors[index]); 
      articlex.style.transform = `translateY(calc(-100% * ${index}))`;

      indexBodyColor = index;

      changeLink();
      storeIndexBodyColor();
      markLinks();
    })
  })
})

/*4) Function for each article to scroll each time the user moves the mouse wheel.*/
function handleMouseWheel(event) {
  window.scrollTo(0, 0);
  const delta = Math.sign(event.deltaY);
  const currentIndex = indexBodyColor + delta;

  if (currentIndex >= 0 && currentIndex < links.length) {
    article.forEach((articlex) => {
      articlex.classList.add('move');
      body.classList.add('move');
      body.classList.remove(...colors);
      body.classList.add(colors[currentIndex]);
      articlex.style.transform = `translateY(calc(-100% * ${currentIndex}))`;
      indexBodyColor = currentIndex;
    });
  }
  storeIndexBodyColor();
  changeLink();
  markLinks();
}

/*5) Function to change the background of the screen according to the position of the item to which the user scrolls.*/
  function scrollAction() {
    
    let windowHeight = window.innerHeight;
    const footerRect = footerPage.getBoundingClientRect();
    let isInArticle = false;

    article.forEach((article, index) => {
      let rect = article.getBoundingClientRect();
      let articleBottom = rect.bottom;

      if (articleBottom >= windowHeight / 2) {
        body.classList.remove(...colors);
        body.classList.add(colors[colors.length - 1 - index]);
        body.classList.add('move');
        indexBodyColor = colors.length - 1 - index;
        isInArticle = true;  
        return;  
      }
    });

    
      first_a.forEach((a_link)=>{
        if(indexBodyColor===1){
         a_link.style.color = '#FF608C'; 
       } else {
         a_link.style.color = 'white';
       }
     })

  
     pink_a.forEach((p_link)=>{
       if(indexBodyColor===0){
        p_link.style.color='white';
       } else {
        p_link.style.color='#FF608C';
       }
     })
  
    if (!isInArticle && (footerRect.top <= windowHeight && footerRect.bottom >= 0)) {
      body.classList.remove(...colors);
      body.classList.add('red');
      indexBodyColor = 6;  
    }

    changeLink();
    markLinks();
    storeIndexBodyColor();
  
  }

/*Functions for scrolling items with the up and down buttons.*/
function handleButton(event) {
  const {key} = event;

  if (key === 'ArrowUp') {
    handleScroll(-1);
  }

  // Flecha hacia arriba
  else if (key === 'ArrowDown') {
    handleScroll(1);
  }
}

function handleScroll(delta) {

  window.scrollTo(0, 0);
  const currentIndex = indexBodyColor + delta;

  if (currentIndex >= 0 && currentIndex < links.length) {
    article.forEach((articlex) => {
      articlex.classList.add('move');
      body.classList.remove(...colors);
      body.classList.add(colors[currentIndex]);
      articlex.style.transform = `translateY(calc(-100% * ${currentIndex}))`;
      indexBodyColor = currentIndex;
    });
  }

  changeLink();
  storeIndexBodyColor();
  markLinks();

}

/*6) Function to execute the necessary functions according to the dimensions of the screen.*/
function resizeScreen() {

  if (!window.matchMedia('(max-width: 991px) or (max-height: 649px)').matches) {
    window.scrollTo(0, 0);
    
      body.classList.remove(...colors);
      body.classList.add(colors[indexBodyColor]);
      article.forEach((articlex) => {
      articlex.style.transform = `translateY(calc(-100% * ${indexBodyColor}))`;

      });
    
    window.addEventListener('wheel', handleMouseWheel);
    window.addEventListener('keyup', handleButton);
    
  } else {
    
    article.forEach((articlex) => {
      articlex.classList.remove('move');
    });
    const reversedIndex = colors.length - 1 - indexBodyColor;
    article[reversedIndex].scrollIntoView({ behavior: 'auto', block: 'center' });

    window.removeEventListener('wheel', handleMouseWheel);
    window.removeEventListener('keyup', handleButton);
  }
}
 

/*7 - 8)Functions to store the value of the variable 'indexBodyColor' so that it can be reused when 
reloading the page.*/
function storeIndexBodyColor() {
  localStorage.setItem('indexBodyColor', indexBodyColor.toString());
}

function retrieveIndexBodyColor() {
  const storedIndex = localStorage.getItem('indexBodyColor');
  if (storedIndex !== null) {
    indexBodyColor = parseInt(storedIndex);
  } 
}

/*9) Function so that the necessary functions are executed each time the page is reloaded and according
 to the measurements the page is reloaded and according to the measurements obtained when reloading the page.*/
function reloadDOM(){
  if(!window.matchMedia('(max-width:991px) or (max-height:649px)').matches){
    window.scrollTo(0, 0);
    article.forEach((articlex)=>{

      articlex.style.transform = `translateY(calc(-100% * ${indexBodyColor}))`;
      body.classList.add(colors[indexBodyColor]);
      body.classList.add('move');
      
    })
    window.addEventListener('wheel', handleMouseWheel);
    window.addEventListener('keyup', handleButton);
  } else {
    body.classList.add('move');
    const reversedInd = colors.length - 1 - indexBodyColor;
    article[reversedInd].scrollIntoView({behavior:'smooth', block: 'center'});
  }
}


window.addEventListener('load', () => {
  retrieveIndexBodyColor();
    reloadDOM();
});

window.addEventListener('resize', resizeScreen);

window.addEventListener('load', function () {
  setTimeout(function () {
    scrollAction();
    window.addEventListener('scroll', function () {
      scrollAction();
    });
  }, 400);
});


 