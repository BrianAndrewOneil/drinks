//First build an array of all ingredients available from the API to use in search tool and then update the DOM
let fullIngredientsList=[]
fetch(`https://www.thecocktaildb.com/api/json/v2/9973533/list.php?i=list`)
    .then(res => res.json()) // parse response as JSON
    .then(ingredients => {
        fullIngredientsList = ingredients.drinks.map(a => a.strIngredient1)
        console.log(fullIngredientsList)
        for(i of fullIngredientsList){
            document.querySelector('#datalistItems').innerHTML += (`<option value="${i}">`)
        }        
    })
    .catch(err => {
        console.log(`error ${err}`)
        document.querySelector('#cocktailName').innerText = "Sorry, our app is down, please try again soon."
});

//Search based on user's preference, by drink name or by ingredient
document.querySelector('#inputNameButton').addEventListener('click', function() {getDrink('name')})
document.querySelector('#inputIngredientButton').addEventListener('click', function() {getDrink('ingredient')})

function getDrink(searchType){
    //at the press of the button, first clear any existing ingredients and measurements lists
    let ingredientsList = []
    let measurementsList = []
    clearRecipeData()
    console.log('search type is '+searchType)
    //then build the page for the new drink choices
    var termForAPI=''
    if (searchType=='name') {
        termForAPI = 'search.php?s='+document.querySelector('#inputTextName').value
    }
    if (searchType=='ingredient') {
        if (!fullIngredientsList.includes(document.querySelector('#inputTextIngredient').value)) {
            alert('not a valid ingredient, please try again')
        }else{
            termForAPI = 'filter.php?i='+document.querySelector('#inputTextIngredient').value
        }
    }
    fetch(`https://www.thecocktaildb.com/api/json/v2/9973533/${termForAPI}`)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log(data.drinks)
            
            //In case the ingredients list contains an ingredient that's not actually in any recipe
            if (data.drinks=='None Found') {
                alert("Apologies, we don't have a recipe with that ingredient, please try again.")
            }

            //If more than one result, style options as carousel:
            else if (data.drinks.length>1&&data.drinks!='None Found'){
                console.log(data.drinks.length)
                document.querySelector('#choicesHeading').innerText = `Uncle Peter has ${data.drinks.length} options for you, please choose one:`
                let drinkChoices=''
                drinkChoices +=
                    (`
                    <div id="recipeOptionsCarousel" class="carousel carousel-dark slide" data-bs-ride="carousel">
						<div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="${data.drinks[0].strDrinkThumb}" id="drinkSelection0" class="img-fluid" alt="...">
                                <div class="carousel-caption d-md-block">
                                <h5>${1}. ${data.drinks[0].strDrink}</h5>
                                </div>
                            </div>
                    `)
                
                for (let i=1; i<data.drinks.length; i++){
                    drinkChoices +=
                        (`<div class="carousel-item">
                            <img src="${data.drinks[i].strDrinkThumb}" id="drinkSelection${i}" class="img-fluid" alt="...">
                            <div class="carousel-caption d-md-block">
                            <h5>${i+1}. ${data.drinks[i].strDrink}</h5>
                            </div>
                        </div>`)
                }
                    
                drinkChoices += 
                    (`</div>
                        <a class="carousel-control-prev" role="button" data-bs-target="#recipeOptionsCarousel" data-bs-slide="prev">
                        <i class="fa-solid fa-square-caret-left fa-2xl"></i>
                            <span class="visually-hidden">Previous</span>
                        </a>
                        <a class="carousel-control-next" role="button" data-bs-target="#recipeOptionsCarousel" data-bs-slide="next">
                            <i class="fa-solid fa-square-caret-right fa-2xl"></i>
                            <span class="visually-hidden">Next</span>
                        </a>
                    </div>`)
                    
                document.querySelector('#drinkChoices').innerHTML = drinkChoices
                
                for (let i=0; i<data.drinks.length ;i++){
                    document.querySelector('#drinkSelection'+i).addEventListener('click', function() { displayDrink(data.drinks[i].idDrink); } )
                }
                    
            }
            
            //Or, if only one option was returned from the API
            else if (data.drinks!='None Found') {
                displayDrink(data.drinks[0].idDrink)
            }
        })
        
        .catch(err => {
            console.log(`error ${err}`)
            document.querySelector('#cocktailName').innerText = "Apologies, mate, couldn't find what you were looking for, please enter something else."
    });
}

function displayDrink(currentDrinkID){
    clearRecipeData()
    let currentDrink = {}
    fetch(`https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=${currentDrinkID}`)
        .then(res => res.json()) // parse response as JSON
        .then(data => { 
            currentDrink = data.drinks[0]
            console.log(currentDrinkID)
            document.querySelector('#cocktailName').innerText = currentDrink.strDrink
            document.querySelector('#cocktailPic').src = currentDrink.strDrinkThumb+'/preview'
            document.querySelector('#ingredientsHeading').innerText = 'Ingredients'
            
            //Loop through the drink object and populate the measurements and ingredients lists
            for (const [key, value] of Object.entries(currentDrink)) {
                if (key.includes('strMeasure') && value != null){
                    measurementsList.push(`${value}`)
                }else if(key.includes('strIngredient') && value != null){
                    ingredientsList.push((`${value}`).toLowerCase())
                }
            }
            console.log(currentDrink)
            console.log(measurementsList, ingredientsList)

            //Write to the dom each measurement+ingredient in a bulleted list
            for (let i=0; i<ingredientsList.length; i++){
                if (measurementsList[i]==null){
                    document.querySelector('#ingredients').innerHTML += (`<li>${ingredientsList[i]}</li>`)
                }else{ 
                    document.querySelector('#ingredients').innerHTML += (`<li>${measurementsList[i]} ${ingredientsList[i]}</li>`)
                }
            }

            //Hide the search results and write the recipe to the DOM
            toggleSearchArea()           
            document.querySelector('#directionsHeading').innerText = 'Directions'
            document.querySelector('#directions').innerText = currentDrink.strInstructions
            document.querySelector('#newSearch').innerHTML = 
            (`<div class="my-3">
                <button type="button" name="button" class="btn btn-danger" id="previousSearch">Previous Search</button>
                <a href=""><button type="button" name="button" class="btn btn-danger" id="inputButton">New Search</button></a>
            </div>`)
            
            
            //******PICK UP HERE, call new function on PREVIOUS SEARCH option
            document.querySelector('#previousSearch').addEventListener('click', toggleRecipeArea)     
        })
        .catch(err => {
            console.log(`error ${err}`)
            document.querySelector('#cocktailName').innerText = "Sorry, our app is down, please try again soon."
    });
}

function clearRecipeData(){
    ingredientsList = []
    measurementsList = []
    document.querySelector('#ingredients').innerHTML = ""
    document.querySelector('#directionsHeading').innerText = ""
    document.querySelector('#ingredientsHeading').innerText = ""
    document.querySelector('#directions').innerText = ""
    document.querySelector('#cocktailPic').src = ""
    document.querySelector('#cocktailName').innerText = ""
    document.querySelector('#newSearch').innerText = ""
}

function toggleSearchArea(){
    var x = document.getElementById("searchArea")
        if (x.style.display === "none") {
            x.style.display = "block"
        } else {
            x.style.display = "none"
    }
    //clearRecipeData()
    console.log('hey toggleSearchArea was called')
}

function toggleRecipeArea(){
    toggleSearchArea()
    clearRecipeData()
    console.log('hey toggleRecipeArea was called')
}
