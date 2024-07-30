document.addEventListener("DOMContentLoaded", async function () {
    const overallStartTime = performance.now();
    const overallStartRealTime = new Date();
    console.log("sandbox script started at:", overallStartRealTime);
  
    var container = document.getElementById("mask");
    container.style.zIndex = "3";
    container.style.boxSizing = "content-box";
    container.style.gridColumnGap = "48px";
    container.style.gridRowGap = "10px";
    container.style.objectFit = "scale-down";
    container.style.justifyContent = "flex-start";
    container.style.alignItems = "center";
    container.style.width = "100%";
    container.style.maxWidth = "1200px";
    container.style.height = "auto";
    container.style.display = "flex";
    container.style.position = "relative";
    container.style.overflow = "auto";
    container.style.msOverflowStyle = "none";
    container.style.scrollbarWidth = "none";
    let elementsToDuplicate = document.getElementById("slider-for-product-0");
    const phoneNumber = localStorage.getItem("phoneNumberFinalVal");
    const location = localStorage.getItem("location");
    const overallStartTime1 = performance.now();
    const overallStartRealTime1 = new Date();
    console.log("sandbox data script started at:", overallStartRealTime1);
    const sliderData = await fetchFeatureProductData();
    const overallEndTime1 = performance.now();
    const overallEndRealTime1 = new Date();
    console.log("sandbox data script ended at:", overallEndRealTime1);
    console.log(
      `sandbox data execution time: ${
        overallEndTime1 - overallStartTime1
      } milliseconds`
    );
    const ProductIds = [];
    const OrderData = [];
  
    for (let i = 0; i < sliderData.length; i++) {
      const productId = sliderData[i].id;
      ProductIds.push(productId);
      const Orderdata = sliderData[i].id;
      OrderData.push(Orderdata);
    }
  
    const selectedProductIds = OrderData || [];
    let count = 0;
  
    if (Array.isArray(selectedProductIds) && selectedProductIds.length > 0) {
      for (let id of selectedProductIds) {
        let current_id = id;
        document.getElementById("slider-for-product-0").style.visibility =
          "hidden";
        var clonedElement = elementsToDuplicate.cloneNode(true); // Clone the element directly
        var newId = elementsToDuplicate.id + "-" + id; // Use the element's ID
  
        clonedElement.id = newId;
        container.appendChild(clonedElement);
  
        // const favButton = clonedElement.
        const image = clonedElement.querySelector("#favorite-icon");
  
        if (image) {
          // favButton.setAttribute("data-id", id);
          image.setAttribute("data-id-img", current_id);
  
          const src_image = await checkSelectedProductIds(
            location,
            phoneNumber,
            current_id
          );
  
          image.setAttribute("src", src_image);
  
          image.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent default link behavior
            event.stopPropagation(); // Stop event from bubbling up
            if (phoneNumber != null) {
              await updateSelectedProductIds(location, phoneNumber, id);
            } else {
              window.location.href = `/customer/login`;
            }
          });
        }
  
        const systemDetails = clonedElement.querySelectorAll("[w-el='link']");
        if (systemDetails) {
          if (location == "kerala") {
            systemDetails.forEach((element) => {
              element.setAttribute("data-id", id);
              element.setAttribute("href", `/product-kerala?id=${id}`);
            });
          } else {
            systemDetails.forEach((element) => {
              element.setAttribute("data-id", id);
              element.setAttribute("href", `/product?id=${id}`);
            });
          }
        }
  
        // systemDetails.addEventListener("click", () => {
        //   window.location.href = `/product?id=${id}`;
        // });
  
        let tableName = null;
        if (location == "kerala") {
          tableName = "kerala_products";
        } else {
          tableName = "products";
        }
  
        const fetchedData = await fetchDataById(current_id, tableName);
        if (fetchedData) {
          displayDataForCard(newId, fetchedData);
        } else {
          return;
        }
  
        clonedElement.style.visibility = "visible";
  
        document.getElementById("main-div").style.display = "flex";
  
        count++;
      }
    }
    document.getElementById("slider-for-product-0").style.display = "none";
    const overallEndTime = performance.now();
    const overallEndRealTime = new Date();
    console.log("sandbox script ended at:", overallEndRealTime);
    console.log(
      `sandbox execution time: ${overallEndTime - overallStartTime} milliseconds`
    );
  });
  
  function filterAndPrintData(data) {
    let result = [];
  
    // Iterate through the range of specs_ac_capacity values from 3 to 22
    for (let acCapacity = 3; acCapacity <= 22; acCapacity++) {
      // Convert acCapacity to string since specs_ac_capacity is a string in the data
      let acCapacityStr = acCapacity.toString();
  
      // Filter data by specs_ac_capacity
      const filteredDataByCapacity = data.filter(
        (item) => item.specs_ac_capacity == acCapacityStr
      );
  
      // Get unique specs_panel_type values
      const uniquePanelTypes = [
        ...new Set(filteredDataByCapacity.map((item) => item.specs_panel_type)),
      ];
  
      // For each unique specs_panel_type, filter the data and sort by specs_panel_type
      uniquePanelTypes.forEach((panelType) => {
        const filteredDataByPanelType = filteredDataByCapacity.filter(
          (item) => item.specs_panel_type === panelType
        );
  
        // Append the filtered and sorted data to the result array
        result = result.concat(filteredDataByPanelType);
      });
    }
  
    return result;
  }
  
  async function fetchFeatureProductData() {
    // console.log("Fetching feature product data...");
    var location = localStorage.getItem("location");
    // console.log(location);
    let tableName = "products";
    if (location == "kerala") {
      tableName = "kerala_products";
    } else {
      tableName = "products";
    }
    try {
      const { data, error } = await window.supabaseClient
        .from(tableName)
        .select("*")
        .eq("core_zircle_featured", "Yes");
      if (error) {
        console.error("Error fetching product data:", error);
        // return null;
      }
      // console.log(data);
      const filteredData = filterAndPrintData(data);
      if (filteredData && filteredData.length > 0) {
        // console.log("Product Data:");
        return filteredData;
      } else {
        // console.log("No data found for the given criteria");
        // return null;
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      // return null;
    }
  }
  function displayDataForCard(cardId, data) {
    const cardElement = document.getElementById(cardId);
    if (cardElement) {
      // Assuming each card has specific elements where data needs to be displayed
      const coreEmiElement = cardElement.querySelector(
        "[w-el='core_emi_amount_k']"
      );
      const corePriceTag = cardElement.querySelector("[w-el='core_value']");
      const coreProductName = cardElement.querySelector(
        "[w-el='core_product_name_k']"
      );
      const coreVendor = cardElement.querySelector("[w-el='core_vendor_name_k']");
      const corePrice = cardElement.querySelector(
        "[w-el='core_price_gst_exclusive_k']"
      );
      const PanelType = cardElement.querySelector("[w-el='spec_1_k']");
      const StructureType = cardElement.querySelector("[w-el='spec_2_k']");
      const PanelBrand = cardElement.querySelector(
        "[w-el='specs_panel_brand_k']"
      );
      const InverterBrand = cardElement.querySelector(
        "[w-el='specs_inverter_company_k']"
      );
      const DCcapacity = cardElement.querySelector(
        "[w-el='specs_dc_capacity_kw_k']"
      );
      const NoOfPanels = cardElement.querySelector("[w-el='specs_no_of_panels']");
      // const SubsidyScheme = cardElement.querySelector(
      //   "[w-el='core_subsidy_scheme']"
      // );
      const SubsidyPrice = cardElement.querySelector(
        "[w-el='spec_subsidy_price_k']"
      );
      const coreCardImage = cardElement.querySelector(
        "[w-el='product_card_hero_image_k']"
      );
  
      const valueBadge = cardElement.querySelector("[w-el='value-badge']");
  
      if (coreEmiElement) {
        coreEmiElement.textContent = formatPriceINR(data.core_monthly_emi);
      } else {
        console.warn(
          `Element with w-el='core_emi_amount_k' not found in card with ID ${cardId}.`
        );
      }
      if (corePriceTag) {
        corePriceTag.textContent = data.core_price_tag;
        if (data.core_price_tag == "Standard") {
          valueBadge.style.backgroundColor = "#C1CE56";
        } else if (data.core_price_tag == "Assured") {
          valueBadge.style.backgroundColor = "#36B457";
        } else if (data.core_price_tag == "Premium") {
          valueBadge.style.backgroundColor = "#023E4D";
        } else {
          valueBadge.style.backgroundColor = "#023E4D";
        }
      } else {
        console.warn(
          `Element with w-el='core_value' not found in card with ID ${cardId}.`
        );
      }
  
      if (coreProductName) {
        coreProductName.textContent = data.core_product_name;
      } else {
        console.warn(
          `Element with w-el='core_product_name_k' not found in card with ID ${cardId}.`
        );
      }
      if (corePrice) {
        corePrice.textContent = formatPriceINR(data.core_price_gst_inclusive);
      } else {
        console.warn(
          `Element with w-el='core_price_gst_exclusive_k' not found in card with ID ${cardId}.`
        );
      }
      if (PanelType) {
        PanelType.textContent = data.specs_panel_type;
      } else {
        console.warn(
          `Element with w-el='spec_1_k' not found in card with ID ${cardId}.`
        );
      }
      if (StructureType) {
        StructureType.textContent = data.specs_strmtr_structure_type;
      } else {
        console.warn(
          `Element with w-el='spec_2_k' not found in card with ID ${cardId}.`
        );
      }
      if (PanelBrand) {
        PanelBrand.textContent = data.specs_panel_brand;
      } else {
        console.warn(
          `Element with w-el='specs_panel_brand_k' not found in card with ID ${cardId}.`
        );
      }
      if (InverterBrand) {
        InverterBrand.textContent = data.specs_inverter_company;
      } else {
        console.warn(
          `Element with w-el='specs_inverter_company_k' not found in card with ID ${cardId}.`
        );
      }
      if (DCcapacity) {
        DCcapacity.textContent = data.specs_dc_capacity;
      } else {
        console.warn(
          `Element with w-el='specs_dc_capacity_kw_k' not found in card with ID ${cardId}.`
        );
      }
      if (NoOfPanels) {
        NoOfPanels.textContent = data.specs_panel_number;
      } else {
        console.warn(
          `Element with w-el='specs_no_of_panels' not found in card with ID ${cardId}.`
        );
      }
      // if (SubsidyScheme) {
      //   SubsidyScheme.textContent = data.specs_subsidy_type;
      // } else {
      //   console.warn(
      //     `Element with w-el='core_subsidy_scheme' not found in card with ID ${cardId}.`
      //   );
      // }
      if (SubsidyPrice) {
        SubsidyPrice.textContent = data.core_price_additional_subsidy;
      } else {
        console.warn(
          `Element with w-el='spec_subsidy_price_k' not found in card with ID ${cardId}.`
        );
      }
      if (coreVendor) {
        coreVendor.textContent = data.core_product_vendor;
      } else {
        console.warn(
          `Element with w-el='core_product_vendor' not found in card with ID ${cardId}.`
        );
      }
      if (coreCardImage) {
        const imageUrl = `https://ukzzjbbakdwnhqinxucz.supabase.co/storage/v1/object/public/card-hero-image/${data.core_card_image}?width=100`;
        // console.log(`Setting image src for card with ID ${cardId}: ${imageUrl}`);
        coreCardImage.setAttribute("srcset", imageUrl);
      } else {
        console.warn(
          `Image element with class 'marketplace-product-image-5' not found in card with ID ${cardId}.`
        );
      }
    } else {
      console.warn(`Card with ID ${cardId} not found.`);
    }
  }
  
  // async function removeProductFromWishlist(productId, location, phoneNumber) {
  //   console.log("Removing product from wishlist...");
  
  //   try {
  //     const { data, error } = await window.supabaseClient
  //       .from("wishlists")
  //       .delete()
  //       .match({
  //         phone_number: phoneNumber,
  //         location: location,
  //         product_id: productId,
  //       });
  
  //     if (error) {
  //       console.error("Error removing product from wishlist:", error);
  //       return;
  //     }
  
  //     console.log("Product removed from wishlist:", data);
  //   } catch (err) {
  //     console.error("Error removing product from wishlist:", err);
  //   }
  // }
  
  async function fetchDataById(id, tableName) {
    try {
      const { data, error } = await window.supabaseClient
        .from(tableName)
        .select("*")
        .eq("id", id);
  
      if (error) {
        console.error("Error fetching data by ID:", error);
        return null;
      }
  
      return data[0];
    } catch (err) {
      console.error("Error fetching data by ID:", err);
      return null;
    }
  }
  
  async function updateSelectedProductIds(location, phone, id) {
    let selectedIdsForWishlist = [];
    let updateData = {};
    let alreadyInWishlist = false;
    // Change the favorite button image to filled red
  
    const img = document.querySelector(`#favorite-icon[data-id-img="${id}"]`);
  
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
            // console.log("No customer data found for this phone number.");
          }
  
          // Normalize `selectedIdsForWishlist` to integers
          selectedIdsForWishlist = selectedIdsForWishlist.map(Number);
  
          // console.log("Checking ID:", idToCheck);
          // console.log("Existing IDs:", selectedIdsForWishlist);
  
          alreadyInWishlist = selectedIdsForWishlist.includes(idToCheck);
  
          if (alreadyInWishlist) {
            // alert("Product already in wishlist");
            await removeProductFromWishlist(id, location, phone);
            alert("Product successfully removed from wishlist");
            if (img) {
              // const image = document.getElementById("favorite-icon");
              img.setAttribute("src", defaultImageUrl);
  
              img.src = defaultImageUrl;
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
                  // console.log("Data updated successfully:", updateResult);
                  alert("Product added to wishlist");
  
                  if (img) {
                    // const image = document.getElementById("favorite-icon");
                    img.setAttribute("src", filledRedImageUrl);
                    img.src = filledRedImageUrl;
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
            // console.log(data.selected_product_ids);
          } else if (location === "kerala") {
            selectedIdsForWishlist = data.selected_product_ids_kerala || [];
          } else {
            // console.log("No customer data found for this phone number.");
          }
          // console.log(selectedIdsForWishlist);
  
          // Normalize `selectedIdsForWishlist` to integers
          selectedIdsForWishlist = selectedIdsForWishlist.map(Number);
  
          // console.log("Checking ID:", idToCheck);
          // console.log("Existing IDs:", selectedIdsForWishlist);
  
          alreadyInWishlist = selectedIdsForWishlist.includes(idToCheck);
  
          // Return the appropriate image URL based on whether the ID is already in the wishlist
          return alreadyInWishlist ? filledRedImageUrl : defaultImageUrl;
        } else {
          // console.log("No data found for this phone number.");
          return defaultImageUrl; // Default to the default image if no data is found
        }
      } catch (error) {
        console.error("Error:", error);
        return defaultImageUrl; // Default to the default image in case of error
      }
    } else {
      // console.log("Phone number not provided.");
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
        // console.log(`Raw ${columnName} from Supabase:`, data[columnName]);
  
        const indexToRemove = data[columnName].indexOf(productId);
        // console.log(
        //   `Index to remove for product ID ${productId}:`,
        //   indexToRemove
        // );
  
        if (indexToRemove !== -1) {
          data[columnName].splice(indexToRemove, 1);
  
          // console.log(`Updated product IDs after removal:`, data[columnName]);
  
          const { error: updateError } = await window.supabaseClient
            .from("customers")
            .update({ [columnName]: data[columnName] })
            .eq("phone", phoneNumber);
  
          if (updateError) {
            console.error("Error updating wishlist:", updateError);
            return;
          }
  
          // console.log(
          //   `Product with ID ${productId} removed successfully from ${columnName}.`
          // );
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
  // Function to format a numeric price for display in INR format
  function formatPriceINR(price) {
    // Ensure price is a number
    // if (typeof price !== "number") {
    //   throw new Error("Price must be a number");
    // }
  
    // // Convert the number to a string
    // const priceString = price.toString();
  
    // // Split into integer and decimal parts
    // const [integerPart, decimalPart] = priceString.split(".");
  
    // // Handle integer part formatting
    // const lastThreeDigits = integerPart.slice(-3);
    // const otherDigits = integerPart.slice(0, -3);
    // const formattedIntegerPart =
    //   otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThreeDigits;
  
    // // Combine integer and decimal parts
    // const formattedPrice = decimalPart
    //   ? formattedIntegerPart + "." + decimalPart
    //   : formattedIntegerPart;
  
    return price.toLocaleString("en-IN");
  }
  