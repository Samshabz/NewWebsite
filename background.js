document.addEventListener('DOMContentLoaded', () => {
    function generateBoxShadows(numStars) {
      let shadows = [];
      for (let i = 0; i < numStars; i++) {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);
        shadows.push(`${x}px ${y}px #FFF`);
      }
      return shadows.join(', ');
    }

    // Apply the generated stars to the elements
    document.getElementById('stars').style.boxShadow = generateBoxShadows(700);
    document.getElementById('stars2').style.boxShadow = generateBoxShadows(200);
    document.getElementById('stars3').style.boxShadow = generateBoxShadows(100);

    // Function to handle scroll and update star positions
    function handleScroll() {
      const scrollY = window.scrollY;
      document.querySelector('#stars').style.transform = `translateY(${scrollY * 0.3}px)`;
      document.querySelector('#stars2').style.transform = `translateY(${scrollY * 0.2}px)`;
      document.querySelector('#stars3').style.transform = `translateY(${scrollY * 0.1}px)`;
    }

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initialize star positions
    handleScroll();
  });

  

  