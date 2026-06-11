(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const totalSlides = slides.length;
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const worksheetBtn = document.getElementById("worksheetBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const counter = document.getElementById("counter");
  const progressBar = document.getElementById("progressBar");
  const worksheet = document.getElementById("worksheet");
  const backToSlides = document.getElementById("backToSlides");
  const printWorksheet = document.getElementById("printWorksheet");
  const deck = document.getElementById("deck");

  let current = 0;

  function showSlide(index) {
    current = Math.max(0, Math.min(index, totalSlides - 1));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === current);
    });

    counter.textContent = `${current + 1} / ${totalSlides}`;
    progressBar.style.width = `${((current + 1) / totalSlides) * 100}%`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === totalSlides - 1;
  }

  function showWorksheet() {
    document.body.classList.add("worksheet-mode");
    worksheet.classList.remove("hidden");
  }

  function hideWorksheet() {
    document.body.classList.remove("worksheet-mode");
    worksheet.classList.add("hidden");
    showSlide(current);
  }

  function next() {
    if (document.body.classList.contains("worksheet-mode")) {
      return;
    }

    if (current === totalSlides - 1) {
      showWorksheet();
      return;
    }

    showSlide(current + 1);
  }

  function prev() {
    if (document.body.classList.contains("worksheet-mode")) {
      hideWorksheet();
      return;
    }

    showSlide(current - 1);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  worksheetBtn.addEventListener("click", showWorksheet);
  backToSlides.addEventListener("click", hideWorksheet);
  printWorksheet.addEventListener("click", () => window.print());

  fullscreenBtn.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      await deck.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowRight" || key === "PageDown" || key === " ") {
      event.preventDefault();
      next();
    }

    if (key === "ArrowLeft" || key === "PageUp") {
      event.preventDefault();
      prev();
    }

    if (key === "Escape" && document.body.classList.contains("worksheet-mode")) {
      hideWorksheet();
    }
  });

  let startX = null;

  document.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener("touchend", (event) => {
    if (startX === null) {
      return;
    }

    const diff = event.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 60) {
      diff < 0 ? next() : prev();
    }
    startX = null;
  }, { passive: true });

  showSlide(0);
})();
