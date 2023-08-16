
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

const JoursBitwise = {
  DimancheBitwise: 0,
  LundiBitwise: 0x01,
  MardiBitwise : 0x02,
  MercrediBitwise: 0x04,
  JeudiBitwise: 0x08,
  VendrediBitwise: 0x10,
  SamediBitwise: 0
}


const tableau = [
  {
    "jour" : "Lundi",
    "valeur": JoursBitwise.LundiBitwise
  },
  {
    "jour" : "Mardi",
    "valeur": JoursBitwise.MardiBitwise
  },
  {
    "jour" : "Mercredi",
    "valeur": JoursBitwise.MercrediBitwise
  },
  {
    "jour" : "Jeudi",
    "valeur": JoursBitwise.JeudiBitwise
  },
  {
    "jour" : "Vendredi",
    "valeur": JoursBitwise.VendrediBitwise
  }
];

// javascript janvier est 0 et decembre est 11
let conges = [
  new Date(2023, Mois.Septembre, 4),
  new Date(2023, Mois.Septembre, 19),

  new Date(2023, Mois.Octobre, 9),
  new Date(2023, Mois.Octobre, 19),

  new Date(2023, Mois.Novembre, 10),

  new Date(2023, Mois.Decembre, 4),
];

let exceptions = [
  {"date" : new Date(2023, Mois.Octobre, 11),
  "jour" : JoursBitwise.LundiBitwise
  }
];

let debut = new Date(2023, Mois.Aout, 21);
let fin = new Date(2023, Mois.Decembre, 12);

function verifierCheckboxes() {
  jours = 0;
  tableau.forEach(element => {
    try {
      let checkbox = document.getElementById(element.jour);

      if (checkbox.checked) {
        ajouterJour(element.valeur);
      }
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

// c'est vraiment bizarre. Je ne trouve pas mon erreur mais date1 == date2 ne fonctionne pas
function compareDate(date1, date2) {
  let diff = date1.getYear() > date2.getYear();
  if (diff == 0) {
    diff = date1.getMonth() - date2.getMonth()
  }
  if (diff == 0) {
    diff = date1.getDate() - date2.getDate()
  }
  return diff;
}

function verifierConge(jourCourant) {
  let trouve = false;
  for (let i = 0; i < conges.length && !trouve; i++) {
    // pourquoi conges[i] == jourCourant me retourne false même quand c'est égal? 
    if (compareDate(jourCourant, conges[i]) == 0) {
      trouve = true;
    }
  }
  return trouve;
}

function obtenirJourDeLaSemaine(jourCourant) {
  let valeur = 0;
  for (let i = 0; i < exceptions.length && (valeur == 0); i++) {
    if (compareDate(exceptions[i].date, jourCourant) == 0) {
      valeur = exceptions[i].jour;
    }
  }
  if (valeur == 0) {
    try {
      valeur = tableau[jourCourant.getDay() - 1].valeur;
    } catch (error) {
    }
  }
  return valeur;
}
function genererDate() {
  console.log("genererDate");
  verifierCheckboxes();
  console.log(jours);
  try {
    let container = document.getElementById("resultats");
    let resultats = "";
    if (jours != 0) {
      let jourCourant = debut;
      console.log(jourCourant.toISOString().split('T')[0]);
      //while (jourCourant < fin) {
      while (compareDate(jourCourant, fin) < 0) {
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
