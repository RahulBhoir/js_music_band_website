// for adding the new items to the cart
var cart = document.getElementById('items-cart');

// storing the item added to the cart, its price and quantity
// these are the initial items in the cart 
let idList = {
    item6: { quantity: 2, price: 15.99 },
    item3: { quantity: 1, price: 12.99 }
};

// for storing the total price of all the items in the cart 
var totalPrice = 0;


/////////////////////////////////////////// ITEM IMAGE AND TITLE ////////////////////////////////////////

// gettting title, image, and price of the product from the items section
function getImageTitleAndPrice(itemId, contentType) {

    // getting the element with id == itemId
    const content = document.getElementById(itemId);

    if (contentType === 'imgTit') {

        // from the element stored in content storing the value of
        // innerText of its first child in title
        const title = content.children[0].innerText;

        // storing the item image path in the image variable
        const image = content.children[1].src
        return [title, image];
    } else if (contentType === 'price') {

        // storing the price of the item in the price variable
        const price = content.children[2].children[0].innerText;
        return price
    }
}

//////////////////////////////////////////// ITEM DIV  /////////////////////////////////////////////////

// creating div for title and image of the item
function getCartItemDiv(itemId) {
    const cartItem = document.createElement('div');
    const itemImage = document.createElement('img');
    const itemTitle = document.createElement('span');
    const content = getImageTitleAndPrice(itemId, 'imgTit');

    // getting the title and adding class to the item Title
    itemTitle.innerText = content[0];
    itemTitle.className = 'cart-item-title';

    // getting image url and adding class to the item Image
    itemImage.src = content[1];
    itemImage.className = 'cart-item-image';

    // appending title and image to the cart-item div element
    cartItem.appendChild(itemImage);
    cartItem.appendChild(itemTitle);
    cartItem.className = "cart-item cart-column";
    return cartItem;
}

///////////////////////////////////////////////// ITEM PRICE ////////////////////////////////////////////

// creating span element for item price
function getItemPrice(itemId) {
    // creating span element 
    const itemPrice = document.createElement('span');
    // getting the price 
    const price = getImageTitleAndPrice(itemId, 'price');
    itemPrice.innerText = price;
    itemPrice.className = "cart-price cart-column";
    // storing the price of the item in the idList
    idList[itemId]['price'] = Number(price.slice(1, price.length));
    return itemPrice;
}


//////////////////////////////////////////////// ITEM QUANTITY //////////////////////////////////////////

// creating div for quantity and remove button
function getQuantity(itemId) {
    // creating div, input, and button elements 
    const itemQuantity = document.createElement('div');
    const itemInput = document.createElement('input');
    const removeButton = document.createElement('button');

    // setting value to 1 for the input element which will be displaying the quantity
    itemInput.value = 1;

    // giving it an id
    itemInput.id = 'in' + itemId;

    // setting this function so that whenever someone changes the value manually
    // than this function will be called for adjusting the total price and the quantity in idList
    itemInput.onchange = manualValueChange;
    itemInput.className = 'cart-quantity-input';

    // giving class and id to the remove button
    removeButton.innerText = 'REMOVE';
    removeButton.className = "btn btn-danger"
    removeButton.id = 'rm' + itemId;
    removeButton.onclick = removeFromCart;

    // appending the input and button in the div
    itemQuantity.appendChild(itemInput);
    itemQuantity.appendChild(removeButton);
    itemQuantity.className = "cart-quantity cart-column";
    return itemQuantity;
}


///////////////////////////////////////// MAIN CART ITEM /////////////////////////////////////
// creating the div for cart item
function creatingCartItem(id) {
    // creating an entry for the item in the idList object 
    idList[id] = {};

    // creating div element that is going to hold all the elements
    const cartRow = document.createElement('div');
    cartRow.appendChild(getCartItemDiv(id));
    cartRow.appendChild(getItemPrice(id));
    cartRow.appendChild(getQuantity(id));
    cartRow.className = 'cart-row';
    cartRow.id = 'cart-' + id;

    // appending the cartRow in the main cart section
    cart.appendChild(cartRow);

    // storing the quantity of the item in the idList object
    idList[id]['quantity'] = 1;
}

/////////////////////////////////////////// ADD TO CART ////////////////////////////////////
function addToCart() {
    // getting the id of the item to be added in the cart
    let itemID = this.id;

    // slicing is done to extract the id of the item
    // as this function is invoke when the add to cart button is pressed/clicked
    // so the id is of the button element and not of the main item div
    // id before slicing --> btnitem1
    // id after slicing --> item1
    itemID = itemID.slice(3, itemID.length);

    // checking if the element exist in the idList object
    if (itemID in idList) {
        // if item in the idList object than just increment the quantity of the item
        idList[itemID]['quantity'] += 1;
        const cartItem = document.getElementById('cart-' + itemID);
        cartItem.lastElementChild.firstElementChild.value = idList[itemID]['quantity'];
    } else {
        // if item not in the idList object than create the item 
        creatingCartItem(itemID);
    }
    // as of now the idList object is updated so the total price should also be updated 
    updatingTotalPrice();
}


/////////////////////////////////////// REMOVE FROM CART ///////////////////////////////////

function removeFromCart() {
    // to remove item from the cart after pressing/clicking the remove button
    let itemId = this.id;
    itemId = itemId.slice(2, itemId.length);
    document.getElementById('cart-' + itemId).remove();
    delete idList[itemId];
    updatingTotalPrice();
}


///////////////////////////////////////// UPDATE TOTAL PRICE ////////////////////////////////////
// updating the total price whenever there is an item added to the cart
// or quantity of the item is changed or removal of the item
function updatingTotalPrice() {
    totalPrice = 0;

    // once there is changed in the cart the idList object is updated
    // simple for loop for adding the prices of all the items in the idList (cart) object
    for (let i in idList) {
        const quant = idList[i]['quantity'];
        const price = idList[i]['price'];
        totalPrice += quant * price;
    }

    // displaying total price
    document.getElementsByClassName("cart-total-price")[0].innerText = '$' + totalPrice.toFixed(2);
}

///////////////////////////////////////// MANUAL VALUE CHANGE ///////////////////////////////////
// when the user manually changes the quantity in the input tag
// for handling the changes in total price we use this function 
function manualValueChange() {
    let id = this.id;
    const value = document.getElementById(id).value;
    id = id.slice(2, id.length);
    idList[id]['quantity'] = Number(value);
    updatingTotalPrice();
}


////////////////////////////////////// CONSTRUCTOR ////////////////////////////////////
// basically its a constructor
// setting IDs for the items and buttons
// setting the total price
function assignInitialValues() {
    // getting list of all the elements with class shop-item and shop-item-btn
    const shopItems = document.getElementsByClassName('shop-item');
    const btnOfItems = document.getElementsByClassName('shop-item-btn');

    // adding id to the items stored in shopItem and btnOfItem
    for (let index = 0; index < shopItems.length; index++) {
        const idValue = 'item' + (index + 1);
        shopItems[index].id = idValue;
        btnOfItems[index].id = 'btn' + idValue;
        // adding a function for adding item to the cart
        btnOfItems[index].onclick = addToCart;
    }

    // adding a function for manual value changes to the input element
    // which is displaying the quantity of the items
    document.getElementById('initem3').onchange = manualValueChange;
    document.getElementById('initem6').onchange = manualValueChange;

    // adding a function for removing item to the button element with id rmitem3 and rmitem6
    document.getElementById('rmitem3').onclick = removeFromCart;
    document.getElementById('rmitem6').onclick = removeFromCart;

    // as of now the idList object is updated so the total price should also be updated
    updatingTotalPrice();
}
assignInitialValues();