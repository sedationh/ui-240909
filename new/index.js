import gsap from "gsap";

function animate(target, duration, properties) {
  return new Promise((resolve) => {
    gsap.to(target, {
      ...properties,
      duration: duration,
      onComplete: resolve,
    });
  });
}

async function loop() {
  gsap.set(".indicator", { x: -window.innerWidth });
  await animate(".indicator", 2, { x: 0 });
  await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
  gsap.set(".indicator", { x: -window.innerWidth });
  loop();
}

async function init() {
  await loop();
}

init();
