/* 时间线：分类筛选 + 长列表折叠（默认前 10 条，展开看全部） */
(function () {
    'use strict';
    var PAGE = 10;
    var entries = Array.prototype.slice.call(document.querySelectorAll('#works .entry'));
    var btns = document.querySelectorAll('.tl-btn');
    var moreBtn = document.getElementById('tl-more');
    var moreCount = document.getElementById('tl-more-count');
    if (!entries.length || !moreBtn) return;
    var filter = 'all';

    function apply(animateMore) {
        var shown = 0, hiddenTotal = 0;
        entries.forEach(function (el) {
            var catOk = filter === 'all' || el.getAttribute('data-cat') === filter;
            var visible = catOk && (filter !== 'all' || shown < PAGE);
            el.classList.toggle('tl-hidden', !catOk || !visible);
            if (catOk) {
                if (visible) shown++; else hiddenTotal++;
            }
        });
        moreBtn.parentElement.style.display = (filter === 'all' && hiddenTotal > 0) ? '' : 'none';
        moreCount.textContent = hiddenTotal ? '（还有 ' + hiddenTotal + ' 条）' : '';
    }
    btns.forEach(function (b) {
        b.addEventListener('click', function () {
            btns.forEach(function (x) { x.classList.remove('is-active'); });
            b.classList.add('is-active');
            filter = b.getAttribute('data-filter');
            apply();
        });
    });
    moreBtn.addEventListener('click', function () {
        entries.forEach(function (el) {
            if (filter === 'all' || el.getAttribute('data-cat') === filter) {
                el.classList.remove('tl-hidden');
            }
        });
        moreBtn.parentElement.style.display = 'none';
    });
    apply();
})();
