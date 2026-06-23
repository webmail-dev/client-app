/*====================
 Ratio js
=======================*/
window.addEventListener("load", () => {
  const bgImg = document.querySelectorAll(".bg-img");
  for (i = 0; i < bgImg.length; i++) {
    let bgImgEl = bgImg[i];
    /// Optional Class Add ///
    if (bgImgEl.classList.contains("bg-top")) {
      bgImgEl.parentNode.classList.add("b-top");
    } else if (bgImgEl.classList.contains("bg-bottom")) {
      bgImgEl.parentNode.classList.add("b-bottom");
    } else if (bgImgEl.classList.contains("bg-center")) {
      bgImgEl.parentNode.classList.add("b-center");
    } else if (bgImgEl.classList.contains("bg-left")) {
      bgImgEl.parentNode.classList.add("b-left");
    } else if (bgImgEl.classList.contains("bg-right")) {
      bgImgEl.parentNode.classList.add("b-right");
    }

    /// Lazyloader Class Add ///
    if (bgImgEl.classList.contains("blur-up")) {
      bgImgEl.parentNode.classList.add("blur-up", "lazyload");
    }

    /// Size Class Add ///
    if (bgImgEl.classList.contains("bg_size_content")) {
      bgImgEl.parentNode.classList.add("b_size_content");
    }
    vendors /
      bootstrap /
      /// Ratio Style ///
      bgImgEl.parentNode.classList.add("bg-size");
    const bgSrc = bgImgEl.src;
    bgImgEl.style.display = "none";
    bgImgEl.parentNode.setAttribute(
      "style",
      `
background-image: url(${bgSrc});
background-size:cover;
background-position: center;
background-repeat: no-repeat;
display: block;
`
    );
  }
});
