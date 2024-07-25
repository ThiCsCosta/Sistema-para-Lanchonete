const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const modal = document.getElementById('cart-modal');
const cartItensContainer = document.getElementById('cart-itens');
const totalItens = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const fechar = document.getElementById('close-modal-btn');
const cartCount = document.getElementById('cart-count');
const adressInput = document.getElementById('address');
const warnAdress = document.getElementById('address-warn');
const dateSpan = document.getElementById('date-span');

let car = [];

//Manipulando o elemento modal do carrinho
cartBtn.addEventListener("click", () => {
    updateCar();
    modal.style.display = "flex"
});

//Manipulando o elemento para fechar o modal clicando fora do modal
modal.addEventListener("click", (event) =>{
     if(event.target === modal){
         modal.style.display = "none";
     }
});
// Evento fechar o modal com o botão FECHAR
fechar.addEventListener("click", () => modal.style.display = "none");

//Pegando os elementos do Menu
menu.addEventListener("click", function(event){
    let buttonProx = event.target.closest(".add-to-cart");
    if(buttonProx){
        const name = buttonProx.getAttribute("data-name");
        const price = parseFloat(buttonProx.getAttribute("data-price"));

        addToCart(name, price); // <--- chamando a função adicionar carrinho
    }
})

//Criando a função para adicionar os elementos no carrinho
function addToCart(name, price){
    const itenExistent = car.find(item => item.name === name)
    if(itenExistent){
        itenExistent.quantity += 1;
    }else{

        car.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCar();
}

// Atualizando e adicionando carrinho
function updateCar(){
    cartItensContainer.innerHTML = "";
    let total = 0;

    car.forEach(item => {
        const cartItensElement = document.createElement("div");
        cartItensElement.classList.add("flex", "justify-between", "mt-4", "flex-col");

        cartItensElement.innerHTML = `
            <div class="flex itens-center justify-between">
                <div>
                    <p class="font-medium">
                        ${item.name}
                    </p>
                    <p>
                       Qtd: ${item.quantity}
                    </p>
                    <p class="font-medium mt-2">

                        R$ ${item.price.toLocaleString("pt-BR",{
                            style: "currency",
                            currency: "BRL"
                        })
                    }
                    </p>
                </div>
                    <button class="text-btnRed remove-btn" data-name="${item.name}">
                        remover
                    </button>
            </div>
        
        `
        total += item.price * item.quantity;

        cartItensContainer.appendChild(cartItensElement);
    });
    


    totalItens.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL",
    });

    cartCount.innerHTML = car.length;
}

// Removendo itens do carrinho

cartItensContainer.addEventListener("click", (event) =>{
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name");

        removeItens(name);
    }
} );

function removeItens(name){
    const index = car.findIndex(item => item.name === name);
    if(index !== -1){
        const item = car[index];

        if(item.quantity > 1){
            item.quantity -= 1;

            updateCar();
            return;
        }
        car.splice(index, 1);
        updateCar();
        console.log(item);
    }
}

// Pegar endereço

adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        adressInput.classList.remove("border-btnRed");
        warnAdress.classList.add("hidden");
    }
    updateCar();
});


//Finalizar pedido
checkoutBtn.addEventListener("click", ()=>{

     const isOpen = checkRestauntatOpen();
     if(!isOpen){
        Toastify({
            text: "Ops! O restaurante ainda está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#b91c1c",
            },
        }).showToast();
         return;
     }

    if(car.length === 0)return;

    if(adressInput.value === ""){
        warnAdress.classList.remove("hidden");
        adressInput.classList.add("border-btnRed")
    }

    //Enviando pedido para api do whatsapp
    const cartItens = car.map((item) =>{
        return (
            `Produto: ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toLocaleString("pt-BR",{
                style: "currency",
                currency: "BRL"
            })

            } | `
        );
    }).join("");

    const message = encodeURIComponent(cartItens);
    const phone = "98984832769";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_black");
    car = [];
    updateCar();
});

//Verificar se o restaurante tá aberto

function checkRestauntatOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23; // O retorno dessa função vai ser True ou Restaurante aberto
}

const spanIten = document.getElementById("date-span");
const isOpen = checkRestauntatOpen();

if(isOpen){
    spanIten.classList.remove("bg-btnRed");
    spanIten.classList.add("bg-btnGreen ");
}else{
    spanIten.classList.add("bg-btnRed");
    spanIten.classList.remove("bg-btnGreen ");
}
