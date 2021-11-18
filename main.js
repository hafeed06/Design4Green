let descriptions = [];
descriptions.push("None")
descriptions.push("The First One");
descriptions.push("The Second One");
$(function () {
  $('.custom-modal').click(function (e) {
    e.preventDefault();
    console.log(this.id)
    var mymodal = $('#exampleModal');
    let content = descriptions[this.id]
    console.log(content)
    mymodal.find('.modal-body').text(content);
    mymodal.modal('show');
  });
})

let types = {}
for (i = 0; i < jscontent.length; i++) types[i] = jscontent[i].family
let cats = ['STRATEGIE', 'SPECIFICATIONS', 'UX-UI', 'CONTENUS', 'ARCHITECTURE', 'FRONTEND', 'BACKEND', 'HEBERGEMENT']
$(document).ready(function () {
  window.localStorage.clear()
  document.getElementById("download").disabled = true;
  let x;
  let searchFor;
  for (let i = 0; i < cats.length; i++) {
    let content = `
<div id="${cats[i]}" class="pracTables">
<h3 class="p-3">${cats[i]}</h3>
<table class="table table-hover" style="width:90%; margin-left:auto; margin-right:auto; ">
<thead>
<tr style="font-weight:bold">
<td>Famille Origine<td/>
<td>ID<td/>
<td>RECOMMANDATION<td/>
<td>CRITERES<td/>
<td>PRIORITE<td/>
<td>MORE INFO<td/>
<td>ADD TO BASKET<td/>
</tr>
</thead>
<tbody>`
    searchFor = cats[i]
    const filteredByValue = Object.fromEntries(
        Object.entries(types).filter(([key, value]) => value === searchFor))

    x = Object.keys(filteredByValue).forEach(e => {
      let checked = jscontent[e].mustHave == "INCONTOURNABLE" ? "checked" : ""
      let disabled = jscontent[e].mustHave == "INCONTOURNABLE" ? "disabled" : ""

      let button = `<label class="btn btn-outline-success add-practice-button" for="btn-check-outlined` + e + `" data-index="${e}">Add to cart</label><br>`

      if (checked) {
        button = `<label class="btn btn-outline-danger remove-practice-button" for="btn-check-outlined` + e + `" data-index="${e}">Remove</label><br>  `
      }


      content += `
<tr class="">
<td style="max-width:14%">` + jscontent[e].family + `<td/>
<td style="max-width:14%">` + jscontent[e].id + `<td/>
<td style="max-width:14%">` + jscontent[e].recommendation + `<td/>
<td style="max-width:14%">` + jscontent[e].criterias + `<td/>
<td style="max-width:14%">` + jscontent[e].priority + `<td/>
<td style="max-width:14%"><button type="button" class="btn btn-outline-success custom-modal" id="` + i + `" data-cat-index="${i}" data-index="${e}" onclick="showDetails(this)" data-toggle="modal" data-target="#exampleModal">
Show details
</button><td/>
<td style="max-width:14%">
<div class="form-check form-switch">
<input type="checkbox" class="btn-check d-none" id="btn-check-outlined` + e + `" autocomplete="off" ${checked} ${disabled} />
${button}
</div>
<td/>
</tr>`
    })


    content += `
</tbody>
</table>
</div></div>`
    $(".container-lg").append(content);
    $(".pracTables").hide();
  }


// CheckBox Manipulation
  let carts = document.querySelectorAll('.btn-check')
  let products = jscontent;
  console.log(carts.length)
  for (let i = 0; i < carts.length; i++) {
    if (carts[i].checked) addProduct(products[i])
    carts[i].addEventListener('click', event => {
      const {target} = event
      const button = target.nextElementSibling;
      if (carts[i].checked) addProduct(products[i], button);
      else remProduct(products[i], button);
    })
  }
});


function addProduct(newproduct, button) {
  button?.classList.remove('btn-outline-success');
  button?.classList.add('btn-outline-danger');
  if (button) button.innerHTML = "Remove"


  let products = [];
  if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
  }
  products.push(newproduct);
  localStorage.setItem('products', JSON.stringify(products));
  displayProduct();
}

function remProduct(newproduct, button) {
  button?.classList.add('btn-outline-success');
  button?.classList.remove('btn-outline-danger');
  if (button) button.innerHTML = "Add to cart"

  let products = [];
  if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
  }
  products.pop(newproduct);
  localStorage.setItem('products', JSON.stringify(products));
  displayProduct();
}

function showDetails(element) {
  const cat = cats[element.dataset.catIndex]
  const products = Object.fromEntries(
      Object.entries(types).filter(([key, value]) => value === cat))
  const { scores, recommendation, criterias, priority } = jscontent[element.dataset.index]

  document.getElementById("recommendation-details").innerHTML = recommendation
  document.getElementById("criteria-details").innerHTML = criterias
  document.getElementById("priority-details").innerHTML = priority
  document.getElementById("people-details").innerHTML = scores.people
  document.getElementById("planet-details").innerHTML = scores.planet
  document.getElementById("prosperity-details").innerHTML = scores.prosperity

}

function displayProduct() {
  console.log("___")
  var incartproducts = JSON.parse(localStorage.getItem("products"));
  console.log(incartproducts);
  const list = document.getElementById("basket");
  if (incartproducts.length > 0) document.getElementById("download").disabled = false;
  else document.getElementById("download").disabled = true;
  list.innerHTML = incartproducts.length;
}

function download() {
  var incartproducts = JSON.parse(localStorage.getItem("products"));
  var doc = new jsPDF();
  var table_body = []
  for (const row of incartproducts) {
    table_body.push([row.family, row.scores.people, row.scores.planet, row.scores.prosperity, row.recommendation, row.justifications, row.lifecycleStage])
  }
  doc.autoTable({
    head: [['Family', 'People Score', 'Planet Score', 'Prosperity', 'Reccomendation', 'Justification', 'Life cycle stage']],
    body: table_body,
    rowPageBreak: 'auto',
    bodyStyles: {valign: 'top'}
  })
  doc.save('Test.pdf');
}