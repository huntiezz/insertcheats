(function () {
  function colorToRgbaPrefix(color) {
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    const ctx = probe.getContext("2d");
    if (!ctx) return "rgba(180, 180, 180,";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b},`;
  }

  function mountFlickeringGrid(container, options) {
    if (!container) return () => {};

    const opts = {
      squareSize: 3,
      gridGap: 3,
      flickerChance: 0.2,
      color: "#B4B4B4",
      maxOpacity: 0.15,
      text: "",
      fontSize: 140,
      fontWeight: 600,
      width: null,
      height: null,
      ...options,
    };

    const canvas = document.createElement("canvas");
    canvas.className = "pointer-events-none";
    canvas.setAttribute("aria-hidden", "true");
    container.replaceChildren(canvas);

    const rgba = colorToRgbaPrefix(opts.color);
    let cols = 0;
    let rows = 0;
    let squares = new Float32Array(0);
    let dpr = 1;
    let layoutW = 0;
    let layoutH = 0;
    let inView = false;
    let raf = 0;
    let lastTime = 0;

    function setupLayout() {
      layoutW = Math.max(1, Math.round(opts.width || container.clientWidth));
      layoutH = Math.max(1, Math.round(opts.height || container.clientHeight));
      dpr = window.devicePixelRatio || 1;
      canvas.width = layoutW * dpr;
      canvas.height = layoutH * dpr;
      canvas.style.width = `${layoutW}px`;
      canvas.style.height = `${layoutH}px`;
      cols = Math.ceil(layoutW / (opts.squareSize + opts.gridGap));
      rows = Math.ceil(layoutH / (opts.squareSize + opts.gridGap));
      squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++)
        squares[i] = Math.random() * opts.maxOpacity;
    }

    function tickSquares(delta) {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < opts.flickerChance * delta) {
          squares[i] = Math.random() * opts.maxOpacity;
        }
      }
    }

    function drawFrame() {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mask = document.createElement("canvas");
      mask.width = canvas.width;
      mask.height = canvas.height;
      const mctx = mask.getContext("2d", { willReadFrequently: true });
      if (!mctx) return;

      if (opts.text) {
        mctx.save();
        mctx.scale(dpr, dpr);
        mctx.fillStyle = "white";
        mctx.font = `${opts.fontWeight} ${opts.fontSize}px Inter, system-ui, sans-serif`;
        mctx.textAlign = "center";
        mctx.textBaseline = "middle";
        mctx.fillText(opts.text, layoutW / 2, layoutH / 2);
        mctx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (opts.squareSize + opts.gridGap) * dpr;
          const y = j * (opts.squareSize + opts.gridGap) * dpr;
          const size = opts.squareSize * dpr;
          let opacity = squares[i * rows + j];
          if (opts.text) {
            const px = mctx.getImageData(x, y, size, size).data;
            const onText = px.some((v, idx) => idx % 4 === 0 && v > 0);
            if (onText) opacity = Math.min(1, opacity * 3 + 0.4);
          }
          ctx.fillStyle = `${rgba}${opacity})`;
          ctx.fillRect(x, y, size, size);
        }
      }
    }

    function frame(now) {
      if (!inView) return;
      const delta = lastTime ? (now - lastTime) / 1000 : 0;
      lastTime = now;
      tickSquares(delta);
      drawFrame();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      cancelAnimationFrame(raf);
      lastTime = 0;
      if (inView) raf = requestAnimationFrame(frame);
    }

    let relayoutTimer = 0;
    function relayout() {
      clearTimeout(relayoutTimer);
      relayoutTimer = window.setTimeout(() => {
        setupLayout();
        drawFrame();
        start();
      }, 80);
    }

    setupLayout();
    drawFrame();

    const ro = new ResizeObserver(relayout);
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        start();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    inView = true;
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      container.replaceChildren();
    };
  }

  window.mountFlickeringGrid = mountFlickeringGrid;
})();
