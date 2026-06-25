let panier = [];
let total = 0;

// Fonction pour ajouter au panier
function ajouterAuPanier(nom, prix) {
  const item = panier.find(p => p.nom === nom);
  
  if (item) {
    item.qte++;
  } else {
    panier.push({ nom, prix, qte: 1 });
  }

  total += prix;
  majPanier();
}

// Mettre à jour l’affichage du panier
function majPanier() {
  const liste = document.getElementById("liste-panier");
  const compteur = document.getElementById("panier-compteur");
  const totalPanier = document.getElementById("total-panier");

  liste.innerHTML = "";
  panier.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nom} x${item.qte} - ${(item.prix * item.qte).toFixed(2)} €`;

    // bouton supprimer
    const btnSuppr = document.createElement("button");
    btnSuppr.textContent = "❌";
    btnSuppr.style.marginLeft = "10px";
    btnSuppr.onclick = () => supprimerDuPanier(item.nom);
    li.appendChild(btnSuppr);

    liste.appendChild(li);
  });

  compteur.textContent = `Panier (${panier.reduce((sum, i) => sum + i.qte, 0)})`;
  totalPanier.textContent = total.toFixed(2) + " €";
}

// Supprimer un produit du panier
function supprimerDuPanier(nom) {
  const index = panier.findIndex(p => p.nom === nom);
  if (index !== -1) {
    total -= panier[index].prix * panier[index].qte;
    panier.splice(index, 1);
  }
  majPanier();
}

// Simuler un paiement
function payer() {
  if (panier.length === 0) {
    alert("Votre panier est vide !");
  } else {
    alert("Merci pour votre achat ! 🛒");
    panier = [];
    total = 0;
    majPanier();
  }
}
