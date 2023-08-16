
let jours = 0;

const Jours = {
  Dimanche: 0,
  Lundi: 1,
  Mardi : 2,
  Mercredi: 3,
  Jeudi: 4,
  Vendredi: 5,
  Samedi: 6
}

const Mois = {
  Janvier: 0,
  Fevrier: 1,
  Mars : 2,
  Avril: 3,
  Mai: 4,
  Juin: 5,
  Juillet: 6,
  Aout: 7,
  Septembre: 8,
  Octobre: 9,
  Novembre: 10,
  Decembre : 11
}

const tableau = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi"
];

// javascript janvier est 0 et decembre est 11
let conges = [
  new Date(2023, Mois.Septembre, 4).valueOf(),
  new Date(2023, Mois.Septembre, 19).valueOf(),

  new Date(2023, Mois.Octobre, 9).valueOf(),
  new Date(2023, Mois.Octobre, 19).valueOf(),

  new Date(2023, Mois.Novembre, 10).valueOf(),

  new Date(2023, Mois.Decembre, 4).valueOf(),
];

let exceptions = [
  {"date" : new Date(2023, Mois.Octobre, 11),
  "jour" : Jours.Lundi
  }
];

let debut = new Date(2023, Mois.Aout, 21);
let fin = new Date(2023, Mois.Decembre, 12).valueOf();

function creerCheckboxes() {
  let div = document.getElementById("checkboxes");
             
  tableau.forEach(element => {
    // creating checkbox element
    let checkbox = document.createElement('input');
    
      // Assigning the attributes
      // to created checkbox
    checkbox.type = "checkbox";
    checkbox.name = element;
    checkbox.value = element;
    checkbox.id = element;
      
    // creating label for checkbox
    var label = document.createElement('label');
      
    // assigning attributes for
    // the created label tag
    label.htmlFor = element;
      
    // appending the created text to
    // the created label tag
    label.appendChild(document.createTextNode(" " + element));
      
    // appending the checkbox
    // and label to div
    div.appendChild(checkbox);
    div.appendChild(label);
    let p = document.createElement('p');
    p.textContent = '';
    div.appendChild(p);
  });

}
function verifierCheckboxes() {
  jours = 0;
  let valeur = 1;
  tableau.forEach(element => {
    try {
      let checkbox = document.getElementById(element);

      if (checkbox.checked) {
        ajouterJour(valeur);
      }
      valeur <<= 1;
    } catch (error) {
      console.log("Pas trouvé");
    }
})
}

function ajouterJour(jour) {
  jours = jours | jour;
}

function enleverJour(jour) {
  jours &= ~jour;
}

function verifierConge(jourCourant) {
  let trouve = false;
  for (let i = 0; i < conges.length && !trouve; i++) {
    // pourquoi conges[i] == jourCourant me retourne false même quand c'est égal? 
    if (jourCourant.valueOf() == conges[i]) {
      trouve = true;
    }
  }
  return trouve;
}

function obtenirJourDeLaSemaine(jourCourant) {
  let valeur = 0;
  for (let i = 0; i < exceptions.length && (valeur == 0); i++) {
    if (jourCourant.valueOf() == exceptions[i].date) {
      valeur = 1 << (exceptions[i].jour - 1);
    }
  }
  if (valeur == 0) {
    try {
      valeur = 1 << (jourCourant.getDay() - 1);
    } catch (error) {
    }
  }
  return valeur;
}
function genererDate() {
  verifierCheckboxes();

  try {
    let container = document.getElementById("resultats");
    let resultats = "";
    if (jours != 0) {
      let jourCourant = new Date(debut);
      console.log(jourCourant.toISOString().split('T')[0]);
      //while (jourCourant < fin) {
      while (jourCourant.valueOf() < fin) {
        while (jourCourant.getDay() == Jours.Dimanche || jourCourant.getDay() == Jours.Samedi || verifierConge(jourCourant)) {
          jourCourant.setDate(jourCourant.getDate() + 1);
        }
        let jour = obtenirJourDeLaSemaine(jourCourant);
        let bitwise = jour & jours;
        if (bitwise != 0) {
            resultats += jourCourant.toISOString().split('T')[0] + "<br>";
        }
        jourCourant.setDate(jourCourant.getDate() + 1);
      }
    }
    container.innerHTML = resultats;
  } catch (error) {
    console.log("oups");
  }

}
