//Trial
document.addEventListener("DOMContentLoaded", async function () {
  const phoneNumber = localStorage.getItem("phoneNumberFinalVal");
  const location = localStorage.getItem("location");
  const ProceedToPay = document.getElementById("proceed-toPay");
  if (ProceedToPay) {
    ProceedToPay.addEventListener("click", async () => {
      let phoneNumber = localStorage.getItem("phoneNumberFinalVal");

      if (!phoneNumber.startsWith("+91")) {
        phoneNumber = "+91" + phoneNumber;
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        console.error("Invalid phone number format");
        return null;
      }

      const location = localStorage.getItem("location");
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      if (phoneNumber) {
        await updateSupabase(phoneNumber, id, location);
        await insertOrderDetails(phoneNumber, location);
      } else {
        let phoneNumber = document.getElementById("bf-number").value;

        if (!phoneNumber.startsWith("+91")) {
          phoneNumber = "+91" + phoneNumber;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
          console.error("Invalid phone number format");
          return null;
        }

        await CreateCustomer(phoneNumber, location);
        await insertOrderDetails(phoneNumber, location);
      }
    });
  } else {
    console.error("Element with id 'proceed-toPay' not found.");
  }
  if (phoneNumber) {
    try {
      const { data, error } = await window.supabaseClient
        .from("customers")
        .select("*")
        .eq("phone", phoneNumber)
        .single();

      if (error) {
        throw new Error("Error fetching data: " + error.message);
      }

      console.log(data);
      if (data) {
        displayData(data);
      } else {
        console.warn(
          "No data found for the provided phone number and location."
        );
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  } else {
    console.warn("Phone number or location not found in local storage.");
  }
});

async function updateSupabase(phoneNumber, id, location) {
  console.log("entern in customer function ");
  // Fetch current data from the database
  let currentData;
  try {
    const { data, error } = await window.supabaseClient
      .from("customers")
      .select("*")
      .eq("phone", phoneNumber)
      .single();

    if (error) {
      throw new Error("Error fetching current data: " + error.message);
    }
    currentData = data;
  } catch (error) {
    console.error("Error fetching current data: ", error);
    return;
  }

  // Get new input values
  const bfName = document.getElementById("bf-name").value.trim();
  const bfEmail = document.getElementById("bf-email-2").value.trim();
  // const bfAddressL1 = document.getElementById("bf-addressl1").value.trim();
  // const bfAddressL2 = document.getElementById("bf-addressl-2").value.trim();
  // const bfPincode = document.getElementById("bf-pincode").value.trim();
  // const bfCity = document.getElementById("bf-city-2").value.trim();
  // const bfState = document.getElementById("bf-state-2").value.trim();
  let updateData = {};
  if (location == "kerala") {
    const purchasedItems = currentData.purchased_ids_kerala || [];
    const updatedPurchasedItems = [...purchasedItems, id];
    // Merge current data with new input values
    updateData = {
      name: bfName || currentData.name,
      email: bfEmail || currentData.email,
      // address1: currentData.address1,
      // address2: currentData.address2,
      // pincode: currentData.pincode,
      // city: currentData.city,
      // state: currentData.state,
      purchased_ids: updatedPurchasedItems,
    };
  } else if (location == "delhi") {
    const purchasedItems = currentData.purchased_ids || [];
    const updatedPurchasedItems = [...purchasedItems, id];
    // Merge current data with new input values
    updateData = {
      name: bfName || currentData.name,
      email: bfEmail || currentData.email,
      // address1: currentData.address1,
      // address2: currentData.address2,
      // pincode: currentData.pincode,
      // city: currentData.city,
      // state: currentData.state,
      purchased_ids: updatedPurchasedItems,
    };
  }

  try {
    const { data, error } = await window.supabaseClient
      .from("customers")
      .update(updateData)
      .eq("phone", phoneNumber)
      .single();

    if (error) {
      throw new Error("Error updating data: " + error.message);
    }

    console.log("Data updated successfully:", data);
    if (data) {
      displayData(data);
    } else {
      console.error("No data returned after update.");
    }
  } catch (error) {
    console.error("Error updating data: ", error);
  }
}

async function insertOrderDetails(phoneNumber, location) {
  const Phone = phoneNumber ?? document.getElementById("bf-number");
  console.log("Phone is", Phone);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log("id is", id);
  const Location = location;
  const tableName = "orders_by_customers";
  let cop = localStorage.getItem("cop");
  const bfName = document.getElementById("bf-name").value.trim();
  const bfAddressL1 = document.getElementById("bf-addressl1").value.trim();
  const bfAddressL2 = document.getElementById("bf-addressl-2").value.trim();
  const bfPincode = document.getElementById("bf-pincode").value.trim();
  const bfCity = document.getElementById("bf-city-2").value.trim();
  const bfState = document.getElementById("bf-state-2").value.trim();
  const notes = document.getElementById("bf-note-2").value.trim();
  let dataToUpdate = {};

  if (cop == 1) {
    const CouponCode = localStorage.getItem("CouponName");
    const Discount = localStorage.getItem("discountamount");
    dataToUpdate = {
      phone: Phone,
      location: Location,
      product_id: id,
      discount_code_applied: CouponCode,
      discount_amount: Discount,
      name: bfName,
      address1: bfAddressL1,
      address2: bfAddressL2,
      pincode: bfPincode,
      city: bfCity,
      state: bfState,
      notes: notes,
    };
  } else {
    dataToUpdate = {
      phone: Phone,
      location: Location,
      product_id: id,
      name: bfName,
      address1: bfAddressL1,
      address2: bfAddressL2,
      pincode: bfPincode,
      city: bfCity,
      state: bfState,
      notes: notes,
    };
  }

  try {
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .insert(dataToUpdate);

    if (error) {
      console.error("Error updating data:", error.message);
      localStorage.removeItem("CouponName");
      localStorage.removeItem("discountamount");
    } else {
      console.log("Data updated successfully:", data);
      localStorage.removeItem("CouponName");
      localStorage.removeItem("discountamount");
    }
  } catch (error) {
    console.error("Error updating data:", error.message);
  }
}

// Function to validate phone number format
function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^\+91\d{10}$/;
  return phoneRegex.test(phoneNumber);
}

function displayData(data) {
  if (!data) {
    console.error("No data provided to display.");
    return;
  }

  document.getElementById("bf-name").value = data.name || "";
  document.getElementById("bf-email-2").value = data.email || "";
  const phoneNumberInput = document.getElementById("bf-number");
  phoneNumberInput.value = data.phone || "";
  phoneNumberInput.setAttribute("readonly", "readonly"); // Set readonly attribute
  document.getElementById("bf-addressl1").value = data.address1 || "";
  document.getElementById("bf-addressl-2").value = data.address2 || "";
  document.getElementById("bf-pincode").value = data.pincode || "";
  document.getElementById("bf-city-2").value = data.city || "";
  document.getElementById("bf-state-2").value = data.state || "";
}

async function CreateCustomer(phoneNumber, location) {
  const Name = document.getElementById("bf-name").value.trim();
  // console.log("Name is", Name);
  const Email = "";
  const address = document.getElementById("bf-addressl1").value.trim();
  // console.log("Email is", Email);
  const Phone = phoneNumber;
  const Pincode = document.getElementById("bf-pincode").value.trim();
  const City = document.getElementById("bf-city-2").value.trim();
  const State = document.getElementById("bf-state-2").value.trim();
  // console.log("Phone is", Phone);
  const Password = "";
  // console.log("Phone is", Password);

  const Location = location;
  // Define the table name
  const tableName = "customers";

  // Data to be inserted
  const dataToInsert = [
    {
      name: Name,
      email: Email,
      phone: Phone,
      address1: address,
      pincode: Pincode,
      city: City,
      state: State,
      password: Password,
      location: Location,
    },
  ];

  try {
    // Insert data into the table
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .insert(dataToInsert);

    // Check for errors
    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      // console.log("Data inserted successfully:", data);
      // Optionally, perform any actions upon successful insertion
    }
  } catch (error) {
    console.error("Error inserting data:", error.message);
  }
}
