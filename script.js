document.addEventListener("DOMContentLoaded", function () {
  let currentRound = 1;
  let jellybeans = 20;
  let totalSpent = 0;
  const requiredCategories = [
    "HOUSING & UTILITIES",
    "INSURANCE",
    "FURNITURE & HOUSEWARES",
    "FOOD",
    "CLOTHES & LAUNDRY",
    "TRANSPORTATION",
  ];

  const updateJellybeanCounter = () => {
    document.getElementById(
      "jellybean-counter"
    ).textContent = `Jellybeans left: ${jellybeans}`;
  };

  const showPrompt = (message) => {
    document.getElementById("game-prompts").textContent = message;
  };

  const resetPrompts = () => {
    document.getElementById("game-prompts").textContent = "";
  };

  const getCategoryDiv = (categoryName) => {
    const headers = document.querySelectorAll("h2");
    for (let header of headers) {
      if (header.textContent.includes(categoryName)) {
        return header;
      }
    }
    return null;
  };

  const checkRequiredCategories = () => {
    for (let category of requiredCategories) {
      let categoryDiv = getCategoryDiv(category);
      if (!categoryDiv) continue;

      let items =
        categoryDiv.parentElement.querySelectorAll(".squares-container");
      let isCovered = Array.from(items).some(
        (container) =>
          container.querySelectorAll(".square.active").length ===
          container.children.length
      );
      if (!isCovered) {
        showPrompt(
          `Please cover the cost of at least one item in the ${category} category.`
        );
        return false;
      }
    }
    return true;
  };

  const finishRound = () => {
    if (totalSpent < (currentRound === 1 ? 20 : 13)) {
      showPrompt(`You still have jellybeans left to spend.`);
      return;
    }
    if (!checkRequiredCategories()) {
      return;
    }

    if (currentRound === 1) {
      jellybeans = 13;
      showPrompt(
        "Your income has been cut to 13 jellybeans. Remove 7 jellybeans to continue."
      );
      currentRound++;
    } else if (currentRound === 2) {
      if (totalSpent !== 13) {
        showPrompt(`Please remove exactly 7 jellybeans.`);
        return;
      }
      showPrompt(
        "Someone in your family broke their leg. If you do not have insurance, remove 3 jellybeans."
      );
      currentRound++;
    } else if (currentRound === 3) {
      jellybeans += hasInsurance() ? 0 : -3;
      showPrompt(
        "You have received a raise of 2 jellybeans. Spend them to finish the game."
      );
      jellybeans += 2;
      currentRound++;
    } else if (currentRound === 4) {
      showPrompt("Congratulations! You have completed the game.");
      document.getElementById("finish-round").disabled = true;
    }
    updateJellybeanCounter();
  };

  const hasInsurance = () => {
    let insuranceCategory = getCategoryDiv("INSURANCE");
    if (!insuranceCategory) return false;

    let healthItems = insuranceCategory.parentElement.querySelectorAll(".item");
    return Array.from(healthItems).some(
      (item) =>
        item.textContent.includes("Full Health Coverage") &&
        item.nextElementSibling.querySelectorAll(".square.active").length === 2
    );
  };

  const toggleJellybean = (e) => {
    let square = e.target;
    if (square.classList.contains("active")) {
      square.classList.remove("active");
      jellybeans++;
      totalSpent--;
    } else {
      if (jellybeans > 0) {
        square.classList.add("active");
        jellybeans--;
        totalSpent++;
      } else {
        showPrompt("You cannot spend more jellybeans than you have.");
      }
    }
    updateJellybeanCounter();
  };

  document.querySelectorAll(".square").forEach((square) => {
    square.addEventListener("click", toggleJellybean);
  });

  document
    .getElementById("finish-round")
    .addEventListener("click", finishRound);

  updateJellybeanCounter();
});
