const cart = {

    // The array of sandwiches the user is ordering. 
    //  This will be updated after we fetch.
    items: [],

    // The sandwich selected in the cart (defaults to the first sandwich)
    selectedSandwich: null,

    // Updates the DOM to display a list of sandwiches from the cart
    render() {
        const sandwichUl = document.querySelector('.sandwich-list');

        // Empty the sandwichUl before adding any content to it.
        sandwichUl.innerHTML = '';

        this.items.forEach((sandwich) => {
            const sandwichDiv = this.createSandwichCard(sandwich);
            sandwichUl.append(sandwichDiv)
        })
    },

    // Creates a DIV to display a single sandwich
    createSandwichCard(sandwich) {
        const { id, name, bread, ingredients } = sandwich
        const sandwichCard = document.createElement('div');
        sandwichCard.className = cart.selectedSandwich.id === id ? 'm-3 card border-primary' : 'm-3 card'
        sandwichCard.style.cursor = 'pointer';
        sandwichCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${id}. ${name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${bread}</h6>
            <p class="card-text">${ingredients.join(', ')}</p>
            <button class="btn btn-secondary duplicate-button">Duplicate</button>
            <button class="btn btn-danger delete-button">Delete</button>
        </div>
    `

        // When a sandwich card is clicked, select it.
        sandwichCard.addEventListener('click', () => {
            this.selectSandwich(sandwich)
        })

        // Add a button to copy a sandwich
        const duplicateButton = sandwichCard.querySelector('.duplicate-button')
        duplicateButton.addEventListener('click', () => {
            this.duplicateSandwich(sandwich)
        })

        // Add a button to delete a sandwich
        const deleteButton = sandwichCard.querySelector('.delete-button')
        deleteButton.addEventListener('click', (e) => {
            this.deleteSandwich(sandwich)
        })

        return sandwichCard
    },

    // We'll use this function anytime we need to change the selected sandwich
    selectSandwich(sandwich) {
        this.selectedSandwich = sandwich

        const breadRadio = document.querySelector(`[value="${sandwich.bread}"]`)
        breadRadio.checked = true

        const nameInput = document.querySelector(`.name-input`)
        nameInput.value = sandwich.name

        this.render()
        ingredientList.render()
    },

    // We'll use this function to save the sandwich, either
    //  when we've added/removed ingredients, or changed the type of bread.
    async saveSelectedSandwich() {

        // Save the sandwich on the server
        fetch(`http://localhost:3001/cart/${cart.selectedSandwich.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart.selectedSandwich)
        })
    },

    // Runs when the user clicks 'Duplicate' on a sandwich card
    async duplicateSandwich(sandwich) {
        let newSandwich = {
            ...sandwich
        }

        // Save the sandwich on the server
        let response = await fetch(`http://localhost:3001/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSandwich)
        })

        newSandwich = await response.json()

        cart.items.push(newSandwich)
        cart.selectSandwich(newSandwich)
    },

    // Runs when the user clicks 'Delete' on a sandwich card
    async deleteSandwich(sandwich) {
        // Can't delete the last sandwich in the cart
        if (this.items.length === 1) {
            return
        }

        // Remove the sandwich from the server
        await fetch(`http://localhost:3001/cart/${sandwich.id}`, {
            method: 'DELETE',
        })

        // Remove the sandwich locally
        this.items = this.items.filter(x => x !== sandwich)
        if (this.selectedSandwich.id === sandwich.id) {
            this.selectSandwich(this.items[0])
        } else {
            this.render()
        }
    },

    // Runs when the user clicks 'Add Sandwich'
    async addSandwich() {
        let newSandwich = {
            name: 'Unnamed',
            bread: 'White',
            ingredients: []
        }

        // Save the sandwich on the server
        const response = await fetch(`http://localhost:3001/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSandwich)
        })

        // Update the sandwich to match what the server responds with
        //  (this will include the id)
        newSandwich = await response.json()

        cart.items.push(newSandwich)
        cart.selectSandwich(newSandwich)
    },

    changeSelectedSandwichName(value) {
        this.selectedSandwich.name = value
        this.saveSelectedSandwich()
        this.render()
    },

    changeSelectedSandwichBread(value) {
        this.selectedSandwich.bread = value
        this.saveSelectedSandwich()
        this.render()
    }

}