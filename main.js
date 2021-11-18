let descriptions = []; 
descriptions.push("None")
descriptions.push("The First One");
descriptions.push("The Second One");
$(function(){
    $('.custom-modal').click(function(e){
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
for(i=0; i < jscontent.length; i++) types[i] = jscontent[i].family
let cats = ['STRATEGIE', 'SPECIFICATIONS', 'UX-UI', 'CONTENUS', 'ARCHITECTURE', 'FRONTEND', 'BACKEND', 'HEBERGEMENT']
$(document).ready(function(){
window.localStorage.clear()
document.getElementById("download").disabled = true;
for(let i = 0; i < cats.length; i++) {
let content = `
<div id="${cats[i]}" class="pracTables">
<h3>${cats[i]}</h3>
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
let checked = jscontent[e].mustHave == "INCONTOURNABLE"?"checked":""
let disabled = jscontent[e].mustHave == "INCONTOURNABLE"?"disabled":""  
content+= `
<tr class="table-active">
<td style="max-width:14%">`+jscontent[e].family+`<td/>
<td style="max-width:14%">`+jscontent[e].id+`<td/>
<td style="max-width:14%">`+jscontent[e].recommendation+`<td/>
<td style="max-width:14%">`+jscontent[e].criterias+`<td/>
<td style="max-width:14%">`+jscontent[e].priority+`<td/>
<td style="max-width:14%"><button type="button" class="btn btn-primary custom-modal" id="`+i+`" data-toggle="modal" data-target="#exampleModal">
DETAILS
</button><td/>
<td style="max-width:14%">
<div class="form-check form-switch">
<input type="checkbox" class="btn-check" id="btn-check-outlined`+e+`" autocomplete="off" ${checked} ${disabled}>
<label class="btn btn-outline-primary" for="btn-check-outlined`+e+`">ADD</label><br>
</div>
<td/>
</tr>`
})
content+= `
</tbody>
</table>
</div></div>`
$(".container-lg").append(content);
$( ".pracTables" ).hide();
}


// CheckBox Manipulation 
let carts = document.querySelectorAll('.btn-check')
let products = jscontent;
console.log(carts.length)
for (let i=0; i < carts.length; i++){
  if(carts[i].checked) cartNumbers(products[i])
  carts[i].addEventListener('click', () => {
    if(carts[i].checked) cartNumbers(products[i]);
    else remProduct(products[i]);
  })
}
});

// Set cart numbers
function cartNumbers(product){
  // Displays the product json data for which the add to cart is clicked
  console.log("Product clicked is", product);
  // setItems(product)
  addProduct(product);
}
function addProduct(newproduct){
  let products = [];
  if(localStorage.getItem('products')){
      products = JSON.parse(localStorage.getItem('products'));
  }
  products.push(newproduct);
  localStorage.setItem('products', JSON.stringify(products));
  displayProduct();
}

function remProduct(newproduct){
  let products = [];
  if(localStorage.getItem('products')){
      products = JSON.parse(localStorage.getItem('products'));
  }
  products.pop(newproduct);
  localStorage.setItem('products', JSON.stringify(products));
  displayProduct();
}


function displayProduct(){
  console.log("___")
  var incartproducts = JSON.parse(localStorage.getItem("products"));
  console.log(incartproducts);
  const list = document.getElementById("basket");
  if(incartproducts.length > 0) document.getElementById("download").disabled = false;
  else document.getElementById("download").disabled = true;
  list.innerHTML = incartproducts.length;
}

function download(){
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
      bodyStyles: { valign: 'top' }
  })
  doc.save('Test.pdf');
}