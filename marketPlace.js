function main() {
  const discomdiv = document.getElementById("check-discom");
  discomdiv.style.display = "flex"
  const location = localStorage.getItem("location");
  const getDiscom = getCookie("discomValue")
  if (getDiscom !== null) {
    document.getElementById('discom-header-value').textContent = getDiscom;
  }
  if (location !== null) {
    const locationElement = document.querySelector('.text-block-184');
    if (locationElement) {
      locationElement.textContent = location;
    }
    const locationElement2 = document.querySelector('.bold-text-19');
    if (locationElement2) {
      locationElement2.textContent = location;

      const formWrapper = document.getElementById('form-input');
      const dropdownWrapper = document.getElementById('dropdown-input');
      console.log("from div");
      console.log(formWrapper)

      if (location === "delhi") {
        // Show the input field and hide the dropdown
        formWrapper.style.display = 'block';
        dropdownWrapper.style.display = 'none';
      } else {
        // Show the dropdown and hide the input field
        formWrapper.style.display = 'none';
        dropdownWrapper.style.display = 'block';
      }
    }
  }

  const url = window.location.search;
  const cleanedUrl = url.startsWith('?') ? url.substring(1) : url;
  const paramsObject = convertURL(cleanedUrl);
  console.log(paramsObject)
  showFilter(paramsObject)
  markCheck(paramsObject)
  dynamicQuery(paramsObject)
}

async function dynamicQuery(filters) {
  const location = localStorage.getItem("location");
  let table = "products";
  if (location === "delhi") {
    table = "products"
  } else {
    table = "kerala_products"
  }

  console.log(filters)
  let query = window.supabaseClient
    .from(table)
    .select("*")
  const getDiscom = getCookie("discomValue")
  if (getDiscom) {
    if (location === "delhi") {
      const disCom = getEnergyBoard(getDiscom);
      query.eq("core_discom", disCom)
    } else {
      query.like("core_vendor_district", `%${getDiscom}%`)

    }
  }


  filters.forEach(condition => {
    const [key, value] = Object.entries(condition)[0];
    if (Array.isArray(value)) {
      // Use .in() for array values
      query = query.in(key, value);
    } else {
      // Use .eq() for single values
      query = query.eq(key, value);
    }
    console.log(query);
  });
  const { data, error } = await query.limit(25);

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Fetched data:", data);
    // if (data) {
    //   console.error("cardrMask element not found");
    // } else {
    const cardMask = document.getElementById('card-div');

    //   if (data) {
    data.forEach(async (item) => {

      const card = createCard(item);

      if (card) {
        cardMask.appendChild(card);
      } else {
        console.error("Failed to create card for item:", item);
      }
    });
    //   } else {
    //     console.log("error");
    //   }
    // }
  }
}

function calculateSizeE(electricityBill) {
  const step1 = electricityBill / 2;
  const step2 = step1 / 7;
  const step3 = step2 / 30;
  const step4 = step3 / 4;
  const size_e = step4 * 1.2;
  return size_e;
}

function getSizeR(roof_area) {
  const trimmedRoofArea = roof_area.replace(/\u00A0/g, " ").trim();
  let size_r;

  if (trimmedRoofArea === "200 - 500 sq ft") {
    size_r = 300 / 80;
  } else if (trimmedRoofArea === "500 - 1000 sq ft") {
    size_r = 750 / 80;
  } else if (trimmedRoofArea === "1000 - 1500 sq ft") {
    size_r = 1250 / 80;
  } else if (trimmedRoofArea === "1500 - 2000 sq ft") {
    size_r = 1750 / 80;
  } else {
    size_r = 20;
  }

  return size_r;
}

function getEnergyBoard(pincode) {
  switch (pincode) {
    case "110002":
    case "110055":
    case "110005":
    case "110001":
    case "110008":
    case "110003":
    case "110011":
    case "110006":
    case "110012":
    case "110060":
    case "110004":
    case "110092":
    case "110051":
    case "110032":
    case "110053":
    case "110091":
    case "110094":
    case "110095":
    case "110031":
    case "110096":
    case "110093":
      return "BSES Yamuna";
    case "110007":
    case "110084":
    case "110054":
    case "110033":
    case "110036":
    case "110034":
    case "110052":
    case "110039":
    case "110042":
    case "110040":
    case "110086":
    case "110081":
    case "110009":
    case "110035":
    case "110088":
    case "110082":
    case "110083":
    case "110085":
    case "110089":
    case "110056":
      return "TPDDL";
    case "110025":
    case "110062":
    case "110019":
    case "110024":
    case "110049":
    case "110044":
    case "110020":
    case "110017":
    case "110013":
    case "110065":
    case "110048":
    case "110014":
    case "110076":
    case "110010":
    case "110038":
    case "110075":
    case "110021":
    case "110029":
    case "110047":
    case "110028":
    case "110071":
    case "110077":
    case "110061":
    case "110074":
    case "110072":
    case "110073":
    case "110030":
    case "110016":
    case "110037":
    case "110068":
    case "110045":
    case "110067":
    case "110043":
    case "110078":
    case "110023":
    case "110070":
    case "110064":
    case "110046":
    case "110022":
    case "110066":
    case "110057":
    case "110058":
    case "110018":
    case "110026":
    case "110015":
    case "110059":
    case "110027":
    case "110063":
    case "110087":
    case "110041":
      return "BSES Rajdhani";
    case "208002":
    case "209401":
    case "208011":
    case "208003":
    case "209401":
    case "208009":
    case "208009":
    case "208002":
    case "208017":
    case "208001":
    case "209217":
    case "208017":
    case "209401":
    case "208027":
    case "208027":
    case "209401":
    case "209401":
    case "209402":
    case "209305":
    case "209214":
    case "209305":
    case "209402":
    case "209305":
    case "209214":
    case "208024":
    case "209304":
    case "208001":
    case "209304":
    case "209217":
    case "208007":
    case "208008":
    case "209305":
    case "208008":
    case "208003":
    case "209214":
    case "209214":
    case "208013":
    case "208001":
    case "208001":
    case "208012":
    case "209214":
    case "209214":
    case "208001":
    case "208013":
    case "208001":
    case "208002":
    case "208001":
    case "208001":
    case "209304":
    case "208007":
    case "209214":
    case "209401":
    case "209401":
    case "208006":
    case "208006":
    case "208002":
    case "208001":
    case "208007":
    case "209401":
    case "209214":
    case "208007":
    case "209402":
    case "208001":
    case "208002":
    case "208005":
    case "208016":
    case "208026":
    case "208005":
    case "209217":
    case "208010":
    case "209214":
    case "209402":
    case "208012":
    case "209304":
    case "208014":
    case "208001":
    case "208024":
    case "209214":
    case "209214":
    case "208017":
    case "209402":
    case "208004":
    case "208001":
    case "208001":
    case "208001":
    case "209402":
    case "208021":
    case "209214":
    case "209214":
    case "208021":
    case "208012":
    case "208017":
    case "208004":
    case "208017":
    case "208011":
    case "208007":
    case "209401":
    case "209402":
    case "209402":
    case "209402":
    case "209402":
    case "209214":
    case "209217":
    case "209305":
    case "208004":
    case "208023":
    case "208002":
    case "208021":
    case "208004":
    case "209217":
    case "208004":
    case "209401":
    case "209401":
    case "208021":
    case "208001":
    case "208025":
    case "208002":
    case "208001":
    case "208015":
    case "208014":
    case "208017":
    case "208001":
    case "209217":
    case "209401":
    case "209401":
    case "208020":
    case "208020":
    case "209402":
    case "209304":
    case "209217":
    case "208001":
    case "209402":
    case "208021":
    case "209402":
    case "208002":
    case "209402":
    case "208012":
    case "208004":
    case "209304":
    case "209214":
    case "208012":
    case "209304":
    case "209401":
    case "208022":
    case "208019":
    case "208011":
    case "209402":
    case "209304":
    case "208025":
    case "209402":
    case "208021":
    case "209214":
    case "209401":
    case "209402":
    case "208005":
    case "209401":
    case "209401":
    case "209305":
    case "208005":
    case "208010":
    case "208013":
    case "209214":
    case "208012":
    case "209402":
    case "208002":
    case "208019":
    case "208023":
    case "209217":
    case "208021":
    case "209217":
    case "209402":
    case "209214":
    case "208022":
    case "208005":
    case "208011":
    case "209203":
    case "209206":
      return "KESCO";
    default:
      if (pincode.startsWith("20")) {
        return "PVVNL/NPCL";
      } else if (pincode.startsWith("12") || pincode.startsWith("13")) {
        return "DHBVNL";
      } else {
        $(".mp-error-cont").css("display", "block");
      }
  }
}

main()

function markCheck(paramsObject) {
  paramsObject.forEach(obj => {
    const key = Object.keys(obj)[0];
    const value = obj[key];
    console.log("value: " + value);

    if (Array.isArray(value)) {
      // If the value is an array, iterate over each item
      value.forEach(item => {
        const div = document.getElementById(item);
        if (div) {
          div.style.backgroundColor = 'black';
        }
      });
    } else {
      // If the value is not an array, directly use it
      const div = document.getElementById(value);
      if (div) {
        div.style.backgroundColor = 'black';
      }
    }
  });
}


function showFilter(paramsObject) {
  const divBlock166 = document.getElementsByClassName("div-block-166");
  if (divBlock166) {
    paramsObject.forEach(obj => {
      const key = Object.keys(obj)[0];  // Assuming each object has one key-value pair
      const value = obj[key];

      for (let i = 0; i < divBlock166.length; i++) {
        divBlock166[i].style.overflow = "auto";

        const filterChip = document.createElement("div");

        filterChip.className = "filter-chip"; // Create the filter-chip div

        const filterName = document.createElement("div");
        filterName.className = "text-block-181";
        filterName.style.display = "flex";
        filterName.style.alignItems = "center";
        filterName.style.gap = "3px";
        filterName.style.cursor = "pointer";
        // Setting the text content based on the length of the value
        const printValue = value.length == 1 ? value + "kw" : value;
        filterName.innerHTML = `<strong>${printValue}</strong>`;
        // `<svg fill="#033e4d" width="18px" height="18px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#b5b5b5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cross-round</title> <path d="M0 16q0 3.264 1.28 6.208t3.392 5.12 5.12 3.424 6.208 1.248 6.208-1.248 5.12-3.424 3.392-5.12 1.28-6.208-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.264 1.6-6.016t4.384-4.352 6.016-1.632 6.016 1.632 4.384 4.352 1.6 6.016-1.6 6.048-4.384 4.352-6.016 1.6-6.016-1.6-4.384-4.352-1.6-6.048zM9.76 20.256q0 0.832 0.576 1.408t1.44 0.608 1.408-0.608l2.816-2.816 2.816 2.816q0.576 0.608 1.408 0.608t1.44-0.608 0.576-1.408-0.576-1.408l-2.848-2.848 2.848-2.816q0.576-0.576 0.576-1.408t-0.576-1.408-1.44-0.608-1.408 0.608l-2.816 2.816-2.816-2.816q-0.576-0.608-1.408-0.608t-1.44 0.608-0.576 1.408 0.576 1.408l2.848 2.816-2.848 2.848q-0.576 0.576-0.576 1.408z"></path> </g></svg>`

        filterChip.appendChild(filterName); // Append text-block-181 to filter-chip
        divBlock166[i].appendChild(filterChip); // Append filter-chip to div-block-166
      }
    });
  }
}


const sidebar = document.getElementById("sideBar");

document.getElementById("closeSideBar").addEventListener("click", () => {
  if (window.innerWidth < 768) {
    const sidebar = document.getElementById("sideBar");
    if (sidebar) {
      sidebar.style.transition = "left 0.5s ease-in-out"; // Add transition property
      sidebar.style.left = "-120%";
    } else {
      console.error("Element with ID 'sideBar' not found");
    }
  }
});


document.getElementById("openSidebar").addEventListener("click", () => {
  console.log("open button");
  if (window.innerWidth < 768) {
    const sidebar = document.getElementById("sideBar");
    sidebar.style.transition = "left 0.5s ease-in-out"; // Add transition property
    sidebar.style.left = "2%";
  }
});

function handleDivClick(event) {

  const clickedElement = event.target;
  checkButton()
  if (clickedElement.hasAttribute("el-filter")) {
    const elFilterValue = clickedElement.getAttribute("el-filter");
    const id = clickedElement.getAttribute("id");
    createUrl(elFilterValue, id);
    return elFilterValue;
  }
}



document
  .querySelector(".div-block-150")
  .addEventListener("click", handleDivClick);

const urlParams = [];
let finalURl

// Function to create URL parameters
function createUrl(elFilterValue, value) {
  let param = null;
  for (let item of urlParams) {
    if (item[elFilterValue]) {
      param = item;
      break;
    }
  }

  if (param) {
    if (!param[elFilterValue].includes(value)) {
      param[elFilterValue].push(value);
    }
  } else {
    let newParam = {};
    newParam[elFilterValue] = [value];
    urlParams.push(newParam);
    console.log("Updated urlParams:", urlParams);
  }

  console.log(urlParams);
  markCheck(urlParams)

  serachFilter();
}
function serachFilter() {
  console.log(urlParams);
  const queryString = urlParams
    .map((param) => {
      const key = Object.keys(param)[0];
      const values = param[key];
      return `${key}=${values.join("+")}`;
    })
    .join("&");

  const currentUrl = `${location.protocol}//${location.host}${location.pathname}`;
  finalURl = `${currentUrl}?${queryString}`;
}

document.getElementById('search-url').addEventListener('click', function() {
  location.href = finalURl;
});

function convertURL(url) {
  const params = url.split('&');
  const resultArray = [];
  params.forEach(param => {
    if (param) {
      const [key, value] = param.split('=');
      if (key && value) {
        const cleanedValue = decodeURIComponent(value);
        let valuesArray = cleanedValue.split('+');
        valuesArray = valuesArray.map(val => val.replace(/-/g, ' '));
        resultArray.push({
          [key]: valuesArray.length > 1 ? valuesArray : valuesArray[0]
        });
      }
    }
  });

  return resultArray;
}

function createCard(item) {
  const location = localStorage.getItem("location");
  const redirectUrl = location === "delhi" ? "product" : "product-kerala";
  const card = document.createElement("div");

  card.className = `div-block-127`;
  // card.setAttribute("aria-label", `${cardNumber}`);
  card.style.minHeight = "320px";
  // card.innerHTML = `<p>${item.id}</p>`
  card.innerHTML = `
        <a w-el="link" href="/${redirectUrl}?id=${item.id
    }" class="img-gradient-4 w-inline-block" data-id="${item.id}"">
          <img width="100" height="Auto" alt="${item.core_product_name
    }" srcset="https://ukzzjbbakdwnhqinxucz.supabase.co/storage/v1/object/public/card-hero-image/${item.core_card_image
    }?width=100" w-el="product_card_hero_image_k" class="marketplace-product-image-6" w-el-src="https://cdn.prod.website-files.com/6686a2af6794e55ac4dc8df9/6686e2" w-el-srcset="" srcset="https://ukzzjbbakdwnhqinxucz.supabase.co/storage/v1/object/public/card-hero-image/Hero-solx-1.webp?width=100" />
          <div class="img-gradient-4">
            <div class="img-upper-part-2">
            <div id="value-wrapper" w-el="value-badge" class="product-card-badge-3" 
            style="background-color: ${item.core_price_tag === "Standard"
      ? "#C1CE56"
      : item.core_price_tag == "Premium"
        ? "#023E4D"
        : item.core_price_tag == "Assured"
          ? "#36B457"
          : "#023E4D"
    }">
            <h6 id="value" w-el="core_value" fs-cmsfilter-field="core_value" class="value-label-5" 
              w-el-text="${item.core_price_tag}">
              ${item.core_price_tag}
            </h6>
          </div>
            </div>
            <div class="img-lower-part-5">
              <h5 w-el="core_product_name_k" class="heading-59" w-el-text="${item.core_product_name
    }">${item.core_product_name}</h5>
              <h5 w-el="core_vendor_name_k" class="heading-60" w-el-text="${item.core_product_vendor
    }">${item.core_product_vendor}</h5>
            </div>
          </div>
        </a>
        <div class="fav-and-compare-container-2">
          <a w-el="heart-icon-link" href="#" class="heart-icon w-inline-block">
            <img w-el="heart-icon" width="8.5" height="Auto" alt="favorites-icon" src="https://cdn.prod.website-files.com/6686a2af6794e55ac4dc8df9/6686a2af6794e55ac4dc8f6c_Favourite.svg" loading="lazy" id="favorite-icon" class="favourite-button-product" data-id-img="${item.id
    }" />
          </a>
        </div>
        <a w-el="link" href="/${redirectUrl}?id=${item.id
    }" class="details-part-6 w-inline-block" data-id="${item.id}">
          <div class="details-wrapper-5">
            <div class="product-details-6">
              <h3 class="product-price-5">₹ <span w-el="core_price_gst_exclusive_k" class="text-span-58" w-el-text="${item.core_price_gst_exclusive.toLocaleString(
      "en-IN"
    )}">${item.core_price_gst_exclusive.toLocaleString(
      "en-IN"
    )}</span></h3>
              <h4 class="product-emi-6">EMI ₹ <span w-el="core_emi_amount_k" w-el-text="${item.core_monthly_emi.toLocaleString(
      "en-IN"
    )}">${item.core_monthly_emi.toLocaleString(
      "en-IN"
    )}</span> /month</h4>
              <div class="panel-and-structure-type-5">
                <div class="panel-type panel-structure-label">
                  <h6 w-el="spec_1_k" class="panel-type-label-4" w-el-text="${item.specs_panel_type
    }">${item.specs_panel_type}</h6>
                </div>
                <div class="structure-type panel-structure-label">
                  <h6 w-el="spec_2_k" class="structure-type-label-5" w-el-text="${item.specs_strmtr_structure_type
    }">${item.specs_strmtr_structure_type}</h6>
                </div>
              </div>
            </div>
          </div>
          <div class="other-details-6">
            <div id="w-node-_869255f7-3baf-a46d-0233-933da5b0f39e-c620d89f" class="other-details-labels-2">
              <h5 w-el="specs_panel_brand_k" class="details-label-text-5" w-el-text="${item.specs_panel_brand
    }">${item.specs_panel_brand}</h5>
              <h5 class="details-label-text-5 details-type-label">PANEL</h5>
            </div>
            <div id="w-node-_869255f7-3baf-a46d-0233-933da5b0f3a3-c620d89f" class="other-details-labels-2">
              <h5 w-el="specs_inverter_company_k" class="details-label-text-5" w-el-text="${item.specs_inverter_company
    }">${item.specs_inverter_company}</h5>
              <h5 class="details-label-text-5 details-type-label">INVERTER</h5>
            </div>
            <div class="div-block-134">
              <div id="w-node-_869255f7-3baf-a46d-0233-933da5b0f3a9-c620d89f" class="other-details-labels-flex">
                <div class="other-details-labels-inner">
                  <h5 w-el="specs_no_of_panels" class="details-label-text-5" w-el-text="${item.specs_panel_number
    }">${item.specs_panel_number}</h5>
                  <h5 class="details-label-text-5 details-type-label">PANELS</h5>
                </div>
              </div>
              <div id="w-node-_869255f7-3baf-a46d-0233-933da5b0f3af-c620d89f" class="other-details-labels-flex">
                <div class="other-details-labels-inner">
                  <h5 w-el="specs_dc_capacity_kw_k" class="details-label-text-5" w-el-text="${item.specs_dc_capacity
    }">${item.specs_dc_capacity}</h5>
                  <h5 class="details-label-text-5 details-type-label">kW DC</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="subsidy-details-5">
            <div class="subsidy-label-2 subsidy-amount">
              <h6 class="subsidy-product-3">Subsidy : ₹<span w-el="spec_subsidy_price_k" w-el-text="${item.core_price_additional_subsidy
    }">${item.core_price_additional_subsidy}</span></h6>
            </div>
          </div>
        </a>
    `;

  // const phoneNumber = localStorage.getItem("phoneNumberFinalVal");
  // const favButton = slide.querySelector("[w-el='heart-icon-link']");
  // const image = slide.querySelector("[w-el='heart-icon']");

  // if (favButton) {
  //   favButton.setAttribute("data-id", item.id);
  //   image.setAttribute("data-id-image", item.id);
  //   const src_image = await checkSelectedProductIds(
  //     location,
  //     phoneNumber,
  //     item.id
  //   );
  //   image.setAttribute("src", src_image);

  //   favButton.addEventListener("click", async function(event) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     if (phoneNumber != null) {
  //       await updateSelectedProductIds(location, phoneNumber, item.id);
  //     } else {
  //       window.location.href = `/customer/login`;
  //     }
  //   });
  // }

  return card;
}


document.addEventListener("DOMContentLoaded", () => {
  const shortingButton = document.getElementById("shorting");
  if (shortingButton) {
    let count = 0; // Move count outside the event listener to maintain state between clicks
    shortingButton.addEventListener("click", () => {
      console.log("sorting sorting");

      let isOpen;
      if (count % 2) {
        isOpen = true;
      } else {
        isOpen = false;
      }

      const sortingCard = document.getElementById("sorting-card");
      console.log(sortingCard);
      if (sortingCard) {
        if (isOpen) {
          sortingCard.style.display = "flex";
        } else {
          sortingCard.style.display = "none";
        }
      } else {
        console.error("Element with ID 'sorting-card' not found");
      }

      count++;
      console.log(count);
    });
  } else {
    console.error("Element with ID 'shorting' not found");
  }
});


function checkButton() {
  if (urlParams) {
    document.getElementById("closeSideBar").style.display = "none";
    document.getElementById("search-url").style.display = "block";

  } else {
    document.getElementById("closeSideBar").style.display = "block";
    document.getElementById("search-url").style.display = "none";
  }
}





document.getElementById('check-discom').addEventListener('click', function() {

  const divBlock = document.querySelector('.div-block-169');
  const location = localStorage.getItem("location");

  if (location !== null) {
    const locationElement = document.querySelector('.bold-text-19');
    if (locationElement) {
      locationElement.textContent = location;

      const formWrapper = document.getElementById('form-input');
      const dropdownWrapper = document.getElementById('dropdown-input');
      console.log("from div");
      console.log(formWrapper)
      const district = [
        "Kannur",
        "Wayanad",
        "Malappuram",
        "Palakkad",
        "Thrissur",
        "Pathanamthitta",
        "Alappuzha",
        "Kollam",
        "Thiruvananthapuram"
      ];
      if (location === "delhi") {
        // Show the input field and hide the dropdown
        formWrapper.style.display = 'block';
        dropdownWrapper.style.display = 'none';
      } else {
        // Show the dropdown and hide the input field
        formWrapper.style.display = 'none';
        dropdownWrapper.style.display = 'block';
        // Clear previous content in dropdownWrapper
        dropdownWrapper.innerHTML = '';

        // Create a select element
        const select = document.createElement('select');
        select.className = 'custom-select';
        select.id = "dropdown-option" // You can add a custom class for styling
        // Apply styles to the select element
        select.style.width = '280px';
        select.style.height = '30px';         // Set the width of the dropdown
        // Set the width of the dropdown
        select.style.borderRadius = '30px';
        // Create option elements for each district
        district.forEach(districtName => {
          const option = document.createElement('option');
          option.style.width = "280px"
          option.style.rediouse = "30px"
          option.value = districtName;
          option.textContent = districtName;
          select.appendChild(option);
        });

        // Append the select element to the dropdownWrapper
        dropdownWrapper.appendChild(select);

      }
    }
  }
  console.log(divBlock)
  divBlock.style.display = 'flex'
  if (divBlock.style.display) {
    divBlock.style.display = 'flex';
  } else {
    divBlock.style.display = 'flex';
  }
  keralaCode()
});


// document.getElementById("pincode-submit").addEventListener("click", function() {
//   const pincodeValue = document.getElementById("pincode-input").value;
//   if (pincodeValue) {
//     localStorage.setItem("discomValue", pincodeValue);
//   }

//   console.log("Pincode saved to localStorage:", pincodeValue);
//   const divBlock = document.querySelector('.div-block-169');
//   divBlock.style.display = 'none';
// });
// function keralaCode() {
//   const dropdown = document.getElementById("dropdown-option");

//   if (dropdown) {
//     // Retrieve and set the saved value on page load
//     const savedValue = localStorage.getItem("discomValue");
//     if (savedValue) {
//       dropdown.value = savedValue;
//       const divBlock = document.querySelector('.div-block-169');
//       divBlock.style.display = 'none'; // Apply the same logic if needed
//     }

//     dropdown.addEventListener("change", function() {
//       console.log("Dropdown value changed");
//       const selectedValue = this.value;
//       if (selectedValue) {
//         localStorage.setItem("discomValue", selectedValue);

//       }
//       console.log("Dropdown value saved to localStorage:", selectedValue);

//       const divBlock = document.querySelector('.div-block-169');
//       divBlock.style.display = 'none';
//     });
//   } else {
//     console.error("Dropdown element not found");
//   }
// }

// Helper functions to set and get cookies
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
  location.reload()
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(cname) === 0) {
      return cookie.substring(cname.length, cookie.length);
    }
  }
  return "";
}

document.getElementById("pincode-submit").addEventListener("click", function() {
  const pincodeValue = document.getElementById("pincode-input").value;
  if (pincodeValue) {
    setCookie("discomValue", pincodeValue, 7); // Set cookie for 7 days
  }

  console.log("Pincode saved to cookies:", pincodeValue);
  const divBlock = document.querySelector('.div-block-169');
  divBlock.style.display = 'none';
});

function keralaCode() {
  const dropdown = document.getElementById("dropdown-option");
  if (dropdown) {
    // Retrieve and set the saved value on page load
    const savedValue = getCookie("discomValue");
    if (savedValue) {
      dropdown.value = savedValue;
      const divBlock = document.querySelector('.div-block-169');
    }

    dropdown.addEventListener("change", function() {
      console.log("Dropdown value changed");
      const selectedValue = this.value;
      if (selectedValue) {
        setCookie("discomValue", selectedValue, 7); // Set cookie for 7 days
      }
      console.log("Dropdown value saved to cookies:", selectedValue);

      const divBlock = document.querySelector('.div-block-169');
    });
  } else {
    console.error("Dropdown element not found");
  }
}
