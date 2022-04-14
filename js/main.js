//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM
document.querySelector('button').addEventListener('click', getDrink)
// function getDrink(){
//     let drink = document.querySelector('input').value
//     fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
//         .then(res => res.json()) // parse response as JSON
//         .then(data => {
//         console.log(data.drinks[0])
//         document.querySelector('h2').innerText = data.drinks[0].strDrink
//         document.querySelector('img').src = data.drinks[0].strDrinkThumb
//         document.querySelector('h3').innerText = data.drinks[0].strInstructions
//         })
//         .catch(err => {
//             console.log(`error ${err}`)
//     });

// }
function getDrink(){
    //at the press of the button, first clear any existing ingredients and measurements lists
    document.querySelector('span').innerHTML = ""
    let ingredientsList = []
    let measurementsList = []
    //then build the page for the new drink
    let drink = document.querySelector('input').value
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            //console.log(data)
            console.log(data.drinks)
            document.querySelector('#cocktailName').innerText = data.drinks[0].strDrink
            document.querySelector('img').src = data.drinks[0].strDrinkThumb
            document.querySelector('#ingredientsHeading').innerText = 'Ingredients'
            
            //Loop through the drink object and populate the measurements and ingredients lists
            for (const [key, value] of Object.entries(data.drinks[0])) {
                if (key.includes('strMeasure') && value != null){
                    measurementsList.push(`${value}`)
                }else if(key.includes('strIngredient') && value != null){
                    ingredientsList.push((`${value}`).toLowerCase())
                }
            }
            //Write to the dom each measurement+ingredient in a bulleted list
            for (let i=0; i<ingredientsList.length; i++){
                if (measurementsList[i]==null){
                    document.querySelector('span').innerHTML += (`<li>${ingredientsList[i]}</li>`)
                    }else 
                    {document.querySelector('span').innerHTML += (`<li>${measurementsList[i]} ${ingredientsList[i]}</li>`)
                }
            }
            //Write the directions to the dom
            document.querySelector('#directionsHeading').innerText = 'Directions'
            document.querySelector('#directions').innerText = data.drinks[0].strInstructions
        })
        .catch(err => {
            console.log(`error ${err}`)
    });
}
    