
const departamento = document.getElementById('departamento')
const closeLocation = document.getElementById('closeLocation')
const fetchDep = async () =>{
    const response = await fetch('http://localhost:3000/ubicacion')
    const data = await response.json()
    renderDep(data)
}
const fetchCiud = async () =>{
    const response = await fetch('http://localhost:3000/ubicacion')
    const data = await response.json()
    renderCiud(data)
}
let dep = "";
fetchDep()
const ubicacion = document.getElementById('ubicacion')
ubicacion.addEventListener('change', ()=>{ 
    if(ubicacion.value == ''){
        fetchDep()
    }else{
        dep = ubicacion.value
        fetchCiud();
    }   
})

closeLocation.addEventListener('click',()=>{
    locationMdl.style.display = 'none'
})

const locationMdl = document.getElementById('locationMdl');
const locationBtn = document.getElementById('locationBtn');
const saveLocation = document.getElementById('saveLocation');
const locationView = document.getElementById('locationView');
locationMdl.style.display = 'none'
locationBtn.addEventListener('click',()=>{
    locationMdl.style.display = 'block'
})
saveLocation.addEventListener('click', ()=>{
    locationMdl.style.display = 'none'
    locationView.innerText = `${ubicacion.value}`
    localStorage.setItem('locationLocal', ubicacion.value)
})
const locationLocal = localStorage.getItem('locationLocal') || "";
console.log(locationLocal)
if(locationLocal !== ""){
    locationView.innerText = locationLocal
}
const renderCiud = (data) =>{
    if(ubicacion.value == ''){
     }else{
        data.forEach((element)=>{
            if(element.departamento == dep){
                departamento.innerHTML = ""
                element.ciudades.forEach(e=>{
                    departamento.innerHTML += `
                    <option value="${dep} ${e}"></option>
                    `
                })
            }
        })
     }
}
const renderDep = (data) =>{
    departamento.innerHTML = ""
    data.forEach(element => {
        departamento.innerHTML += `
        <option value="${element.departamento}"></option>
        `
    });   
}

const ofertas = document.getElementById('ofertas');
const populares = document.getElementById('populares')
const fetchProducts = async ()=>{
    const response = await fetch('http://localhost:3000/productos')
    const data = await response.json();
    return data
}
const renderProducts = async () =>{
    const data = await fetchProducts();
    //render ofertas
    const filter = []
    data.forEach((element, index) =>{
       for(const [key, value] of Object.entries(element)){
        if(key=="discount"){
            ofertas.innerHTML += `
            <figure class='product'>
            <p>${element.discount}% dto.</p>
            <img src='${element.imagen}'>
            <h2>$${(element.price-(element.price*element.discount)/100).toFixed(1)} ${element.type == 1 ? "/kg" : ""} <del>$${element.price} ${element.type == 1 ? "/kg" : ""} </del></h2>
            <h4>${element.name}</h4>
            <button id="btnAdd" class="btnAgregar ${element.id}">Agregar</button>
            </figure>
            `
            filter.push(index)
        }
       }
    })
    const dataFilter = data.filter((e, index) => {
       return index !== filter[index]
    })
    dataFilter.forEach(element=>{
        if(!element?.discount){
            populares.innerHTML += `
            <figure class="product" >
            <img src='${element.imagen}'>
            <h2>$${element.price} ${element.type == 1 ? "/kg" : ""}</h2>
            <h4>${element.name}</h4>
            <button id="btnAdd" class="btnAgregar ${element.id}">Agregar</button>  
            </figure>
            `
        }
    })
}
//
const withDiscount =(price) =>{
    return price.discount !== undefined ? (price.price-(price.price*price.discount)/100).toFixed(1) : price.price
}
const products = document.getElementById('products');
const addModal = document.getElementById('addModal');
let relacionados = ``
addModal.style.display = 'none'
const productosRelacionados = (data, element) =>{
    relacionados = ``
    data.forEach((product)=>{
        if(product.type == element.type){
            if(product.type == 1){
                if(product.id !== element.id){             
                    relacionados +=
                    `
                    <figure class='product' id="${product.id}">
                    <p>${product.discount}% dto.</p>
                    <img src='${product.imagen}'>
                    <h2>$${withDiscount(product)} ${product.type == 1 ? "/kg" : ""} <del>$${product.price} ${product.type == 1 ? "/kg" : ""} </del></h2>
                    <h4>${product.name}</h4>
                    <button id="btnAdd" class="btnAgregar ${product.id}">Agregar</button>
                    </figure>
                    `
                }
            }else{
                if(product.id !== element.id){  
                relacionados +=
                `
                <figure class='product' id="${product.id}">
                <img src='${product.imagen}'>
                <h2>$${product.price}</h2>
                <h4>${product.name}</h4>
                <button id="btnAdd" class="btnAgregar ${product.id}">Agregar</button>
                </figure>
                `
                }
            }
            }
       })
       return relacionados
    }


const renderAddModal = async(id) =>{
    const data = await fetchProducts();
    data.forEach((element)=>{
        if(element.id == id){
            addModal.innerHTML = `
        <article>
            <section id="${element.id}">
            <button class="closeIcon closeAdd" style="position: absolute; margin-left: 80%;" onclick="addModal.style.display = 'none'">x</button>
            <img src="${element.imagen}" alt="">
            <div>
                <h1>${element.name}</h1>
                <h3>• $${withDiscount(element)} ${element.type == 1 ? "/Kg" : ""}</h3>
                <h5>Precios con IVA incluido</h5>
                ${element.type == 1 ? `
                <p>Peso aproximado por pieza, puede variar de acuerdo al peso real.</p>
                <h2>Selecciona la madurez que desea</h2>
                <select id="condicion">
                <option value="0">Por elegir</option>
                <option value="1">Maduro ${element.condition.maduro}</option>
                <option value="2">Normal ${element.condition.normal}</option>
                <option value="3">Verde ${element.condition.verde}</option>
                </select>
                <div class="addBtns">
                <figure class='contador'><button onclick="getElementById('counter').value = getElementById('counter').value*1-5; getElementById('counter').click()">-</button><input id="counter" value="250" onclick="if(getElementById('counter').value < 250){getElementById('counter').value = 250}"><p>g</p><button onclick="getElementById('counter').value = getElementById('counter').value*1+5">+</button></figure>
                <button class="btnAgregar ${element.type}" id="addToCarBtn" >Agregar</button>
                </div>
                ` 
                : `
                <div class="addBtns">
                <figure class='contador'><button onclick="getElementById('counter').value = getElementById('counter').value*1- 1; getElementById('counter').click()">-</button><input id="counter" value="1" onclick="if(getElementById('counter').value < 1){getElementById('counter').value = 1}"><p>U</p><button onclick="getElementById('counter').value = getElementById('counter').value*1+1">+</button></figure>
                <button class="btnAgregar ${element.type}" id="addToCarBtn">Agregar</button>
                </div>
                `} 
            </section>
            <section>
            <h2>Productos relacionados</h2>
            <div class="carrusel" id="relacionados">
           ${productosRelacionados(data, element)}
            </div>
            </section>
                
            </div>
        </article>
        `
        }
    })
    const relacionados = document.getElementById('relacionados')
    relacionados.addEventListener('click', (e)=>{
        renderAddModal(e.target.classList[1]) 
    })
}

products.addEventListener('click', (e) =>{
    if(e.target.id == 'btnAdd'){
        addModal.style.display = 'block'
        renderAddModal(e.target.classList[1]) 
    }
})
const numCar = document.getElementById('numCar')
let carProducts = JSON.parse(localStorage.getItem('carProducts')) || [];
if(carProducts.length !== 0){
    numCar.innerText = carProducts.length
}
//carModal
const btnCar = document.getElementById('car');
const carModal = document.getElementById('carModal')
const productAdd = document.getElementById('productAdd')
carModal.style.display = 'none'
productAdd.style.display ='none'
addModal.addEventListener('click', (e)=>{
    console.log(e.composedPath()[3])
    if(e.target.id == 'addToCarBtn'){
        productAdd.style.display ='flex'
        setTimeout(()=>{
            productAdd.style.display ='none'
        },2000)
        addModal.style.display = 'none'
        if(e.target.classList[1] == 1){
            carProducts.push({
                "id": e.composedPath()[3].id,
                "cantidad":  e.composedPath()[3].children[2].children[6].children[0].children[1].value,
                "condicion": e.composedPath()[3].children[2].children[5].value
            })
        }else{
            carProducts.push({
                "id": e.composedPath()[3].id,
                "cantidad": e.composedPath()[3].children[2].children[3].children[0].children[1].value
            })
        }
    }
    localStorage.setItem('carProducts', JSON.stringify(carProducts))
    if(carProducts.length !== 0){
        numCar.innerText = carProducts.length
    }
})
const deleteProduct = () =>{
    if(carProducts.length !== 0){
        numCar.innerText = carProducts.length
    }else{
        numCar.innerText = ''
    }
    btnCar.click();
   
}
let productsCar = ``;
const renderCar = (data, carProducts) =>{
    productsCar = ``
    carProducts.forEach((carProduct, index) =>{
        data.forEach(element => {
          if(element.id == carProduct.id){
            productsCar += `
            <figure class="productCar" name="${index}" id="productH">
            <div>
            <img src="${element.imagen}">
            <div class="textCar">
            <p>${element.name}</p>
            <h2 id="price${index}" name="priceList">$${(element.type == 1 ? withDiscount(element)/1000: withDiscount(element))*carProduct.cantidad}</h2>
            </div>
            </div>
            <figure class='contador' >
            ${element.type == 1 ? `
            <button onclick="getElementById('counter${index}').value = getElementById('counter${index}').value.replace('g','')*1-${element.type == 1? 5: 1}+'g'; getElementById('price${index}').textContent = '$'+(${element.type == 1 ? withDiscount(element)/1000 : withDiscount(element)}*getElementById('counter${index}').value.replace('g','')).toFixed(1); if(getElementById('counter${index}').value.replace('g','') < 250){carProducts.splice(${index}, 1); deleteProduct()}; carProducts[${index}].cantidad = getElementById('counter${index}').value.replace('g','') ; document.getElementById('renderPrice').onclick()">-</button>
            <input id="counter${index}" value="${carProduct.cantidad}g" class='carProduct.condicion' onblur="if(getElementById('counter${index}').value.replace('g','') < 250){carProducts.splice(${index}, 1); deleteProduct(); }">
            <button onclick="getElementById('counter${index}').value = getElementById('counter${index}').value.replace('g','')*1+5+'g'; getElementById('price${index}').textContent = '$'+(${element.type == 1 ? withDiscount(element)/1000 : withDiscount(element)}*getElementById('counter${index}').value.replace('g','')).toFixed(1); carProducts[${index}].cantidad = getElementById('counter${index}').value.replace('g','') ; document.getElementById('renderPrice').onclick()">+</button>
            `:`
            <button onclick="getElementById('counter${index}').value = getElementById('counter${index}').value.replace('U','')*1-1+'U'; getElementById('price${index}').textContent = '$'+(${element.type == 1 ? withDiscount(element)/1000 : withDiscount(element)}*getElementById('counter${index}').value.replace('U','')).toFixed(1); if(getElementById('counter${index}').value.replace('U','') < 1){carProducts.splice(${index}, 1); deleteProduct()}; carProducts[${index}].cantidad = getElementById('counter${index}').value.replace('U','') ;document.getElementById('renderPrice').onclick()">-</button>
            <input id="counter${index}" value="${carProduct.cantidad}U" onblur="if(getElementById('counter${index}').value.replace('U','') < 1){carProducts.splice(${index}, 1); deleteProduct()}">
            <button onclick="getElementById('counter${index}').value = getElementById('counter${index}').value.replace('U','')*1+1+'U'; getElementById('price${index}').textContent = '$'+(${element.type == 1 ? withDiscount(element)/1000 : withDiscount(element)}*getElementById('counter${index}').value.replace('U','')).toFixed(1); carProducts[${index}].cantidad = getElementById('counter${index}').value.replace('U','') ; document.getElementById('renderPrice').onclick()">+</button>
            `}
            </figure>
            </figure>
            `
          }  
        })
    })
    
    return productsCar
}
let priceFinal = 0;

const sumPrecios = (value) =>{  
    console.log(value)
    priceFinal = 0;
    for(let i = 0; i < value.length; i++){
        priceFinal = (value[i].textContent.substring(1)*1)+priceFinal;
    }
    return "$" + priceFinal.toFixed(1)
}

btnCar.addEventListener('click', async()=>{
    document.body.style.overflowY ='hidden'
    const data = await fetchProducts();
    carModal.style.display = 'flex'
    carModal.innerHTML = `
    <article>
    <div id="back" style="display: none;" onclick="backCar(); getElementById('back').style.display = 'none'; getElementById('closeBack').style.display = 'flex' "><img src="./img/back.svg"/> <p>Volver</p></div>
    <div id="closeBack">
    <h5 style="font-weight: 300; margin-top: 10px;">Entregar en: <span style="font-weight:600;">${ubicacion.value}</span></h5>
    <button class="closeIcon" onclick="carModal.style.display = 'none'; body.style.overflowY ='scroll'">x</button>
    </div>
    
    ${carProducts.length == 0 ? `
    <section style="display: grid; place-items: center; margin-top: 20%;">
    <img src="./img/canasta.svg">
    <h3>Tu canasta está vacía</h3>
    <a href="#products"><button class="btnAgregar" onclick="carModal.style.display = 'none'; body.style.overflowY = 'scroll'">Agregar productos</button></a>
    </section>
    `:`
    <section>
    ${renderCar(data, carProducts)}
    </section>
    `}
    ${carProducts.length !== 0 ? `
    <div style="display: flex; justify-content: space-between; aling-items: center;">
    <p style="color: grey; margin-top: 12px;">Vaciar canasta</p>
    <button id="btnPagar" >
    <h2>${carProducts.length}</h2>
    <h3>Ir a pagar</h3>
    <i id="renderPrice"onclick="getElementById('priceF').textContent = sumPrecios(getElementsByName('priceList'));" style="display: none;"></i>
    <h4 id="priceF"></h4>
    </button>
    </div>
    ` : ``}
    </article>
    `
        document.getElementById('renderPrice').onclick()
        
})
const formContainer = document.createElement('section')
const comprado = document.getElementById('comprado')
formContainer.className = 'formulario-container'

carModal.addEventListener('mouseenter',(e)=>{
    const total = document.getElementById('priceF')
    const btnPagar = document.getElementById('btnPagar')
    btnPagar.addEventListener('click', ()=>{ 
        const close = document.getElementById('closeBack');
        close.style.display = 'none'
        back.style.display = 'flex';
        formContainer.innerHTML =  `
        <form id="formulario">
        <p id='error' style="color: red;"></p>
        <label>Correo electrónico</label>
        <input id='correo' />
        <label>Información de la tarjeta</label>
        <div>
        <input id="num" placeholder="1234 1234 1234 1234"/>
        <figure>
        <input id="date"placeholder="MM / YY"/>
        <input id="cvc"placeholder="CVC"/>
        </figure>
        </div>
        <label>Nombre en la tarjeta</label>
        <input id="nameCar"/>
        <button id='enviarSoli'>Pagar ${total.textContent}</button>
        </form>
        `
        carModal.append(formContainer)
        const form = document.getElementById('enviarSoli');
        form.addEventListener('click', async (e)=>{
            e.stopPropagation();
            e.preventDefault();
            const correo = document.getElementById('correo');
            const numero = document.getElementById('num');
            const fecha = document.getElementById('date');
            const cvc = document.getElementById('cvc');
            const nameCar = document.getElementById('nameCar')
            const error = document.getElementById('error')
            const compras = []
            console.log(error)
            if(!correo.value.includes('@') && !correo.value.includes('.')){
                error.textContent = "Ingrese un correo valido."
                console.log('click')
            }else{
                console.log('click')
                if(numero.value.length !== 16){
                    error.textContent = "Ingrese un numero valido.";
                }else{
                    if(fecha.value.substring(0,2) > 12){
                        error.textContent = 'Ingrese una fecha valida.';
                    }else{
                        if(correo.value == '' || numero.value == '' || fecha.value == '' || cvc.value == ''|| nameCar.value == ''){
                            error.textContent = 'Llenar todos los espacios';
                        }else{
                            error.textContent = ''
                        }
                    }
                }
            }
            if(error.innerText == ''){
                carProducts.forEach((product, index)=>{
                    if(product.condicion !== undefined){
                        let pruduct = {
                            "idProduct" : product.id,
                            "cantidad": product.cantidad
                        }
                        compras.push(product)
                    }else{
                        let pruduct = {
                            "idProduct" : product.id,
                            "cantidad": product.cantidad,
                            "condicion": product.condicion
                        }
                        compras.push(product)
                    }
                })
               const infoCompra = {
                    "correo": correo.value,
                    "numero": numero.value,
                    'fecha': fecha.value,
                    'cvc': cvc.value,
                    'nameCar': nameCar.value,
                    'compra': compras
               }
               const response = await fetch('http://localhost:3000/compras',{
                method: 'POST',
                body: JSON.stringify(infoCompra),
                headers:{
                    'Content-type': 'application/json'
                },
                cache: 'reload'
               })
               
               e.stopPropagation();
              e.preventDefault()
               
                carModal.style.display = 'none'
                comprado.style.display = 'flex'
               
            }
            
        })
    })
})
const backCar = () =>{
    carModal.removeChild(formContainer); 
}
const guardarForm = document.getElementById('guardarProduct')
const editarProducto = document.getElementById('editarProduct')
const openForm = (num) =>{
    formAdd.style.display = 'block'
    if(num == 1){
        editarProducto.style.display = 'none'
        guardarForm.style.display = 'block'
    }else{
        editarProducto.style.display = 'block'
        guardarForm.style.display = 'none'
    }
}
const bgMdl = document.getElementById('bgMdl')
const formAdd = document.getElementById('formAdd')
const ingr = document.getElementById('ingresar')
const adminMdl = document.getElementById('adminMdl')
const infoAdmin = document.getElementById('infoAdmin')
const user = document.getElementById('user');
const password = document.getElementById('password')
const buttonRend = () =>{
    bgMdl.style.display = 'block'
    ingr.click()
}
const imagenUrl = document.getElementById('imagenUrl')
const nombreF = document.getElementById('nombreF')
const precioForm = document.getElementById('precioForm')
const descuentoF = document.getElementById('descuentoF')
const tipo = document.getElementById('tipo')
const maduro = document.getElementById('maduro')
const normal = document.getElementById('normal')
const verde = document.getElementById('verde')

const editInfo = async(id) =>{
    const data = await fetchProducts();
    data.forEach((element)=>{
        if(element.id == id){
            imagenUrl.value = element.imagen
            nombreF.value = element.name
            precioForm.value = element.price
            if(element?.descuentoF){
                descuentoF.value = element.discount
            }
            tipo.value = element.type
            if(element.type == 1){
                maduro.value = element.condition.maduro
                normal.value = element.condition.normal
                verde.value = element.condition.verde
            }
        }
    })
    editarProducto.classList.add = id
}
const borrarProducto = async(id)=>{
    const data = await fetchProducts();
    const product = data.find((element)=> element.id == id)
    confirm(`¿Está seguro de eliminar ${product.name} de la lista?`) ? 
    await fetch('http://localhost:3000/productos/'+id,{
        method: 'DELETE'
    })
    :
    ""
}
ingr.addEventListener('click',()=>{
    if(user.value == 'admin' && password.value == 'admin'){
        infoAdmin.style.display= "none"
        adminMdl.style.display = 'block'
        adminMdl.innerHTML = `
        <article>
        <div style="display: flex; gap: 10px; align-items: center;" onclick="bgMdl.style.display = 'none'"><img src="./img/back.svg"><p>Salir</p></div>
        <button id="listProducts">Lista de productos</button>
        <button id="listBuy">Lista de compras</button>
        </article>
        `
        const listProducts = document.getElementById('listProducts');
        const listBuy = document.getElementById('listBuy');
        console.log(listProducts)
        const renderListP = (data) =>{
           let list = ``;
            data.forEach((elem)=>{
                list += `
                <tr>
                    <td>${elem.id}</td>
                    <td>${elem.name}</td>
                    <td>${elem.price}</td>
                    <td>${elem.type}</td>
                    <td>${elem?.discount ? `descuento del ${elem.discount}%` 
                    : (elem.type == 1 ? `maduro: ${elem.condition.maduro} <br> 
                    normal: ${elem.condition.normal} <br>
                    verde: ${elem.condition.verde} <br>` : "-")}</td>
                    <td style="display: flex; align-content: center; gap: 20px; justify-content: center;"><button id="editProduct" onclick="openForm(2); editInfo(${elem.id});" class="${elem.id}">✏️</button><button onclick="borrarProducto(${elem.id})" id="borrarProduct">🚫</button></td>
                </tr>
                `
            })
            return list
        }

        listProducts.addEventListener('click', async()=>{
            console.log('click')
            const data = await fetchProducts()
            adminMdl.innerHTML = `
            <figure id="formStyle">
            <div style="display: flex; gap: 10px; align-items: center;" onclick="buttonRend()"><img src="./img/back.svg"><p>Volver</p></div>
                <table>
                <thead>
                <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Observaciones</th>
                <th><button id="aggProduct" onclick="openForm(1)">+</button></th>
                </tr>
                </thead>
                <tbody>
                ${renderListP(data)}
                </tbody>
                </table>
            </figure>
            `
            guardarForm.addEventListener('click', async(e) =>{
                e.preventDefault();
                let newProduct = {}
                if(imagenUrl.value == "" || nombreF.value == "" || precioForm.value == ""){
                    alert('Llenar todos los espacios')
                }else{
                    if(tipo.value == 1){
                        if(descuentoF.value !== 0){
                            newProduct = {
                                "name": nombreF.value,
                                "price": precioForm.value,
                                "discount": descuentoF.value,
                                "imagen": imagenUrl.value,
                                "type": tipo.value,
                                "condition":{
                                    "maduro": maduro.value,
                                    "normal": normal.value,
                                    "verde": verde.value
                                }
                            }
                        }else{
                            newProduct = {
                                "name": nombreF.value,
                                "price": precioForm.value,
                                "imagen": imagenUrl.value,
                                "type": tipo.value,
                                "condition":{
                                    "maduro": maduro.value,
                                    "normal": normal.value,
                                    "verde": verde.value
                                }
                        }
                    }
                }else{
                    if(descuentoF.value !== 0){
                        newProduct = {
                            "name": nombreF.value,
                            "price": precioForm.value,
                            "discount": descuentoF.value,
                            "imagen": imagenUrl.value,
                            "type": tipo.value,
                        }
                    }else{
                        newProduct = {
                            "name": nombreF.value,
                            "price": precioForm.value,
                            "imagen": imagenUrl.value,
                            "type": tipo.value,
                    }
                    }
                }
                if(newProduct?.name){
                    await fetch('http://localhost:3000/productos',{
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(newProduct)
                    })
                    }
                }
            })

            editarProducto.addEventListener('click', async(e)=>{
                console.log()
                e.preventDefault();
                let newProduct = {}
                if(imagenUrl.value == "" || nombreF.value == "" || precioForm.value == ""){
                    alert('Llenar todos los espacios')
                }else{
                    if(tipo.value == 1){
                        if(descuentoF.value !== ""){
                            newProduct = {
                                "name": nombreF.value,
                                "price": precioForm.value,
                                "discount": descuentoF.value,
                                "imagen": imagenUrl.value,
                                "type": tipo.value,
                                "condition":{
                                    "maduro": maduro.value,
                                    "normal": normal.value,
                                    "verde": verde.value
                                }
                            }
                        }else{
                            newProduct = {
                                "name": nombreF.value,
                                "price": precioForm.value,
                                "imagen": imagenUrl.value,
                                "type": tipo.value,
                                "condition":{
                                    "maduro": maduro.value,
                                    "normal": normal.value,
                                    "verde": verde.value
                                }
                        }
                    }
                }else{
                    if(descuentoF.value !== ""){
                        newProduct = {
                            "name": nombreF.value,
                            "price": precioForm.value,
                            "discount": descuentoF.value,
                            "imagen": imagenUrl.value,
                            "type": tipo.value,
                        }
                    }else{
                        newProduct = {
                            "name": nombreF.value,
                            "price": precioForm.value,
                            "imagen": imagenUrl.value,
                            "type": tipo.value,
                     }
                    }
                }
                await fetch('http://localhost:3000/compras/'+e.target.classList.add,{
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(newProduct)
                })
            }
            })
        })
        listBuy.addEventListener('click', async()=>{
            const res = await fetch('http://localhost:3000/compras')
            const data = await res.json();
            const dataP = await fetchProducts()
            if(data.length == 0){
                alert('Aún no hay compras realizadas')
            }else{
                let listb = ``
                let productB =``
                let totalB = 0
                const rendProductB = (data, products) =>{
                    productB =``
                    products.forEach(product =>{
                        data.forEach(elemnt =>{
                            if(elemnt.id == product.id){
                                productB += `
                                <li>Nombre: ${product.cantidad} ${elemnt.type == 1 ? 'g': 'U'} ${elemnt.name}</li>
                                ${elemnt.type == 1 ? ` 
                                <p>Precio: $${(withDiscount(elemnt)/100)*product.cantidad}</p>
                                <p style="display: none;">${totalB += (withDiscount(elemnt)/100)*product.cantidad}</p>
                                `:`
                                <p>Precio: $${withDiscount(elemnt)*product.cantidad}</p>
                                <p style="display: none;"> ${totalB += withDiscount(elemnt)*product.cantidad}</p>
                                `}
                                `
                            }
                    })
                    })
                    return productB
                }
                const renderListB = (data) =>{
                    productB =``
                    data.forEach((element, index)=>{
                        listb += `
                        <h2>informacion de la compra ${index+1}</h2>
                        <ul>
                        <li>Correo: ${element.correo}</li>
                        <li>Nombre de la tarjeta: ${element.nameCar}</li>
                        <li>Numero de tarjeta: ${element.numero}</li>
                        <li>Cvc: ${element.cvc}</li>
                        <li>Fecha: ${element.fecha}</li>
                        </ul>
                        <h3>Productos:</h3>
                        <ul>
                        ${rendProductB(dataP, element.compra)}
                        </ul>
                        <h4>Total: $${totalB}</h4>
                        `
                    })
                    totalB = 0;
                    return listb
                }
                adminMdl.innerHTML = `
                <figure id='comprasInfor'>
                <div style="display: flex; gap: 10px; align-items: center;" onclick="buttonRend()"><img src="./img/back.svg"><p>Volver</p></div>
                <h1>COMPRAS:</h1>
                ${renderListB(data)}
                </figure>
                `
            }
        })
    }else{
        const error = document.getElementById('userError')
        error.innerHTML = `
        Usuario o contraseña incorrectos
        `
    }
})
renderProducts()

