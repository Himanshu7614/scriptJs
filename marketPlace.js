let urlData
function main() {
    localStorage.setItem("HImahus", "choudhary");
    const discomdiv = document.getElementById("check-discom");
    discomdiv.style.display = "flex"
    const location = localStorage.getItem("location");
    let getDiscom
    if (location === "delhi") {
        getDiscom = getCookie("discomValueDl")
        document.getElementById('discom-header-value').innerText = getDiscom;

    } else {
        getDiscom = getCookie("discomValueKl")
        document.getElementById('discom-header-value').innerText = getDiscom;


    }
    if (window.innerWidth < 768) {
        document.getElementById("brand-logo").style.display = 'none';
    }

    if (!getDiscom) {
        const messageElement = document.createElement('p');
        messageElement.textContent = "Select Your pin / district for accurate result.";
        messageElement.style.fontWeight = 'bold';
        // Append the <h1> element to the element with id="card-div"
        document.getElementById('card-div-msg').appendChild(messageElement);
    }

    if (location !== null) {
        const locationElement = document.querySelector('.text-block-184');
        if (location === "delhi") {
            locationElement.textContent = "Delhi";

        } else {
            locationElement.textContent = "Kerala";


        }
        // if (locationElement) {
        //   locationElement.textContent = location;
        // }
        const locationElement2 = document.querySelector('.bold-text-19');
        if (locationElement2) {
            locationElement2.textContent = location;

            const formWrapper = document.getElementById('form-input');
            const dropdownWrapper = document.getElementById('dropdown-input');
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
    monthlyBill()
    const url = window.location.search;
    const cleanedUrl = url.startsWith('?') ? url.substring(1) : url;
    const paramsObject = convertURL(cleanedUrl);
    urlData = paramsObject
    console.log(paramsObject)
    showFilter(paramsObject)
    markCheck(paramsObject)
    dynamicQuery(paramsObject)
}

let offset = 0;
let limit = 24;

async function dynamicQuery(filters) {
    const location = localStorage.getItem("location");
    let table = "products";
    if (location === "delhi") {
        table = "products"
    } else {
        table = "kerala_products"
    }

    let query = window.supabaseClient
        .from(table)
        .select("*")

    if (location === "delhi") {
        const getDiscom = getCookie("discomValueDl")
        if (getDiscom) {
            const disCom = getEnergyBoard(getDiscom);
            query.eq("core_discom", disCom)
        }
    } else {
        const getDiscom = getCookie("discomValueKl")
        if (getDiscom) {

            query.like("core_vendor_district", `%${getDiscom}%`)

        }

    }

    filters.forEach(condition => {
        const [key, value] = Object.entries(condition)[0];
        if (Array.isArray(value)) {
            query = query.in(key, value);
        } else {
            query = query.eq(key, value);
        }
        console.log(query);
    });
    limit = filters.length === 0 ? 500 : 24

    const { data, error } = await query.range(offset, offset + limit - 1);

    let filterData;

    if (filters.length === 0) {
        console.log("hello-1")
        filterData = filterAndPrintData(data)
    } else {
        console.log("hello-2")

        filterData = data
    };

    if (data.length === 0) {
        const messageElement = document.createElement('p');
        messageElement.textContent = "Sorry, no products match your filter criteria.";
        messageElement.style.fontWeight = 'bold';
        messageElement.style.paddingTop = '50px';
        document.getElementById('card-div-msg').appendChild(messageElement);
    }


    if (error) {
        console.error("Error fetching data:", error);
    } else {
        console.log("Fetched data:", filterData);
        const sortOrder = 'asc'; // or 'desc'

        // Sort filterData based on core_price_gst_inclusive
        filterData.sort((a, b) => {
            const priceA = parseFloat(a.core_price_gst_inclusive);
            const priceB = parseFloat(b.core_price_gst_inclusive);

            if (sortOrder === 'asc') {
                return priceA - priceB; // For low to high
            } else {
                return priceB - priceA; // For high to low
            }
        });
        const cardMask = document.getElementById('card-div');

        // Iterate over the sorted data and create the cards
        filterData.forEach(async (item) => {
            const card = await createCard(item);
            if (card) {
                cardMask.appendChild(card);
            } else {
                console.error("Failed to create card for item:", item);
            }
        });
        // const cardMask = document.getElementById('card-div');
        // filterData.forEach(async (item) => {
        //   const card = await createCard(item);
        //   if (card) {
        //     cardMask.appendChild(card);
        //   } else {
        //     console.error("Failed to create card for item:", item);
        //   }
        // });

    }

    const loadMoreButton = document.getElementById('load-more');
    if (data.length < limit) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }

}

function calculateSizeE(electricityBill) {
    const step3 = electricityBill / 30;
    const step4 = step3 / 7;
    const size_e = step4 / 4;
    return Math.round(size_e);
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

main();

function markCheck(paramsObject) {
    // Get a list of all elements that have been styled
    const allStyledElements = document.querySelectorAll('[el-filter]');

    // Collect all IDs currently in the paramsObject
    const activeIds = new Set();

    paramsObject.forEach(obj => {
        const key = Object.keys(obj)[0];
        const value = obj[key];

        if (Array.isArray(value)) {
            value.forEach(item => activeIds.add(item));
        } else {
            activeIds.add(value);
        }
    });

    // Reset the background color for elements that are not active
    allStyledElements.forEach(div => {
        if (!activeIds.has(div.id)) {
            div.style.backgroundColor = ''; // Reset background color for inactive elements
        }
    });

    // Apply the active filter styles
    activeIds.forEach(id => {
        const div = document.getElementById(id);
        if (div) {
            div.style.backgroundColor = 'black';
        }
    });
}


function removeKeyFromObject(key) {
    urlData = urlData.filter(obj => !obj.hasOwnProperty(key));
    console.log("Updated Array:", urlData);
    const queryString = urlData
        .map((param) => {
            const key = Object.keys(param)[0];
            const values = param[key];
            return `${key}=${values}`;
        })
        .join("&");

    const currentUrl = `${location.protocol}//${location.host}${location.pathname}`;
    window.location.href = `${currentUrl}?${queryString}`;
}

function showFilter(paramsObject) {
    const divBlock166 = document.getElementsByClassName("div-block-166");
    // divBlock166.style.msOverflowStyle = "none";
    // divBlock166.style.scrollbarWidth = "none";
    if (divBlock166) {
        paramsObject.forEach(obj => {
            const key = Object.keys(obj)[0];  // Assuming each object has one key-value pair
            const value = obj[key];
            console.log("url data", urlData)
            for (let i = 0; i < divBlock166.length; i++) {
                divBlock166[i].style.overflow = "auto";

                const filterChip = document.createElement("div");
                filterChip.className = "filter-chip";

                const filterName = document.createElement("div");
                filterName.className = "text-block-181";
                filterName.id = key;
                filterName.style.display = "flex";
                filterName.style.alignItems = "center";
                filterName.style.gap = "3px";
                filterName.style.cursor = "pointer";
                filterName.style.whiteSpace = "nowrap";

                // Handling both single and array values
                let printValue;
                if (Array.isArray(value)) {
                    printValue = value.map(v => {
                        // Convert string to integer if it's a string, then check if it's a number
                        const numericValue = !isNaN(v) ? parseInt(v, 10) : v;
                        return (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 100) ? numericValue + "kw" : v;
                    }).join(", ");
                } else {
                    // Convert string to integer if it's a string, then check if it's a number
                    const numericValue = !isNaN(value) ? parseInt(value, 10) : value;
                    printValue = (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 100) ? numericValue + "kw" : value;
                }


                filterName.innerHTML = `<strong>${printValue}</strong> <svg fill="#033e4d" width="18px" height="18px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#b5b5b5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cross-round</title> <path d="M0 16q0 3.264 1.28 6.208t3.392 5.12 5.12 3.424 6.208 1.248 6.208-1.248 5.12-3.424 3.392-5.12 1.28-6.208-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.264 1.6-6.016t4.384-4.352 6.016-1.632 6.016 1.632 4.384 4.352 1.6 6.016-1.6 6.048-4.384 4.352-6.016 1.6-6.016-1.6-4.384-4.352-1.6-6.048zM9.76 20.256q0 0.832 0.576 1.408t1.44 0.608 1.408-0.608l2.816-2.816 2.816 2.816q0.576 0.608 1.408 0.608t1.44-0.608 0.576-1.408-0.576-1.408l-2.848-2.848 2.848-2.816q0.576-0.576 0.576-1.408t-0.576-1.408-1.44-0.608-1.408 0.608l-2.816 2.816-2.816-2.816q-0.576-0.608-1.408-0.608t-1.44 0.608-0.576 1.408 0.576 1.408l2.848 2.816-2.848 2.848q-0.576 0.576-0.576 1.408z"></path> </g></svg>`;
                filterChip.appendChild(filterName); // Append text-block-181 to filter-chip
                divBlock166[i].appendChild(filterChip); // Append filter-chip to div-block-166


                // document.getElementById('container').appendChild(filterName);

                // Add click event listener to remove the key from the object
                document.getElementById(key).addEventListener("click", function() {
                    removeKeyFromObject(key);
                    filterName.remove(); // Optionally remove the element from the DOM
                });

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

// function handleDivClick(event) {

//     const clickedElement = event.target;
//     if (clickedElement.id === "monthly-bill") {
//         clickedElement.addEventListener('change', function() {
//             const inputValue = clickedElement.value;
//             createUrl("specs_ac_capacity", calculateSizeE(inputValue));
//         });
//     }

//     checkButton()
//     if (clickedElement.hasAttribute("el-filter")) {
//         const elFilterValue = clickedElement.getAttribute("el-filter");
//         const id = clickedElement.getAttribute("id");

//         // Check if the filter is already applied
//         if (isFilterApplied(elFilterValue, id)) {
//             removeFilter(elFilterValue, id); // Remove the filter if it is already applied
//         } else {
//             createUrl(elFilterValue, id); // Add the filter if not applied
//         }
//     }
// }

// document
//     .querySelector(".div-block-150")
//     .addEventListener("click", handleDivClick);

// function removeFilter(elFilterValue, id) {
//     // Implement logic to remove the filter from the URL or state
//     const urlParams = new URLSearchParams(window.location.search);
//     urlParams.delete(elFilterValue);
//     updateUrl(urlParams.toString());
// }

function handleDivClick(event) {
    const clickedElement = event.target;

    if (clickedElement.id === "monthly-bill") {
        clickedElement.addEventListener('change', function() {
            const inputValue = clickedElement.value;
            createUrl("specs_ac_capacity", calculateSizeE(inputValue));
        });
    }



    if (clickedElement.hasAttribute("el-filter")) {
        const elFilterValue = clickedElement.getAttribute("el-filter");
        const id = clickedElement.getAttribute("id");

        // Create or remove filter based on its current state
        createUrl(elFilterValue, id);
    }
}

document
    .querySelector(".div-block-150")
    .addEventListener("click", handleDivClick);


document.getElementById('load-more').addEventListener('click', () => {
    console.log("load more more laod")
    offset += limit; // Increase offset by limit
    dynamicQuery(urlData); // Call the function with the updated offset
});



const urlParams = [];
let finalURl

// Function to create URL parameters
function createUrl(elFilterValue, value) {
    checkButton();
    let param = null;
    let paramIndex = -1;

    // Find the filter in the existing urlParams array
    for (let i = 0; i < urlParams.length; i++) {
        if (urlParams[i][elFilterValue]) {
            param = urlParams[i];
            paramIndex = i;
            break;
        }
    }

    if (param) {
        // Check if the value is already in the filter array
        const valueIndex = param[elFilterValue].indexOf(value);
        if (valueIndex !== -1) {
            // If the value exists, remove it
            param[elFilterValue].splice(valueIndex, 1);

            // If the array becomes empty, remove the entire filter object
            if (param[elFilterValue].length === 0) {
                urlParams.splice(paramIndex, 1);
            }
        } else {
            // If the value doesn't exist, add it
            param[elFilterValue].push(value);
        }
    } else {
        // If the filter doesn't exist, add it
        let newParam = {};
        newParam[elFilterValue] = [value];
        urlParams.push(newParam);
    }
    selectionCondition()
    console.log("Updated urlParams:", urlParams);
    markCheck(urlParams);
    serachFilter(urlParams);
}


// function createUrl(elFilterValue, value) {
//     let paramIndex = null;
//     let param = null;

//     // Find if the filter is already in urlParams
//     for (let i = 0; i < urlParams.length; i++) {
//         if (urlParams[i][elFilterValue]) {
//             paramIndex = i;
//             param = urlParams[i];
//             break;
//         }
//     } 

//     if (param) {
//         const valueIndex = param[elFilterValue].indexOf(value);

//         if (valueIndex !== -1) {
//             // Value exists, remove it (toggle off)
//             param[elFilterValue].splice(valueIndex, 1);

//             // If the array is empty after removal, remove the whole parameter
//             if (param[elFilterValue].length === 0) {
//                 urlParams.splice(paramIndex, 1);
//             }
//         } else {
//             // Value does not exist, add it (toggle on)
//             param[elFilterValue].push(value);
//         }
//     } else {
//         // If param doesn't exist, create a new one
//         let newParam = {};
//         newParam[elFilterValue] = [value];
//         urlParams.push(newParam);
//     }

//     console.log("Updated urlParams:", urlParams);
//     markCheck(urlParams);

//     serachFilter(urlParams);
// }

// function createUrl(elFilterValue, value) {
//     let param = null;
//     let paramIndex = -1;

//     // Find the filter in the existing urlParams array
//     for (let i = 0; i < urlParams.length; i++) {
//         if (urlParams[i][elFilterValue]) {
//             param = urlParams[i];
//             paramIndex = i;
//             break;
//         }
//     }

//     // If the filter is found
//     if (param) {
//         // Check if the value is already in the filter array
//         const valueIndex = param[elFilterValue].indexOf(value);
//         if (valueIndex !== -1) {
//             // If the value exists, remove it
//             param[elFilterValue].splice(valueIndex, 1);

//             // If the array becomes empty, remove the entire filter object
//             if (param[elFilterValue].length === 0) {
//                 urlParams.splice(paramIndex, 1);
//             }
//         } else {
//             // If the value doesn't exist, add it
//             param[elFilterValue].push(value);
//         }
//     } else {
//         // If the filter doesn't exist, add it
//         let newParam = {};
//         newParam[elFilterValue] = [value];
//         urlParams.push(newParam);
//     }

//     console.log("Updated urlParams:", urlParams);
//     markCheck(urlParams);
//     serachFilter(urlParams);
// }




function serachFilter(urlParams) {
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

async function createCard(item) {
    const location = localStorage.getItem("location");
    const redirectUrl = location === "delhi" ? "product" : "product-kerala";
    const card = document.createElement("div");

    card.className = `div-block-127`;
    // card.setAttribute("aria-label", `${cardNumber}`);
    card.style.minHeight = "320px";
    card.style.width = "full";


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
            : item.core_price_tag === "Premium"
                ? "#023E4D"
                : item.core_price_tag === "Assured"
                    ? "#79C145"
                    : item.core_price_tag === "Zircle Express"
                        ? "#79C145"
                        : ""
        }">
    ${item.core_price_tag === "Zircle Express" ?
            `     <svg width="24" height="24" viewBox="0 0 92 87" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="92" height="87" fill="url(#pattern0_2518_17085)" />
      <defs>
        <pattern id="pattern0_2518_17085" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image0_2518_17085" transform="matrix(0.00195312 0 0 0.00206537 0 -0.0287356)" />
        </pattern>
        <image id="image0_2518_17085" width="512" height="512" xlink:href="data:image/png;base64,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58Y3nALIlWmXUkFbAHzOlfIx2prXDC4CpGFXPyU30Vm5o4Lv3KflOmd6v4hikbf9aUQy2dy3BLgg7Toi2yjACSNtn//B4ASA0jG1bU/bJ7dA0Jh2KRGUFfg3XypcCG70QyOcbW47HirXANgx7VpCCfCEMb5jW+3PwUWAlI5n1vTq/nvcYLVBAWRRu5PR5wWmzZXyt6RdCNFw0HVrntC9D/yNiGkWYHza9SQmuNE1bG5399zxQtqlpKVWv3RpBMk0tc5QMVcC2C/tWoZAobjWqf9Gfz91om3MpNx2me3xPQXmobI7acb2EgRnue7CzWkXkjZOAKg6TO4Ynanb9F0FzkH135l6WkS+XO7O3512IURpq2tsO9wb+Q8AR6VdyyB0OoOvjMTGPklwAkDVJdt6mIU5D/37fFfb5/MVBS7yfQ2XcpU/0bvNN7b5gRPg9UcQHJB2Ne9jpUC+XS7lS2kXUk2q7QuWCMBf9iL/LoCZSP911fUKXOZNwyUVaWVKNFJM7Kg3O2/6kgi+jup4pNctxny/XFy4NO1CqhEnAFTdGlv3zxhzugJzAew6rMcWuR/AVW7LqBv4i59oKOabTMuDU1X9PChaMbzXmk1QdBrVn/St6HpoGI9bczgBoNowc+aozNv1TfA+p8BnAOxWicMI8BggnWW4W1Fa9HgljkG0TcnO3tuKzgQ0B8UMVKab31sQLINqp9vsbh90W/BtHCcAVHs6Omzdy5uPdE4nCzAZgqPR37t8qIsHewE8Iir3qmClM+VVKC5+MX7BRASgvzuorT9GBJNVMAXARwGMG2KKAvgDIKsVWGkg95ZfrV/NrbeHjhMAGhkmdtRj3Jv7ZTKZ/dVjD4UfDcgYo9jBQzZB9G0R2QBorxE807cl8zRW3fZS2mUTbfMmz9i5btSo/b1iAoBxCj8GKqMNMMYDr0PxlgBvQ/GiM/4pmDefQbE48nuKEBERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERpeJ/AYHnIkgBKyE9AAAAAElFTkSuQmCC" />
      </defs>
    </svg>`
            : ""}

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
        )}">${item.core_price_gst_inclusive.toLocaleString(
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

    const phoneNumber = localStorage.getItem("phoneNumberFinalVal");
    const favButton = card.querySelector("[w-el='heart-icon-link']");
    const image = card.querySelector("[w-el='heart-icon']");

    if (favButton) {
        favButton.setAttribute("data-id", item.id);
        image.setAttribute("data-id-image", item.id);
        const src_image = await checkSelectedProductIds(
            location,
            phoneNumber,
            item.id
        );
        image.setAttribute("src", src_image);

        favButton.addEventListener("click", async function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (phoneNumber != null) {
                await updateSelectedProductIds(location, phoneNumber, item.id);
            } else {
                window.location.href = `/customer/login`;
            }
        });
    }

    return card;
}

// document.addEventListener("DOMContentLoaded", () => {
//     const shortingButton = document.getElementById("shorting");
//     if (shortingButton) {
//         let count = 0; // Move count outside the event listener to maintain state between clicks
//         shortingButton.addEventListener("click", () => {
//             console.log("sorting sorting");

//             let isOpen;
//             if (count % 2) {
//                 isOpen = true;
//             } else {
//                 isOpen = false;
//             }

//             const sortingCard = document.getElementById("sorting-card");
//             console.log(sortingCard);
//             if (sortingCard) {
//                 if (isOpen) {
//                     sortingCard.style.display = "flex";
//                 } else {
//                     sortingCard.style.display = "none";
//                 }
//             } else {
//                 console.error("Element with ID 'sorting-card' not found");
//             }

//             count++;
//             console.log(count);
//         });
//     } else {
//         console.error("Element with ID 'shorting' not found");
//     }
// });


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
                , "Kottayam"
                , "Ernakulam"
                , "Kozhikode"
                , "Kasaragod"
                , "Idukki"
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
                select.id = "dropdown-option"
                select.placeholder = "Select your district"
                // You can add a custom class for styling
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
    if (divBlock.style.display == "flex") {
        divBlock.style.display = 'none';
    } else {
        divBlock.style.display = 'flex';
    }
    keralaCode()
});

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
        setCookie("discomValueDl", pincodeValue, 7); // Set cookie for 7 days
    }

    console.log("Pincode saved to cookies:", pincodeValue);
    const divBlock = document.querySelector('.div-block-169');
    divBlock.style.display = 'none';
});

function keralaCode() {
    const dropdown = document.getElementById("dropdown-option");
    if (dropdown) {
        // Retrieve and set the saved value on page load
        const savedValue = getCookie("discomValueKl");
        if (savedValue) {
            dropdown.value = savedValue;
            const divBlock = document.querySelector('.div-block-169');
        }

        dropdown.addEventListener("change", function() {
            console.log("Dropdown value changed");
            const selectedValue = this.value;
            if (selectedValue) {
                setCookie("discomValueKl", selectedValue, 7); // Set cookie for 7 days
            }
            console.log("Dropdown value saved to cookies:", selectedValue);

            const divBlock = document.querySelector('.div-block-169');
        });
    } else {
        console.error("Dropdown element not found");
    }
}

function monthlyBill() {
    const formElements = document.querySelectorAll('form#email-form-2 input, form#email-form-2 label, form#email-form-2 .w-form-done, form#email-form-2 .w-form-fail');
    formElements.forEach(element => {
        element.style.display = 'none';
    });

    // Create a new input element with id="monthly-bill"
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = 'monthly-bill';
    newInput.elfilter = "specs_ac_capacity";
    newInput.className = 'text-field-10 w-input';
    newInput.name = 'name';
    newInput.placeholder = 'Monthly Electricity Bill';

    // Add an onchange event listener to the new input
    newInput.addEventListener('change', function() {
        const inputValue = newInput.value;
        console.log('Input value changed:', inputValue);
        // You can perform additional actions with the inputValue here
    });

    // Append the new input element to the form
    document.getElementById('email-form-2').appendChild(newInput);
}

async function updateSelectedProductIds(location, phone, id) {
    let selectedIdsForWishlist = [];
    let updateData = {};
    let alreadyInWishlist = false;
    // Change the favorite button image to filled red
    const favButton = document.querySelector(
        `.favourite-button-product[data-id="${id}"]`
    );
    const image = document.querySelector(
        `.favourite-button-product[data-id-image="${id}"]`
    );
    // Convert `id` to an integer
    const idToCheck = parseInt(id, 10);

    // URL of the filled red favorite button image
    const filledRedImageUrl =
        "https://uploads-ssl.webflow.com/64e3567fade593472d02cbc6/669fed1277e324e4ffe72a4b_Favourite.png"; // Replace with your actual image URL
    // URL of the default favorite button image
    const defaultImageUrl =
        "https://cdn.prod.website-files.com/6686a2af6794e55ac4dc8df9/6686a2af6794e55ac4dc8f6c_Favourite.svg"; // Replace with your actual image URL

    if (phone) {
        try {
            const { data, error } = await window.supabaseClient
                .from("customers")
                .select("*")
                .eq("phone", phone)
                .single();

            if (error) {
                throw new Error("Error fetching data: " + error.message);
            }

            if (data) {
                if (location === "delhi") {
                    selectedIdsForWishlist = data.selected_product_ids || [];
                } else if (location === "kerala") {
                    selectedIdsForWishlist = data.selected_product_ids_kerala || [];
                } else {
                    console.log("No customer data found for this phone number.");
                }

                // Normalize `selectedIdsForWishlist` to integers
                selectedIdsForWishlist = selectedIdsForWishlist.map(Number);

                alreadyInWishlist = selectedIdsForWishlist.includes(idToCheck);

                if (alreadyInWishlist) {
                    // alert("Product already in wishlist");
                    await removeProductFromWishlist(id, location, phone);
                    alert("Product successfully removed in wishlist");
                    if (image) {
                        image.src = defaultImageUrl;
                    }
                    return;
                } else {
                    // Add ID to wishlist
                    if (location === "delhi") {
                        selectedIdsForWishlist.push(idToCheck);
                        updateData = {
                            selected_product_ids: selectedIdsForWishlist,
                        };
                    } else if (location === "kerala") {
                        selectedIdsForWishlist.push(idToCheck);
                        updateData = {
                            selected_product_ids_kerala: selectedIdsForWishlist,
                        };
                    }

                    if (Object.keys(updateData).length > 0) {
                        try {
                            const { data: updateResult, error: updateError } =
                                await window.supabaseClient
                                    .from("customers")
                                    .update(updateData)
                                    .eq("phone", phone);

                            if (updateError) {
                                console.error("Error updating data:", updateError.message);
                            } else {
                                alert("Product added to wishlist");

                                if (image) {
                                    image.src = filledRedImageUrl;
                                }
                            }
                        } catch (error) {
                            console.error("Error updating data:", error.message);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
}
async function checkSelectedProductIds(location, phone, id) {
    let selectedIdsForWishlist = [];
    let alreadyInWishlist = false;

    // Convert `id` to an integer
    const idToCheck = parseInt(id, 10);

    // URL of the filled red favorite button image
    const filledRedImageUrl =
        "https://uploads-ssl.webflow.com/64e3567fade593472d02cbc6/669fed1277e324e4ffe72a4b_Favourite.png"; // Replace with your actual image URL

    // URL of the default favorite button image
    const defaultImageUrl =
        "https://cdn.prod.website-files.com/6686a2af6794e55ac4dc8df9/6686a2af6794e55ac4dc8f6c_Favourite.svg"; // Replace with your actual image URL

    if (phone) {
        try {
            const { data, error } = await window.supabaseClient
                .from("customers")
                .select("*")
                .eq("phone", phone)
                .single();

            if (error) {
                throw new Error("Error fetching data: " + error.message);
            }

            if (data) {
                if (location === "delhi") {
                    selectedIdsForWishlist = data.selected_product_ids || [];
                } else if (location === "kerala") {
                    selectedIdsForWishlist = data.selected_product_ids_kerala || [];
                } else {
                    console.log("No customer data found for this phone number.");
                }

                // Normalize `selectedIdsForWishlist` to integers
                selectedIdsForWishlist = selectedIdsForWishlist.map(Number);

                alreadyInWishlist = selectedIdsForWishlist.includes(idToCheck);

                // Return the appropriate image URL based on whether the ID is already in the wishlist
                return alreadyInWishlist ? filledRedImageUrl : defaultImageUrl;
            } else {
                return defaultImageUrl; // Default to the default image if no data is found
            }
        } catch (error) {
            console.error("Error:", error);
            return defaultImageUrl; // Default to the default image in case of error
        }
    } else {
        console.log("Phone number not provided.");
        return defaultImageUrl; // Default to the default image if phone number is not provided
    }
}
async function removeProductFromWishlist(productId, location, phoneNumber) {
    try {
        const columnName =
            location.toLowerCase() === "delhi"
                ? "selected_product_ids"
                : "selected_product_ids_kerala";

        const { data, error } = await window.supabaseClient
            .from("customers")
            .select(columnName)
            .eq("phone", phoneNumber)
            .single();

        if (error) {
            console.error("Error fetching wishlist data:", error);
            return;
        }

        if (data && data[columnName]) {
            const indexToRemove = data[columnName].indexOf(productId);

            if (indexToRemove !== -1) {
                data[columnName].splice(indexToRemove, 1);

                const { error: updateError } = await window.supabaseClient
                    .from("customers")
                    .update({ [columnName]: data[columnName] })
                    .eq("phone", phoneNumber);

                if (updateError) {
                    console.error("Error updating wishlist:", updateError);
                    return;
                }
            } else {
                console.error(
                    `Product with ID ${productId} not found in ${columnName}.`
                );
            }
        } else {
            console.error(`No wishlist data found for user: ${phoneNumber}`);
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
}

function filterAndPrintData(data) {
    // Helper function to generate a random number between -1 and 1
    function getRandomValue() {
        return Math.random() * 2 - 1; // Generates a number between -1 and 1
    }

    // Add a random value to each product
    const dataWithRandomValues = data.map(item => ({
        ...item,
        core_randomise: getRandomValue()
    }));

    // Sort products by the random value
    const sortedData = dataWithRandomValues.sort((a, b) => a.core_randomise - b.core_randomise);

    // Select the top 25 products
    const top25Products = sortedData.slice(0, 25);

    return top25Products;
}

// const sortingOpen = document.getElementById('sorting-open');
// const sortingCard = document.getElementById('sorting-card');

// sortingOpen.addEventListener('click', () => {
//     if (sortingCard.style.display === 'none' || sortingCard.style.display === '') {
//         sortingCard.style.display = 'flex'; // Show the sorting card
//     } else {
//         sortingCard.style.display = 'none'; // Hide the sorting card
//     }
// });

// const acsElement = document.getElementById('acs');

// acsElement.addEventListener('click', () => {
//     // Add the value "acs" to localStorage under the key "filter"
//     localStorage.filter = 'acs'; // Directly setting the localStorage value
//     window.location = window.location;

//     // Reload the page
//     // location.reload();
// });

function selectionCondition() {
    console.log("selectionCondition");
    urlParams.forEach((param) => {
        // Extract key and value from each object in urlParams
        const key = Object.keys(param)[0];
        const values = param[key];
        console.log(values, key);

        // Check if the key matches "core_product_grid_type"
        if (key === "core_product_grid_type") {
            if (values.length === 1) {
                values.forEach((value) => {
                    if (value === "Ongrid") {
                        const offGrid = document.querySelector('#Offgrid-Inverter[el-filter="specs_inverter_type"]');
                        const hybrid = document.querySelector('#Hybrid-Inverter[el-filter="specs_inverter_type"]');
                        if (offGrid) {
                            offGrid.style.cursor = "not-allowed";    // Show 'not-allowed' cursor
                            offGrid.style.pointerEvents = "none";
                            offGrid.style.backgroundColor = "#D3D3D3";    // Disable pointer events
                        }
                        if (hybrid) {
                            hybrid.style.cursor = "not-allowed";    // Show 'not-allowed' cursor
                            hybrid.style.pointerEvents = "none";    // Disable pointer events
                            hybrid.style.backgroundColor = "#D3D3D3";
                        }
                    }
                    if (value === "Offgrid") {
                        const String = document.getElementById('String');
                        const Microinverter = document.getElementById('Microinverter');
                        if (String) {
                            String.style.cursor = "not-allowed";    // Show 'not-allowed' cursor
                            String.style.pointerEvents = "none";    // Disable pointer events
                            String.style.backgroundColor = "#D3D3D3";
                        }
                        if (Microinverter) {
                            Microinverter.style.cursor = "not-allowed";    // Show 'not-allowed' cursor
                            Microinverter.style.pointerEvents = "none";    // Disable pointer events
                            Microinverter.style.backgroundColor = "#D3D3D3";
                        }
                    }
                    if (value === "Hybrid") {
                        const offGrid = document.querySelector('#Offgrid-Inverter[el-filter="specs_inverter_type"]');
                        const String = document.getElementById('String');
                        const Microinverter = document.getElementById('Microinverter');
                        if (offGrid) {
                            offGrid.style.cursor = "not-allowed";    // Show 'not-allowed' cursor
                            offGrid.style.pointerEvents = "none";    // Disable pointer events
                            offGrid.style.backgroundColor = "#D3D3D3";
                        }
                        if (String) {
                            String.style.cursor = "not-allowed";    // Show 'not-allowed' cursor
                            String.style.pointerEvents = "none";    // Disable pointer events
                            String.style.backgroundColor = "#D3D3D3";
                        }
                        if (Microinverter) {
                            Microinverter.style.cursor = "not-allowed";    // Show 'not-allowed' cursor
                            Microinverter.style.pointerEvents = "none";    // Disable pointer events
                            Microinverter.style.backgroundColor = "#D3D3D3";
                        }
                    }
                });
            } else if (values.length > 1) {
                // Reset styles if there are multiple values
                const elementsToReset = [
                    document.querySelector('#Offgrid[el-filter="specs_inverter_type"]'),
                    document.querySelector('#Hybrid[el-filter="specs_inverter_type"]'),
                    document.getElementById('String'),
                    document.getElementById('Microinverter')
                ];

                elementsToReset.forEach((element) => {
                    if (element) {
                        element.style.cursor = "default";   // Reset cursor
                        element.style.pointerEvents = "auto";  // Enable pointer events
                        Microinverter.style.backgroundColor = "";
                    }
                });
            }
        }
    });
}
