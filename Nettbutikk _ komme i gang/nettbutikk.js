let listeEl = document.querySelector("#cart-items");
let produkter = [];
uppdateCart();

function uppdateCart() {
  let lagredeProdukter = localStorage.getItem("produktliste");

  if (lagredeProdukter) {
    produkter = JSON.parse(lagredeProdukter);
  } else {
    produkter = [];
  }

  listeEl.innerHTML = "";

  for (let i = 0; i < produkter.length; i++) {
    let li = document.createElement("li");
    li.textContent = `${produkter[i].name}: ${produkter[i].quantity}`;
    listeEl.appendChild(li);
  }
}


function addToCart(nyttprodukt) {
  let eksisterer = -1;

  for (let i = 0; i < produkter.length; i++) {
    if (produkter[i].name === nyttprodukt) {
      eksisterer = i;
      break;
    }
  }

  if (eksisterer >= 0) {
    produkter[eksisterer].quantity++;
  } else {
    produkter.push({ name: nyttprodukt, quantity: 1 });
  }

  localStorage.setItem("produktliste", JSON.stringify(produkter));
  uppdateCart();
}

function clearCart() {
  localStorage.removeItem("produktliste");
  produkter = [];
  uppdateCart();
}