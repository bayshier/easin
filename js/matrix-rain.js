    (function () {
        'use strict';
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var canvas = document.getElementById('matrix-rain');
        if (!canvas || !canvas.getContext) return;
        var ctx = canvas.getContext('2d');

        /* 二进制代码雨：只有 0 和 1 */
        var CHARS = '01'.split('');
        var BG_FADE = 'rgba(10, 14, 22, 0.09)'; // 与 --bg 同色，制造拖尾
        var FONT_SIZE = 16;

        var drops = [];       // 每列当前下落位置（以行计）
        var speeds = [];      // 每列速度（帧间隔）
        var columns = 0;
        var W = 0, H = 0;

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
            columns = Math.ceil(W / FONT_SIZE);
            drops = [];
            speeds = [];
            for (var i = 0; i < columns; i++) {
                // 随机初始位置：让雨幕一开始就是满屏的
                drops[i] = Math.floor(Math.random() * -60);
                speeds[i] = 0.5 + Math.random() * 0.8; // 每列速度略有差异
            }
            ctx.fillStyle = '#0a0e16';
            ctx.fillRect(0, 0, W, H);
        }

        var lastGlyphChange = 0;
        function draw(ts) {
            requestAnimationFrame(draw);
            if (document.hidden) return;

            // 限帧 ~30fps：数字雨不需要 60fps，省一半渲染开销
            if (ts - lastGlyphChange < 33) return;
            lastGlyphChange = ts;

            // 半透明背景覆盖 → 上一帧字符逐渐淡出，形成拖尾
            ctx.fillStyle = BG_FADE;
            ctx.fillRect(0, 0, W, H);

            ctx.font = FONT_SIZE + 'px monospace';

            for (var i = 0; i < columns; i++) {
                var x = i * FONT_SIZE;
                var row = Math.floor(drops[i]);
                var y = row * FONT_SIZE;

                // 雨头：亮白绿；雨尾：暗绿（只在整数行刷新时绘制，速度<1 时按概率推进）
                var ch = CHARS[(Math.random() * CHARS.length) | 0];
                if (row >= 0 && y <= H) {
                    ctx.fillStyle = 'rgba(180, 255, 210, 0.9)';
                    ctx.fillText(ch, x, y);
                }

                // 在雨头后方随机重绘几个字符，让拖尾"闪烁"变化
                if (row > 4 && Math.random() < 0.28) {
                    var ty = y - FONT_SIZE * (1 + Math.random() * 6 | 0);
                    if (ty > 0) {
                        ctx.fillStyle = 'rgba(61, 220, 132, 0.35)';
                        ctx.fillText(CHARS[(Math.random() * CHARS.length) | 0], x, ty);
                    }
                }

                drops[i] += speeds[i];
                // 落出屏幕后，小概率重置到顶部（制造错落感）
                if (y > H && Math.random() > 0.975) {
                    drops[i] = Math.floor(Math.random() * -30);
                }
            }
        }

        var resizeTimer = null;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 200);
        }, { passive: true });

        resize();
        requestAnimationFrame(draw);
    })();
