const ingredientList = {

    // The array of ingredients the user can add to a sandwich
    //  This will be updated after we fetch.
    ingredients: [],

    // Updates the DOM to display a list of ingredients
    render() {
        const ingredientUl = document.querySelector('.ingredient-list');

        // Empty the ingredientUl before adding any content to it.
        ingredientUl.innerHTML = '';

        this.ingredients.forEach(ingredient => {
            const ingredientDiv = this.createIngredientCard(ingredient);
            ingredientUl.append(ingredientDiv)
        })
    },

    // Creates a DIV to display a single ingredient
    createIngredientCard(ingredient) {
        const { imageURL, name, calories, description } = ingredient;

        const ingredientCard = document.createElement('div');
        ingredientCard.className = 'card'

        const sandwichHasIngredient = cart.selectedSandwich.ingredients.includes(ingredient.name);
        ingredientCard.innerHTML = `
        <div class="card-body">
            <div class="row g-0">
                <div class="col-sm-4">
                    <img src="${imageURL}" alt="${name}" style="width: 100%">
                </div>
                <div class="col-sm-8">
                    <h5 class="card-title">${name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${calories} Calories</h6>
                    <p class="card-text">${description}</p>
                    ${sandwichHasIngredient ? `
                        <button class="btn btn-danger toggle-button">Remove</button>
                    ` : `
                        <button class="btn btn-primary toggle-button">Add</button>
                    `}
                </div>
            </div>
        </div>
    `
        const toggleButton = ingredientCard.querySelector('.toggle-button')
        toggleButton.addEventListener('click', () => {
            ingredientList.toggleIngredient(ingredient)
        })

        return ingredientCard
    },

    // Runs when the user clicks 'Add' or 'Remove' on a ingredient card
    toggleIngredient(ingredient) {
        let sandwichHasIngredient = cart.selectedSandwich.ingredients.includes(ingredient.name);
        if (sandwichHasIngredient) {
            cart.selectedSandwich.ingredients = cart.selectedSandwich.ingredients.filter(x => x !== ingredient.name)
        } else {
            sandwichHasIngredient = true;
            cart.selectedSandwich.ingredients.push(ingredient.name)
        }
        cart.saveSelectedSandwich()
        cart.render()
        ingredientList.render()
    }

}