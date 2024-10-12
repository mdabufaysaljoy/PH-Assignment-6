const categorySelect = document.getElementById("categorySelect");
const cardsGroup = document.getElementById("cardsGroup");

function getPets(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => displayPets(data));
}

function getPetById(id) {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
    .then((response) => response.json())
    .then((data) => displayPetById(data));
}
function addLikedPet(id) {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
    .then((response) => response.json())
    .then((data) => saveLikedPet(data));
}
function getCategories(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => displayCategories(data));
}
function getPetsByCategory(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => displayPetsByCategory(data));
}
function displayPetsByCategory(dataObj) {
  const { data } = dataObj;

  cardsGroup.innerHTML = "";

  if (data.length === 0) {
    cardsGroup.classList.add("grid-cols-1");
    const div = document.createElement("div");
    div.classList.add(
      "w-full",
      "rounded-xl",
      "text-center",
      "text-3xl",
      "py-8",
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-2",
      "bg-[#13131308]",
      "col-span-3"
    );
    const img = document.createElement("img");
    img.src = "./images/error.webp";
    const h1 = document.createElement("h1");
    h1.innerText = "No Information available";
    h1.classList.add("text-3xl", "font-bold");
    const p = document.createElement("p");
    p.innerHTML =
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at <br/> its layout. The point of using Lorem Ipsum is that it has a.";
    p.classList.add("text-sm", "text-gray-400");
    div.append(img, h1, p);
    cardsGroup.append(div);
  }

  data.forEach((petObj) => {
    const {
      petId,
      breed,
      category,
      date_of_birth,
      gender,
      image,
      pet_details,
      pet_name,
      price,
      vaccinated_status,
    } = petObj;
    cardsGroup.classList.remove("grid-cols-1");
    cardsGroup.classList.add("grid-cols-1", "lg:grid-cols-2", "xl:grid-cols-3");

    const card = document.createElement("div");
    card.classList.add("card");
    const img = document.createElement("img");
    img.src = image;
    img.classList.add("rounded-lg");

    const h3 = document.createElement("h3");
    h3.classList.add("card_h3");
    h3.innerText = pet_name;
    const infoSpanGroup = document.createElement("div");
    infoSpanGroup.classList.add("infoSpanGroup", "border-b", "pb-4");
    const span1 = document.createElement("span");
    span1.innerHTML = `<img src="./images/menubar.svg" alt=""/> Breed: ${
      breed || "N/A"
    }`;
    span1.classList.add("span1");
    const span2 = document.createElement("span");
    span2.innerHTML = `<img src="./images/calender.svg" alt=""/> Birth: ${
      date_of_birth || "N/A"
    }`;
    span2.classList.add("span2");
    const span3 = document.createElement("span");
    span3.innerHTML = `<img src="./images/gender.svg" alt=""/> Gender: ${
      gender || "N/A"
    }`;
    span3.classList.add("span3");
    const span4 = document.createElement("span");
    span4.innerHTML = `<img src="./images/dollar.svg" alt=""/> Price: $${
      price || "N/A"
    }`;
    span4.classList.add("span4");
    infoSpanGroup.classList.add("text-[#131313B2]");
    infoSpanGroup.append(span1, span2, span3, span4);
    const spanGroup = document.createElement("div");
    spanGroup.classList.add("spanGroup");
    const likeIcon = document.createElement("i");
    likeIcon.classList.add("likeIcon", "ri", "ri-thumb-up-line");
    likeIcon.onclick = () => {
      addLikedPet(petId);
    };
    const adopt = document.createElement("span");
    adopt.classList.add("adopt");
    adopt.innerText = "Adopt";
    adopt.onclick = () => hadleAdopt();
    const details = document.createElement("span");
    details.classList.add("adopt");
    details.innerText = "Details";
    details.onclick = () => {
      getPetById(petId);
    };
    spanGroup.append(likeIcon, adopt, details);
    card.append(img, h3, infoSpanGroup, spanGroup);
    cardsGroup.append(card);
  });
}
function displayCategories(data) {
  const { categories } = data;
  const categorySelect = document.getElementById("categorySelect");

  categories.forEach((categoryObj) => {
    const { id, category, category_icon } = categoryObj;
    const span = document.createElement("span");
    span.classList.add(
      "px-8",
      "py-4",
      "flex",
      "items-center",
      "justify-center",
      "cursor-pointer",
      "gap-2",
      "font-bold",
      "border",
      "rounded-lg",
      "text-xl"
    );
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "category";
    input.id = id;
    input.value = category;
    input.classList.add("hidden");
    const label = document.createElement("label");
    label.htmlFor = id;
    span.append(input);
    span.style.userSelect = "none";
    const img = document.createElement("img");
    img.classList.add("w-6");
    img.src = category_icon;
    span.append(img, category);
    label.append(span);
    categorySelect.append(label);
    span.addEventListener("click", () => {
      if (input.checked && input.value === category) {
        input.checked = false;
        span.classList.add("categoryBtn");
        setTimeout(() => {
          getPetsByCategory(
            `https://openapi.programming-hero.com/api/peddy/category/${input.value}`
          );
        }, 2000);
        cardsGroup.innerHTML = "<span class='loader col-span-3'></span>";
      } else {
        input.checked = true;
        document.querySelectorAll(".selectSection span").forEach((el) => {
          el.classList.remove("categoryBtn");
        });
      }
    });
  });
}
function hadleAdopt() {
  const adoptedPet = document.getElementById("adoptModal");
  adoptedPet.classList.remove("hidden");
  let timeleft = 3;
  const x = setInterval(function () {
    document.getElementById("countdown").innerHTML = timeleft + "s";
    timeleft--;
    if (timeleft < 0) {
      clearInterval(x);
      adoptedPet.classList.add("hidden");
    }
  }, 1000);
}
function displayPetById(data) {
  const {
    breed,
    date_of_birth,
    gender,
    image,
    pet_details,
    pet_name,
    price,
    vaccinated_status,
  } = data.petData;
  const targetedModal = `
   <div id="modal" class="modal px-4 fixed top-0 left-0 w-full h-full bg-[#00000080] flex justify-center items-center ">
      <div class="w-full md:w-2/3 lg:w-1/2 xl:w-1/4 h-[700px] overflow-y-scroll bg-white mx-auto my-auto rounded-lg p-4">
          <img src=${image} alt=${image} class="h-[300px] w-full" />
          <div class="about py-3">
              <h3 class="text-xl font-bold">${pet_name}</h3>
              <div class="infoSpanGroup border-b py-3 text-[#131313B2] flex flex-col lg:flex-row ">
                  <div>
                      <span class="span1">
                          <img src='./images/menubar.svg' alt='./images/dollar.svg' />Breed: ${breed}
                      </span>
                      <span class="span3">
                          <img src='./images/gender.svg' alt='./images/dollar.svg' />Gender: ${gender}
                      </span>
                      <span class="span3">
                          <img src='./images/gender.svg' alt='./images/dollar.svg' />Vaccinated Status: ${vaccinated_status}
                      </span>
                  </div>
                  <div>
                      <span class="span2">
                          <img src='./images/calender.svg' alt='./images/dollar.svg' />Birth: ${date_of_birth}
                      </span>
                      <span class="span4">
                          <img src='./images/dollar.svg' alt='./images/dollar.svg' />Price : ${price}
                      </span>
                  </div>
              </div>
              <div class="details py-3 text-[#131313B2]">
                  <h3 class="text-md font-bold text-black">Details Information</h3>
                  <p class="text-sm">${pet_details}</p>
              </div>
              <button class="w-full py-2 font-bold bg-[#0E7A811A] text-[#0E7A81] border border-[#0E7A8133] rounded-lg"
                  onclick="closeModal()">Cancel</button>
          </div>
      </div>
  </div>
  `;
  document.body.insertAdjacentHTML("beforeend", targetedModal);
}
function saveLikedPet(data) {
  const {
    petData: { image },
  } = data;
  console.log(image);

  const img = `<img src=${image} alt=${image} class="rounded-lg p-2 border" />`;
  document
    .getElementById("selectedPhotoGroup")
    .insertAdjacentHTML("beforeend", img);
}
function closeModal() {
  document.getElementById("modal").remove();
}
function toggleMenu() {
  const menu = document.getElementById("menu");
  const menuIcon = document.getElementById("menuIcon");
  menu.classList.toggle("hidden");
  if (menu.classList.contains("hidden")) {
    menuIcon.classList.remove("ri-close-line");
    menuIcon.classList.add("ri-menu-line");
  } else {
    menuIcon.classList.remove("ri-menu-line");
    menuIcon.classList.add("ri-close-line");
  }
}
function displayPets(data) {
  const { pets } = data;
  setTimeout(() => {
    pets.forEach((petObj) => {
      const { petId, breed, date_of_birth, gender, image, pet_name, price } =
        petObj;
      cardsGroup.classList.remove("grid-cols-1");
      cardsGroup.classList.add(
        "grid-cols-1",
        "lg:grid-cols-2",
        "xl:grid-cols-3"
      );
      const card = document.createElement("div");
      card.classList.add("card");
      const img = document.createElement("img");
      img.src = image;
      img.classList.add("rounded-lg", "w-[300px]");
      const h3 = document.createElement("h3");
      h3.classList.add("card_h3");
      h3.innerText = pet_name;
      const infoSpanGroup = document.createElement("div");
      infoSpanGroup.classList.add("infoSpanGroup", "border-b", "pb-4");
      const span1 = document.createElement("span");
      span1.innerHTML = `<img src="./images/menubar.svg" alt=""/> Breed: ${
        breed || "N/A"
      }`;
      span1.classList.add("span1");
      const span2 = document.createElement("span");
      span2.innerHTML = `<img src="./images/calender.svg" alt=""/> Birth: ${
        date_of_birth || "N/A"
      }`;
      span2.classList.add("span2");
      const span3 = document.createElement("span");
      span3.innerHTML = `<img src="./images/gender.svg" alt=""/> Gender: ${
        gender || "N/A"
      }`;
      span3.classList.add("span3");
      const span4 = document.createElement("span");
      span4.innerHTML = `<img src="./images/dollar.svg" alt=""/> Price: $${
        price || "N/A"
      }`;
      span4.classList.add("span4");
      infoSpanGroup.classList.add("text-[#131313B2]");
      infoSpanGroup.append(span1, span2, span3, span4);
      const spanGroup = document.createElement("div");
      spanGroup.classList.add("spanGroup");
      const likeIcon = document.createElement("i");
      likeIcon.classList.add("likeIcon", "ri", "ri-thumb-up-line");
      likeIcon.onclick = () => {
        addLikedPet(petId);
      };
      const adopt = document.createElement("span");
      adopt.classList.add("adopt");
      adopt.innerText = "Adopt";
      adopt.onclick = () => hadleAdopt();
      const details = document.createElement("span");
      details.classList.add("adopt");
      details.innerText = "Details";
      details.onclick = () => {
        getPetById(petId);
      };
      spanGroup.append(likeIcon, adopt, details);
      card.append(img, h3, infoSpanGroup, spanGroup);
      cardsGroup.append(card);
    });
    document.getElementsByClassName("loader")[0].remove();
  }, 2000);
  cardsGroup.innerHTML = "<span class='loader col-span-3'></span>";
}
getPets(`https://openapi.programming-hero.com/api/peddy/pets`);
getCategories("https://openapi.programming-hero.com/api/peddy/categories");
