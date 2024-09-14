import gsap from "gsap";

const data = [
  {
    place: "Switzerland Alps",
    title: "SAINT",
    title2: "ANTONIEN",
    description:
      "Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.",
    image: "https://assets.codepen.io/3685267/timed-cards-1.jpg",
  },
  {
    place: "Japan Alps",
    title: "NANGANO",
    title2: "PREFECTURE",
    description:
      "Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country's best powder.",
    image: "https://assets.codepen.io/3685267/timed-cards-2.jpg",
  },
  {
    place: "Sahara Desert - Morocco",
    title: "MARRAKECH",
    title2: "MEROUGA",
    description:
      "The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.",
    image: "https://assets.codepen.io/3685267/timed-cards-3.jpg",
  },
  {
    place: "Sierra Nevada - USA",
    title: "YOSEMITE",
    title2: "NATIONAL PARAK",
    description:
      "Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.",
    image: "https://assets.codepen.io/3685267/timed-cards-4.jpg",
  },
  {
    place: "Tarifa - Spain",
    title: "LOS LANCES",
    title2: "BEACH",
    description:
      "Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach's long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.",
    image: "https://assets.codepen.io/3685267/timed-cards-5.jpg",
  },
  {
    place: "Cappadocia - Turkey",
    title: "Göreme",
    title2: "Valley",
    description:
      "Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.",
    image: "https://assets.codepen.io/3685267/timed-cards-6.jpg",
  },
].map((i, index) => ({ ...i, index }));

const _ = (id) => document.getElementById(id);

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
  await step();
  loop();
}

function getCard(index) {
  return `#card${index}`;
}
const { innerHeight: height, innerWidth: width } = window;

const offsetTop = window.innerHeight - 430;
const offsetLeft = window.innerWidth - 830;
const cardWidth = 200;
const cardHeight = 300;
const gap = 40;
const ease = "sine.inOut";

const initialCardScrollWidth = 400;

const order = [0, 1, 2, 3, 4, 5];

function step() {
  return new Promise((resolve) => {
    order.push(order.shift());
    const [active, ...rest] = order;
    const prv = rest[rest.length - 1];
    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 2, ease });

    gsap.to(getCard(active), {
      x: 0,
      y: 0,
      ease,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
        gsap.set(getCard(prv), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
          scale: 1,
        });

        resolve();
      },
    });

    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          ease,
          delay: 0.1 * (index + 1),
        });
      }
    });
  });
}

async function init() {
  const cards = data
    .map(
      (i, index) =>
        `<div class="card" id="card${index}" style="background-image:url(${i.image})"  ></div>`
    )
    .join("");
  _("demo").innerHTML = cards;

  gsap.set(".indicator", { x: -window.innerWidth });

  const [active, ...rest] = order;

  gsap.set(getCard(active), {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  rest.forEach((i, index) => {
    gsap.set(getCard(i), {
      x: offsetLeft + initialCardScrollWidth + index * (cardWidth + gap),
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 10,
    });
  });
  const startDelay = 0.6;
  rest.forEach((i, index) => {
    console.log(offsetLeft + index * (cardWidth + gap), index);
    gsap.to(getCard(i), {
      x: offsetLeft + index * (cardWidth + gap),
      zIndex: 30,
      ease,
      delay: startDelay,
    });
  });

  gsap.to(".cover", {
    x: width + 400,
    delay: 0.5,
    ease,
    onComplete: () => {
      setTimeout(() => {
        loop();
      }, 500);
    },
  });
}

init();
