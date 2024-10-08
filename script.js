document.addEventListener("DOMContentLoaded", function () {
  let currentRound = 1;
  let jellybeans = 20;
  let totalSpent = 0;
  let gameStarted = false;
  const requiredCategories = [
    "HOUSING & UTILITIES",
    "INSURANCE",
    "FURNITURE & HOUSEWARES",
    "FOOD",
    "CLOTHES & LAUNDRY",
    "TRANSPORTATION",
  ];


  const updateJellybeanCounter = () => {
    const counterElement = document.getElementById("jellybean-counter");
    counterElement.textContent = `Jellybeans left: ${jellybeans}`;

  if (jellybeans <= 5) {
      counterElement.classList.add("jellybean-counter-low");
    } else {
      counterElement.classList.remove("jellybean-counter-low");
    }
  };

  const showPrompt = (message) => {
    const alertOverlay = document.getElementById("alert-overlay");
    const alertMessage = document.getElementById("alert-message"); 
    alertMessage.innerHTML = message.replace(/\n/g, "<br>");
    alertOverlay.style.display = "flex"; // Show the overlay

    // Hide the overlay after a few seconds
    setTimeout(() => {
      alertOverlay.style.display = "none";
    }, 4000);
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
      let isCovered = Array.from(items).some((container) => {
        let squares = container.querySelectorAll(".square");
        let activeSquares = container.querySelectorAll(".square.active").length;
        let checkboxChecked =
          container.querySelector('input[type="checkbox"]')?.checked || false;
        return activeSquares === squares.length || checkboxChecked;
      });

      if (!isCovered) {
        showPrompt(
          `Please cover the cost of at least one item\nin the ${category} category.`
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
        "Your income has been cut to 13 jellybeans!\nRemove 7 jellybeans to continue."
      );
      currentRound++;
    } else if (currentRound === 2) {
      if (totalSpent !== 13) {
        showPrompt(`Please remove exactly 7 jellybeans.`);
        return;
      }
      showPrompt(
        "Someone in your family broke their leg. :(\nIf you do not have insurance, remove 3 jellybeans."
      );
      currentRound++;
    } else if (currentRound === 3) {
      jellybeans += hasInsurance() ? 0 : -3;
      showPrompt(
        "You have received a raise of 2 jellybeans!\nSpend them to finish the game."
      );
      jellybeans += 2;
      currentRound++;
    } else if (currentRound === 4) {
      showPrompt("Congratulations!\nYou have completed the game.");
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

  let isRoundOver = false;

  const clickSound = new Audio("assets/place-bean.wav");
  const toggleJellybean = (e) => {
    if (!gameStarted) {
      gameStarted = true; // Start the game
      document.querySelector(".counter-container").style.display = "flex"; // Show the counter-container
    }

    if (isRoundOver) {
      return; // Do nothing if the round is over
    }
    
    let square = e.target;

    let maxJellybeansAllowed;
    switch (currentRound) {
      case 1:
        maxJellybeansAllowed = 20;
        break;
      case 2:
        maxJellybeansAllowed = 13;
        break;
      case 4:
        maxJellybeansAllowed = 15;
        break;
      default:
        maxJellybeansAllowed = Number.POSITIVE_INFINITY;
        break;
    }
    if (square.classList.contains("active")) {
      square.classList.remove("active");
      jellybeans++;
      totalSpent--;
    } else {
      if (jellybeans <= 0 || totalSpent >= maxJellybeansAllowed) {
        showPrompt(
          "You have spent all your jellybeans!"
        );
        return;
      } else if (jellybeans > 0 && totalSpent < maxJellybeansAllowed) {
        square.classList.add("active");
        clickSound.play();
        jellybeans--;
        totalSpent++;
      } else if (totalSpent >= maxJellybeansAllowed) {
        showPrompt(
          "You have spent all your allocated jellybeans for this round."
        );
        isRoundOver = true;
      } else {
        showPrompt("You cannot spend more jellybeans than you have.");
      }
    }

    // Toggle the 'selected' class to show or hide the background image
    square.classList.toggle("selected");

    updateJellybeanCounter();
  };
  document.querySelectorAll(".square").forEach((square) => {
    square.addEventListener("click", toggleJellybean);
  });

  document
    .getElementById("finish-round")
    .addEventListener("click", finishRound);

  document.getElementById("start-game").addEventListener("click", function () {
    document.querySelector(".counter-container").style.display = "flex";
    gameStarted = true;
  });

  updateJellybeanCounter();
});